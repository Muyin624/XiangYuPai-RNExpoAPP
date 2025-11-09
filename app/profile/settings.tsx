/**
 * Settings Page - 设置页面
 * 
 * 功能：
 * - 修改密码
 * - 微信绑定
 * - 支付其他密码
 * - 支付密码
 * - 退出账号
 */

import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const SettingsPage = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  // 设置菜单项
  const settingsItems = [
    { 
      id: 'password', 
      label: '修改密码', 
      icon: '🔒', 
      route: '/profile/change-password',
      showArrow: true,
    },
    { 
      id: 'wechat', 
      label: '微信绑定', 
      icon: '💬', 
      route: '/profile/wechat-binding',
      showArrow: true,
      rightText: '已绑定',
    },
    { 
      id: 'other-password', 
      label: '支付其他密码', 
      icon: '🔐', 
      route: '/profile/other-payment-password',
      showArrow: true,
      rightText: '已绑定',
    },
    { 
      id: 'payment-password', 
      label: '支付密码', 
      icon: '🔑', 
      route: '/profile/payment-password',
      showArrow: true,
      rightText: '未绑定',
    },
  ];

  // 处理菜单项点击
  const handleMenuPress = (route: string, label: string) => {
    console.log(`🧭 导航: 设置 → ${label}`);
    
    // 支付密码页面已实现
    if (route === '/profile/payment-password') {
      router.push('/profile/payment-password');
      return;
    }
    
    // 其他路由暂时显示提示
    Alert.alert('提示', `${label}功能开发中...`);
  };

  // 处理退出账号
  const handleLogout = () => {
    Alert.alert(
      '退出账号',
      '确定要退出当前账号吗？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          style: 'destructive',
          onPress: () => {
            console.log('🚪 用户退出登录');
            logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  // 处理返回
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>设置</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 设置菜单列表 */}
        <View style={styles.menuSection}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === settingsItems.length - 1 && styles.menuItemLast,
              ]}
              onPress={() => handleMenuPress(item.route, item.label)}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconContainer}>
                  <Text style={styles.iconText}>{item.icon}</Text>
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <View style={styles.menuRight}>
                {item.rightText && (
                  <Text style={[
                    styles.rightText,
                    item.rightText === '未绑定' && styles.rightTextUnbound
                  ]}>
                    {item.rightText}
                  </Text>
                )}
                {item.showArrow && (
                  <Text style={styles.arrow}>›</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 退出账号按钮 */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>退出账号</Text>
          </TouchableOpacity>
        </View>

        {/* 底部间距 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  // 顶部导航栏
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 32,
    color: '#1F2937',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  // 菜单区域
  menuSection: {
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
  },
  menuLabel: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginRight: 4,
  },
  rightTextUnbound: {
    color: '#EF4444',
  },
  arrow: {
    fontSize: 24,
    color: '#D1D5DB',
    fontWeight: '300',
  },
  // 退出账号区域
  logoutSection: {
    marginTop: 32,
    marginHorizontal: 16,
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default SettingsPage;

