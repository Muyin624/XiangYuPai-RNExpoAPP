/**
 * MyPostsPage - 我的发布页面
 * 
 * 功能：
 * - 展示当前用户发布的所有内容
 * - 支持下拉刷新和上拉加载更多
 * - 展示内容的统计数据（浏览量、价格、距离等）
 * - 使用技能卡片样式布局
 */

import type { ContentListVO } from '@/services/api/types/content';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getMockMyPosts } from './mockData';

// 获取内容类型文本
const getContentTypeText = (type: number, typeDesc?: string): string => {
  if (typeDesc) return typeDesc;
  switch (type) {
    case 1:
      return '动态';
    case 2:
      return '服务';
    case 3:
      return '活动';
    default:
      return '其他';
  }
};

// 格式化价格显示
const formatPrice = (type: number, viewCount?: number): string => {
  if (type === 2 || type === 3) {
    return `${viewCount || 10}`;
  }
  return `${viewCount || 0}`;
};

// 格式化价格单位
const getPriceUnit = (type: number): string => {
  if (type === 2 || type === 3) {
    return '金币/周';
  }
  return '浏览';
};

// 内容卡片组件 - 完全参考技能卡片布局
const ContentCard = ({ item, onPress }: { item: ContentListVO; onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* 封面图 */}
      <Image
        source={
          item.coverImage
            ? { uri: item.coverImage }
            : require('@/assets/images/images/common/default-avatar.png')
        }
        style={styles.icon}
      />

      {/* 内容信息 */}
      <View style={styles.info}>
        {/* 标题 + 类型标签 */}
        <View style={styles.titleRow}>
          <Text style={styles.skillName} numberOfLines={1}>
            {item.title || item.author?.nickname || '无标题'}
          </Text>
          <View style={styles.typeTag}>
            <Text style={styles.typeText}>{getContentTypeText(item.type, item.typeDesc)}</Text>
          </View>
        </View>

        {/* 摘要 */}
        {item.summary && (
          <Text style={styles.summary} numberOfLines={2}>
            {item.summary}
          </Text>
        )}

        {/* 标签 */}
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 价格 + 距离 */}
        <View style={styles.detailsRow}>
          {/* 价格 */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(item.type, item.viewCount)}</Text>
            <Text style={styles.priceUnit}> {getPriceUnit(item.type)}</Text>
          </View>

          {/* 距离 */}
          {item.distance !== undefined && (
            <View style={styles.distanceContainer}>
              <Ionicons name="location" size={12} color="#757575" />
              <Text style={styles.distanceText}>
                {item.distance < 1
                  ? `${Math.round(item.distance * 1000)}m`
                  : `${item.distance.toFixed(1)}km`}
              </Text>
            </View>
          )}
        </View>

        {/* 位置或活动时间 */}
        {item.type === 3 && item.createdAt ? (
          <View style={styles.locationRow}>
            <Ionicons name="time-outline" size={12} color="#757575" />
            <Text style={styles.locationText}>
              {new Date(item.createdAt).toLocaleDateString('zh-CN', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        ) : null}

        {item.locationName && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color="#757575" />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.locationName}
            </Text>
          </View>
        )}
      </View>

      {/* 箭头图标 */}
      <Ionicons name="chevron-forward" size={20} color="#BDBDBD" style={styles.arrow} />
    </TouchableOpacity>
  );
};

const MyPostsPage = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<ContentListVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNum, setPageNum] = useState(1);

  // 加载我的发布
  const loadMyPosts = async (page: number = 1, isRefresh: boolean = false) => {
    try {
      if (page === 1) {
        isRefresh ? setRefreshing(true) : setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // 🔥 使用虚拟数据
      console.log('[MyPostsPage] 使用虚拟数据加载我的发布', { page });
      const data = await getMockMyPosts(page, 20);

      // 如果需要使用真实API，取消下面的注释
      // const data = await contentApi.getMyContents({
      //   pageNum: page,
      //   pageSize: 20,
      // });

      if (page === 1) {
        setPosts(data);
      } else {
        setPosts((prev) => [...prev, ...data]);
      }

      setHasMore(data.length >= 20);
      setPageNum(page);
      
      console.log('[MyPostsPage] 加载成功', { count: data.length, hasMore: data.length >= 20 });
    } catch (error) {
      console.error('[MyPostsPage] 加载失败', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadMyPosts(1);
  }, []);

  // 下拉刷新
  const handleRefresh = () => {
    loadMyPosts(1, true);
  };

  // 加载更多
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadMyPosts(pageNum + 1);
    }
  };

  // 点击卡片 - 跳转到详情页
  const handleCardPress = (item: ContentListVO) => {
    console.log('🧭 导航: 我的发布 → 详情页（我的产品）', item.id);
    // 跳转到详情页，传递技能ID和用户ID
    // 详情页会识别这是"我的产品"，显示管理按钮而不是下单按钮
    router.push(`/skill/${item.id}?userId=${item.userId}&isMyProduct=true`);
  };

  // 返回
  const handleBack = () => {
    router.back();
  };

  // 渲染空状态
  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📝</Text>
        <Text style={styles.emptyText}>还没有发布内容</Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => router.push('/publish')}
          activeOpacity={0.7}
        >
          <Text style={styles.emptyButtonText}>去发布</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // 渲染底部加载
  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="small" color="#FF2442" />
        <Text style={styles.footerText}>加载中...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的发布</Text>
        <View style={styles.headerRight} />
      </View>

      {/* 内容列表 */}
      {loading && posts.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF2442" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ContentCard item={item} onPress={() => handleCardPress(item)} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#FF2442']}
              tintColor="#FF2442"
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  // 头部
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 32,
    color: '#1F2937',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerRight: {
    width: 40,
  },
  // 加载状态
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9CA3AF',
  },
  // 列表
  listContent: {
    padding: 12,
  },
  // 卡片样式 - 完全使用技能卡片样式
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F5FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8D5FF',
  },
  icon: {
    width: 100,
    height: 140,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skillName: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
    flex: 1,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#8A2BE2',
    borderRadius: 4,
  },
  typeText: {
    fontSize: 11,
    color: '#FFFFFF',
  },
  summary: {
    fontSize: 13,
    color: '#757575',
    lineHeight: 18,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#FEF3F2',
  },
  tagText: {
    fontSize: 11,
    color: '#EF4444',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 18,
    color: '#8A2BE2',
    fontWeight: '700',
  },
  priceUnit: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 2,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    color: '#757575',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#757575',
    flex: 1,
  },
  arrow: {
    marginLeft: 8,
  },
  // 空状态
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#FF2442',
    borderRadius: 24,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  // 底部加载
  footerLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#9CA3AF',
  },
});

export default MyPostsPage;

