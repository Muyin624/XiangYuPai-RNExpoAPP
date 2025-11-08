/**
 * FollowerItem - 粉丝列表项组件
 * 
 * 功能：显示粉丝信息，包含回关按钮
 */

import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// ============================================
// Types
// ============================================

interface FollowerItemProps {
  id: string;
  avatar: string;
  nickname: string;
  content: string;
  timestamp: number;
  isRead: boolean;
  isFollowing?: boolean; // 是否已回关
  isMutualFollow?: boolean; // 是否互相关注
  onPress: () => void;
  onFollowPress: (followerId: string) => Promise<void>;
}

// ============================================
// Constants
// ============================================

const COLORS = {
  background: '#FFFFFF',
  backgroundPressed: '#F9FAFB',
  border: '#E5E7EB',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textTime: '#9CA3AF',
  primaryButton: '#6366F1',
  primaryButtonText: '#FFFFFF',
  secondaryButton: '#F3F4F6',
  secondaryButtonText: '#6B7280',
};

// ============================================
// Utils
// ============================================

const formatTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;

  const date = new Date(timestamp);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// ============================================
// Component
// ============================================

const FollowerItem: React.FC<FollowerItemProps> = ({
  id,
  avatar,
  nickname,
  content,
  timestamp,
  isRead,
  isFollowing = false,
  isMutualFollow = false,
  onPress,
  onFollowPress,
}) => {
  const [loading, setLoading] = useState(false);
  const [followed, setFollowed] = useState(isFollowing);
  const [mutual, setMutual] = useState(isMutualFollow);

  const handleFollowPress = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
      await onFollowPress(id);
      setFollowed(true);
      setMutual(true); // 回关后变成互相关注
    } catch (error) {
      console.error('[FollowerItem] handleFollowPress error:', error);
    } finally {
      setLoading(false);
    }
  }, [id, loading, onFollowPress]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* 左侧头像 */}
      <Image
        source={{ uri: avatar }}
        style={styles.avatar}
        defaultSource={require('@/assets/images/react-logo.png')}
      />

      {/* 中央内容区域 */}
      <View style={styles.contentArea}>
        <View style={styles.topRow}>
          <Text
            style={[styles.nickname, !isRead && styles.unreadNickname]}
            numberOfLines={1}
          >
            {nickname}
          </Text>
          <Text style={styles.time}>{formatTime(timestamp)}</Text>
        </View>
        <Text style={styles.content} numberOfLines={1}>
          {content}
        </Text>
      </View>

      {/* 右侧回关按钮 */}
      <TouchableOpacity
        style={[
          styles.followButton,
          followed && styles.followedButton,
          mutual && styles.mutualFollowButton,
        ]}
        onPress={handleFollowPress}
        disabled={loading || followed}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.primaryButton} />
        ) : (
          <Text
            style={[
              styles.followButtonText,
              followed && styles.followedButtonText,
              mutual && styles.mutualFollowButtonText,
            ]}
          >
            {mutual ? '互相关注' : followed ? '已关注' : '回关'}
          </Text>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// ============================================
// Styles
// ============================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: COLORS.border,
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nickname: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  unreadNickname: {
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: COLORS.textTime,
  },
  content: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.primaryButton,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followedButton: {
    backgroundColor: COLORS.secondaryButton,
  },
  mutualFollowButton: {
    backgroundColor: '#10B981', // 绿色表示互相关注
  },
  followButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primaryButtonText,
  },
  followedButtonText: {
    color: COLORS.secondaryButtonText,
  },
  mutualFollowButtonText: {
    color: COLORS.primaryButtonText, // 白色文字
  },
});

// ============================================
// Exports
// ============================================

export default React.memo(FollowerItem);
export { FollowerItem };
export type { FollowerItemProps };

