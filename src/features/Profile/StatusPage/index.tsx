/**
 * StatusPage - 状态管理页面
 * 
 * 功能：
 * - 管理用户接单状态（在线接单/预约接单/暂不接单）
 * - 设置延迟接单时间（10分钟后/20分钟后/30分钟后/1小时后/1.5小时后）
 * - 提供取消和确定操作
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// 状态选项类型
type StatusOption = {
  id: string;
  label: string;
  value: string;
};

// 时间选项类型
type TimeOption = {
  id: string;
  label: string;
  minutes: number;
};

const StatusPage = () => {
  const router = useRouter();
  
  // 状态选项
  const statusOptions: StatusOption[] = [
    { id: 'online', label: '在线接单', value: 'online' },
    { id: 'appointment', label: '预约接单', value: 'appointment' },
    { id: 'offline', label: '暂不接单', value: 'offline' },
  ];

  // 时间选项
  const timeOptions: TimeOption[] = [
    { id: '10min', label: '10分钟后', minutes: 10 },
    { id: '20min', label: '20分钟后', minutes: 20 },
    { id: '30min', label: '30分钟后', minutes: 30 },
    { id: '1hour', label: '1小时后', minutes: 60 },
    { id: '1.5hour', label: '1.5小时后', minutes: 90 },
  ];

  // 当前选中的状态和时间
  const [selectedStatus, setSelectedStatus] = useState<string>('online');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // 处理状态选择
  const handleStatusSelect = (statusId: string) => {
    setSelectedStatus(statusId);
    // 如果选择"在线接单"，清除时间选择
    if (statusId === 'online') {
      setSelectedTime(null);
    }
  };

  // 处理时间选择
  const handleTimeSelect = (timeId: string) => {
    if (selectedStatus === 'appointment' || selectedStatus === 'offline') {
      setSelectedTime(timeId);
    }
  };

  // 处理取消
  const handleCancel = () => {
    console.log('🔙 取消状态设置');
    router.back();
  };

  // 处理确定
  const handleConfirm = () => {
    const selectedStatusOption = statusOptions.find(opt => opt.id === selectedStatus);
    const selectedTimeOption = timeOptions.find(opt => opt.id === selectedTime);
    
    console.log('✅ 确认状态设置:', {
      status: selectedStatusOption?.label,
      time: selectedTimeOption?.label,
    });

    // TODO: 调用 API 保存状态设置
    // await updateUserStatus({ status: selectedStatus, delayMinutes: selectedTimeOption?.minutes });

    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleCancel}
          activeOpacity={0.7}
        >
          <Text style={styles.headerButtonText}>取消</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>状态</Text>
        
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleConfirm}
          activeOpacity={0.7}
        >
          <Text style={[styles.headerButtonText, styles.confirmText]}>保存</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 状态选项区域 */}
        <View style={styles.section}>
          {statusOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                index === 0 && styles.firstOption,
                index === statusOptions.length - 1 && styles.lastOption,
              ]}
              onPress={() => handleStatusSelect(option.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionLabel}>{option.label}</Text>
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioOuter,
                  selectedStatus === option.id && styles.radioOuterSelected
                ]}>
                  {selectedStatus === option.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 时间选项区域（仅在预约接单或暂不接单时显示） */}
        {(selectedStatus === 'appointment' || selectedStatus === 'offline') && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>预约</Text>
              <Text style={styles.sectionSubtitle}>确定</Text>
            </View>
            
            {timeOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionItem,
                  index === 0 && styles.firstOption,
                  index === timeOptions.length - 1 && styles.lastOption,
                ]}
                onPress={() => handleTimeSelect(option.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                <View style={styles.radioContainer}>
                  <View style={[
                    styles.radioOuter,
                    selectedTime === option.id && styles.radioOuterSelected
                  ]}>
                    {selectedTime === option.id && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

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
  // 顶部导航栏
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  headerButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 60,
  },
  headerButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  confirmText: {
    color: '#8B5CF6',
    fontWeight: '600',
    textAlign: 'right',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  // 滚动区域
  scrollView: {
    flex: 1,
  },
  // 区域样式
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 15,
    color: '#6B7280',
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#8B5CF6',
  },
  // 选项样式
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  firstOption: {
    // 第一个选项样式
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionLabel: {
    fontSize: 16,
    color: '#1F2937',
  },
  // 单选按钮样式
  radioContainer: {
    padding: 4,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  radioOuterSelected: {
    borderColor: '#8B5CF6',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8B5CF6',
  },
  // 底部间距
  bottomSpacer: {
    height: 40,
  },
});

export default StatusPage;

