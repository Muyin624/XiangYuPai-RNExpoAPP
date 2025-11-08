/**
 * TopicDetailPage - 话题详情页面
 * 
 * 功能：
 * - 话题信息展示
 * - 话题下的动态列表
 * - 下拉刷新
 * - 上拉加载更多
 */

import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import type { Feed } from '../types';

// 颜色常量
const COLORS = {
  PRIMARY: '#8A2BE2',
  BACKGROUND: '#F5F5F5',
  CARD_BACKGROUND: '#FFFFFF',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  TEXT_TERTIARY: '#999999',
  BORDER: '#E5E5E5',
  LIKE_ACTIVE: '#FF4444',
} as const;

interface TopicInfo {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  participantCount: number;
  postCount: number;
  viewCount?: number;
}

interface TopicDetailPageProps {
  topicId: string;
}

export default function TopicDetailPage({ topicId }: TopicDetailPageProps) {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [topicInfo, setTopicInfo] = useState<TopicInfo | null>(null);
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // 加载话题信息和动态列表
  useEffect(() => {
    loadTopicData();
  }, [topicId]);

  const loadTopicData = async () => {
    setLoading(true);
    try {
      // TODO: 调用API获取话题信息和动态列表
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟话题数据
      setTopicInfo({
        id: topicId,
        name: 'S10全球总决赛',
        description: '英雄联盟2021新赛季已开启',
        participantCount: 1250,
        postCount: 3200,
        viewCount: 50000,
      });

      // 模拟动态数据
      const mockFeeds: Feed[] = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        type: 1,
        typeDesc: '动态',
        title: '新赛季，新征程',
        content: '英雄联盟2021新赛季已开启，段位解锁更改让赛季初上分更轻松人人❤️，速速',
        userId: `user${i + 1}`,
        userInfo: {
          id: `user${i + 1}`,
          nickname: `用户名称${123 + i}`,
          avatar: `https://i.pravatar.cc/150?u=user${i + 1}`,
          isFollowed: false,
          tags: ['达人'],
        },
        mediaList: [
          {
            id: `${i + 1}`,
            type: 'image',
            url: 'https://picsum.photos/400/400?random=' + (i + 1),
            thumbnailUrl: 'https://picsum.photos/200/200?random=' + (i + 1),
            width: 400,
            height: 400,
          },
        ],
        topicList: [
          {
            name: 'S10全球总决赛',
            participantCount: 1250,
            postCount: 3200,
            hotIndex: 85,
            trendChange: 12,
            createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
          },
        ],
        locationName: '河北',
        likeCount: 11 + i,
        commentCount: 3 + i,
        collectCount: 5 + i,
        shareCount: 2 + i,
        viewCount: 100 + i * 10,
        isLiked: false,
        isCollected: false,
        createdAt: Date.now() - i * 60 * 60 * 1000,
        updatedAt: Date.now() - i * 60 * 60 * 1000,
      }));

      setFeeds(mockFeeds);
      setPage(1);
      setHasMore(true);
    } catch (error) {
      Alert.alert('错误', '加载失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 下拉刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadTopicData();
    } finally {
      setRefreshing(false);
    }
  };

  // 加载更多
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      // TODO: 调用API加载更多
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟没有更多数据
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  // 点赞
  const handleLike = (feedId: string) => {
    setFeeds(prevFeeds =>
      prevFeeds.map(feed =>
        feed.id === feedId
          ? {
              ...feed,
              isLiked: !feed.isLiked,
              likeCount: feed.isLiked ? feed.likeCount - 1 : feed.likeCount + 1,
            }
          : feed
      )
    );
  };

  // 跳转到动态详情
  const handleFeedPress = (feedId: string) => {
    console.log('[TopicDetailPage] 🧭 导航: 话题页 → 动态详情', { feedId });
    router.push({
      pathname: '/feed/[id]',
      params: { id: feedId },
    });
  };

  // 跳转到用户主页
  const handleUserPress = (userId: string) => {
    console.log('[TopicDetailPage] 🧭 导航: 话题页 → 用户主页', { userId });
    router.push({
      pathname: '/profile/[userId]',
      params: { userId },
    });
  };

  // 格式化数字
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}w`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  // 格式化时间
  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    
    if (diff < minute) {
      return '刚刚';
    } else if (diff < hour) {
      return `${Math.floor(diff / minute)}分钟前`;
    } else if (diff < day) {
      return `${Math.floor(diff / hour)}小时前`;
    } else if (diff < 7 * day) {
      return `${Math.floor(diff / day)}天前`;
    } else {
      const date = new Date(timestamp);
      return `${date.getMonth() + 1}-${date.getDate()}`;
    }
  };

  // 渲染动态卡片
  const renderFeedCard = ({ item }: { item: Feed }) => (
    <View style={styles.feedCard}>
      {/* 用户信息 */}
      <TouchableOpacity 
        style={styles.userInfo}
        onPress={() => handleUserPress(item.userId)}
      >
        <Image source={{ uri: item.userInfo.avatar }} style={styles.avatar} />
        <View style={styles.userTextInfo}>
          <View style={styles.userNameRow}>
            <Text style={styles.nickname}>{item.userInfo.nickname}</Text>
            {item.userInfo.tags && item.userInfo.tags.length > 0 && (
              <View style={styles.userTag}>
                <Text style={styles.userTagText}>{item.userInfo.tags[0]}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* 内容 */}
      <TouchableOpacity 
        style={styles.contentArea}
        onPress={() => handleFeedPress(item.id)}
        activeOpacity={0.9}
      >
        {item.title && (
          <Text style={styles.feedTitle} numberOfLines={2}>
            {item.title}
          </Text>
        )}
        <Text style={styles.feedContent} numberOfLines={3}>
          {item.content}
        </Text>

        {/* 图片 */}
        {item.mediaList && item.mediaList.length > 0 && (
          <Image
            source={{ uri: item.mediaList[0].url }}
            style={styles.feedImage}
            resizeMode="cover"
          />
        )}

        {/* 话题标签 */}
        {item.topicList && item.topicList.length > 0 && (
          <View style={styles.topicRow}>
            <Text style={styles.topicText}>#{item.topicList[0].name}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* 底部互动栏 */}
      <View style={styles.feedFooter}>
        <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
        <Text style={styles.locationText}>{item.locationName}</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLike(item.id)}
          >
            <Text style={styles.actionIcon}>
              {item.isLiked ? '❤️' : '🤍'}
            </Text>
            <Text style={styles.actionText}>{item.likeCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>{item.commentCount}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // 渲染列表头部
  const renderHeader = () => {
    if (!topicInfo) return null;

    return (
      <View style={styles.topicHeader}>
        <Text style={styles.topicName}>#{topicInfo.name}</Text>
      </View>
    );
  };

  // 渲染加载更多
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={COLORS.PRIMARY} />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      </View>
    );
  }

  if (!topicInfo) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>话题不存在</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 动态列表 */}
      <FlatList
        data={feeds}
        renderItem={renderFeedCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.PRIMARY}
            colors={[COLORS.PRIMARY]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  listContent: {
    paddingBottom: 20,
  },
  topicHeader: {
    padding: 16,
    backgroundColor: COLORS.CARD_BACKGROUND,
    marginBottom: 8,
  },
  topicName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  feedCard: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    marginBottom: 8,
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.BORDER,
  },
  userTextInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  userTag: {
    backgroundColor: '#FFF5E6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  userTagText: {
    fontSize: 11,
    color: '#FF8C00',
    fontWeight: '500',
  },
  contentArea: {
    marginBottom: 12,
  },
  feedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
    lineHeight: 22,
  },
  feedContent: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  feedImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: COLORS.BORDER,
    marginBottom: 8,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  feedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 13,
    color: COLORS.TEXT_TERTIARY,
  },
  locationText: {
    fontSize: 13,
    color: COLORS.TEXT_TERTIARY,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionIcon: {
    fontSize: 16,
  },
  actionText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

