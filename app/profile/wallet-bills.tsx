/**
 * Wallet Bills Page - 钱包账单明细页面
 * 
 * 功能：
 * - 显示账单列表
 * - 时间筛选（年月选择）
 * - 收入/支出记录展示
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type TransactionType = 'income' | 'expense';

interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  date: string;
  time: string;
  orderId: string;
}

const WalletBillsPage = () => {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(6);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // 模拟数据
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'income',
      title: '白石',
      amount: 200.0,
      date: '2025-06-06',
      time: '10:42',
      orderId: '计费单号：250606I0942501',
    },
    {
      id: '2',
      type: 'income',
      title: '白石',
      amount: 200.0,
      date: '2025-06-06',
      time: '10:42',
      orderId: '计费单号：250606I0942501',
    },
    {
      id: '3',
      type: 'expense',
      title: '智平商城',
      amount: -200.0,
      date: '2025-06-04',
      time: '10:42',
      orderId: '计费单号：250606I0942501',
    },
    {
      id: '4',
      type: 'income',
      title: '白石',
      amount: 200.0,
      date: '2025-06-04',
      time: '10:42',
      orderId: '计费单号：250606I0942501',
    },
  ];

  // 年份列表
  const years = [2024, 2025];
  // 月份列表
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 处理返回
  const handleBack = () => {
    router.back();
  };

  // 处理时间选择确认
  const handleTimeConfirm = () => {
    setShowTimePicker(false);
    console.log(`📅 选择时间: ${selectedYear}年${selectedMonth}月`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>账单明细</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 时间筛选器 */}
      <View style={styles.timeFilter}>
        <TouchableOpacity
          style={styles.timeSelector}
          onPress={() => setShowTimePicker(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.timeText}>
            {selectedYear}年{String(selectedMonth).padStart(2, '0')}月
          </Text>
          <Text style={styles.timeArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 账单列表 */}
        <View style={styles.transactionList}>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View style={styles.transactionHeader}>
                  <Text style={styles.transactionTitle}>{transaction.title}</Text>
                  <Text style={[
                    styles.transactionAmount,
                    transaction.type === 'income' ? styles.incomeAmount : styles.expenseAmount,
                  ]}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}元
                  </Text>
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDate}>
                    {transaction.date} {transaction.time}
                  </Text>
                  <Text style={styles.transactionOrderId}>{transaction.orderId}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 底部间距 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* 时间选择器模态框 */}
      <Modal
        visible={showTimePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTimePicker(false)}
        >
          <View style={styles.timePickerContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.timePickerHeader}>
                <Text style={styles.timePickerTitle}>时间选择</Text>
                <TouchableOpacity onPress={handleTimeConfirm}>
                  <Text style={styles.confirmButton}>确定</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.timePickerContent}>
                {/* 年份选择 */}
                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>年份</Text>
                  <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                    {years.map((year) => (
                      <TouchableOpacity
                        key={year}
                        style={[
                          styles.pickerItem,
                          selectedYear === year && styles.pickerItemSelected,
                        ]}
                        onPress={() => setSelectedYear(year)}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          selectedYear === year && styles.pickerItemTextSelected,
                        ]}>
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* 月份选择 */}
                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>月份</Text>
                  <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                    {months.map((month) => (
                      <TouchableOpacity
                        key={month}
                        style={[
                          styles.pickerItem,
                          selectedMonth === month && styles.pickerItemSelected,
                        ]}
                        onPress={() => setSelectedMonth(month)}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          selectedMonth === month && styles.pickerItemTextSelected,
                        ]}>
                          {month}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  // 时间筛选器
  timeFilter: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  timeArrow: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  // 交易列表
  transactionList: {
    backgroundColor: '#fff',
    marginTop: 12,
  },
  transactionItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  transactionLeft: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  incomeAmount: {
    color: '#10B981',
  },
  expenseAmount: {
    color: '#EF4444',
  },
  transactionDetails: {
    gap: 4,
  },
  transactionDate: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  transactionOrderId: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  bottomSpacer: {
    height: 40,
  },
  // 时间选择器模态框
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  timePickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  confirmButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  timePickerContent: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 10,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  pickerScroll: {
    maxHeight: 200,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  pickerItemSelected: {
    backgroundColor: '#8B5CF6',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
  },
  pickerItemTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default WalletBillsPage;

