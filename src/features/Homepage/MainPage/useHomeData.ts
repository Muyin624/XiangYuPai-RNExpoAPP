/**
 * useHomeData - 首页数据管理Hook
 * 统一管理首页所有数据获取逻辑
 * 根据接口文档更新: XiangYuPai-Doc/Action-API/Home/首页接口文档.md
 */

import { useCallback } from 'react';
import { homeApi } from './homeApi';
import type {
  CheckInResponse,
  ExpertsResponse,
  FeedResponse,
  HomeInitResponse,
  TopicBannerResponse,
  UserCard,
} from './types';

/**
 * 首页数据管理Hook
 * 提供所有首页API调用的封装
 */
export const useHomeData = () => {
  // ========== 新API接口（根据接口文档） ==========
  
  /**
   * 一、首页初始化加载
   * 接口: GET /api/home/init
   */
  const loadHomeInit = useCallback(async (): Promise<HomeInitResponse> => {
    try {
      // TODO: 切换到真实API
      // return await homeApi.getHomeInit();
      
      // 使用Mock数据
      console.log('[useHomeData] 加载首页初始化数据（Mock）');
      await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
      return homeApi.generateMockHomeInit();
    } catch (error) {
      console.error('[useHomeData] 加载首页初始化失败:', error);
      throw error;
    }
  }, []);

  /**
   * 二、明日专家推荐
   * 接口: GET /api/home/experts
   */
  const loadExperts = useCallback(async (): Promise<ExpertsResponse> => {
    try {
      // TODO: 切换到真实API
      // return await homeApi.getExperts();
      
      // 使用Mock数据
      console.log('[useHomeData] 加载专家推荐数据（Mock）');
      await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
      return homeApi.generateMockExperts();
    } catch (error) {
      console.error('[useHomeData] 加载专家推荐失败:', error);
      throw error;
    }
  }, []);

  /**
   * 三、你什么名模块
   * 接口: GET /api/home/topic-banner
   */
  const loadTopicBanner = useCallback(async (): Promise<TopicBannerResponse> => {
    try {
      // TODO: 切换到真实API
      // return await homeApi.getTopicBanner();
      
      // 使用Mock数据
      console.log('[useHomeData] 加载你什么名模块数据（Mock）');
      await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
      return homeApi.generateMockTopicBanner();
    } catch (error) {
      console.error('[useHomeData] 加载你什么名模块失败:', error);
      throw error;
    }
  }, []);

  /**
   * 四、内容Feed流
   * 接口: GET /api/home/feed
   */
  const loadFeed = useCallback(async (pageNum: number = 1, pageSize: number = 10): Promise<FeedResponse> => {
    try {
      // 参数验证
      if (pageNum < 1) {
        throw new Error('pageNum必须大于等于1');
      }
      if (pageSize < 5 || pageSize > 20) {
        throw new Error('pageSize范围必须在5-20之间');
      }

      // TODO: 切换到真实API
      // return await homeApi.getFeed({ pageNum, pageSize });
      
      // 使用Mock数据
      console.log('[useHomeData] 加载Feed流数据（Mock）', { pageNum, pageSize });
      await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
      return homeApi.generateMockFeed(pageNum, pageSize);
    } catch (error) {
      console.error('[useHomeData] 加载Feed流失败:', error);
      throw error;
    }
  }, []);

  /**
   * 五、签到功能
   * 接口: POST /api/user/check-in
   */
  const checkIn = useCallback(async (): Promise<CheckInResponse> => {
    try {
      // TODO: 切换到真实API
      // return await homeApi.checkIn();
      
      // 使用Mock数据
      console.log('[useHomeData] 执行签到（Mock）');
      await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
      // 随机模拟已签到或未签到
      const alreadyChecked = Math.random() > 0.7;
      return homeApi.generateMockCheckIn(alreadyChecked);
    } catch (error) {
      console.error('[useHomeData] 签到失败:', error);
      throw error;
    }
  }, []);

  /**
   * 下拉刷新 - 批量刷新所有数据
   */
  const refreshAll = useCallback(async () => {
    try {
      console.log('[useHomeData] 开始刷新所有数据');
      const [init, experts, topicBanner, feed] = await Promise.all([
        loadHomeInit(),
        loadExperts(),
        loadTopicBanner(),
        loadFeed(1, 10),
      ]);
      
      console.log('[useHomeData] 刷新完成');
      return { init, experts, topicBanner, feed };
    } catch (error) {
      console.error('[useHomeData] 刷新失败:', error);
      throw error;
    }
  }, [loadHomeInit, loadExperts, loadTopicBanner, loadFeed]);

  // ========== 旧接口（保留向后兼容） ==========
  
  /**
   * @deprecated 使用loadFeed代替
   */
  const loadUsers = useCallback(async (filter?: string, region?: string): Promise<UserCard[]> => {
    console.warn('[useHomeData] loadUsers已废弃，请使用loadFeed');
    return [];
  }, []);

  /**
   * @deprecated 使用loadExperts代替
   */
  const loadLimitedOffers = useCallback(async (): Promise<UserCard[]> => {
    console.warn('[useHomeData] loadLimitedOffers已废弃，请使用loadExperts');
    return [];
  }, []);

  /**
   * @deprecated 搜索功能已移至搜索模块
   */
  const searchUsers = useCallback(async (query: string): Promise<UserCard[]> => {
    console.warn('[useHomeData] searchUsers已废弃，搜索功能已移至搜索模块');
    return [];
  }, []);

  /**
   * @deprecated 用户详情已移至用户模块
   */
  const getUserDetail = useCallback(async (userId: string): Promise<UserCard | null> => {
    console.warn('[useHomeData] getUserDetail已废弃，用户详情已移至用户模块');
    return null;
  }, []);

  return {
    // 新API
    loadHomeInit,
    loadExperts,
    loadTopicBanner,
    loadFeed,
    checkIn,
    refreshAll,
    // 旧API（保留兼容）
    loadUsers,
    loadLimitedOffers,
    searchUsers,
    getUserDetail,
  };
};
