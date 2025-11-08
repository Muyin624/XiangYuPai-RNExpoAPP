/**
 * User Store - 用户数据状态管理
 * 使用Zustand实现用户列表、用户详情等状态管理
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createSafeStorage } from './storage-config';

// 用户基础信息类型
export interface User {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height?: number; // 身高（cm）
  location: {
    city: string;
    district: string;
    distance?: number;
  };
  tags: string[];
  price: number;
  rating: number;
  reviewCount: number;
  isOnline: boolean;
  lastActiveTime: string;
  serviceTypes: string[];
  description: string;
  images: string[];
  skills: Array<{
    type: string;
    level: string;
    price: number;
  }>;
  // 社交统计
  followingCount?: number; // 关注数
  followersCount?: number; // 粉丝数
  likesCount?: number; // 获赞数
}

// 用户列表状态类型
export interface UserListState {
  data: User[];
  hasMore: boolean;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  page: number;
  totalCount: number;
}

// 筛选条件类型
export interface FilterConditions {
  location?: string;
  gameType?: string;
  priceRange?: [number, number];
  serviceType?: string;
  gender?: string;
  isOnline?: boolean;
  rating?: number;
  sortBy?: 'price' | 'rating' | 'distance' | 'lastActive';
  sortOrder?: 'asc' | 'desc';
}

// 搜索状态类型
export interface SearchState {
  query: string;
  results: User[];
  loading: boolean;
  error: string | null;
  history: string[];
}

// 用户详情缓存类型
interface UserDetailCache {
  [userId: string]: {
    data: User;
    timestamp: number;
  };
}

// User Store状态类型
interface UserState {
  // 用户列表数据
  userList: UserListState;
  
  // 筛选结果
  filteredUsers: {
    data: User[];
    totalCount: number;
    appliedFilters: FilterConditions;
    loading: boolean;
    error: string | null;
  };
  
  // 搜索状态
  search: SearchState;
  
  // 用户详情缓存
  userDetails: UserDetailCache;
  
  // 当前筛选条件
  currentFilters: FilterConditions;
  
  // Actions
  loadUserList: (params?: { page?: number; limit?: number; refresh?: boolean }) => Promise<void>;
  loadMoreUsers: () => Promise<void>;
  refreshUserList: () => Promise<void>;
  
  applyFilters: (filters: FilterConditions) => Promise<void>;
  clearFilters: () => void;
  
  searchUsers: (query: string) => Promise<void>;
  clearSearch: () => void;
  addSearchHistory: (query: string) => void;
  
  getUserDetail: (userId: string) => Promise<User | null>;
  updateUserDetail: (userId: string, data: Partial<User>) => void;
  clearUserDetailCache: () => void;
  
  resetUserState: () => void;
}

// 初始状态
const initialState = {
  userList: {
    data: [],
    hasMore: true,
    loading: false,
    refreshing: false,
    error: null,
    page: 1,
    totalCount: 0,
  },
  filteredUsers: {
    data: [],
    totalCount: 0,
    appliedFilters: {},
    loading: false,
    error: null,
  },
  search: {
    query: '',
    results: [],
    loading: false,
    error: null,
    history: [],
  },
  userDetails: {},
  currentFilters: {},
};

// 模拟用户数据生成器
const generateMockUsers = (page: number, limit: number): User[] => {
  const users: User[] = [];
  const names = ['小明', '小红', '大神', '萌妹子', '技术宅', '游戏达人', '温柔小姐姐', '幽默大叔'];
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安'];
  const serviceTypes = ['honor_of_kings', 'league_of_legends', 'explore_shop', 'ktv', 'billiards'];
  
  for (let i = 0; i < limit; i++) {
    const index = (page - 1) * limit + i;
    users.push({
      id: `user_${index + 1}`,
      name: `${names[index % names.length]}${index + 1}`,
      avatar: `https://example.com/avatar${(index % 10) + 1}.jpg`,
      age: 18 + (index % 15),
      gender: index % 3 === 0 ? 'female' : index % 3 === 1 ? 'male' : 'other',
      height: 155 + (index % 30), // 身高: 155-185cm
      location: {
        city: cities[index % cities.length],
        district: `${cities[index % cities.length]}区`,
        distance: Math.floor(Math.random() * 50) + 1,
      },
      tags: [`标签${(index % 5) + 1}`, `技能${(index % 3) + 1}`],
      price: 30 + (index % 100),
      rating: 4.0 + Math.random(),
      reviewCount: Math.floor(Math.random() * 500) + 10,
      isOnline: index % 4 !== 0,
      lastActiveTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      serviceTypes: [serviceTypes[index % serviceTypes.length]],
      description: `我是用户${index + 1}，擅长游戏和生活服务。`,
      images: [`https://example.com/image${(index % 5) + 1}.jpg`],
      skills: [
        {
          type: serviceTypes[index % serviceTypes.length],
          level: ['青铜', '白银', '黄金', '铂金', '钻石'][index % 5],
          price: 30 + (index % 50),
        },
      ],
      // 社交统计数据
      followingCount: Math.floor(Math.random() * 500) + 50, // 关注数: 50-550
      followersCount: Math.floor(Math.random() * 1000) + 100, // 粉丝数: 100-1100
      likesCount: Math.floor(Math.random() * 5000) + 500, // 获赞数: 500-5500
    });
  }
  
  return users;
};

// User Store实现
export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // 加载用户列表
        loadUserList: async (params = {}) => {
          const { page = 1, limit = 20, refresh = false } = params;
          const state = get();
          
          if (refresh) {
            set(prevState => ({
              userList: {
                ...prevState.userList,
                refreshing: true,
                error: null,
              },
            }));
          } else {
            set(prevState => ({
              userList: {
                ...prevState.userList,
                loading: true,
                error: null,
              },
            }));
          }
          
          try {
            // TODO: 替换为实际API调用
            const mockUsers = generateMockUsers(page, limit);
            
            // 模拟API延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            set(prevState => ({
              userList: {
                ...prevState.userList,
                data: refresh || page === 1 ? mockUsers : [...prevState.userList.data, ...mockUsers],
                hasMore: mockUsers.length === limit,
                loading: false,
                refreshing: false,
                page: page,
                totalCount: 1000, // 模拟总数
              },
            }));
          } catch (error) {
            set(prevState => ({
              userList: {
                ...prevState.userList,
                loading: false,
                refreshing: false,
                error: error instanceof Error ? error.message : '用户列表加载失败',
              },
            }));
          }
        },

        // 加载更多用户
        loadMoreUsers: async () => {
          const { userList } = get();
          if (!userList.hasMore || userList.loading) return;
          
          await get().loadUserList({ page: userList.page + 1, limit: 20 });
        },

        // 刷新用户列表
        refreshUserList: async () => {
          await get().loadUserList({ page: 1, limit: 20, refresh: true });
        },

        // 应用筛选条件
        applyFilters: async (filters: FilterConditions) => {
          set(prevState => ({
            currentFilters: filters,
            filteredUsers: {
              ...prevState.filteredUsers,
              loading: true,
              error: null,
              appliedFilters: filters,
            },
          }));
          
          try {
            // TODO: 替换为实际API调用
            const mockFilteredUsers = generateMockUsers(1, 10);
            
            // 模拟API延迟
            await new Promise(resolve => setTimeout(resolve, 800));
            
            set(prevState => ({
              filteredUsers: {
                ...prevState.filteredUsers,
                data: mockFilteredUsers,
                totalCount: mockFilteredUsers.length,
                loading: false,
              },
            }));
          } catch (error) {
            set(prevState => ({
              filteredUsers: {
                ...prevState.filteredUsers,
                loading: false,
                error: error instanceof Error ? error.message : '筛选失败',
              },
            }));
          }
        },

        // 清除筛选条件
        clearFilters: () => {
          set(prevState => ({
            currentFilters: {},
            filteredUsers: {
              ...initialState.filteredUsers,
            },
          }));
        },

        // 搜索用户
        searchUsers: async (query: string) => {
          set(prevState => ({
            search: {
              ...prevState.search,
              query,
              loading: true,
              error: null,
            },
          }));
          
          try {
            // TODO: 替换为实际API调用
            const mockResults = generateMockUsers(1, 5);
            
            // 模拟API延迟
            await new Promise(resolve => setTimeout(resolve, 600));
            
            set(prevState => ({
              search: {
                ...prevState.search,
                results: mockResults,
                loading: false,
              },
            }));
          } catch (error) {
            set(prevState => ({
              search: {
                ...prevState.search,
                loading: false,
                error: error instanceof Error ? error.message : '搜索失败',
              },
            }));
          }
        },

        // 清除搜索
        clearSearch: () => {
          set(prevState => ({
            search: {
              ...prevState.search,
              query: '',
              results: [],
              error: null,
            },
          }));
        },

        // 添加搜索历史
        addSearchHistory: (query: string) => {
          if (!query.trim()) return;
          
          set(prevState => ({
            search: {
              ...prevState.search,
              history: [
                query,
                ...prevState.search.history.filter(item => item !== query),
              ].slice(0, 10), // 保留最近10条
            },
          }));
        },

        // 获取用户详情
        getUserDetail: async (userId: string): Promise<User | null> => {
          const { userDetails } = get();
          
          // 检查缓存
          const cached = userDetails[userId];
          if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5分钟缓存
            return cached.data;
          }
          
          try {
            // TODO: 替换为实际API调用
            const mockUser = generateMockUsers(1, 1)[0];
            mockUser.id = userId;
            
            // 模拟API延迟
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 更新缓存
            set(prevState => ({
              userDetails: {
                ...prevState.userDetails,
                [userId]: {
                  data: mockUser,
                  timestamp: Date.now(),
                },
              },
            }));
            
            return mockUser;
          } catch (error) {
            console.error('获取用户详情失败:', error);
            return null;
          }
        },

        // 更新用户详情
        updateUserDetail: (userId: string, data: Partial<User>) => {
          set(prevState => {
            const cached = prevState.userDetails[userId];
            if (!cached) return prevState;
            
            return {
              userDetails: {
                ...prevState.userDetails,
                [userId]: {
                  ...cached,
                  data: {
                    ...cached.data,
                    ...data,
                  },
                },
              },
            };
          });
        },

        // 清除用户详情缓存
        clearUserDetailCache: () => {
          set({ userDetails: {} });
        },

        // 重置用户状态
        resetUserState: () => {
          set(initialState);
        },
      }),
      {
        name: 'user-store',
        storage: createSafeStorage(),
        partialize: (state) => ({
          search: {
            query: state.search.query,
            history: state.search.history,
          },
          currentFilters: state.currentFilters,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            console.log('[UserStore] 存储恢复成功');
          }
        },
      }
    ),
    {
      name: 'UserStore',
    }
  )
);

// 选择器函数
export const useUserList = () => useUserStore(state => state.userList);
export const useFilteredUsers = () => useUserStore(state => state.filteredUsers);
export const useUserSearch = () => useUserStore(state => state.search);
export const useCurrentFilters = () => useUserStore(state => state.currentFilters);
