/**
 * MyPage - 我的页面
 * 
 * 功能：
 * - 用户基本信息展示
 * - 文档快捷入口（我的发布/我的订单/我的购买/我的报名）
 * - 更多内容菜单（个人中心/钱包/认证/金币/设置/客服/达人认证）
 */

import { useAuthStore } from '@/src/features/AuthModule/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// 图标组件（简单实现，可以后续替换为图标库）
const IconPlaceholder = ({ emoji }: { emoji: string }) => (
  <View style={styles.iconContainer}>
    <Text style={styles.iconEmoji}>{emoji}</Text>
  </View>
);

const MyPage = () => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentProfile = useProfileStore((state) => state.currentProfile);

  // 文档区域菜单项
  const documentItems = [
    { id: 'publish', label: '我的发布', icon: '📝', route: '/profile/my-posts' },
    { id: 'order', label: '我的订单', icon: '📋', route: '/profile/my-orders' }, // ✅ 已实现
    { id: 'purchase', label: '我的购买', icon: '🛍️', route: '/profile/my-purchases' },
    { id: 'signup', label: '我的报名', icon: '📢', route: '/profile/my-signups' },
  ];

  // 更多内容菜单项
  const moreItems = [
    { id: 'personal', label: '个人中心', icon: '👤', route: '/profile/personal-center' },
    { id: 'wallet', label: '钱包', icon: '💰', route: '/profile/wallet' },
    { id: 'status', label: '状态', icon: '🔄', route: '/profile/my-status' },
    { id: 'coin', label: '金币', icon: '🪙', route: '/profile/coins' },
    { id: 'settings', label: '设置', icon: '⚙️', route: '/profile/settings' },
    { id: 'service', label: '客服', icon: '🏠', route: '/profile/customer-service' },
    { id: 'expert', label: '达人认证', icon: '👑', route: '/profile/expert-verification' },
  ];

  // 处理菜单项点击
  const handleMenuPress = (route: string, label: string) => {
    console.log(`🧭 导航: 我的页面 → ${label}`);
    
    // 特殊处理：个人中心跳转到用户详情页
    if (route === '/profile/personal-center') {
      router.push('/profile/user-profile');
      return;
    }
    
    // 特殊处理：我的发布
    if (route === '/profile/my-posts') {
      router.push('/profile/my-posts');
      return;
    }
    
    // 特殊处理：我的订单（服务提供者视角）
    if (route === '/profile/my-orders') {
      router.push('/profile/my-orders');
      return;
    }
    
    // 特殊处理：我的购买（客户视角）
    if (route === '/profile/my-purchases') {
      router.push('/profile/my-purchases');
      return;
    }
    
    // 特殊处理：我的报名
    if (route === '/profile/my-signups') {
      router.push('/profile/my-signups');
      return;
    }
    
    // 特殊处理：状态管理
    if (route === '/profile/my-status') {
      router.push('/profile/my-status');
      return;
    }
    
    // 特殊处理：钱包
    if (route === '/profile/wallet') {
      router.push('/profile/wallet');
      return;
    }
    
    // 特殊处理：金币
    if (route === '/profile/coins') {
      router.push('/profile/coins');
      return;
    }
    
    // 特殊处理：设置
    if (route === '/profile/settings') {
      router.push('/profile/settings');
      return;
    }
    
    // 特殊处理：客服
    if (route === '/profile/customer-service') {
      router.push('/profile/customer-service');
      return;
    }
    
    // 特殊处理：达人认证
    if (route === '/profile/expert-verification') {
      router.push('/profile/expert-verification');
      return;
    }
    
    // 其他路由暂时显示提示
    console.log(`⚠️ 路由 ${route} 尚未实现`);
    // router.push(route);
  };

  // 处理用户信息区域点击
  const handleUserInfoPress = () => {
    if (isAuthenticated) {
      console.log('🧭 导航: 我的页面 → 个人中心');
      router.push('/profile/user-profile');
    } else {
      console.log('🧭 导航: 我的页面 → 登录页');
      router.push('/auth/login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 用户信息区域 */}
        <TouchableOpacity 
          style={styles.userSection}
          onPress={handleUserInfoPress}
          activeOpacity={0.7}
        >
          <View style={styles.userInfo}>
            <Image
              source={
                currentProfile?.avatar
                  ? { uri: currentProfile.avatar }
                  : require('@/assets/images/images/common/default-avatar.png')
              }
              style={styles.avatar}
            />
            <View style={styles.userText}>
              <Text style={styles.userName}>
                {isAuthenticated && currentProfile?.nickname
                  ? currentProfile.nickname
                  : '用户名称'}
              </Text>
              <Text style={styles.userDesc}>
                {isAuthenticated && currentProfile?.bio
                  ? currentProfile.bio
                  : '这个人很懒，没有留下签名'}
              </Text>
            </View>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* 文档区域 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>文档</Text>
          <View style={styles.menuGrid}>
            {documentItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuPress(item.route, item.label)}
                activeOpacity={0.7}
              >
                <IconPlaceholder emoji={item.icon} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 更多内容区域 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>更多内容</Text>
          <View style={styles.menuGrid}>
            {moreItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuPress(item.route, item.label)}
                activeOpacity={0.7}
              >
                <IconPlaceholder emoji={item.icon} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  // 用户信息区域
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
  },
  userText: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  userDesc: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  arrow: {
    fontSize: 28,
    color: '#D1D5DB',
    fontWeight: '300',
  },
  // 区域样式
  section: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  // 菜单网格
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  menuItem: {
    width: '25%',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconEmoji: {
    fontSize: 24,
  },
  menuLabel: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 4,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default MyPage;

