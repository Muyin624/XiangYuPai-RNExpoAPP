/**
 * PendingPurchaseArea - 待接单状态区域（客户视角）
 * 
 * 功能：
 * - 显示等待接单状态
 * - 显示自动取消倒计时
 * - 取消订单按钮
 * - 联系客服按钮
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import type { PurchaseDetail } from '../types';

interface PendingPurchaseAreaProps {
  order: PurchaseDetail;
  onCancel: () => void;
  onContact: () => void;
}

const COLORS = {
  primary: '#8B5CF6',
  warning: '#F59E0B',
} as const;

/**
 * 倒计时Hook
 */
const useCountdown = (targetTime: number) => {
  const [timeLeft, setTimeLeft] = useState(targetTime - Date.now());
  
  useEffect(() => {
    const timer = setInterval(() => {
      const left = targetTime - Date.now();
      setTimeLeft(left > 0 ? left : 0);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetTime]);
  
  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const isExpired = timeLeft <= 0;
  
  return { minutes, seconds, isExpired };
};

const PendingPurchaseArea: React.FC<PendingPurchaseAreaProps> = ({
  order,
  onCancel,
  onContact,
}) => {
  // 自动取消时间（30分钟后）
  const autoCancelTime = order.createdAt + 30 * 60 * 1000;
  const { minutes, seconds, isExpired } = useCountdown(autoCancelTime);
  
  return (
    <View style={styles.container}>
      <View style={styles.statusIcon}>
        <Ionicons name="time-outline" size={48} color={COLORS.warning} />
      </View>
      
      <Text style={styles.statusTitle}>等待服务者接单</Text>
      <Text style={styles.statusDesc}>
        服务者将在30分钟内接单，请耐心等待
      </Text>
      
      {/* 倒计时 */}
      {!isExpired ? (
        <View style={styles.countdown}>
          <Ionicons name="alarm-outline" size={16} color={COLORS.warning} />
          <Text style={styles.countdownText}>
            剩余时间：{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </Text>
        </View>
      ) : (
        <View style={styles.expired}>
          <Text style={styles.expiredText}>订单已超时，将自动取消</Text>
        </View>
      )}
      
      {/* 操作按钮 */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={onContact}
          activeOpacity={0.7}
        >
          <Ionicons name="chatbubbles-outline" size={18} color="#666666" />
          <Text style={styles.secondaryButtonText}>联系客服</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton]}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle-outline" size={18} color="#FFFFFF" />
          <Text style={styles.dangerButtonText}>取消订单</Text>
        </TouchableOpacity>
      </View>
      
      {/* 温馨提示 */}
      <View style={styles.tips}>
        <Ionicons name="information-circle-outline" size={16} color="#999999" />
        <Text style={styles.tipsText}>
          如长时间无人接单，订单将自动取消并退还金币
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
    marginBottom: 16,
  },
  
  // 倒计时
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  countdownText: {
    fontSize: 14,
    color: COLORS.warning,
    fontWeight: '600',
    marginLeft: 6,
  },
  
  // 已过期
  expired: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  expiredText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  
  // 操作按钮
  actions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  secondaryButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  dangerButton: {
    backgroundColor: '#EF4444',
  },
  dangerButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
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

export default PendingPurchaseArea;

