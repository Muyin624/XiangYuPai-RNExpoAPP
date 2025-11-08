/**
 * MyPosts Mock Data - 我的发布虚拟数据
 * 
 * 用于开发和测试的虚拟数据
 */

import type { ContentListVO } from '@/services/api/types/content';

/**
 * 虚拟的我的发布数据
 */
export const MOCK_MY_POSTS: ContentListVO[] = [
  {
    id: '2001',
    userId: '1',
    type: 2, // 服务
    typeDesc: '陪玩',
    title: '昵称123',
    summary: '关于我想看电影都没有朋友陪 能不能有转转的朋友一起看电影呢',
    coverImage: 'https://picsum.photos/400/600?random=21',
    author: {
      userId: '1',
      nickname: '昵称123',
      avatar: 'https://i.pravatar.cc/150?img=21',
      username: 'female',
    },
    locationName: '福田区下沙XXK ONE酒吧商场',
    locationAddress: '深圳市福田区下沙XXK ONE酒吧商场',
    longitude: 114.0579,
    latitude: 22.5431,
    distance: 2.3,
    viewCount: 10,
    likeCount: 25,
    collectCount: 8,
    commentCount: 12,
    shareCount: 3,
    liked: false,
    collected: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    tags: ['看电影', '交友', '福田区'],
  },
  {
    id: '2002',
    userId: '1',
    type: 2, // 服务
    typeDesc: '陪玩',
    title: '昵称123',
    summary: '周末想去爬山，有没有小伙伴一起？可以互相拍照',
    coverImage: 'https://picsum.photos/400/600?random=22',
    author: {
      userId: '1',
      nickname: '昵称123',
      avatar: 'https://i.pravatar.cc/150?img=21',
      username: 'female',
    },
    locationName: '南山',
    locationAddress: '深圳市南山区',
    longitude: 113.9297,
    latitude: 22.5329,
    distance: 3.2,
    viewCount: 200,
    likeCount: 45,
    collectCount: 15,
    commentCount: 23,
    shareCount: 8,
    liked: true,
    collected: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    tags: ['爬山', '运动', '周末'],
  },
  {
    id: '2003',
    userId: '1',
    type: 3, // 活动
    typeDesc: 'K歌两小时',
    title: 'K歌两小时',
    summary: '6月6日18:00 创业时期见面会',
    coverImage: 'https://picsum.photos/400/600?random=23',
    author: {
      userId: '1',
      nickname: '昵称123',
      avatar: 'https://i.pravatar.cc/150?img=21',
      username: 'female',
    },
    locationName: '福田区下沙XXK ONE酒吧商场',
    locationAddress: '深圳市福田区下沙XXK ONE酒吧商场',
    longitude: 114.0579,
    latitude: 22.5431,
    distance: 2.3,
    viewCount: 300,
    likeCount: 78,
    collectCount: 32,
    commentCount: 45,
    shareCount: 15,
    liked: false,
    collected: true,
    createdAt: new Date('2024-06-06T18:00:00').toISOString(),
    tags: ['K歌', '聚会', '福田'],
  },
  {
    id: '2004',
    userId: '1',
    type: 1, // 动态
    typeDesc: '动态',
    title: '今天的下午茶',
    summary: '发现了一家超棒的咖啡店，环境很好，适合拍照📷',
    coverImage: 'https://picsum.photos/400/500?random=24',
    author: {
      userId: '1',
      nickname: '昵称123',
      avatar: 'https://i.pravatar.cc/150?img=21',
      username: 'female',
    },
    locationName: '海岸城',
    locationAddress: '深圳市南山区文心五路海岸城',
    longitude: 113.9297,
    latitude: 22.5329,
    distance: 1.8,
    viewCount: 150,
    likeCount: 56,
    collectCount: 18,
    commentCount: 28,
    shareCount: 6,
    liked: false,
    collected: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['咖啡', '下午茶', '南山'],
  },
  {
    id: '2005',
    userId: '1',
    type: 2, // 服务
    typeDesc: '陪玩',
    title: '昵称123',
    summary: '想找个人一起打羽毛球，我是初学者，希望能互相学习进步',
    coverImage: 'https://picsum.photos/400/600?random=25',
    author: {
      userId: '1',
      nickname: '昵称123',
      avatar: 'https://i.pravatar.cc/150?img=21',
      username: 'female',
    },
    locationName: '体育中心',
    locationAddress: '深圳市福田区笋岗西路体育中心',
    longitude: 114.1095,
    latitude: 22.5455,
    distance: 4.5,
    viewCount: 80,
    likeCount: 32,
    collectCount: 12,
    commentCount: 15,
    shareCount: 4,
    liked: true,
    collected: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['羽毛球', '运动', '福田'],
  },
  {
    id: '2006',
    userId: '1',
    type: 1, // 动态
    typeDesc: '动态',
    title: '周末市集',
    summary: '今天去逛了文创市集，买了好多有趣的小东西🎨',
    coverImage: 'https://picsum.photos/400/500?random=26',
    author: {
      userId: '1',
      nickname: '昵称123',
      avatar: 'https://i.pravatar.cc/150?img=21',
      username: 'female',
    },
    locationName: 'OCT创意园',
    locationAddress: '深圳市南山区华侨城创意文化园',
    longitude: 113.9797,
    latitude: 22.5429,
    distance: 3.8,
    viewCount: 220,
    likeCount: 89,
    collectCount: 35,
    commentCount: 42,
    shareCount: 12,
    liked: false,
    collected: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['市集', '文创', '周末'],
  },
  {
    id: '2007',
    userId: '1',
    type: 3, // 活动
    typeDesc: '桌游聚会',
    title: '桌游聚会',
    summary: '6月10日19:00 桌游之夜，欢迎新手',
    coverImage: 'https://picsum.photos/400/600?random=27',
    author: {
      userId: '1',
      nickname: '昵称123',
      avatar: 'https://i.pravatar.cc/150?img=21',
      username: 'female',
    },
    locationName: '桌游吧',
    locationAddress: '深圳市南山区科技园桌游吧',
    longitude: 113.9497,
    latitude: 22.5329,
    distance: 2.8,
    viewCount: 180,
    likeCount: 65,
    collectCount: 28,
    commentCount: 35,
    shareCount: 10,
    liked: false,
    collected: false,
    createdAt: new Date('2024-06-10T19:00:00').toISOString(),
    tags: ['桌游', '聚会', '南山'],
  },
  {
    id: '2008',
    userId: '1',
    type: 2, // 服务
    typeDesc: '陪玩',
    title: '昵称123',
    summary: '找人一起去看画展，对艺术感兴趣的朋友来',
    coverImage: 'https://picsum.photos/400/600?random=28',
    author: {
      userId: '1',
      nickname: '昵称123',
      avatar: 'https://i.pravatar.cc/150?img=21',
      username: 'female',
    },
    locationName: '关山月美术馆',
    locationAddress: '深圳市福田区红荔路6026号',
    longitude: 114.0697,
    latitude: 22.5529,
    distance: 5.2,
    viewCount: 120,
    likeCount: 48,
    collectCount: 20,
    commentCount: 18,
    shareCount: 7,
    liked: false,
    collected: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['画展', '艺术', '福田'],
  },
];

/**
 * 模拟API延迟
 */
export const simulateDelay = (ms: number = 800): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 获取我的发布列表（分页）
 */
export const getMockMyPosts = async (
  pageNum: number = 1,
  pageSize: number = 20
): Promise<ContentListVO[]> => {
  await simulateDelay();
  
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return MOCK_MY_POSTS.slice(startIndex, endIndex);
};

/**
 * 获取我的发布总数
 */
export const getMockMyPostsCount = (): number => {
  return MOCK_MY_POSTS.length;
};

