/**
 * useHomeState - 首页状态管理Hook
 * 统一管理首页所有状态逻辑
 * 
 * 版本: v2.0 - 集成真实后端API
 * 更新: 2025-10-22
 */

import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
// ========== 🚫 注释掉真实API导入 ==========
// import { homepageApiEnhanced } from '../../../../services/api/homepageApiEnhanced';
// =========================================
// 🆕 导入认证状态
import { useAuthStore } from '../../../features/AuthModule';
import type { LocationInfo, UserCard } from './types';

// Mock数据生成函数
const generateMockUsers = (filter: string = 'nearby', region?: string): UserCard[] => {
  const baseCount = 20;
  const users: UserCard[] = [];
  
  for (let i = 0; i < baseCount; i++) {
    const user: UserCard = {
      id: `user-${filter}-${i + 1}`,
      avatar: `https://picsum.photos/100/100?random=${i + 1}&sig=${filter}`,
      username: `用户${i + 1}`,
      age: 18 + (i % 12),
      bio: '这个家伙很懒惰，没有填写简介',
      services: ['模特', '陪玩', '聊天'][i % 3] ? [['模特', '陪玩', '聊天'][i % 3]] : ['模特'],
      distance: Math.round((Math.random() * 10) * 10) / 10,
      status: ['online', 'available', 'offline'][i % 3] as any,
      photos: Array.from({ length: 3 }, (_, j) => 
        `https://picsum.photos/200/200?random=${i * 10 + j + 100}&sig=${filter}`
      ),
      price: i % 3 === 0 ? `¥${80 + i * 15}/小时` : undefined,
      region: region || '南山区',
      lastActive: Date.now() - Math.random() * 24 * 60 * 60 * 1000,
      rating: 4.2 + Math.random() * 0.8,
      reviewCount: Math.floor(Math.random() * 200) + 10,
    };
    
    users.push(user);
  }
  
  return users;
};

/**
 * 首页状态管理Hook
 */
