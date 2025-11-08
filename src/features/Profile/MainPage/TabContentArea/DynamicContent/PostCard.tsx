/**
 * PostCard - 动态卡片组件
 * 
 * 显示内容：
 * - 封面图（圆角12px）
 * - 用户信息（头像24x24 + 昵称 + 时间）
 * - 统计信息（点赞数 + 评论数）
 * 
 * UI规范：
 * - 卡片圆角：12px
 * - 卡片阴影：轻微阴影
 * - 间距：内边距12px
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

import type { Post } from '../../types';

// #region Types
interface PostCardProps {
  post: Post;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}
// #endregion

// #region Constants
const AVATAR_SIZE = 24;
const CARD_RADIUS = 12;
const CARD_PADDING = 12;
// #endregion

// #region Utils
// 格式化时间显示
const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}天前`;
  if (hours > 0) return `${hours}小时前`;
  if (minutes > 0) return `${minutes}分钟前`;
  return '刚刚';
};

// 格式化数字显示
const formatCount = (count: number): string => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`;
  }
  return count.toString();
};
// #endregion

const PostCard: React.FC<PostCardProps> = ({ post, onPress, style }) => {
  // 计算图片宽高比 - 使用动态比例
  const imageAspectRatio = post.coverImage ? 0.75 : undefined; // 3:4 比例

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* 封面图 */}
      {post.coverImage && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: post.coverImage }}
            style={[
              styles.coverImage,
              imageAspectRatio && { aspectRatio: imageAspectRatio },
            ]}
            resizeMode="cover"
          />
          {/* 视频标识 */}
          {post.mediaList?.[0]?.type === 'video' && (
            <View style={styles.videoIndicator}>
              <Ionicons name="play-circle" size={32} color="#FFFFFF" />
            </View>
          )}
        </View>
      )}

      {/* 内容区域 */}
      <View style={styles.content}>
        {/* 标题 */}
        {post.title && (
          <Text style={styles.title} numberOfLines={2}>
            {post.title}
          </Text>
        )}
        
        {/* 文字内容（如果没有封面图） */}
        {!post.coverImage && post.content && (
          <Text style={styles.contentText} numberOfLines={4}>
            {post.content}
          </Text>
        )}

        {/* 底部信息栏 */}
        <View style={styles.footer}>
          {/* 用户信息 */}
          <View style={styles.userInfo}>
            <Image
              source={{ uri: post.userInfo.avatar }}
              style={styles.avatar}
            />
            <Text style={styles.nickname} numberOfLines={1}>
              {post.userInfo.nickname}
            </Text>
          </View>

          {/* 点赞数 */}
          <View style={styles.likeInfo}>
            <Ionicons
              name={post.isLiked ? 'heart' : 'heart'}
              size={16}
              color="#FF4458"
            />
            <Text style={styles.likeText}>
              {formatCount(post.likeCount)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  coverImage: {
    width: '100%',
    minHeight: 150,
  },
  videoIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -16 }],
    opacity: 0.9,
  },
  content: {
    padding: CARD_PADDING,
  },
  title: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 8,
  },
  contentText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginRight: 6,
  },
  nickname: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '400',
    flex: 1,
  },
  likeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '400',
  },
});

export default PostCard;

