/**
 * CompletedPurchaseArea - 已完成状态区域（客户视角）
 * 
 * 功能：
 * - 显示服务已完成状态
 * - 评价功能（星级评分 + 文字评价）
 * - 再来一单按钮
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

import type { PurchaseDetail } from '../types';

interface CompletedPurchaseAreaProps {
  order: PurchaseDetail;
  onRate: (rating: number, comment: string) => void;
  onReorder: () => void;
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

const CompletedPurchaseArea: React.FC<CompletedPurchaseAreaProps> = ({
  order,
  onRate,
  onReorder,
}) => {
  const [rating, setRating] = useState(order.rating || 0);
  const [comment, setComment] = useState(order.comment || '');
  const hasRated = !!order.rating;
  
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
      
      <Text style={styles.statusTitle}>服务已完成</Text>
      <Text style={styles.statusDesc}>
        {hasRated ? '感谢您的评价' : '期待您的评价'}
      </Text>
      
      {/* 评价区域 */}
      <View style={styles.ratingSection}>
        <Text style={styles.ratingLabel}>
          {hasRated ? '您的评价' : '服务评价'}
        </Text>
        
        <StarRating
          rating={rating}
          onRatingChange={setRating}
          editable={!hasRated}
        />
        
        {hasRated ? (
          // 已评价：显示评价内容
          order.comment && (
            <View style={styles.commentDisplay}>
              <Text style={styles.commentText}>{order.comment}</Text>
            </View>
          )
        ) : (
          // 未评价：显示评价输入框
          <>
            <TextInput
              style={styles.commentInput}
              placeholder="说说您的服务体验吧（选填）"
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
      <View style={styles.actions}>
        {!hasRated && (
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleSubmitRating}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>提交评价</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton, hasRated && styles.fullWidth]}
          onPress={onReorder}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={20} color={COLORS.primary} />
          <Text style={styles.secondaryButtonText}>再来一单</Text>
        </TouchableOpacity>
      </View>
      
      {/* 温馨提示 */}
      <View style={styles.tips}>
        <Ionicons name="information-circle-outline" size={16} color="#999999" />
        <Text style={styles.tipsText}>
          您的评价将帮助其他用户更好地选择服务
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
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
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
  fullWidth: {
    flex: 1,
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

export default CompletedPurchaseArea;

