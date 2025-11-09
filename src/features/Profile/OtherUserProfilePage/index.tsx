// #region 1. File Banner & TOC
/**
 * OtherUserProfilePage - Other User's Profile Page
 * 
 * 个人主页页面（完整页面，非模态框）
 * 用于查看其他用户的个人主页
 * 
 * Features:
 * - 完整的页面布局
 * - 头部导航
 * - 用户信息展示
 * - 统计数据
 * - Tab切换（动态/收藏/点赞/资料）
 * - 底部操作按钮
 * - 认证系统集成
 * - 刷新支持
 * 
 * 🔄 Updated: Now using MainPage components for consistency
 * - UnifiedHeaderArea (same as personal profile)
 * - TabNavigationArea (same tab structure)
 * - TabContentArea (shared component)
 * 
 * TOC:
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Main Component
 * [4] Styles
 * [5] Export
 */
// #endregion

// #region 2. Imports

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 🆕 Reuse components from MainPage for consistency
import UnifiedHeaderArea from '../MainPage/UnifiedHeaderArea';

// 🆕 Use OtherUserProfile specific Tab components
import TabContentArea from './TabContentArea';
import TabNavigationArea from './TabNavigationArea';

// State management
import { useAuthGuard } from '@/src/utils/auth/AuthGuard';
import useOtherUserProfilePage from './useOtherUserProfilePage';

// Event handlers
import navigateToMessage from './navigateToMessage';

// Types
import type { OtherUserProfilePageProps } from './types';

// #endregion

// #region 3. Main Component

/**
 * 对方用户主页页面
 */
const OtherUserProfilePage: React.FC<OtherUserProfilePageProps> = ({ userId }) => {
  const router = useRouter();
  const { requireAuth } = useAuthGuard();
  
  const {
    userInfo,
    activeTab,
    isFollowing,
    loading,
    error,
    handleTabChange,
    handleFollowToggle,
    handleBack,
    handleFollowingPress,
    handleFollowerPress,
    handleLikePress,
    handleWechatUnlock,
  } = useOtherUserProfilePage(userId);
  
  // Handle send message
  const handleSendMessage = () => {
    if (!requireAuth({ action: '发送消息' })) {
      return;
    }
    
    if (userInfo) {
      navigateToMessage(router, userInfo.id, userInfo.nickname);
    }
  };
  
  // Handle unlock WeChat
  const handleUnlockWeChat = () => {
    if (!requireAuth({ action: '解锁微信' })) {
      return;
    }
    
    if (userInfo) {
      handleWechatUnlock();
    }
  };
  
  // Loading state
  if (loading && !userInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#8A2BE2" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Error state
  if (error && !userInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={handleBack} style={styles.errorButton}>
            <Text style={styles.errorButtonText}>返回</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  // No data
  if (!userInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>用户不存在</Text>
          <TouchableOpacity onPress={handleBack} style={styles.errorButton}>
            <Text style={styles.errorButtonText}>返回</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* ✨ 整页滚动容器 - 支持整个页面上下滚动 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
      >
        {/* ✨ 统一的现代化背景头图区域（与个人主页一致） */}
        <UnifiedHeaderArea
          backgroundImage={userInfo.backgroundImage}
          nickname={userInfo.nickname}
          gender={userInfo.gender === 1 ? 1 : userInfo.gender === 2 ? 2 : undefined}
          age={userInfo.age}
          height={userInfo.height}
          isRealVerified={userInfo.isRealVerified}
          isGodVerified={userInfo.isGodVerified}
          isVipVerified={userInfo.isVip}
          isOnline={userInfo.isOnline}
          distance={userInfo.distance}
          followerCount={userInfo.followerCount}
          followingCount={userInfo.followingCount}
          likeCount={userInfo.likeCount}
          isFollowing={isFollowing}
          isOwnProfile={false}
          onBack={handleBack}
          onFollowPress={handleFollowToggle}
          onFollowingPress={handleFollowingPress}
          onFollowerPress={handleFollowerPress}
          onLikePress={handleLikePress}
        />
        
        {/* Tab标签栏 */}
        <TabNavigationArea
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        {/* Tab内容区域 */}
        <View style={styles.tabContent}>
          <TabContentArea
            activeTab={activeTab}
            userId={userInfo.id}
            isOwnProfile={false}
          />
        </View>
      </ScrollView>
      
      {/* Bottom Action Buttons (私信 & 解锁微信) */}
      <View style={styles.bottomButtonArea}>
        <TouchableOpacity
          style={styles.messageButton}
          onPress={handleSendMessage}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#FFFFFF" />
          <Text style={styles.messageButtonText}>私信</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.unlockButton}
          onPress={handleUnlockWeChat}
          activeOpacity={0.8}
        >
          <Ionicons name="lock-open-outline" size={20} color="#FFFFFF" />
          <Text style={styles.unlockButtonText}>解锁微信</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// #endregion

// #region 4. Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // 不设置 flex:1，让内容自然撑开高度
  },
  tabContent: {
    // 移除 flex: 1，让内容自适应高度
    minHeight: 400, // 最小高度确保有足够空间显示内容
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#8A2BE2',
    borderRadius: 8,
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomButtonArea: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6', // Purple color for 私信
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  unlockButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D946EF', // Magenta/Pink color for 解锁微信
  },
  unlockButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

// #endregion

// #region 5. Export

export default OtherUserProfilePage;

// #endregion

