/**
 * UnifiedHeaderArea - 统一的现代化背景头图区域（重构版）
 * 
 * 架构模式：🔵 嵌套化架构（Nested Architecture）
 * 
 * 功能：
 * - 大背景图片（全屏宽度，500px高度）
 * - 顶部操作栏（返回 + 编辑/关注按钮）
 * - 用户信息卡片（姓名、性别、认证标签、状态信息）
 * 
 * 架构组成：
 * - BackgroundLayer - 背景层（图片 + 渐变）
 * - TopActionBar - 顶部操作栏（返回 + 操作按钮）
 * - UserInfoCard - 用户信息卡片（3行信息）
 * 
 * 设计原则：
 * - 单一职责：每个子组件只负责一个功能区域
 * - 高内聚：子组件内部高度内聚
 * - 低耦合：子组件之间相对独立
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BackgroundLayer from './BackgroundLayer';
import TopActionBar from './TopActionBar';
import { BACKGROUND_HEIGHT } from './constants';
import type { UnifiedHeaderAreaProps } from './types';

const UnifiedHeaderArea: React.FC<UnifiedHeaderAreaProps> = ({
  // Background
  backgroundImage,
  
  // User Basic Info
  nickname,
  gender,
  age,
  height,
  
  // Verification Badges
  isRealVerified = false,
  isGodVerified = false,
  isVipVerified = false,
  
  // Status Info
  isOnline,
  distance,
  followerCount,
  followingCount,
  likeCount,
  
  // Follow Status
  isFollowing = false,
  isMutualFollowing = false,
  
  // Custom Tags
  customTags = [],
  
  // Page Type
  isOwnProfile,
  
  // Event Callbacks
  onBack,
  onEditPress,
  onFollowPress,
  onFollowingPress,
  onFollowerPress,
  onLikePress,
}) => {
  return (
    <View style={styles.container}>
      {/* 背景层 */}
      <BackgroundLayer backgroundImage={backgroundImage} />

      {/* 顶部操作栏 */}
      <TopActionBar
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        isMutualFollowing={isMutualFollowing}
        onBack={onBack}
        onEditPress={onEditPress}
        onFollowPress={onFollowPress}
      />

      {/* 用户信息直接在背景上（白色文字） */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.nickname}>
          {nickname} <Text style={styles.age}>{age}岁</Text>
        </Text>
        
        {/* 状态信息行 */}
        <View style={styles.statusRow}>
          {/* 在线状态 */}
          {isOnline !== undefined && (
            <View style={styles.statusItem}>
              <View style={[styles.onlineDot, { backgroundColor: isOnline ? '#4ADE80' : '#9CA3AF' }]} />
              <Text style={styles.statusText}>{isOnline ? '在线' : '离线'}</Text>
            </View>
          )}
          
          {/* 身高 */}
          {height && (
            <View style={styles.statusItem}>
              <Text style={styles.statusIcon}>📏</Text>
              <Text style={styles.statusText}>{height}cm</Text>
            </View>
          )}
          
          {/* 距离 */}
          {distance !== undefined && distance > 0 && (
            <View style={styles.statusItem}>
              <Text style={styles.statusIcon}>📍</Text>
              <Text style={styles.statusText}>{distance}km</Text>
            </View>
          )}
        </View>
        
        {/* 社交统计行 */}
        <View style={styles.socialRow}>
          {/* 关注 */}
          <TouchableOpacity 
            style={styles.socialItem}
            onPress={onFollowingPress}
            activeOpacity={0.7}
          >
            <Text style={styles.socialLabel}>关注</Text>
            <Text style={styles.socialValue}>{followingCount || 0}</Text>
          </TouchableOpacity>
          
          {/* 粉丝 */}
          <TouchableOpacity 
            style={styles.socialItem}
            onPress={onFollowerPress}
            activeOpacity={0.7}
          >
            <Text style={styles.socialLabel}>粉丝</Text>
            <Text style={styles.socialValue}>{followerCount || 0}</Text>
          </TouchableOpacity>
          
          {/* 获赞 */}
          <TouchableOpacity 
            style={styles.socialItem}
            onPress={onLikePress}
            activeOpacity={0.7}
          >
            <Text style={styles.socialLabel}>获赞</Text>
            <Text style={styles.socialValue}>{likeCount || 0}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: BACKGROUND_HEIGHT,
    position: 'relative',
  },
  userInfoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  nickname: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  age: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  
  // 状态信息行
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusIcon: {
    fontSize: 14,
  },
  statusText: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  
  // 社交统计行
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  socialLabel: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  socialValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default UnifiedHeaderArea;
export { BACKGROUND_HEIGHT };

