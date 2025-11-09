/**
 * ConfirmedStatusArea - 已确认状态区域
 * 
 * 功能：
 * - 显示见面码
 * - 显示活动倒计时
 * - 输入见面码签到按钮
 * - 联系主办方按钮
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import type { SignupDetail } from '../types';

interface ConfirmedStatusAreaProps {
  signup: SignupDetail;
  onCheckIn: () => void;
  onContact: () => void;
}

const COLORS = {
  primary: '#8B5CF6',
  success: '#10B981',
  info: '#3B82F6',
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
  
  const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
  const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
  const isExpired = timeLeft <= 0;
  
  return { days, hours, minutes, seconds, isExpired };
};

const ConfirmedStatusArea: React.FC<ConfirmedStatusAreaProps> = ({
  signup,
  onCheckIn,
  onContact,
}) => {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(signup.activityTime);
  const isCheckedIn = signup.isCheckedIn;
  
  return (
    <View style={styles.container}>
      <View style={styles.statusIcon}>
        <Ionicons
          name={isCheckedIn ? "checkmark-circle" : "calendar"}
          size={48}
          color={isCheckedIn ? COLORS.success : COLORS.info}
        />
      </View>
      
      <Text style={styles.statusTitle}>
        {isCheckedIn ? '已签到' : '报名已确认'}
      </Text>
      <Text style={styles.statusDesc}>
        {isCheckedIn ? '您已成功签到，祝您活动愉快' : '请准时参加活动，到场后向主办方索取见面码完成签到'}
      </Text>
      
      {/* 倒计时 */}
      {!isExpired && !isCheckedIn && (
        <View style={styles.countdown}>
          <Text style={styles.countdownLabel}>距离活动开始</Text>
          <View style={styles.countdownValues}>
            {days > 0 && (
              <View style={styles.countdownItem}>
                <Text style={styles.countdownNumber}>{days}</Text>
                <Text style={styles.countdownUnit}>天</Text>
              </View>
            )}
            <View style={styles.countdownItem}>
              <Text style={styles.countdownNumber}>{String(hours).padStart(2, '0')}</Text>
              <Text style={styles.countdownUnit}>时</Text>
            </View>
            <View style={styles.countdownItem}>
              <Text style={styles.countdownNumber}>{String(minutes).padStart(2, '0')}</Text>
              <Text style={styles.countdownUnit}>分</Text>
            </View>
            <View style={styles.countdownItem}>
              <Text style={styles.countdownNumber}>{String(seconds).padStart(2, '0')}</Text>
              <Text style={styles.countdownUnit}>秒</Text>
            </View>
          </View>
        </View>
      )}
      
      {/* 操作按钮 */}
      {!isCheckedIn && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={onContact}
            activeOpacity={0.7}
          >
            <Ionicons name="call-outline" size={18} color={COLORS.primary} />
            <Text style={styles.secondaryButtonText}>联系主办方</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={onCheckIn}
            activeOpacity={0.7}
          >
            <Ionicons name="log-in-outline" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>现场签到</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* 温馨提示 */}
      <View style={styles.tips}>
        <Ionicons name="information-circle-outline" size={16} color="#999999" />
        <Text style={styles.tipsText}>
          {isCheckedIn 
            ? '签到成功后，请按照活动安排参与活动' 
            : '请提前15分钟到达活动现场，向工作人员索取4位见面码完成签到'}
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
  
  // 倒计时
  countdown: {
    width: '100%',
    backgroundColor: '#EDE9FE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  countdownLabel: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 12,
  },
  countdownValues: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  countdownItem: {
    alignItems: 'center',
  },
  countdownNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
  },
  countdownUnit: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
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
    color: COLORS.primary,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
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

export default ConfirmedStatusArea;

