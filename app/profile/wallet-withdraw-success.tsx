/**
 * Wallet Withdraw Success Page - 钱包提现成功页面
 * 
 * 功能：
 * - 显示提现成功状态
 * - 显示提现金额和账户信息
 * - 显示订单号和提现时间
 * - 返回钱包按钮
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

const WalletWithdrawSuccessPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const amount = params.amount as string || '0.00';
  const method = params.method as string || 'alipay';

  // 模拟数据
  const withdrawalInfo = {
    status: '提现成功',
    statusIcon: '✓',
    receiver: method === 'alipay' ? '支付宝' : '国信',
    account: method === 'alipay' ? '17834268497' : '国×建×银',
    orderId: '250806I0942501',
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

  // 处理返回钱包
  const handleBackToWallet = () => {
    console.log('🧭 导航: 提现成功 → 钱包');
    router.push('/profile/wallet');
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
        <Text style={styles.headerTitle}>提现</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* 成功状态 */}
        <View style={styles.successSection}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>{withdrawalInfo.statusIcon}</Text>
          </View>
          <Text style={styles.successTitle}>{withdrawalInfo.status}</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.amountSymbol}>¥</Text>
            <Text style={styles.amountValue}>{parseFloat(amount).toFixed(2)}</Text>
          </View>
        </View>

        {/* 提现详情 */}
        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>提现账号</Text>
            <Text style={styles.detailValue}>{withdrawalInfo.receiver}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>收款账号</Text>
            <Text style={styles.detailValue}>{withdrawalInfo.account}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>订单号码</Text>
            <Text style={styles.detailValue}>{withdrawalInfo.orderId}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>提现时间</Text>
            <Text style={styles.detailValue}>{withdrawalInfo.time}</Text>
          </View>
        </View>

        {/* 提示信息 */}
        <View style={styles.hintSection}>
          <Text style={styles.hintText}>
            预计1-3个工作日内到账，请注意查收
          </Text>
        </View>
      </View>

      {/* 底部按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToWallet}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>返回钱包</Text>
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
    backgroundColor: '#10B981',
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
    marginBottom: 16,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  amountSymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: '#10B981',
  },
  amountValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: 4,
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
    backgroundColor: '#8B5CF6',
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

export default WalletWithdrawSuccessPage;

