// #region 1. File Banner & TOC
/**
 * UserDetailPage - 用户详情页面
 * 功能描述：展示用户完整信息，支持关注、私信、预订等操作
 * TOC: [1] Imports - [2] Types - [3] Constants - [4] Utils - [5] State - [6] Logic - [7] UI - [8] Exports
 */
// #endregion

// #region 2. Imports
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUserStore } from '../../../../../stores';
import { Button, Card, ErrorBoundary, LoadingOverlay } from '../../../../components';
// #endregion

// #region 3. Types & Schema
interface UserDetailPageProps {
  userId: string;
  serviceType?: string;
}
// #endregion

// #region 4. Constants & Config
const COLORS = {
  BACKGROUND: '#FFFFFF',
  PRIMARY: '#6366F1',
  TEXT: '#1F2937',
  TEXT_SECONDARY: '#6B7280',
  BORDER: '#E5E7EB',
  SURFACE: '#F8FAFC',
  ONLINE: '#10B981',
  OFFLINE: '#9CA3AF',
};

const SIZES = {
  AVATAR_SIZE: 100,
  STATUS_DOT_SIZE: 16,
};
// #endregion

// #region 5. Utils & Helpers
const formatPrice = (price: number) => `¥${price}`;
const formatRating = (rating: number, count: number) => 
  `${rating.toFixed(1)} (${count > 999 ? `${(count/1000).toFixed(1)}k` : count})`;
// #endregion

// #region 6. State Management
const useUserDetailState = (userId: string) => {
  const { getUserDetail } = useUserStore();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadUserDetail = async () => {
      try {
        setLoading(true);
        const userData = await getUserDetail(userId);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserDetail();
  }, [userId, getUserDetail]);
  
  return { user, loading, error };
};
// #endregion