export const useHomeState = () => {
  // 🆕 在Hook顶层调用router和authStore（修复Hook规则错误）
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('nearby');
  const [activeRegion, setActiveRegion] = useState('全部');
  const [users, setUsers] = useState<UserCard[]>([]);
  const [limitedOffers, setLimitedOffers] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<LocationInfo>({ city: '深圳' });

  // 加载用户数据（使用假数据）
  const loadUsers = useCallback(async () => {
    const startTime = Date.now();
    console.log('[useHomeState] 🔄 开始加载用户列表（使用假数据）', { filter: activeFilter, region: activeRegion });
    
    setLoading(true);
    try {
      // ========== 🚫 注释掉真实API调用 ==========
      // try {
      //   console.log('[useHomeState] 📡 调用API: getUserList');
      //   
      //   const response = await homepageApiEnhanced.getUserList({
      //     filterTab: activeFilter as 'nearby' | 'recommend' | 'latest',
      //     region: activeRegion === '全部' ? undefined : activeRegion,
      //     page: 1,
      //     limit: 20,
      //   });
      //   
      //   if (response.success && response.data.users.length > 0) {
      //     console.log('[useHomeState] ✅ API加载成功', {
      //       count: response.data.users.length,
      //       total: response.data.total,
      //       hasMore: response.data.hasMore,
      //       duration: Date.now() - startTime + 'ms',
      //     });
      //     setUsers(response.data.users);
      //     return;
      //   } else {
      //     console.warn('[useHomeState] ⚠️ API返回空数据，使用降级方案');
      //   }
      // } catch (apiError) {
      //   console.warn('[useHomeState] ⚠️ API调用失败，使用降级方案', apiError);
      // }
      // =========================================
      
      // ========== ✅ 使用假数据 ==========
      console.log('[useHomeState] 🔄 使用模拟数据生成用户列表');
      await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
      const regionFilter = activeRegion === '全部' ? undefined : activeRegion;
      const mockUsers = generateMockUsers(activeFilter, regionFilter);
      setUsers(mockUsers);
      console.log('[useHomeState] ✅ 模拟数据加载完成（假数据）', { count: mockUsers.length, duration: Date.now() - startTime + 'ms' });
      // =========================================
      
    } catch (error) {
      console.error('[useHomeState] ❌ 加载用户失败', error);
      setUsers([]); // 失败时设置空数组
    } finally {
      setLoading(false);
    }
  }, [activeFilter, activeRegion]);

  // 加载限时专享数据（使用假数据）
  const loadLimitedOffers = useCallback(async () => {
    const startTime = Date.now();
    console.log('[useHomeState] 🔄 开始加载限时专享用户（使用假数据）');
    
    try {
      // ========== 🚫 注释掉真实API调用 ==========
      // try {
      //   console.log('[useHomeState] 📡 调用API: getFeaturedUsers');
      //   
      //   const response = await homepageApiEnhanced.getFeaturedUsers({
      //     limit: 5,
      //     refresh: false,
      //   });
      //   
      //   if (response.success && response.data.length > 0) {
      //     console.log('[useHomeState] ✅ 精选用户API加载成功', { count: response.data.length, duration: Date.now() - startTime + 'ms' });
      //     setLimitedOffers(response.data);
      //     return;
      //   } else {
      //     console.warn('[useHomeState] ⚠️ 精选用户API返回空数据，使用降级方案');
      //   }
      // } catch (apiError) {
      //   console.warn('[useHomeState] ⚠️ 精选用户API失败，使用降级方案', apiError);
      // }
      // =========================================
      
      // ========== ✅ 使用假数据 ==========
      console.log('[useHomeState] 🔄 使用模拟数据生成精选用户');
      await new Promise(resolve => setTimeout(resolve, 300));
      const mockOffers = generateMockUsers().slice(0, 5);
      setLimitedOffers(mockOffers);
      console.log('[useHomeState] ✅ 模拟数据加载完成（假数据）', { count: mockOffers.length, duration: Date.now() - startTime + 'ms' });
      // =========================================
      
    } catch (error) {
      console.error('[useHomeState] ❌ 加载精选用户失败', error);
      setLimitedOffers([]);
    }
  }, []);

  // 搜索处理
  const handleSearch = useMemo(
    () => {
      let timeoutId: number;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          if (query.trim()) {
            console.log('[useHomeState] 🔍 执行搜索', { query, filter: activeFilter, region: activeRegion });
            
            // TODO: 集成真实搜索API
            
            // 降级：本地筛选
            const regionFilter = activeRegion === '全部' ? undefined : activeRegion;
            const allUsers = generateMockUsers(activeFilter, regionFilter);
            const filteredUsers = allUsers.filter(user =>
              user.username.includes(query) || 
              user.services.some((service: string) => service.includes(query)) ||
              user.bio.includes(query)
            );
            setUsers(filteredUsers);
            console.log('[useHomeState] ✅ 本地搜索完成', { count: filteredUsers.length });
          } else {
            loadUsers();
          }
        }, 300);
      };
    },
    [loadUsers, activeFilter, activeRegion]
  );

  // 刷新处理 - 🆕 添加登录检查
  const handleRefresh = useCallback(() => {
    console.log('[useHomeState] 🔄 用户触发下拉刷新');
    
    // 🎯 检查登录状态（使用顶层的isAuthenticated）
    if (!isAuthenticated) {
      console.log('[useHomeState] 🔐 用户未登录，直接跳转登录页');
      setRefreshing(false);
      
      // 🎯 直接跳转到登录页，不显示弹窗
      router.push({
        pathname: '/auth/login',
        params: { returnTo: '/(tabs)/homepage' },
      });
      return;
    }
    
    // ✅ 已登录，执行刷新
    console.log('[useHomeState] ✅ 用户已登录，执行刷新');
    setRefreshing(true);
    
    Promise.all([loadUsers(), loadLimitedOffers()])
      .then(() => {
        console.log('[useHomeState] ✅ 刷新完成');
      })
      .catch(error => {
        console.error('[useHomeState] ❌ 刷新失败', error);
      })
      .finally(() => {
        setRefreshing(false);
      });
  }, [isAuthenticated, router, loadUsers, loadLimitedOffers]);

  // 初始化数据加载
  useEffect(() => {
    console.log('[useHomeState] 🚀 开始初始化加载', {
      activeFilter,
      activeRegion,
      location: location.city,
    });
    
    // 并行加载数据
    Promise.all([
      loadUsers(),
      loadLimitedOffers(),
    ]).then(() => {
      console.log('[useHomeState] ✅ 初始化加载完成');
    }).catch(error => {
      console.error('[useHomeState] ❌ 初始化加载失败', error);
    });
  }, [loadUsers, loadLimitedOffers]);

  return {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    activeRegion,
    setActiveRegion,
    users,
    limitedOffers,
    loading,
    refreshing,
    location,
    setLocation,
    handleSearch,
    handleRefresh,
  };
};
