/**
 * Discovery Mock Data - 发现页虚拟数据
 * 
 * 用于开发和测试的虚拟数据
 */

import type { CommentItem, ContentDetailVO, ContentListVO } from './types/content';

// ============================================
// 虚拟用户数据
// ============================================

const MOCK_USERS = [
  {
    id: '1',
    nickname: '旅行达人小王',
    avatar: 'https://i.pravatar.cc/150?img=11',
    gender: 'male' as const,
    age: 28,
    isFollowed: false,
    isRealVerified: true,
    isGodVerified: false,
    isVip: true,
  },
  {
    id: '2',
    nickname: '美食探店小李',
    avatar: 'https://i.pravatar.cc/150?img=12',
    gender: 'female' as const,
    age: 25,
    isFollowed: true,
    isRealVerified: true,
    isGodVerified: true,
    isVip: true,
  },
  {
    id: '3',
    nickname: '摄影师老张',
    avatar: 'https://i.pravatar.cc/150?img=13',
    gender: 'male' as const,
    age: 32,
    isFollowed: false,
    isRealVerified: true,
    isGodVerified: true,
    isVip: false,
  },
  {
    id: '4',
    nickname: '健身教练小陈',
    avatar: 'https://i.pravatar.cc/150?img=14',
    gender: 'male' as const,
    age: 27,
    isFollowed: true,
    isRealVerified: false,
    isGodVerified: false,
    isVip: false,
  },
  {
    id: '5',
    nickname: '时尚博主Amy',
    avatar: 'https://i.pravatar.cc/150?img=15',
    gender: 'female' as const,
    age: 24,
    isFollowed: false,
    isRealVerified: true,
    isGodVerified: false,
    isVip: true,
  },
];

// ============================================
// 虚拟动态数据
// ============================================

