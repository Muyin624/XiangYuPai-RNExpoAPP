/**
 * Wallet Page - 钱包页面
 * 
 * 功能：
 * - 显示当前余额
 * - 提现按钮
 * - 提现金额展示
 * - 提现记录列表
 */

import { useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const WalletPage = () => {
  const router = useRouter();

  // 模拟数据
  const balance = 197.73;
  const withdrawalRecords = [
    {
      id: '1',
      type: '支付宝',
      account: '17834268497',
      status: 'completed',
      statusText: '提现成功',
      icon: '💰',
    },
    {
      id: '2',
      type: '国信',
      account: '国×建×银',
      status: 'pending',
      statusText: '待审核',
      icon: '🏦',
    },
  ];

  // 处理提现
  const handleWithdraw = () => {
    console.log('🧭 导航: 钱包 → 提现页面');
    router.push('/profile/wallet-withdraw');
  };

  // 处理账单明细
  const handleBillDetails = () => {
    console.log('🧭 导航: 钱包 → 账单明细');
    router.push('/profile/wallet-bills');
  };

  // 处理返回
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" />
      
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>钱包</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 余额卡片 */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>我的金额</Text>
          <View style={styles.balanceAmountContainer}>
            <Text style={styles.balanceAmount}>{balance.toFixed(2)}</Text>
            <Text style={styles.balanceCurrency}>元</Text>
          </View>
          <Text style={styles.balanceHint}>如何获取收益金额，请联系在线客服咨询</Text>
          
          {/* 提现按钮 */}
          <TouchableOpacity 
            style={styles.withdrawButton}
            onPress={handleWithdraw}
            activeOpacity={0.8}
          >
            <Text style={styles.withdrawButtonText}>提现</Text>
          </TouchableOpacity>
        </View>

        {/* 提现金额区域 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>提现金额</Text>
            <TouchableOpacity onPress={handleBillDetails}>
              <Text style={styles.billDetailsLink}>账单明细</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.amountDisplay}>
            <Text style={styles.amountLabel}>¥</Text>
            <Text style={styles.amountValue}>{balance.toFixed(2)}</Text>
          </View>
          
          <Text style={styles.amountHint}>
            可提现金额 ≥ 金额 {balance.toFixed(2)}
          </Text>
        </View>

        {/* 提现记录列表 */}
        <View style={styles.section}>
          {withdrawalRecords.map((record) => (
            <View key={record.id} style={styles.recordItem}>
              <View style={styles.recordLeft}>
                <View style={styles.recordIcon}>
                  <Text style={styles.recordIconText}>{record.icon}</Text>
                </View>
                <View style={styles.recordInfo}>
                  <Text style={styles.recordType}>{record.type}</Text>
                  <Text style={styles.recordAccount}>{record.account}</Text>
                </View>
              </View>
              <View style={styles.recordRight}>
                <View style={[
                  styles.statusBadge,
                  record.status === 'completed' ? styles.statusCompleted : styles.statusPending
                ]}>
                  <Text style={[
                    styles.statusText,
                    record.status === 'completed' ? styles.statusTextCompleted : styles.statusTextPending
                  ]}>
                    {record.statusText}
                  </Text>
                </View>
              </View>
            </View>
          ))}
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
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  // 余额卡片
  balanceCard: {
    backgroundColor: '#8B5CF6',
    marginHorizontal: 16,
    marginTop: -28,
    marginBottom: 16,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
  },
  balanceAmountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
  },
  balanceCurrency: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 4,
  },
  balanceHint: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 20,
  },
  withdrawButton: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  // 区域样式
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  billDetailsLink: {
    fontSize: 14,
    color: '#8B5CF6',
  },
  // 金额显示
  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 4,
  },
  amountHint: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  // 提现记录
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recordIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recordIconText: {
    fontSize: 20,
  },
  recordInfo: {
    flex: 1,
  },
  recordType: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  recordAccount: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  recordRight: {
    marginLeft: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: '#D1FAE5',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusTextCompleted: {
    color: '#059669',
  },
  statusTextPending: {
    color: '#D97706',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default WalletPage;

