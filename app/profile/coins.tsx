/**
 * Coins Page - 金币页面
 * 
 * 功能：
 * - 显示当前金币余额
 * - 充值按钮
 * - 金币使用记录
 * - 金币明细入口
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

const CoinsPage = () => {
  const router = useRouter();

  // 模拟数据
  const coinBalance = 1580;
  const coinRecords = [
    {
      id: '1',
      type: 'expense',
      title: '购买会员服务',
      amount: -200,
      date: '2025-06-06 10:42',
      icon: '👑',
    },
    {
      id: '2',
      type: 'income',
      title: '充值',
      amount: 500,
      date: '2025-06-05 15:30',
      icon: '💰',
    },
    {
      id: '3',
      type: 'expense',
      title: '打赏作者',
      amount: -50,
      date: '2025-06-04 09:15',
      icon: '❤️',
    },
    {
      id: '4',
      type: 'income',
      title: '签到奖励',
      amount: 10,
      date: '2025-06-03 08:00',
      icon: '🎁',
    },
  ];

  // 处理充值
  const handleRecharge = () => {
    console.log('🧭 导航: 金币 → 充值页面');
    router.push('/profile/coins-recharge');
  };

  // 处理金币明细
  const handleCoinDetails = () => {
    console.log('🧭 导航: 金币 → 金币明细');
    router.push('/profile/coins-bills');
  };

  // 处理返回
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F59E0B" />
      
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>金币</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 金币余额卡片 */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>我的金币</Text>
          <View style={styles.balanceAmountContainer}>
            <Text style={styles.coinIcon}>🪙</Text>
            <Text style={styles.balanceAmount}>{coinBalance}</Text>
          </View>
          <Text style={styles.balanceHint}>金币可用于购买会员、打赏、解锁内容等</Text>
          
          {/* 充值按钮 */}
          <TouchableOpacity 
            style={styles.rechargeButton}
            onPress={handleRecharge}
            activeOpacity={0.8}
          >
            <Text style={styles.rechargeButtonText}>充值</Text>
          </TouchableOpacity>
        </View>

        {/* 金币余额区域 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>金币余额</Text>
            <TouchableOpacity onPress={handleCoinDetails}>
              <Text style={styles.detailsLink}>金币明细</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.amountDisplay}>
            <Text style={styles.coinIconLarge}>🪙</Text>
            <Text style={styles.amountValue}>{coinBalance}</Text>
          </View>
          
          <Text style={styles.amountHint}>
            1元 = 10金币
          </Text>
        </View>

        {/* 金币使用说明 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>金币用途</Text>
          <View style={styles.usageList}>
            <View style={styles.usageItem}>
              <Text style={styles.usageIcon}>👑</Text>
              <Text style={styles.usageText}>购买会员服务</Text>
            </View>
            <View style={styles.usageItem}>
              <Text style={styles.usageIcon}>❤️</Text>
              <Text style={styles.usageText}>打赏优质内容</Text>
            </View>
            <View style={styles.usageItem}>
              <Text style={styles.usageIcon}>🔓</Text>
              <Text style={styles.usageText}>解锁付费内容</Text>
            </View>
            <View style={styles.usageItem}>
              <Text style={styles.usageIcon}>🎁</Text>
              <Text style={styles.usageText}>购买虚拟礼物</Text>
            </View>
          </View>
        </View>

        {/* 最近记录 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>最近记录</Text>
          {coinRecords.map((record) => (
            <View key={record.id} style={styles.recordItem}>
              <View style={styles.recordLeft}>
                <View style={styles.recordIcon}>
                  <Text style={styles.recordIconText}>{record.icon}</Text>
                </View>
                <View style={styles.recordInfo}>
                  <Text style={styles.recordTitle}>{record.title}</Text>
                  <Text style={styles.recordDate}>{record.date}</Text>
                </View>
              </View>
              <View style={styles.recordRight}>
                <Text style={[
                  styles.recordAmount,
                  record.type === 'income' ? styles.incomeAmount : styles.expenseAmount
                ]}>
                  {record.amount > 0 ? '+' : ''}{record.amount}
                </Text>
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
    backgroundColor: '#F59E0B',
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
    backgroundColor: '#F59E0B',
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
    alignItems: 'center',
    marginBottom: 8,
  },
  coinIcon: {
    fontSize: 40,
    marginRight: 8,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
  },
  balanceHint: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 20,
  },
  rechargeButton: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  rechargeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
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
  detailsLink: {
    fontSize: 14,
    color: '#F59E0B',
  },
  // 金额显示
  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  coinIconLarge: {
    fontSize: 32,
    marginRight: 8,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
  },
  amountHint: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  // 用途列表
  usageList: {
    gap: 12,
  },
  usageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  usageIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  usageText: {
    fontSize: 15,
    color: '#4B5563',
  },
  // 记录列表
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
    backgroundColor: '#FEF3C7',
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
  recordTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  recordDate: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  recordRight: {
    marginLeft: 12,
  },
  recordAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  incomeAmount: {
    color: '#10B981',
  },
  expenseAmount: {
    color: '#EF4444',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default CoinsPage;

