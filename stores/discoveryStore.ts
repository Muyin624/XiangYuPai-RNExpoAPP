/**
 * Discovery Store - 发现页面状态管理
 * 
 * 基于Zustand实现，管理：
 * - 动态流数据（关注/热门/同城）
 * - 用户互动状态
 * - 评论数据
 * - 缓存策略
 */

import { create } from 'zustand';
import type { CommentItem } from '../services/api/discoveryApi';
import { discoveryApi } from '../services/api/discoveryApi';
import type { Feed } from '../src/features/Discovery/types';
import { transformFeedList } from '../src/features/Discovery/utils/dataTransform';

// ==================== 类型定义 ====================

/**
 * Tab类型
 */
export type TabType = 'follow' | 'hot' | 'local';

/**
 * 动态流数据状态
 */
export interface FeedDataState {
  followFeeds: Feed[];
  hotFeeds: Feed[];
  localFeeds: Feed[];
  
  // 分页状态
  page: {
    follow: number;
    hot: number;
    local: number;
  };
  
  // 是否还有更多
  hasMore: {
    follow: boolean;
    hot: boolean;
    local: boolean;
  };
}

/**
 * UI状态
 */
export interface UIState {
  activeTab: TabType;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastRefreshTime: number;
}

/**
 * 评论缓存
 */
export interface CommentCache {
  [contentId: string]: CommentItem[];
}

/**
 * 发现页面Store状态
 */
export interface DiscoveryStore {
  // === 状态 ===
  feedData: FeedDataState;
  ui: UIState;
  commentCache: CommentCache;
  
  // === 动态流操作 ===
  setActiveTab: (tab: TabType) => void;
  loadFeedList: (tab: TabType, refresh?: boolean) => Promise<void>;
  loadMoreFeeds: (tab: TabType) => Promise<void>;
  
  // === 互动操作 ===
  toggleLike: (feedId: string, tab: TabType) => Promise<void>;
  toggleCollect: (feedId: string, tab: TabType) => Promise<void>;
  shareFeed: (feedId: string) => Promise<void>;
  
  // === 评论操作 ===
  loadComments: (contentId: string) => Promise<void>;
  addComment: (contentId: string, text: string, replyToId?: string) => Promise<void>;
  toggleCommentLike: (commentId: string) => Promise<void>;
  
