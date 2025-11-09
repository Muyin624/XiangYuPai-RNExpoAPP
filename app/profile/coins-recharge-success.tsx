/**
 * Coins Recharge Success Page - 金币充值成功页面
 * 
 * 功能：
 * - 显示充值成功状态
 * - 显示充值金额和获得的金币数
 * - 显示订单号和充值时间
 * - 返回金币页面按钮
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const CoinsRechargeSuccessPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const amount = params.amount as string || '0.00';
  const coins = params.coins as string || '0';
  const method = params.method as string || 'wechat';

  // 模拟数据
  const rechargeInfo = {
    status: '充值成功',
    statusIcon: '✓',
    paymentMethod: method === 'wechat' ? '微信支付' : '支付宝',
    orderId: 'RC' + Date.now().toString().slice(-12),
    time: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(/\//g, '-'),
  };

  // 处理返回金币页面
  const handleBackToCoins = () => {
    console.log('🧭 导航: 充值成功 → 金币');
    router.push('/profile/coins');
  };

  // 处理关闭
  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <View style={styles.placeholder} />
        <Text style={styles.headerTitle}>充值</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* 成功状态 */}
        <View style={styles.successSection}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>{rechargeInfo.statusIcon}</Text>
          </View>
          <Text style={styles.successTitle}>{rechargeInfo.status}</Text>
          
          {/* 金币展示 */}
          <View style={styles.coinsContainer}>
            <Text style={styles.coinIcon}>🪙</Text>
            <Text style={styles.coinsValue}>{coins}</Text>
          </View>
          <Text style={styles.coinsLabel}>获得金币</Text>
        </View>

        {/* 充值详情 */}
        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>支付金额</Text>
            <Text style={styles.detailValue}>¥{parseFloat(amount).toFixed(2)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>支付方式</Text>
            <Text style={styles.detailValue}>{rechargeInfo.paymentMethod}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>订单号码</Text>
            <Text style={styles.detailValue}>{rechargeInfo.orderId}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>充值时间</Text>
            <Text style={styles.detailValue}>{rechargeInfo.time}</Text>
          </View>
        </View>

        {/* 提示信息 */}
        <View style={styles.hintSection}>
          <Text style={styles.hintText}>
            金币已到账，可在"金币"页面查看余额
          </Text>
        </View>
      </View>

      {/* 底部按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToCoins}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>返回金币</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  // 成功状态区域
  successSection: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successIconText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: '600',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 24,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  coinIcon: {
    fontSize: 40,
    marginRight: 8,
  },
  coinsValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#F59E0B',
  },
  coinsLabel: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  // 详情区域
  detailsSection: {
    backgroundColor: '#F9FAFB',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  // 提示区域
  hintSection: {
    paddingHorizontal: 20,
  },
  hintText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  // 底部按钮
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  backButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default CoinsRechargeSuccessPage;

