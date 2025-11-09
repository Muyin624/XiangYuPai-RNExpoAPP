/**
 * Wallet Withdraw Page - 钱包提现页面
 * 
 * 功能：
 * - 选择提现方式（支付宝/国信）
 * - 输入提现金额
 * - 显示账户信息
 * - 提现按钮
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type PaymentMethod = 'alipay' | 'guoxin';

const WalletWithdrawPage = () => {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('alipay');
  const [amount, setAmount] = useState('');

  // 模拟数据
  const balance = 197.73;
  const paymentMethods = [
    {
      id: 'alipay' as PaymentMethod,
      name: '支付宝',
      account: '17834268497',
      icon: '💰',
      color: '#1677FF',
    },
    {
      id: 'guoxin' as PaymentMethod,
      name: '国信',
      account: '国×建×银',
      icon: '🏦',
      color: '#059669',
    },
  ];

  // 处理返回
  const handleBack = () => {
    router.back();
  };

  // 处理提现
  const handleWithdraw = () => {
    if (!amount || parseFloat(amount) <= 0) {
      console.log('⚠️ 请输入有效的提现金额');
      return;
    }
    
    if (parseFloat(amount) > balance) {
      console.log('⚠️ 提现金额不能超过余额');
      return;
    }

    console.log('🧭 导航: 提现页面 → 提现成功页面');
    router.push({
      pathname: '/profile/wallet-withdraw-success',
      params: {
        amount,
        method: selectedMethod,
      },
    });
  };

  // 获取选中的支付方式
  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>提现</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 提现方式选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>提现方式</Text>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodItem,
                selectedMethod === method.id && styles.methodItemSelected,
              ]}
              onPress={() => setSelectedMethod(method.id)}
              activeOpacity={0.7}
            >
              <View style={styles.methodLeft}>
                <View style={[styles.methodIcon, { backgroundColor: method.color + '20' }]}>
                  <Text style={styles.methodIconText}>{method.icon}</Text>
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodAccount}>{method.account}</Text>
                </View>
              </View>
              <View style={styles.methodRight}>
                <View style={[
                  styles.radio,
                  selectedMethod === method.id && styles.radioSelected,
                ]}>
                  {selectedMethod === method.id && (
                    <View style={styles.radioDot} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 提现金额输入 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>提现金额</Text>
          
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>¥</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="#D1D5DB"
              keyboardType="decimal-pad"
              maxLength={10}
            />
          </View>
          
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceText}>
              可提现金额 ¥{balance.toFixed(2)}
            </Text>
            <TouchableOpacity onPress={() => setAmount(balance.toString())}>
              <Text style={styles.allButton}>全部</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 提现说明 */}
        <View style={styles.section}>
          <Text style={styles.noticeTitle}>提现说明</Text>
          <Text style={styles.noticeText}>
            1. 提现金额将在1-3个工作日内到账
          </Text>
          <Text style={styles.noticeText}>
            2. 每日提现次数不限，单笔最低提现金额为1元
          </Text>
          <Text style={styles.noticeText}>
            3. 提现手续费：免费
          </Text>
        </View>

        {/* 底部间距 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* 底部提现按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.withdrawButton,
            (!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance) && styles.withdrawButtonDisabled,
          ]}
          onPress={handleWithdraw}
          activeOpacity={0.8}
          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
        >
          <Text style={styles.withdrawButtonText}>提现</Text>
        </TouchableOpacity>
      </View>
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
  // 区域样式
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  // 提现方式
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    marginBottom: 12,
  },
  methodItemSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F5F3FF',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodIconText: {
    fontSize: 24,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  methodAccount: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  methodRight: {
    marginLeft: 12,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#8B5CF6',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8B5CF6',
  },
  // 金额输入
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 12,
    marginBottom: 12,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 36,
    fontWeight: '700',
    color: '#1F2937',
    padding: 0,
  },
  balanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  allButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  // 提现说明
  noticeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  noticeText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  // 底部按钮
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  withdrawButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  withdrawButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default WalletWithdrawPage;

