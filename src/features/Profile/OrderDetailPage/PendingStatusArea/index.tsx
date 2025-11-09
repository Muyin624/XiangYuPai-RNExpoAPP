/**
 * PendingStatusArea - 待接单状态区域（服务提供者视角）
 * 
 * 功能：
 * - 显示待接单状态
 * - 显示订单信息
 * - 提供接单和拒绝按钮
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { COLORS } from '../constants';
import type { OrderDetail } from '../types';

interface PendingStatusAreaProps {
  order: OrderDetail;
  onAccept: () => void;
  onReject: () => void;
  onContact: () => void;
}

const PendingStatusArea: React.FC<PendingStatusAreaProps> = ({
  order,
  onAccept,
  onReject,
  onContact,
}) => {
  return (
    <View style={styles.container}>
      {/* 状态图标 */}
      <View style={styles.iconContainer}>
        <Ionicons name="hourglass-outline" size={48} color={COLORS.warning} />
      </View>
      
      {/* 状态文本 */}
      <Text style={styles.statusTitle}>新订单待接单</Text>
      <Text style={styles.statusDesc}>
        客户正在等待您接单，请尽快确认
      </Text>
      
      {/* 订单摘要 */}
      <View style={styles.orderSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>服务项目</Text>
          <Text style={styles.summaryValue}>{order.skillName}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>服务数量</Text>
          <Text style={styles.summaryValue}>{order.quantity} 局</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>订单金额</Text>
          <Text style={[styles.summaryValue, styles.priceValue]}>{order.totalPrice} 金币</Text>
        </View>
      </View>
      
      {/* 操作按钮 */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={onReject}
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle-outline" size={18} color="#666666" />
          <Text style={styles.secondaryButtonText}>拒绝</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={onAccept}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>接单</Text>
        </TouchableOpacity>
      </View>
      
      {/* 联系客户按钮 */}
      <TouchableOpacity
        style={styles.contactButton}
        onPress={onContact}
        activeOpacity={0.7}
      >
        <Ionicons name="chatbubble-outline" size={16} color={COLORS.primary} />
        <Text style={styles.contactButtonText}>联系客户</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  
  // 图标
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  // 状态文本
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
  
  // 订单摘要
  orderSummary: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF4444',
  },
  
  // 操作按钮
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  
  // 联系客户按钮
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  contactButtonText: {
    fontSize: 13,
    color: COLORS.primary,
  },
});

export default PendingStatusArea;
