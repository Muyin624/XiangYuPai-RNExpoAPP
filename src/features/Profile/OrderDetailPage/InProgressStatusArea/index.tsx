/**
 * InProgressStatusArea - 进行中状态区域（服务提供者视角）
 * 
 * 功能：
 * - 显示服务进行中状态
 * - 显示客户联系方式
 * - 提供完成服务或开始服务按钮
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

interface InProgressStatusAreaProps {
  order: OrderDetail;
  onContact: () => void;
  onStartService?: () => void;      // 已接单状态：开始服务
  onCompleteService?: () => void;   // 进行中状态：完成服务
}

const InProgressStatusArea: React.FC<InProgressStatusAreaProps> = ({
  order,
  onContact,
  onStartService,
  onCompleteService,
}) => {
  const isAccepted = order.status === 'accepted';
  const isInProgress = order.status === 'in_progress';
  
  return (
    <View style={styles.container}>
      {/* 状态图标 */}
      <View style={styles.iconContainer}>
        <Ionicons 
          name={isAccepted ? "checkmark-done-circle" : "game-controller"} 
          size={48} 
          color={COLORS.primary} 
        />
      </View>
      
      {/* 状态文本 */}
      <Text style={styles.statusTitle}>
        {isAccepted ? '已接单' : '服务进行中'}
      </Text>
      <Text style={styles.statusDesc}>
        {isAccepted 
          ? '您已接单，请尽快开始服务' 
          : '服务正在进行，请保持联系'}
      </Text>
      
      {/* 客户联系方式 */}
      {(order.customerInfo.phone || order.customerInfo.wechat) && (
        <View style={styles.contactInfo}>
          {order.customerInfo.phone && (
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={20} color="#666666" />
              <Text style={styles.contactLabel}>客户手机</Text>
              <Text style={styles.contactValue}>{order.customerInfo.phone}</Text>
            </View>
          )}
          
          {order.customerInfo.wechat && (
            <View style={styles.contactItem}>
              <Ionicons name="logo-wechat" size={20} color="#07C160" />
              <Text style={styles.contactLabel}>客户微信</Text>
              <Text style={styles.contactValue}>{order.customerInfo.wechat}</Text>
            </View>
          )}
        </View>
      )}
      
      {/* 操作按钮 */}
      {isAccepted && onStartService && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onStartService}
          activeOpacity={0.7}
        >
          <Ionicons name="play-circle" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>开始服务</Text>
        </TouchableOpacity>
      )}
      
      {isInProgress && onCompleteService && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onCompleteService}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>完成服务</Text>
        </TouchableOpacity>
      )}
      
      {/* 联系客户按钮 */}
      <TouchableOpacity
        style={styles.contactButton}
        onPress={onContact}
        activeOpacity={0.7}
      >
        <Ionicons name="chatbubbles-outline" size={16} color={COLORS.primary} />
        <Text style={styles.contactButtonText}>联系客户</Text>
      </TouchableOpacity>
      
      {/* 提示信息 */}
      <View style={styles.tipContainer}>
        <Ionicons name="information-circle-outline" size={16} color="#999999" />
        <Text style={styles.tipText}>
          如遇到问题，请及时联系客户或客服
        </Text>
      </View>
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
    backgroundColor: '#EDE9FE',
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
    marginBottom: 24,
  },
  
  // 联系方式
  contactInfo: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666666',
    width: 70,
  },
  contactValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  
  // 操作按钮
  actionButton: {
    flexDirection: 'row',
    width: '100%',
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // 联系客户按钮
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    marginBottom: 12,
  },
  contactButtonText: {
    fontSize: 13,
    color: COLORS.primary,
  },
  
  // 提示信息
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tipText: {
    fontSize: 12,
    color: '#999999',
  },
});

export default InProgressStatusArea;