export const MOCK_FEEDS: ContentListVO[] = [
  {
    contentId: 1001,
    userId: 1,
    userNickname: '旅行达人小王',
    userAvatar: 'https://i.pravatar.cc/150?img=11',
    type: 1,
    typeDesc: '动态',
    summary: '周末去了趟西湖，风景真的太美了！推荐大家一定要去看看',
    coverImage: 'https://picsum.photos/400/500?random=1',
    mediaList: [
      {
        id: '1',
        type: 'image' as const,
        url: 'https://picsum.photos/400/500?random=1',
        width: 400,
        height: 500,
      },
      {
        id: '2',
        type: 'image' as const,
        url: 'https://picsum.photos/400/600?random=2',
        width: 400,
        height: 600,
      },
      {
        id: '3',
        type: 'image' as const,
        url: 'https://picsum.photos/400/400?random=3',
        width: 400,
        height: 400,
      },
    ],
    topicList: [
      { name: '旅行', hotIndex: 9500 },
      { name: '西湖', hotIndex: 8200 },
    ],
    locationName: '西湖风景区',
    locationAddress: '浙江省杭州市西湖区',
    longitude: 120.1536,
    latitude: 30.2591,
    distance: 2.5,
    likeCount: 1234,
    commentCount: 89,
    shareCount: 45,
    collectCount: 567,
    viewCount: 8900,
    liked: false,
    collected: false,
    createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2小时前
  },
  {
    contentId: 1002,
    userId: 2,
    userNickname: '美食探店小李',
    userAvatar: 'https://i.pravatar.cc/150?img=12',
    type: 1,
    typeDesc: '动态',
    summary: '今天发现了一家超好吃的川菜馆！麻辣鲜香，太过瘾了🌶️',
    coverImage: 'https://picsum.photos/400/300?random=4',
    mediaList: [
      {
        id: '4',
        type: 'image' as const,
        url: 'https://picsum.photos/400/300?random=4',
        width: 400,
        height: 300,
      },
    ],
    topicList: [
      { name: '美食', hotIndex: 12000 },
      { name: '川菜', hotIndex: 6500 },
    ],
    locationName: '老成都川菜馆',
    locationAddress: '上海市徐汇区淮海中路123号',
    longitude: 121.4737,
    latitude: 31.2304,
    distance: 1.2,
    likeCount: 2345,
    commentCount: 156,
    shareCount: 78,
    collectCount: 890,
    viewCount: 15600,
    liked: true,
    collected: false,
    createdAt: Date.now() - 5 * 60 * 60 * 1000, // 5小时前
  },
  {
    contentId: 1003,
    userId: 3,
    userNickname: '摄影师老张',
    userAvatar: 'https://i.pravatar.cc/150?img=13',
    type: 1,
    typeDesc: '动态',
    summary: '今天的日落太美了，用相机记录下这一刻',
    coverImage: 'https://picsum.photos/400/600?random=5',
    mediaList: [
      {
        id: '5',
        type: 'image' as const,
        url: 'https://picsum.photos/400/600?random=5',
        width: 400,
        height: 600,
      },
      {
        id: '6',
        type: 'image' as const,
        url: 'https://picsum.photos/400/600?random=6',
        width: 400,
        height: 600,
      },
    ],
    topicList: [
      { name: '摄影', hotIndex: 8900 },
      { name: '日落', hotIndex: 7200 },
    ],
    locationName: '外滩',
    locationAddress: '上海市黄浦区中山东一路',
    longitude: 121.4916,
    latitude: 31.2397,
    distance: 3.8,
    likeCount: 3456,
    commentCount: 234,
    shareCount: 123,
    collectCount: 1234,
    viewCount: 23400,
    liked: false,
    collected: true,
    createdAt: Date.now() - 8 * 60 * 60 * 1000, // 8小时前
  },
  {
    contentId: 1004,
    userId: 4,
    userNickname: '健身教练小陈',
    userAvatar: 'https://i.pravatar.cc/150?img=14',
    type: 1,
    typeDesc: '动态',
    summary: '坚持健身第100天！分享一些健身心得💪',
    coverImage: 'https://picsum.photos/400/500?random=7',
    mediaList: [
      {
        id: '7',
        type: 'image' as const,
        url: 'https://picsum.photos/400/500?random=7',
        width: 400,
        height: 500,
      },
    ],
    topicList: [
      { name: '健身', hotIndex: 10500 },
      { name: '运动', hotIndex: 9200 },
    ],
    locationName: '威尔仕健身房',
    locationAddress: '北京市朝阳区建国路88号',
    longitude: 116.4074,
    latitude: 39.9042,
    distance: 0.8,
    likeCount: 1567,
    commentCount: 98,
    shareCount: 56,
    collectCount: 678,
    viewCount: 12300,
    liked: true,
    collected: true,
    createdAt: Date.now() - 12 * 60 * 60 * 1000, // 12小时前
  },
  {
    contentId: 1005,
    userId: 5,
    userNickname: '时尚博主Amy',
    userAvatar: 'https://i.pravatar.cc/150?img=15',
    type: 1,
    typeDesc: '动态',
    summary: '今天的穿搭分享✨ 简约风格也可以很时尚',
    coverImage: 'https://picsum.photos/400/600?random=8',
    mediaList: [
      {
        id: '8',
        type: 'image' as const,
        url: 'https://picsum.photos/400/600?random=8',
        width: 400,
        height: 600,
      },
      {
        id: '9',
        type: 'image' as const,
        url: 'https://picsum.photos/400/600?random=9',
        width: 400,
        height: 600,
      },
      {
        id: '10',
        type: 'image' as const,
        url: 'https://picsum.photos/400/600?random=10',
        width: 400,
        height: 600,
      },
    ],
    topicList: [
      { name: '时尚', hotIndex: 11200 },
      { name: '穿搭', hotIndex: 9800 },
    ],
    locationName: '三里屯太古里',
    locationAddress: '北京市朝阳区三里屯路19号',
    longitude: 116.4551,
    latitude: 39.9375,
    distance: 5.2,
    likeCount: 4567,
    commentCount: 345,
    shareCount: 234,
    collectCount: 2345,
    viewCount: 34500,
    liked: false,
    collected: false,
    createdAt: Date.now() - 24 * 60 * 60 * 1000, // 1天前
  },
];

