/**
 * CompletedStatusArea - 已完成状态区域
 * 
 * 功能：
 * - 显示活动已完成
 * - 评价功能（星级评分 + 文字评价）
 * - 显示已提交的评价
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import type { SignupDetail } from '../types';

interface CompletedStatusAreaProps {
  signup: SignupDetail;
  onRate: (rating: number, comment: string) => void;
}

const COLORS = {
  primary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
} as const;

/**
 * StarRating - 星级评分组件
 */
const StarRating: React.FC<{
  rating: number;
  onRatingChange?: (rating: number) => void;
  editable?: boolean;
}> = ({ rating, onRatingChange, editable = false }) => {
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => editable && onRatingChange?.(star)}
          disabled={!editable}
          activeOpacity={0.7}
        >
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={32}
            color={star <= rating ? COLORS.warning : '#CCCCCC'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const CompletedStatusArea: React.FC<CompletedStatusAreaProps> = ({
  signup,
  onRate,
}) => {
  const [rating, setRating] = useState(signup.rating || 0);
  const [comment, setComment] = useState(signup.comment || '');
  const hasRated = !!signup.rating;
  
  const handleSubmitRating = () => {
    if (rating === 0) {
      Alert.alert('提示', '请选择评分');
      return;
    }
    
    onRate(rating, comment);
    Alert.alert('成功', '评价提交成功');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.statusIcon}>
        <Ionicons name="checkmark-circle" size={48} color={COLORS.success} />
      </View>
      
      <Text style={styles.statusTitle}>活动已完成</Text>
      <Text style={styles.statusDesc}>
        {hasRated ? '感谢您的评价' : '期待您的评价反馈'}
      </Text>
      
      {/* 完成信息 */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color="#666666" />
          <Text style={styles.infoLabel}>完成时间</Text>
          <Text style={styles.infoValue}>
            {signup.completedAt && new Date(signup.completedAt).toLocaleString('zh-CN')}
          </Text>
        </View>
        
        {signup.checkedInAt && (
          <View style={styles.infoRow}>
            <Ionicons name="log-in-outline" size={18} color="#666666" />
            <Text style={styles.infoLabel}>签到时间</Text>
            <Text style={styles.infoValue}>
              {new Date(signup.checkedInAt).toLocaleString('zh-CN')}
            </Text>
          </View>
        )}
      </View>
      
      {/* 评价区域 */}
      <View style={styles.ratingSection}>
        <Text style={styles.ratingLabel}>
          {hasRated ? '您的评价' : '活动评价'}
        </Text>
        
        <StarRating
          rating={rating}
          onRatingChange={setRating}
          editable={!hasRated}
        />
        
        {hasRated ? (
          // 已评价：显示评价内容
          signup.comment && (
            <View style={styles.commentDisplay}>
              <Text style={styles.commentText}>{signup.comment}</Text>
            </View>
          )
        ) : (
          // 未评价：显示评价输入框
          <>
            <TextInput
              style={styles.commentInput}
              placeholder="说说您的活动体验吧（选填）"
              placeholderTextColor="#CCCCCC"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={comment}
              onChangeText={setComment}
              maxLength={200}
            />
            <Text style={styles.commentCount}>{comment.length}/200</Text>
          </>
        )}
      </View>
      
      {/* 操作按钮 */}
      {!hasRated && (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitRating}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>提交评价</Text>
        </TouchableOpacity>
      )}
      
      {/* 温馨提示 */}
      <View style={styles.tips}>
        <Ionicons name="information-circle-outline" size={16} color="#999999" />
        <Text style={styles.tipsText}>
          您的评价将帮助我们改进活动质量
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
    fontSize: 13,
    color: '#333333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  
  // 评价区域
  ratingSection: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  
  // 星级评分
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  
  // 评价输入
  commentInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 12,
    fontSize: 14,
    color: '#333333',
    minHeight: 100,
    marginBottom: 8,
  },
  commentCount: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'right',
  },
  
  // 评价显示
  commentDisplay: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  commentText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  
  // 提交按钮
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    gap: 6,
  },
  submitButtonText: {
    fontSize: 15,
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

export default CompletedStatusArea;