// #region 7. Domain Logic
const useUserDetailLogic = (userId: string, serviceType?: string) => {
  const router = useRouter();
  const { user, loading, error } = useUserDetailState(userId);
  
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  
  const handleFollow = useCallback(() => {
    console.log('Follow user:', userId);
  }, [userId]);
  
  const handleMessage = useCallback(() => {
    router.push({ pathname: '/messages/chat/[conversationId]' as any, params: { conversationId: userId } });
  }, [router, userId]);
  
  const handleUnlockWeChat = useCallback(() => {
    console.log('Unlock WeChat for user:', userId);
    // TODO: Implement WeChat unlock logic
  }, [userId]);
  
  const handleBook = useCallback(() => {
    console.log('Book service:', userId, serviceType);
  }, [userId, serviceType]);
  
  return {
    user,
    loading,
    error,
    handleBack,
    handleFollow,
    handleMessage,
    handleUnlockWeChat,
    handleBook,
  };
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * 用户头部信息区域
 */
const UserHeaderArea: React.FC<{
  user: any;
  onFollow: () => void;
  onMessage: () => void;
}> = ({ user, onFollow, onMessage }) => (
  <View style={styles.headerArea}>
    {/* 头像和基本信息 */}
    <View style={styles.avatarSection}>
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <Text style={styles.avatarPlaceholder}>👤</Text>
        </View>
        <View style={[
          styles.statusDot,
          { backgroundColor: user?.isOnline ? COLORS.ONLINE : COLORS.OFFLINE }
        ]} />
      </View>
      
      <View style={styles.basicInfo}>
        <Text style={styles.userName}>{user?.name || '加载中...'}</Text>
        <Text style={styles.userMeta}>
          {user?.age}岁 · {user?.gender === 'male' ? '♂' : '♀'} · {user?.location?.city}
        </Text>
        <Text style={styles.userRating}>
          ⭐ {user ? formatRating(user.rating, user.reviewCount) : '-'}
        </Text>
      </View>
    </View>
    
    {/* 操作按钮 */}
    <View style={styles.actionButtons}>
      <Button
        title="关注"
        onPress={onFollow}
        variant="outline"
        size="sm"
        style={styles.actionButton}
      />
      <Button
        title="私信"
        onPress={onMessage}
        variant="primary"
        size="sm"
        style={styles.actionButton}
      />
    </View>
  </View>
);

/**
 * 个人信息区域
 */
const PersonalInfoArea: React.FC<{ user: any }> = ({ user }) => (
  <Card style={styles.infoCard}>
    <Text style={styles.sectionTitle}>个人信息</Text>
    
    {/* 信息行 */}
    <View style={styles.infoGrid}>
      {/* 身高 */}
      {user?.height && (
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📏</Text>
          <Text style={styles.infoLabel}>身高</Text>
          <Text style={styles.infoValue}>{user.height}cm</Text>
        </View>
      )}
      
      {/* 关注 */}
      <View style={styles.infoRow}>
        <Text style={styles.infoIcon}>👥</Text>
        <Text style={styles.infoLabel}>关注</Text>
        <Text style={styles.infoValue}>{user?.followingCount ?? 0}</Text>
      </View>
      
      {/* 粉丝 */}
      <View style={styles.infoRow}>
        <Text style={styles.infoIcon}>⭐</Text>
        <Text style={styles.infoLabel}>粉丝</Text>
        <Text style={styles.infoValue}>{user?.followersCount ?? 0}</Text>
      </View>
      
      {/* 获赞 */}
      <View style={styles.infoRow}>
        <Text style={styles.infoIcon}>❤️</Text>
        <Text style={styles.infoLabel}>获赞</Text>
        <Text style={styles.infoValue}>{user?.likesCount ?? 0}</Text>
      </View>
    </View>
  </Card>
);

/**
 * 服务信息区域
 */
const ServiceInfoArea: React.FC<{ user: any }> = ({ user }) => (
  <Card style={styles.infoCard}>
    <Text style={styles.sectionTitle}>服务信息</Text>
    
    {/* 服务标签 */}
    <View style={styles.tagsContainer}>
      {user?.tags?.map((tag: string, idx: number) => (
        <View key={idx} style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ))}
    </View>
    
    {/* 价格信息 */}
    <View style={styles.priceRow}>
      <Text style={styles.priceLabel}>服务价格：</Text>
      <Text style={styles.priceValue}>{user ? formatPrice(user.price) : '-'}/小时</Text>
    </View>
    
    {/* 个人简介 */}
    <Text style={styles.descriptionLabel}>个人简介：</Text>
    <Text style={styles.descriptionText}>
      {user?.description || '暂无简介'}
    </Text>
  </Card>
);

/**
 * UserDetailPage 主组件
 */
const UserDetailPage: React.FC<UserDetailPageProps> = ({ userId, serviceType }) => {
  const {
    user,
    loading,
    error,
    handleBack,
    handleFollow,
    handleMessage,
    handleUnlockWeChat,
    handleBook,
  } = useUserDetailLogic(userId, serviceType);
  
  // 加载状态
  if (loading) {
    return <LoadingOverlay loading={loading} text="加载用户信息..." />;
  }
  
  // 错误状态
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="返回" onPress={handleBack} />
      </View>
    );
  }
  
  return (
    <ErrorBoundary>
      <View style={styles.container}>
        {/* 顶部导航 */}
        <View style={styles.navigation}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>用户详情</Text>
          <View style={styles.navRight} />
        </View>
        
        {/* 内容区域 */}
        <ScrollView style={styles.content}>
          <UserHeaderArea
            user={user}
            onFollow={handleFollow}
            onMessage={handleMessage}
          />
          
          <PersonalInfoArea user={user} />
          
          <ServiceInfoArea user={user} />
          
          {/* 预订按钮 */}
          {serviceType && (
            <View style={styles.bookingSection}>
              <Button
                title="立即预订"
                onPress={handleBook}
                variant="primary"
                size="lg"
                style={styles.bookButton}
              />
            </View>
          )}
        </ScrollView>
        
        {/* Bottom Action Buttons (私信 & 解锁微信) */}
        <View style={styles.bottomButtonArea}>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={handleMessage}
            activeOpacity={0.8}
          >
            <Text style={styles.messageButtonIcon}>💬</Text>
            <Text style={styles.messageButtonText}>私信</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.unlockButton}
            onPress={handleUnlockWeChat}
            activeOpacity={0.8}
          >
            <Text style={styles.unlockButtonIcon}>🔓</Text>
            <Text style={styles.unlockButtonText}>解锁微信</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ErrorBoundary>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  
  // 导航样式
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.TEXT,
  },
  navTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT,
    textAlign: 'center',
  },
  navRight: {
    width: 40,
  },
  
  // 内容区域
  content: {
    flex: 1,
  },
  
  // 头部区域
  headerArea: {
    padding: 20,
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  avatarSection: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: SIZES.AVATAR_SIZE,
    height: SIZES.AVATAR_SIZE,
    borderRadius: SIZES.AVATAR_SIZE / 2,
    backgroundColor: COLORS.SURFACE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    fontSize: 48,
  },
  statusDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: SIZES.STATUS_DOT_SIZE,
    height: SIZES.STATUS_DOT_SIZE,
    borderRadius: SIZES.STATUS_DOT_SIZE / 2,
    borderWidth: 3,
    borderColor: COLORS.BACKGROUND,
  },
  basicInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  userMeta: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  userRating: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  
  // 操作按钮
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  
  // 信息卡片
  infoCard: {
    margin: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 12,
  },
  
  // 个人信息网格
  infoGrid: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.SURFACE,
    borderRadius: 8,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.TEXT,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  
  // 标签
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.BACKGROUND,
  },
  
  // 价格信息
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  
  // 描述
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  
  // 预订区域
  bookingSection: {
    padding: 16,
  },
  bookButton: {
    width: '100%',
  },
  
  // Bottom Action Buttons
  bottomButtonArea: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
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
  messageButtonIcon: {
    fontSize: 20,
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
  unlockButtonIcon: {
    fontSize: 20,
  },
  unlockButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // 错误状态
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default UserDetailPage;
export type { UserDetailPageProps };
// #endregion