  // === 状态管理 ===
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

// ==================== 初始状态 ====================

const initialFeedData: FeedDataState = {
  followFeeds: [],
  hotFeeds: [],
  localFeeds: [],
  page: {
    follow: 1,
    hot: 1,
    local: 1,
  },
  hasMore: {
    follow: true,
    hot: true,
    local: true,
  },
};

const initialUIState: UIState = {
  activeTab: 'hot',
  loading: false,
  refreshing: false,
  error: null,
  lastRefreshTime: 0,
};

// ==================== Store创建 ====================

export const useDiscoveryStore = create<DiscoveryStore>((set, get) => ({
  // 初始状态
  feedData: initialFeedData,
  ui: initialUIState,
  commentCache: {},
  
  // === Tab切换 ===
  setActiveTab: (tab: TabType) => {
    console.log('[DiscoveryStore] setActiveTab 被调用:', tab);
    set((state) => {
      console.log('[DiscoveryStore] 当前activeTab:', state.ui.activeTab, '-> 新activeTab:', tab);
      return {
        ui: { ...state.ui, activeTab: tab },
      };
    });
  },
  
  // === 加载动态流 ===
  loadFeedList: async (tab: TabType, refresh = false) => {
    const state = get();
    
    // 防止重复加载
    if (state.ui.loading || state.ui.refreshing) {
      return;
    }
    
    // 防止频繁刷新（5秒冷却）
    if (refresh) {
      const now = Date.now();
      if (now - state.ui.lastRefreshTime < 5000) {
        return;
      }
      set((state) => ({
        ui: { ...state.ui, refreshing: true },
      }));
    } else {
      set((state) => ({
        ui: { ...state.ui, loading: true },
      }));
    }
    
    try {
      const limit = 20;
      let response;
      
      // 根据tab调用不同的API
      switch (tab) {
        case 'hot':
          response = await discoveryApi.getHotContents({ limit });
          break;
        case 'follow':
          // 关注Tab使用推荐内容（TODO: 后续接入真实关注流）
          response = await discoveryApi.getRecommendedContents({ limit });
          break;
        case 'local':
          // 同城Tab使用本地内容
          response = await discoveryApi.getLocalContents({ limit });
          break;
        default:
          response = await discoveryApi.getHotContents({ limit });
      }
      
      // discoveryApi 直接返回数组，不是 { success, data } 格式
      const list = response || [];
      
      // 转换后端数据为前端格式
      const transformedFeeds = list.length > 0 ? transformFeedList(list) : [];
      
      // 判断是否还有更多（简单判断：返回数量=limit说明可能还有更多）
      const hasMore = list.length >= limit;
      
      set((state) => ({
        feedData: {
          ...state.feedData,
          [`${tab}Feeds`]: refresh ? transformedFeeds : [...state.feedData[`${tab}Feeds`], ...transformedFeeds],
          page: {
            ...state.feedData.page,
            [tab]: refresh ? 1 : state.feedData.page[tab],
          },
          hasMore: {
            ...state.feedData.hasMore,
            [tab]: hasMore,
          },
        },
        ui: {
          ...state.ui,
          loading: false,
          refreshing: false,
          error: null,
          lastRefreshTime: refresh ? Date.now() : state.ui.lastRefreshTime,
        },
      }));
    } catch (error) {
      console.error('加载动态流失败:', error);
      set((state) => ({
        ui: {
          ...state.ui,
          loading: false,
          refreshing: false,
          error: error instanceof Error ? error.message : '加载失败',
        },
      }));
    }
  },
  
  // === 加载更多 ===
  loadMoreFeeds: async (tab: TabType) => {
    const state = get();
    
    // 检查是否还有更多
    if (!state.feedData.hasMore[tab] || state.ui.loading || state.ui.refreshing) {
      return;
    }
    
    set((state) => ({
      ui: { ...state.ui, loading: true },
    }));
    
    try {
      const limit = 20;
      let response;
      
      // 根据tab调用不同的API
      // 注意：目前公开API不支持分页，这里暂时返回空（后续可扩展）
      switch (tab) {
        case 'hot':
          response = await discoveryApi.getHotContents({ limit });
          break;
        case 'follow':
          response = await discoveryApi.getRecommendedContents({ limit });
          break;
        case 'local':
          response = await discoveryApi.getLocalContents({ limit });
          break;
        default:
          response = await discoveryApi.getHotContents({ limit });
      }
      
      if (response.success && response.data) {
        const list = response.data;
        
        // TODO: 目前公开API不支持分页，这里暂时不追加数据
        // 等后端支持分页参数后再启用
        console.warn('[Discovery Store] 当前API不支持分页，暂不加载更多');
        
        set((state) => ({
          feedData: {
            ...state.feedData,
            hasMore: {
              ...state.feedData.hasMore,
              [tab]: false, // 暂时禁用加载更多
            },
          },
          ui: {
            ...state.ui,
            loading: false,
            error: null,
          },
        }));
      }
    } catch (error) {
      console.error('加载更多失败:', error);
      set((state) => ({
        ui: {
          ...state.ui,
          loading: false,
          error: error instanceof Error ? error.message : '加载失败',
        },
      }));
    }
  },
  
  // === 点赞操作（乐观更新） ===
  toggleLike: async (feedId: string, tab: TabType) => {
    const state = get();
    const feedKey = `${tab}Feeds` as keyof FeedDataState;
    const feeds = state.feedData[feedKey] as Feed[];
    const feed = feeds.find((f) => f.id === feedId);
    
    if (!feed) return;
    
    // 乐观更新UI
    const isCurrentlyLiked = feed.isLiked;
    set((state) => ({
      feedData: {
        ...state.feedData,
        [feedKey]: feeds.map((f) =>
          f.id === feedId
            ? {
                ...f,
                isLiked: !isCurrentlyLiked,
                likeCount: isCurrentlyLiked ? f.likeCount - 1 : f.likeCount + 1,
              }
            : f
        ),
      },
    }));
    
    try {
      // 调用API
      if (isCurrentlyLiked) {
        await discoveryApi.unlikeFeed(Number(feedId));
      } else {
        await discoveryApi.likeFeed(Number(feedId));
      }
    } catch (error) {
      console.error('点赞操作失败:', error);
      
      // 失败时回滚
      set((state) => ({
        feedData: {
          ...state.feedData,
          [feedKey]: feeds.map((f) =>
            f.id === feedId
              ? {
                  ...f,
                  isLiked: isCurrentlyLiked,
                  likeCount: feed.likeCount,
                }
              : f
          ),
        },
      }));
    }
  },
  
  // === 收藏操作（乐观更新） ===
  toggleCollect: async (feedId: string, tab: TabType) => {
    const state = get();
    const feedKey = `${tab}Feeds` as keyof FeedDataState;
    const feeds = state.feedData[feedKey] as Feed[];
    const feed = feeds.find((f) => f.id === feedId);
    
    if (!feed) return;
    
    // 乐观更新UI
    const isCurrentlyCollected = feed.isCollected;
    set((state) => ({
      feedData: {
        ...state.feedData,
        [feedKey]: feeds.map((f) =>
          f.id === feedId
            ? {
                ...f,
                isCollected: !isCurrentlyCollected,
                collectCount: isCurrentlyCollected ? f.collectCount - 1 : f.collectCount + 1,
              }
            : f
        ),
      },
    }));
    
    try {
      // 调用API
      if (isCurrentlyCollected) {
        await discoveryApi.uncollectFeed(Number(feedId));
      } else {
        await discoveryApi.collectFeed(Number(feedId));
      }
    } catch (error) {
      console.error('收藏操作失败:', error);
      
      // 失败时回滚
      set((state) => ({
        feedData: {
          ...state.feedData,
          [feedKey]: feeds.map((f) =>
            f.id === feedId
              ? {
                  ...f,
                  isCollected: isCurrentlyCollected,
                  collectCount: feed.collectCount,
                }
              : f
          ),
        },
      }));
    }
  },
  
  // === 分享操作 ===
  shareFeed: async (feedId: string) => {
    try {
      await discoveryApi.shareFeed(Number(feedId));
      console.log('分享成功:', feedId);
    } catch (error) {
      console.error('分享失败:', error);
    }
  },
  
  // === 加载评论 ===
  loadComments: async (contentId: string) => {
    try {
      const response = await discoveryApi.getCommentList({
        contentId: Number(contentId),
        pageNum: 1,
        pageSize: 20,
      });
      
      if (response.success && response.data) {
        set((state) => ({
          commentCache: {
            ...state.commentCache,
            [contentId]: response.data as CommentItem[],
          },
        }));
      }
    } catch (error) {
      console.error('加载评论失败:', error);
    }
  },
  
  // === 添加评论 ===
  addComment: async (contentId: string, text: string, replyToId?: string) => {
    try {
      const response = await discoveryApi.addComment({
        contentId: Number(contentId),
        commentText: text,
        replyToId: replyToId ? Number(replyToId) : undefined,
      });
      
      if (response.success) {
        // 重新加载评论列表
        await get().loadComments(contentId);
      }
    } catch (error) {
      console.error('添加评论失败:', error);
      throw error;
    }
  },
  
  // === 评论点赞 ===
  toggleCommentLike: async (commentId: string) => {
    try {
      await discoveryApi.likeComment(Number(commentId));
      console.log('评论点赞成功:', commentId);
    } catch (error) {
      console.error('评论点赞失败:', error);
    }
  },
  
  // === 状态设置 ===
  setLoading: (loading: boolean) => {
    set((state) => ({
      ui: { ...state.ui, loading },
    }));
  },
  
  setRefreshing: (refreshing: boolean) => {
    set((state) => ({
      ui: { ...state.ui, refreshing },
    }));
  },
  
  setError: (error: string | null) => {
    set((state) => ({
      ui: { ...state.ui, error },
    }));
  },
  
  // === 重置状态 ===
  resetState: () => {
    set({
      feedData: initialFeedData,
      ui: initialUIState,
      commentCache: {},
    });
  },
}));

// ==================== 选择器函数 ====================

/**
 * 获取当前Tab的动态列表
 */
export const useCurrentFeeds = () => {
  return useDiscoveryStore((state) => {
    const tab = state.ui.activeTab;
    switch (tab) {
      case 'follow':
        return state.feedData.followFeeds;
      case 'hot':
        return state.feedData.hotFeeds;
      case 'local':
        return state.feedData.localFeeds;
      default:
        return [];
    }
  });
};

/**
 * 获取当前Tab的hasMore状态
 */
export const useCurrentHasMore = () => {
  return useDiscoveryStore((state) => state.feedData.hasMore[state.ui.activeTab]);
};

/**
 * 获取UI状态
 */
export const useDiscoveryUI = () => {
  return useDiscoveryStore((state) => state.ui);
};

/**
 * 获取评论数据
 */
export const useComments = (contentId: string) => {
  return useDiscoveryStore((state) => state.commentCache[contentId] || []);
};

/**
 * 获取当前激活的Tab
 */
export const useActiveTab = () => {
  return useDiscoveryStore((state) => state.ui.activeTab);
};

/**
 * 获取加载状态
 */
export const useDiscoveryLoading = () => {
  return useDiscoveryStore((state) => ({
    loading: state.ui.loading,
    refreshing: state.ui.refreshing,
  }));
};

/**
 * 获取错误状态
 */
export const useDiscoveryError = () => {
  return useDiscoveryStore((state) => state.ui.error);
};

// ==================== Actions导出 ====================

/**
 * 导出所有Actions（用于在组件外调用）
 */
export const discoveryActions = {
  setActiveTab: () => useDiscoveryStore.getState().setActiveTab,
  loadFeedList: () => useDiscoveryStore.getState().loadFeedList,
  loadMoreFeeds: () => useDiscoveryStore.getState().loadMoreFeeds,
  toggleLike: () => useDiscoveryStore.getState().toggleLike,
  toggleCollect: () => useDiscoveryStore.getState().toggleCollect,
  shareFeed: () => useDiscoveryStore.getState().shareFeed,
  loadComments: () => useDiscoveryStore.getState().loadComments,
  addComment: () => useDiscoveryStore.getState().addComment,
  toggleCommentLike: () => useDiscoveryStore.getState().toggleCommentLike,
  resetState: () => useDiscoveryStore.getState().resetState,
};

// ==================== 导出类型 ====================

export type {
    CommentCache, FeedDataState,
    UIState
};

