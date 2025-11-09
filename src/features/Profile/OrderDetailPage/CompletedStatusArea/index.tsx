/**
 * CompletedStatusArea - 已完成状态区域（服务提供者视角）
 * 
 * 功能：
 * - 显示服务完成状态
 * - 显示客户评价信息
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { COLORS } from '../constants';
import type { OrderDetail } from '../types';

interface CompletedStatusAreaProps {
  order: OrderDetail;
}

/**
 * 星级评分组件
 */
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= rating ? 'star' : 'star-outline'}
          size={20}
          color={star <= rating ? '#FFA500' : '#CCCCCC'}
        />
      ))}
    </View>
  );
};

const CompletedStatusArea: React.FC<CompletedStatusAreaProps> = ({
  order,
}) => {
  const hasRating = !!order.rating;
  
  return (
    <View style={styles.container}>
      {/* 状态图标 */}
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={48} color={COLORS.success} />
      </View>
      
      {/* 状态文本 */}
      <Text style={styles.statusTitle}>服务已完成</Text>
      <Text style={styles.statusDesc}>
        {hasRating ? '客户已评价' : '等待客户评价'}
      </Text>
      
      {/* 评价信息 */}
      {hasRating ? (
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingLabel}>客户评价</Text>
          <StarRating rating={order.rating!} />
          {order.comment && (
            <View style={styles.commentBox}>
              <Text style={styles.commentText}>{order.comment}</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.waitingContainer}>
          <Ionicons name="time-outline" size={32} color="#CCCCCC" />
          <Text style={styles.waitingText}>等待客户评价中...</Text>
        </View>
      )}
      
      {/* 收入信息 */}
      <View style={styles.incomeContainer}>
        <Text style={styles.incomeLabel}>本单收入</Text>
        <Text style={styles.incomeValue}>+{order.totalPrice} 金币</Text>
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
    backgroundColor: '#D1FAE5',
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
  
  // 评价信息
  ratingContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 13,
    color: '#999999',
    marginBottom: 8,
  },
  starContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  commentBox: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  commentText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  
  // 等待评价
  waitingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  waitingText: {
    fontSize: 13,
    color: '#999999',
    marginTop: 8,
  },
  
  // 收入信息
  incomeContainer: {
    width: '100%',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incomeLabel: {
    fontSize: 14,
    color: '#666666',
  },
  incomeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F59E0B',
  },
});

export default CompletedStatusArea;
