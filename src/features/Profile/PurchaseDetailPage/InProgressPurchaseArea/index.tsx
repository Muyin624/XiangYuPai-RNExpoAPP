/**
 * InProgressPurchaseArea - 进行中状态区域（客户视角）
 * 
 * 功能：
 * - 显示服务进行中状态
 * - 显示服务提供者联系方式
 * - 联系服务提供者按钮
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import type { PurchaseDetail } from '../types';

interface InProgressPurchaseAreaProps {
  order: PurchaseDetail;
  onContact: () => void;
}

const COLORS = {
  primary: '#8B5CF6',
  success: '#10B981',
} as const;

const InProgressPurchaseArea: React.FC<InProgressPurchaseAreaProps> = ({
  order,
  onContact,
}) => {
  const isAccepted = !!order.acceptedAt && !order.startedAt;
  const isInProgress = !!order.startedAt && !order.completedAt;
  
  return (
    <View style={styles.container}>
      <View style={styles.statusIcon}>
        <Ionicons
          name={isAccepted ? "checkmark-circle" : "game-controller"}
          size={48}
          color={isAccepted ? COLORS.success : COLORS.primary}
        />
      </View>
      
      <Text style={styles.statusTitle}>
        {isAccepted ? '服务者已接单' : isInProgress ? '服务进行中' : '未知状态'}
      </Text>
      <Text style={styles.statusDesc}>
        {isAccepted ? '服务者正在准备，即将开始服务' : isInProgress ? '正在享受愉快的游戏时光' : ''}
      </Text>
      
      {/* 联系方式 */}
      <View style={styles.contactInfo}>
        <View style={styles.contactItem}>
          <Ionicons name="call-outline" size={20} color="#666666" />
          <Text style={styles.contactLabel}>手机号</Text>
          <Text style={styles.contactValue}>{order.providerInfo.phone}</Text>
        </View>
        
        <View style={styles.contactItem}>
          <Ionicons name="logo-wechat" size={20} color="#07C160" />
          <Text style={styles.contactLabel}>微信号</Text>
          <Text style={styles.contactValue}>{order.providerInfo.wechat}</Text>
        </View>
      </View>
      
      {/* 操作按钮 */}
      <TouchableOpacity
        style={styles.contactButton}
        onPress={onContact}
        activeOpacity={0.7}
      >
        <Ionicons name="chatbubbles" size={20} color="#FFFFFF" />
        <Text style={styles.contactButtonText}>联系服务提供者</Text>
      </TouchableOpacity>
      
      {/* 温馨提示 */}
      <View style={styles.tips}>
        <Ionicons name="information-circle-outline" size={16} color="#999999" />
        <Text style={styles.tipsText}>
          如有任何问题，请及时联系服务提供者或客服
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  
  statusIcon: {
    marginBottom: 16,
  },
  
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  
  statusDesc: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  // 联系方式
  contactInfo: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactLabel: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
    marginRight: 12,
  },
  contactValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    flex: 1,
  },
  
  // 联系按钮
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginBottom: 16,
    width: '100%',
  },
  contactButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // 温馨提示
  tips: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  tipsText: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 6,
    flex: 1,
  },
});

export default InProgressPurchaseArea;

