// #region 1. File Banner & TOC
/**
 * useOtherUserProfilePage - Main State Management
 * 
 * 对方用户主页的主状态管理
 * 
 * TOC:
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Hook Implementation
 * [4] Export
 */
// #endregion

// #region 2. Imports

import { useAuthGuard } from '@/src/utils/auth/AuthGuard';
import { useProfileStore } from '@/stores/profileStore';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Clipboard } from 'react-native';
import type { OtherUserInfo, TabType } from './types';

// #endregion

// #region 3. Hook Implementation

/**
 * 对方用户主页主状态管理
 * 🔄 Updated: Using OtherUserProfile TabType (动态/资料/技能)
 */
export const useOtherUserProfilePage = (userId: string) => {
  const router = useRouter();
  const { requireAuth, isAuthenticated } = useAuthGuard();
  
  // Profile store
  const { loadUserProfile, followUser, unfollowUser, loadPosts } = useProfileStore();
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const loading = useProfileStore((state) => state.loading);
  const error = useProfileStore((state) => state.error);
  const posts = useProfileStore((state) => state.posts);
  
  // Local state - 🔄 Using OtherUserProfile TabType (动态/资料/技能)
  const [activeTab, setActiveTab] = useState<TabType>('dynamics');
  const [isFollowing, setIsFollowing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Load user profile on mount
  useEffect(() => {
    console.log('[OtherUserProfile] Loading user profile:', userId);
    loadUserProfile(userId);
  }, [userId, loadUserProfile]);
  
  // Update following status
  useEffect(() => {
    if (currentProfile) {
      // TODO: Get actual follow status from backend
      setIsFollowing(false);
    }
  }, [currentProfile]);
  
  // 🆕 Auto-load initial tab data
  useEffect(() => {
    if (activeTab === 'dynamics' && posts.dynamic.length === 0) {
      console.log('📋 初始加载动态Tab数据...');
      loadPosts('dynamic', 1);
    }
  }, []);
  
  /**
   * Handle tab change - 🔄 Updated to use OtherUserProfile TabType
   */
  const handleTabChange = useCallback((tab: TabType) => {
    console.log('🔄 切换Tab:', tab);
    setActiveTab(tab);
    
    // Auto-load tab data if empty (only for dynamics tab)
    if (tab === 'dynamics' && posts.dynamic.length === 0) {
      console.log(`📋 动态Tab暂无数据，自动加载...`);
      loadPosts('dynamic', 1);
    }
  }, [posts, loadPosts]);
  
  /**
   * Handle follow toggle
   */
  const handleFollowToggle = useCallback(async () => {
    if (!requireAuth({ action: '关注用户' })) {
      return;
    }
    
    try {
      setActionLoading(true);
      
      if (isFollowing) {
        await unfollowUser(Number(userId));
        setIsFollowing(false);
      } else {
        await followUser(Number(userId));
        setIsFollowing(true);
      }
    } catch (err) {
      console.error('Follow/unfollow error:', err);
    } finally {
      setActionLoading(false);
    }
  }, [isFollowing, userId, requireAuth, followUser, unfollowUser]);
  
  /**
   * Handle refresh
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUserProfile(userId);
    setRefreshing(false);
  }, [userId, loadUserProfile]);
  
  /**
   * 🆕 Handle back button
   */
  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);
  
  /**
   * 🆕 Handle following count press
   */
  const handleFollowingPress = useCallback(() => {
    console.log('🧭 导航: 查看关注列表');
    router.push(`/profile/following?userId=${userId}` as any);
  }, [router, userId]);
  
  /**
   * 🆕 Handle follower count press
   */
  const handleFollowerPress = useCallback(() => {
    console.log('🧭 导航: 查看粉丝列表');
    router.push(`/profile/followers?userId=${userId}` as any);
  }, [router, userId]);
  
  /**
   * 🆕 Handle like count press
   */
  const handleLikePress = useCallback(() => {
    console.log('🧭 导航: 查看获赞与收藏');
    // TODO: Implement like/collect page
  }, []);
  
  /**
   * 🆕 Handle WeChat unlock
   */
  const handleWechatUnlock = useCallback(() => {
    if (!currentProfile) {
      Alert.alert('提示', '用户信息加载中，请稍后再试');
      return;
    }
    
    console.log('🔓 解锁微信功能被调用');
    console.log('📋 用户微信信息:', {
      wechat: currentProfile.wechat,
      wechatMasked: currentProfile.wechatMasked,
      wechatUnlockCondition: currentProfile.wechatUnlockCondition,
      canViewWechat: currentProfile.canViewWechat,
    });
    
    // Check if WeChat is available
    if (!currentProfile.wechat && !currentProfile.wechatMasked) {
      Alert.alert('提示', '该用户暂未设置微信号');
      return;
    }
    
    // Check if already unlocked or can view
    if (currentProfile.canViewWechat && currentProfile.wechat) {
      // Already unlocked, show WeChat ID with copy option
      Alert.alert(
        '微信号',
        `${currentProfile.nickname}的微信号：\n${currentProfile.wechat}`,
        [
          {
            text: '复制',
            onPress: () => {
              Clipboard.setString(currentProfile.wechat || '');
              Alert.alert('成功', '微信号已复制到剪贴板');
            },
          },
          { text: '关闭', style: 'cancel' },
        ]
      );
      return;
    }
    
    // Check unlock condition
    const condition = currentProfile.wechatUnlockCondition || 0;
    const conditionDesc = currentProfile.wechatUnlockDesc || '';
    
    switch (condition) {
      case 0: // 公开
        if (currentProfile.wechat) {
          Alert.alert(
            '微信号',
            `${currentProfile.nickname}的微信号：\n${currentProfile.wechat}`,
            [
              {
                text: '复制',
                onPress: () => {
                  Clipboard.setString(currentProfile.wechat || '');
                  Alert.alert('成功', '微信号已复制到剪贴板');
                },
              },
              { text: '关闭', style: 'cancel' },
            ]
          );
        } else {
          Alert.alert('提示', '该用户暂未设置微信号');
        }
        break;
        
      case 1: // 关注后可见
        if (isFollowing) {
          // Already following, should be able to view
          if (currentProfile.wechat) {
            Alert.alert(
              '微信号',
              `${currentProfile.nickname}的微信号：\n${currentProfile.wechat}`,
              [
                {
                  text: '复制',
                  onPress: () => {
                    Clipboard.setString(currentProfile.wechat || '');
                    Alert.alert('成功', '微信号已复制到剪贴板');
                  },
                },
                { text: '关闭', style: 'cancel' },
              ]
            );
          } else {
            Alert.alert('提示', '该用户暂未设置微信号');
          }
        } else {
          // Need to follow first
          Alert.alert(
            '需要关注',
            `关注 ${currentProfile.nickname} 后即可查看微信号`,
            [
              {
                text: '去关注',
                onPress: handleFollowToggle,
              },
              { text: '取消', style: 'cancel' },
            ]
          );
        }
        break;
        
      case 2: // 付费解锁
        Alert.alert(
          '付费解锁',
          `查看 ${currentProfile.nickname} 的微信号需要支付解锁费用\n\n${conditionDesc || '暂未开放'}`,
          [
            {
              text: '立即支付',
              onPress: () => {
                // TODO: Implement payment logic
                Alert.alert('提示', '支付功能开发中，敬请期待');
              },
            },
            { text: '取消', style: 'cancel' },
          ]
        );
        break;
        
      case 3: // 私密（不可见）
        Alert.alert(
          '无法查看',
          `${currentProfile.nickname} 的微信号已设为私密，暂不对外公开`
        );
        break;
        
      default:
        Alert.alert('提示', '未知的解锁条件');
    }
  }, [currentProfile, isFollowing, handleFollowToggle]);
  
  // Helper: Convert gender string to number
  const convertGender = (gender?: string): number | undefined => {
    if (!gender) return undefined;
    switch (gender) {
      case 'male': return 1;
      case 'female': return 2;
      default: return 0;
    }
  };
  
  // Transform profile data
  const userInfo: OtherUserInfo | null = currentProfile ? {
    id: currentProfile.id,
    nickname: currentProfile.nickname,
    avatar: currentProfile.avatar,
    backgroundImage: currentProfile.backgroundImage,
    bio: currentProfile.bio,
    gender: convertGender(currentProfile.gender) as number | undefined,
    age: currentProfile.age,
    location: currentProfile.location,
    occupation: currentProfile.occupations?.[0],
    
    isVip: currentProfile.isVip || false,
    isRealVerified: currentProfile.isRealVerified || false,
    isGodVerified: currentProfile.isGodVerified || false,
    isPopular: currentProfile.isPopular || false,
    
    isOnline: currentProfile.isOnline,
    
    followerCount: currentProfile.followerCount || 0,
    followingCount: currentProfile.followingCount || 0,
    likeCount: currentProfile.likeCount || 0,
    postCount: currentProfile.postCount || 0,
    
    height: currentProfile.height,
    weight: currentProfile.weight,
    skills: currentProfile.skills,
    wechat: currentProfile.wechat,
    wechatMasked: currentProfile.wechatMasked,
    wechatUnlockCondition: currentProfile.wechatUnlockCondition,
    wechatUnlockDesc: currentProfile.wechatUnlockDesc,
    canViewWechat: currentProfile.canViewWechat,
    phone: currentProfile.phone,
    
    createdAt: currentProfile.createdAt || '',
    distance: undefined,
  } : null;
  
  return {
    // Data
    userInfo,
    activeTab,
    isFollowing,
    loading,
    error,
    actionLoading,
    refreshing,
    isAuthenticated,
    
    // Actions
    handleTabChange,
    handleFollowToggle,
    handleRefresh,
    // 🆕 New handlers for UnifiedHeaderArea
    handleBack,
    handleFollowingPress,
    handleFollowerPress,
    handleLikePress,
    // 🆕 WeChat unlock handler
    handleWechatUnlock,
  };
};

// #endregion

// #region 4. Export

export default useOtherUserProfilePage;

// #endregion