// ============================================
// 虚拟评论数据
// ============================================

export const MOCK_COMMENTS: Record<number, CommentItem[]> = {
  1001: [
    {
      id: '10001',
      contentId: '1001',
      userId: '2',
      userNickname: '美食探店小李',
      userAvatar: 'https://i.pravatar.cc/150?img=12',
      commentText: '西湖真的超美！我上次去也拍了好多照片',
      likeCount: 23,
      replyCount: 2,
      isTop: false,
      liked: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      replies: [
        {
          id: '10002',
          contentId: '1001',
          userId: '1',
          userNickname: '旅行达人小王',
          userAvatar: 'https://i.pravatar.cc/150?img=11',
          commentText: '是的！特别是日落的时候最美',
          parentId: '10001',
          replyToId: '10001',
          replyToUserId: '2',
          replyToUserNickname: '美食探店小李',
          likeCount: 5,
          replyCount: 0,
          isTop: false,
          liked: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
      ],
      totalReplies: 2,
      hasMoreReplies: false,
    },
    {
      id: '10003',
      contentId: '1001',
      userId: '3',
      userNickname: '摄影师老张',
      userAvatar: 'https://i.pravatar.cc/150?img=13',
      commentText: '照片拍得不错👍 用的什么相机？',
      likeCount: 12,
      replyCount: 0,
      isTop: false,
      liked: true,
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
  ],
  1002: [
    {
      id: '10004',
      contentId: '1002',
      userId: '1',
      userNickname: '旅行达人小王',
      userAvatar: 'https://i.pravatar.cc/150?img=11',
      commentText: '看起来好好吃！地址在哪里？',
      likeCount: 34,
      replyCount: 1,
      isTop: true,
      liked: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      replies: [
        {
          id: '10005',
          contentId: '1002',
          userId: '2',
          userNickname: '美食探店小李',
          userAvatar: 'https://i.pravatar.cc/150?img=12',
          commentText: '在徐汇区淮海中路123号，推荐他家的水煮鱼！',
          parentId: '10004',
          replyToId: '10004',
          replyToUserId: '1',
          replyToUserNickname: '旅行达人小王',
          likeCount: 8,
          replyCount: 0,
          isTop: false,
          liked: false,
          createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
        },
      ],
      totalReplies: 1,
      hasMoreReplies: false,
    },
  ],
};

// ============================================
// API响应数据生成器
// ============================================

/**
 * 获取热门内容列表
 */
export const getMockHotContents = (limit: number = 20): ContentListVO[] => {
  return MOCK_FEEDS.slice(0, Math.min(limit, MOCK_FEEDS.length));
};

/**
 * 获取推荐内容列表
 */
export const getMockRecommendedContents = (limit: number = 20): ContentListVO[] => {
  // 推荐内容可以是打乱顺序的
  const shuffled = [...MOCK_FEEDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(limit, shuffled.length));
};

/**
 * 获取同城内容列表
 */
export const getMockLocalContents = (limit: number = 20): ContentListVO[] => {
  // 同城内容按距离排序
  const sorted = [...MOCK_FEEDS].sort((a, b) => (a.distance || 0) - (b.distance || 0));
  return sorted.slice(0, Math.min(limit, sorted.length));
};

/**
 * 获取内容详情
 */
export const getMockContentDetail = (contentId: number): ContentDetailVO | null => {
  const feed = MOCK_FEEDS.find(f => f.contentId === contentId);
  if (!feed) return null;
  
  return {
    ...feed,
    content: feed.summary || '',
  } as ContentDetailVO;
};

/**
 * 获取评论列表
 */
export const getMockComments = (contentId: number): CommentItem[] => {
  return MOCK_COMMENTS[contentId] || [];
};

/**
 * 模拟API延迟
 */
export const simulateDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

