/**
 * Coins Recharge Page - 金币充值页面
 * 
 * 功能：
 * - 选择充值金额（预设金额）
 * - 自定义充值金额
 * - 选择支付方式（微信/支付宝）
 * - 充值按钮
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

type PaymentMethod = 'wechat' | 'alipay';

interface RechargeOption {
  coins: number;
  amount: number;
  bonus?: number;
  popular?: boolean;
}

const CoinsRechargePage = () => {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('wechat');

  // 充值选项
  const rechargeOptions: RechargeOption[] = [
    { coins: 60, amount: 6 },
    { coins: 100, amount: 10, bonus: 10 },
    { coins: 300, amount: 30, bonus: 30, popular: true },
    { coins: 500, amount: 50, bonus: 80 },
    { coins: 1000, amount: 100, bonus: 200 },
    { coins: 3000, amount: 300, bonus: 800 },
  ];

  // 支付方式
  const paymentMethods = [
    {
      id: 'wechat' as PaymentMethod,
      name: '微信支付',
      icon: '💚',
      color: '#07C160',
    },
    {
      id: 'alipay' as PaymentMethod,
      name: '支付宝',
      icon: '💙',
      color: '#1677FF',
    },
  ];

  // 处理返回
  const handleBack = () => {
    router.back();
  };

  // 处理充值
  const handleRecharge = () => {
    const amount = selectedAmount || parseFloat(customAmount);
    
    if (!amount || amount <= 0) {
      console.log('⚠️ 请选择或输入充值金额');
      return;
    }

    console.log('🧭 导航: 充值页面 → 充值成功页面');
    router.push({
      pathname: '/profile/coins-recharge-success',
      params: {
        amount: amount.toString(),
        coins: (amount * 10).toString(),
        method: selectedMethod,
      },
    });
  };

  // 选择金额
  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  // 自定义金额输入
  const handleCustomAmountChange = (text: string) => {
    setCustomAmount(text);
    setSelectedAmount(null);
  };

  // 计算总金币
  const getTotalCoins = () => {
    const amount = selectedAmount || parseFloat(customAmount) || 0;
    const option = rechargeOptions.find(opt => opt.amount === amount);
    return option ? option.coins + (option.bonus || 0) : amount * 10;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>充值</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 充值金额选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择充值金额</Text>
          
          <View style={styles.optionsGrid}>
            {rechargeOptions.map((option) => (
              <TouchableOpacity
                key={option.amount}
                style={[
                  styles.optionCard,
                  selectedAmount === option.amount && styles.optionCardSelected,
                ]}
                onPress={() => handleSelectAmount(option.amount)}
                activeOpacity={0.7}
              >
                {option.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>热门</Text>
                  </View>
                )}
                <Text style={styles.optionCoins}>🪙 {option.coins}</Text>
                <Text style={styles.optionAmount}>¥{option.amount}</Text>
                {option.bonus && (
                  <Text style={styles.optionBonus}>送{option.bonus}币</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 自定义金额 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>自定义金额</Text>
          
          <View style={styles.customAmountContainer}>
            <Text style={styles.currencySymbol}>¥</Text>
            <TextInput
              style={styles.customAmountInput}
              value={customAmount}
              onChangeText={handleCustomAmountChange}
              placeholder="输入充值金额"
              placeholderTextColor="#D1D5DB"
              keyboardType="decimal-pad"
              maxLength={10}
            />
          </View>
          
          <Text style={styles.customAmountHint}>
            1元 = 10金币，最低充值6元
          </Text>
        </View>

        {/* 支付方式选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>支付方式</Text>
          
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
                <Text style={styles.methodName}>{method.name}</Text>
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

        {/* 充值说明 */}
        <View style={styles.section}>
          <Text style={styles.noticeTitle}>充值说明</Text>
          <Text style={styles.noticeText}>
            1. 充值成功后金币将立即到账
          </Text>
          <Text style={styles.noticeText}>
            2. 金币不可提现，仅可用于平台内消费
          </Text>
          <Text style={styles.noticeText}>
            3. 如有疑问请联系客服
          </Text>
        </View>

        {/* 底部间距 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* 底部充值按钮 */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>实付金额</Text>
          <View style={styles.footerAmount}>
            <Text style={styles.footerAmountSymbol}>¥</Text>
            <Text style={styles.footerAmountValue}>
              {(selectedAmount || parseFloat(customAmount) || 0).toFixed(2)}
            </Text>
          </View>
          <Text style={styles.footerCoins}>
            获得 {getTotalCoins()} 金币
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.rechargeButton,
            (!selectedAmount && !customAmount) && styles.rechargeButtonDisabled,
          ]}
          onPress={handleRecharge}
          activeOpacity={0.8}
          disabled={!selectedAmount && !customAmount}
        >
          <Text style={styles.rechargeButtonText}>立即充值</Text>
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
  // 充值选项网格
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  optionCard: {
    width: '31.33%',
    marginHorizontal: '1%',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    backgroundColor: '#fff',
    alignItems: 'center',
    position: 'relative',
  },
  optionCardSelected: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  optionCoins: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
    marginBottom: 4,
  },
  optionBonus: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '500',
  },
  // 自定义金额
  customAmountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 12,
    marginBottom: 8,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  customAmountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    padding: 0,
  },
  customAmountHint: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  // 支付方式
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
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
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
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
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
    borderColor: '#F59E0B',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F59E0B',
  },
  // 充值说明
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
  bottomSpacer: {
    height: 20,
  },
  // 底部按钮
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerInfo: {
    marginBottom: 12,
  },
  footerLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  footerAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  footerAmountSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  footerAmountValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EF4444',
    marginLeft: 2,
  },
  footerCoins: {
    fontSize: 13,
    color: '#F59E0B',
    fontWeight: '500',
  },
  rechargeButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  rechargeButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  rechargeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default CoinsRechargePage;

