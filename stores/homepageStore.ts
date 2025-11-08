/**
 * Homepage Store - 首页状态管理
 * 使用Zustand实现首页相关状态管理
 * 
 * 版本: v2.0 - 集成真实后端API + 完善日志
 * 更新: 2025-10-22
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
// ========== 🚫 注释掉真实API导入 ==========
// import { homepageApiEnhanced } from '../services/api/homepageApiEnhanced';
// =========================================
import { createSafeStorage } from './storage-config';

// 页面配置类型
export interface PageConfig {
  topFunction: {
    enabled: boolean;
    config: Record<string, any>;
  };
  gameBanner: {
    enabled: boolean;
    config: Record<string, any>;
  };
  serviceGrid: {
    enabled: boolean;
    config: Record<string, any>;
  };
  featuredUsers: {
    enabled: boolean;
    config: Record<string, any>;
  };
  eventCenter: {
    enabled: boolean;
    config: Record<string, any>;
  };
  userList: {
    enabled: boolean;
    config: Record<string, any>;
  };
}

// 页面数据类型
export interface PageData {
  featuredUsers: Array<{
    id: string;
    name: string;
    avatar: string;
    tags: string[];
    price: number;
    rating: number;
  }>;
  serviceItems: Array<{
    id: string;
    name: string;
    icon: string;
    type: string;
    enabled: boolean;
  }>;
  bannerData: {
    id: string;
    image: string;
    title: string;
    subtitle: string;
    gameId: string;
  };
}

// 用户交互状态类型
export interface UserInteraction {
  selectedFilter: string;
  searchQuery: string;
  scrollPosition: number;
  activeSection: string;
}

// 首页Store状态类型
interface HomepageState {
  // 页面配置状态
  pageConfig: PageConfig | null;
  
  // 页面数据状态
  pageData: PageData | null;
  
  // 用户交互状态
  userInteraction: UserInteraction;
  
  // 加载状态
  loading: {
    pageConfig: boolean;
    pageData: boolean;
    featuredUsers: boolean;
  };
  
  // 错误状态
  error: {
    pageConfig: string | null;
    pageData: string | null;
    featuredUsers: string | null;
  };
  
  // Actions
  loadPageConfig: () => Promise<void>;
  loadPageData: () => Promise<void>;
  loadFeaturedUsers: () => Promise<void>;
  updateUserInteraction: (interaction: Partial<UserInteraction>) => void;
  updatePageConfig: (config: Partial<PageConfig>) => void;
  resetPageState: () => void;
  setLoading: (key: keyof HomepageState['loading'], value: boolean) => void;
  setError: (key: keyof HomepageState['error'], value: string | null) => void;
}

// 初始状态
const initialState = {
  pageConfig: null,
  pageData: null,
  userInteraction: {
    selectedFilter: '',
    searchQuery: '',
    scrollPosition: 0,
    activeSection: 'userList',
  },
  loading: {
    pageConfig: false,
    pageData: false,
    featuredUsers: false,
  },
  error: {
    pageConfig: null,
    pageData: null,
    featuredUsers: null,
  },
};

// Homepage Store实现
export const useHomepageStore = create<HomepageState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // 加载页面配置（使用假数据）
        loadPageConfig: async () => {
          const { setLoading, setError } = get();
          const startTime = Date.now();
          
          try {
            console.log('[HomepageStore] 🔄 开始加载页面配置（使用假数据）');
            setLoading('pageConfig', true);
            setError('pageConfig', null);
            
            // ========== 🚫 注释掉真实API调用 ==========
            // const response = await homepageApiEnhanced.getHomepageConfig();
            // 
            // if (!response.success) {
            //   throw new Error(response.message || '配置加载失败');
            // }
            // 
            // // 转换API数据格式为Store格式
            // const apiConfig = response.data;
            // =========================================
            
            // ========== ✅ 使用假数据 ==========
            console.log('   模拟网络延迟（500ms）');
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 生成模拟配置
            const pageConfig: PageConfig = {
              topFunction: {
                enabled: true,
                config: {
                  showLocation: true,
                  showSearch: true,
                },
              },
              gameBanner: {
                enabled: true,
                config: {
                  autoPlay: true,
                  interval: 3000,
                },
              },
              serviceGrid: {
                enabled: true,
                config: {
                  columns: 4,
                  rows: 2,
                },
              },
              featuredUsers: {
                enabled: true,
                config: {
                  maxCount: 10,
                  refreshInterval: 60000,
                },
              },
              eventCenter: {
                enabled: true,
                config: {
                  showPromo: true,
                },
              },
              userList: {
                enabled: true,
                config: {
                  pageSize: 20,
                  infiniteScroll: true,
                },
              },
            };
            // =========================================
            
            set({ pageConfig });
            console.log('[HomepageStore] ✅ 页面配置加载成功（假数据）', {
              areas: Object.keys(pageConfig).length,
              duration: Date.now() - startTime + 'ms',
            });
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : '配置加载失败';
            setError('pageConfig', errorMsg);
            console.error('[HomepageStore] ❌ 页面配置加载失败', error);
          } finally {
            setLoading('pageConfig', false);
          }
        },

        // 加载页面数据（使用假数据）
        loadPageData: async () => {
          const { setLoading, setError } = get();
          const startTime = Date.now();
          
          try {
            console.log('[HomepageStore] 🔄 开始加载页面数据（使用假数据）');
            setLoading('pageData', true);
            setError('pageData', null);
            
            // ========== 🚫 注释掉真实API调用 ==========
            // const [servicesRes, bannerRes] = await Promise.allSettled([
            //   homepageApiEnhanced.getServiceItems(),
            //   homepageApiEnhanced.getBannerData(),
            // ]);
            // =========================================
            
            // ========== ✅ 使用假数据 ==========
            console.log('   模拟网络延迟（800ms）');
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // 构建页面数据
            const pageData: PageData = {
              featuredUsers: [], // 精选用户单独加载
              serviceItems: [
                { id: '1', name: '陪玩', icon: 'game-controller', type: 'gaming', enabled: true },
                { id: '2', name: '模特', icon: 'camera', type: 'modeling', enabled: true },
                { id: '3', name: '聊天', icon: 'chatbubbles', type: 'chat', enabled: true },
                { id: '4', name: '约拍', icon: 'camera-outline', type: 'photoshoot', enabled: true },
                { id: '5', name: '组局', icon: 'people', type: 'party', enabled: true },
                { id: '6', name: '探店', icon: 'restaurant', type: 'explore', enabled: true },
                { id: '7', name: '活动', icon: 'calendar', type: 'event', enabled: true },
                { id: '8', name: '更多', icon: 'ellipsis-horizontal', type: 'more', enabled: true },
              ],
              bannerData: {
                id: 'mock_banner_1',
                image: 'https://picsum.photos/800/300',
                title: '精彩游戏陪玩',
                subtitle: '专业陪玩，快乐相伴',
                gameId: 'game_001',
              },
            };
            // =========================================
            
            set({ pageData });
            console.log('[HomepageStore] ✅ 页面数据加载成功（假数据）', {
              services: pageData.serviceItems.length,
              banner: pageData.bannerData.id,
              duration: Date.now() - startTime + 'ms',
            });
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : '数据加载失败';
            setError('pageData', errorMsg);
            console.error('[HomepageStore] ❌ 页面数据加载失败', error);
          } finally {
            setLoading('pageData', false);
          }
        },

        // 加载精选用户（使用假数据）
        loadFeaturedUsers: async () => {
          const { setLoading, setError } = get();
          const startTime = Date.now();
          
          try {
            console.log('[HomepageStore] 🔄 开始加载精选用户（使用假数据）');
            setLoading('featuredUsers', true);
            setError('featuredUsers', null);
            
            // ========== 🚫 注释掉真实API调用 ==========
            // const response = await homepageApiEnhanced.getFeaturedUsers({
            //   limit: 10,
            //   refresh: false,
            // });
            // 
            // if (!response.success) {
            //   throw new Error(response.message || '精选用户加载失败');
            // }
            // 
            // const featuredUsers = response.data.map(user => ({
            //   id: user.id,
            //   name: user.username,
            //   avatar: user.avatar,
            //   tags: user.services || [],
            //   price: user.price ? parseFloat(user.price.replace(/[^\d.]/g, '')) : 0,
            //   rating: user.rating || 0,
            // }));
            // =========================================
            
            // ========== ✅ 使用假数据 ==========
            console.log('   模拟网络延迟（600ms）');
            await new Promise(resolve => setTimeout(resolve, 600));
            
            // 生成模拟精选用户
            const featuredUsers = Array.from({ length: 10 }, (_, i) => ({
              id: `featured_user_${i + 1}`,
              name: `精选用户${i + 1}`,
              avatar: `https://picsum.photos/100/100?random=${i + 100}`,
              tags: i % 3 === 0 ? ['陪玩', '模特'] : i % 3 === 1 ? ['聊天'] : ['约拍', '探店'],
              price: 80 + i * 20,
              rating: 4.5 + Math.random() * 0.5,
            }));
            // =========================================
            
            set(state => ({
              pageData: state.pageData ? {
                ...state.pageData,
                featuredUsers,
              } : null,
            }));
            
            console.log('[HomepageStore] ✅ 精选用户加载成功（假数据）', { count: featuredUsers.length, duration: Date.now() - startTime + 'ms' });
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : '精选用户加载失败';
            setError('featuredUsers', errorMsg);
            console.error('[HomepageStore] ❌ 精选用户加载失败', error);
            
            // 错误时保持空数组，前端会显示空状态
            set(state => ({
              pageData: state.pageData ? {
                ...state.pageData,
                featuredUsers: [],
              } : null,
            }));
          } finally {
            setLoading('featuredUsers', false);
          }
        },

        // 更新用户交互状态
        updateUserInteraction: (interaction: Partial<UserInteraction>) => {
          set(state => ({
            userInteraction: {
              ...state.userInteraction,
              ...interaction,
            },
          }));
        },

        // 更新页面配置
        updatePageConfig: (config: Partial<PageConfig>) => {
          set(state => ({
            pageConfig: state.pageConfig ? {
              ...state.pageConfig,
              ...config,
            } : null,
          }));
        },

        // 重置页面状态
        resetPageState: () => {
          console.log('[HomepageStore] 🔄 重置页面状态');
          set(initialState);
        },

        // 设置加载状态
        setLoading: (key: keyof HomepageState['loading'], value: boolean) => {
          set(state => ({
            loading: {
              ...state.loading,
              [key]: value,
            },
          }));
        },

        // 设置错误状态
        setError: (key: keyof HomepageState['error'], value: string | null) => {
          set(state => ({
            error: {
              ...state.error,
              [key]: value,
            },
          }));
        },
      }),
      {
        name: 'homepage-store',
        storage: createSafeStorage(),
        partialize: (state) => ({
          pageConfig: state.pageConfig,
          userInteraction: state.userInteraction,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            console.log('[HomepageStore] 💾 Store从持久化存储恢复成功', {
              hasConfig: !!state.pageConfig,
              interaction: state.userInteraction,
            });
          }
        },
      }
    ),
    {
      name: 'HomepageStore',
    }
  )
);

// 选择器函数
export const useHomepageConfig = () => useHomepageStore(state => state.pageConfig);
export const useHomepageData = () => useHomepageStore(state => state.pageData);
export const useHomepageLoading = () => useHomepageStore(state => state.loading);
export const useHomepageError = () => useHomepageStore(state => state.error);
export const useUserInteraction = () => useHomepageStore(state => state.userInteraction);
