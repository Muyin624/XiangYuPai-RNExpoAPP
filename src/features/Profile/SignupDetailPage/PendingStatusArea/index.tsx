/**
 * PendingStatusArea - 待确认状态区域
 * 
 * 功能：
 * - 显示等待确认状态
 * - 取消报名按钮
 * - 联系主办方按钮
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import type { SignupDetail } from '../types';

interface PendingStatusAreaProps {
  signup: SignupDetail;
  onCancel: () => void;
  onContact: () => void;
}

const COLORS = {
  primary: '#8B5CF6',
  warning: '#F59E0B',
} as const;

const PendingStatusArea: React.FC<PendingStatusAreaProps> = ({
  signup,
  onCancel,
  onContact,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.statusIcon}>
        <Ionicons name="time-outline" size={48} color={COLORS.warning} />
      </View>
      
      <Text style={styles.statusTitle}>等待主办方确认</Text>
      <Text style={styles.statusDesc}>
        您的报名已提交，主办方将在24小时内确认
      </Text>
      
      {/* 报名信息 */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color="#666666" />
          <Text style={styles.infoLabel}>报名时间</Text>
          <Text style={styles.infoValue}>
            {new Date(signup.signupTime).toLocaleString('zh-CN')}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={18} color="#666666" />
          <Text style={styles.infoLabel}>当前人数</Text>
          <Text style={styles.infoValue}>
            {signup.participantCount}/{signup.maxParticipants}人
          </Text>
        </View>
      </View>
      
      {/* 操作按钮 */}
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
          style={[styles.actionButton, styles.dangerButton]}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle-outline" size={18} color="#FFFFFF" />
          <Text style={styles.dangerButtonText}>取消报名</Text>
        </TouchableOpacity>
      </View>
      
      {/* 温馨提示 */}
      <View style={styles.tips}>
        <Ionicons name="information-circle-outline" size={16} color="#999999" />
        <Text style={styles.tipsText}>
          如有疑问，请及时联系主办方咨询
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
  
  // 信息卡片
  infoCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
    marginRight: 12,
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
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

export default PendingStatusArea;

