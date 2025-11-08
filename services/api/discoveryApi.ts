/**
 * 发现页面 API 服务
 * 
 * 说明：
 * - 所有接口都是公开的，无需登录即可访问
 * - 后端对应 DiscoveryController（/api/v1/discovery/**）
 * - 已在网关配置白名单
 * 
 * @author xypai
 * @date 2025-10-25
 */

import { apiClient } from './client';
import { buildQueryParams } from './config';
import {
    getMockHotContents,
    getMockLocalContents,
    getMockRecommendedContents,
    simulateDelay
} from './discoveryMockData';
import type { ContentDetailVO, ContentListVO } from './types/content';

// 开关：是否使用虚拟数据
const USE_MOCK_DATA = true;

// ==================== 类型定义 ====================

/**
 * FeedListItem - 动态流列表项
 * 
 * 注：与 ContentListVO 类型相同，用于兼容前端命名习惯
 */
export type FeedListItem = ContentListVO;

/**
 * 评论项类型
 * 
 * 注：用于评论列表和评论详情
 */
export interface CommentItem {
  id: string;
  contentId: string;
  userId: string;
  userNickname: string;
  userAvatar?: string;
  commentText: string;
  parentId?: string;
  replyToId?: string;
  replyToUserId?: string;
  replyToUserNickname?: string;
  likeCount: number;
  replyCount: number;
  isTop: boolean;
  liked: boolean;
  replies?: CommentItem[];
  totalReplies?: number;
  hasMoreReplies?: boolean;
  createdAt: string;
}

// ==================== 导出类型 ====================

export type { ContentDetailVO, ContentListVO };

/**
 * 请求参数接口
 */
export interface GetContentsParams {
  type?: number;
  limit?: number;
  city?: string;
}

export interface SearchParams {
  keyword: string;
  type?: number;
  limit?: number;
}

export interface NearbyParams {
  longitude: number;
  latitude: number;
  radius?: number;
  type?: number;
  limit?: number;
}

/**
 * 发现页面 API 类
 * 
 * 功能模块：
 * 1. 内容流展示（热门、推荐、同城）
 * 2. 内容搜索
 * 3. 内容详情查看
 * 4. 地理位置相关内容
 */
export class DiscoveryAPI {
  /**
   * 获取热门内容
   * 
   * @param params - 查询参数（type, limit）
   * @returns 热门内容列表
   */
  async getHotContents(params: GetContentsParams = {}): Promise<ContentListVO[]> {
    const { type, limit = 20 } = params;
    
    // 使用虚拟数据
    if (USE_MOCK_DATA) {
      console.log('📱 [DiscoveryAPI] 使用虚拟数据 - 热门内容');
      await simulateDelay(300);
      return getMockHotContents(limit);
    }
    
    const queryParams = buildQueryParams({ type, limit });
    const url = `/xypai-content/api/v1/discovery/hot${queryParams ? `?${queryParams}` : ''}`;
    
    console.log('\n📱 [DiscoveryAPI] ========== 开始获取热门内容 ==========');
    console.log('📱 请求参数:', { type, limit });
    console.log('📱 完整URL:', url);
    
    try {
      const response = await apiClient.get<ContentListVO[]>(url);

      console.log('📱 [DiscoveryAPI] ========== 响应详情 ==========');
      console.log('📱 success:', response.success);
      console.log('📱 code:', response.code);
      console.log('📱 message:', response.message);
      console.log('📱 data类型:', Array.isArray(response.data) ? 'Array' : typeof response.data);
      console.log('📱 data数量:', response.data?.length || 0);
      
      if (response.data && response.data.length > 0) {
        console.log('📱 第一条数据样本:', JSON.stringify(response.data[0], null, 2));
      } else {
        console.warn('📱 ⚠️ 响应数据为空！');
        console.warn('📱 可能原因:');
        console.warn('   1. 数据库中没有数据');
        console.warn('   2. status字段不是1或deleted字段不是0');
        console.warn('   3. 后端查询条件过滤掉了所有数据');
      }
      
      console.log('📱 ==============================================\n');
      return response.data || [];
      
    } catch (error: any) {
      console.error('\n❌ [DiscoveryAPI] ========== 请求失败 ==========');
      console.error('❌ 错误类型:', error.type || 'unknown');
      console.error('❌ 错误信息:', error.message);
      console.error('❌ 状态码:', error.code);
      console.error('❌ 详细信息:', error.details);
      console.error('❌ 完整错误对象:', error);
      console.error('❌ ==============================================\n');
      return [];
    }
  }

  /**
   * 获取推荐内容
   * 
   * @param params - 查询参数（type, limit）
   * @returns 推荐内容列表
   */
  async getRecommendedContents(params: GetContentsParams = {}): Promise<ContentListVO[]> {
    const { type, limit = 20 } = params;
    
    // 使用虚拟数据
    if (USE_MOCK_DATA) {
      console.log('📱 [DiscoveryAPI] 使用虚拟数据 - 推荐内容');
      await simulateDelay(300);
      return getMockRecommendedContents(limit);
    }
    
    try {
      const queryParams = buildQueryParams({ type, limit });
      const url = `/xypai-content/api/v1/discovery/recommended${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await apiClient.get<ContentListVO[]>(url);

      console.log('[DiscoveryAPI] 获取推荐内容成功', {
        count: response.data?.length || 0,
        type,
        limit
      });

      return response.data || [];
    } catch (error) {
      console.error('[DiscoveryAPI] 获取推荐内容失败', error);
      return [];
    }
  }

  /**
   * 获取同城内容
   * 
   * @param params - 查询参数（city, type, limit）
   * @returns 同城内容列表
   */
  async getLocalContents(params: GetContentsParams = {}): Promise<ContentListVO[]> {
    const { city, type, limit = 20 } = params;
    
    // 使用虚拟数据
    if (USE_MOCK_DATA) {
      console.log('📱 [DiscoveryAPI] 使用虚拟数据 - 同城内容');
      await simulateDelay(300);
      return getMockLocalContents(limit);
    }
    
    try {
      const queryParams = buildQueryParams({ city, type, limit });
      const url = `/xypai-content/api/v1/discovery/local${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await apiClient.get<ContentListVO[]>(url);

      console.log('[DiscoveryAPI] 获取同城内容成功', {
        count: response.data?.length || 0,
        city,
        type,
        limit
      });

      return response.data || [];
    } catch (error) {
      console.error('[DiscoveryAPI] 获取同城内容失败', error);
      return [];
    }
  }

  /**
   * 搜索内容
   * 
   * @param params - 查询参数（keyword, type, limit）
   * @returns 搜索结果列表
   */
  async searchContents(params: SearchParams): Promise<ContentListVO[]> {
    const { keyword, type, limit = 20 } = params;
    try {
      if (!keyword || keyword.trim() === '') {
        console.warn('[DiscoveryAPI] 搜索关键词为空');
        return [];
      }

      const queryParams = buildQueryParams({ keyword: keyword.trim(), type, limit });
      const url = `/xypai-content/api/v1/discovery/search${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await apiClient.get<ContentListVO[]>(url);

      console.log('[DiscoveryAPI] 搜索内容成功', {
        count: response.data?.length || 0,
        keyword,
        type,
        limit
      });

      return response.data || [];
    } catch (error) {
      console.error('[DiscoveryAPI] 搜索内容失败', { keyword, error });
      return [];
    }
  }

  /**
   * 获取内容详情
   * 
   * @param contentId - 内容ID
   * @returns 内容详情
   */
  async getContentDetail(contentId: number | string): Promise<ContentDetailVO | null> {
    try {
      if (!contentId) {
        console.warn('[DiscoveryAPI] 内容ID为空');
        return null;
      }

      const response = await apiClient.get<ContentDetailVO>(
        `/xypai-content/api/v1/discovery/${contentId}`
      );

      console.log('[DiscoveryAPI] 获取内容详情成功', { contentId });
      return response.data || null;
    } catch (error) {
      console.error('[DiscoveryAPI] 获取内容详情失败', { contentId, error });
      return null;
    }
  }

  /**
   * 获取附近内容（基于地理位置）
   * 
   * @param longitude - 经度
   * @param latitude - 纬度
   * @param radius - 半径（米），默认 5000
   * @param type - 内容类型（可选）
   * @param limit - 返回数量限制，默认 20
   * @returns 附近内容列表
   */
  async getNearbyContents(
    longitude: number,
    latitude: number,
    radius: number = 5000,
    type?: number,
    limit: number = 20
  ): Promise<ContentListVO[]> {
    try {
      if (!longitude || !latitude) {
        console.warn('[DiscoveryAPI] 经纬度参数无效');
        return [];
      }

      const queryParams = buildQueryParams({ longitude, latitude, radius, type, limit });
      const url = `/xypai-content/api/v1/discovery/nearby${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await apiClient.get<ContentListVO[]>(url);

      console.log('[DiscoveryAPI] 获取附近内容成功', {
        count: response.data?.length || 0,
        location: { longitude, latitude },
        radius,
        type,
        limit
      });

      return response.data || [];
    } catch (error) {
      console.error('[DiscoveryAPI] 获取附近内容失败', {
        location: { longitude, latitude },
        error
      });
      return [];
    }
  }

  /**
   * 获取城市内容
   * 
   * @param cityId - 城市ID
   * @param type - 内容类型（可选）
   * @param limit - 返回数量限制，默认 50
   * @returns 城市内容列表
   */
  async getContentsByCity(cityId: number, type?: number, limit: number = 50): Promise<ContentListVO[]> {
    try {
      if (!cityId) {
        console.warn('[DiscoveryAPI] 城市ID为空');
        return [];
      }

      const queryParams = buildQueryParams({ type, limit });
      const url = `/xypai-content/api/v1/discovery/city/${cityId}${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await apiClient.get<ContentListVO[]>(url);

      console.log('[DiscoveryAPI] 获取城市内容成功', {
        count: response.data?.length || 0,
        cityId,
        type,
        limit
      });

      return response.data || [];
    } catch (error) {
      console.error('[DiscoveryAPI] 获取城市内容失败', { cityId, error });
      return [];
    }
  }

  /**
   * 获取用户发布的内容
   * 
   * @param userId - 用户ID
   * @param type - 内容类型（可选）
   * @param limit - 返回数量限制，默认 20
   * @returns 用户内容列表
   */
  async getUserContents(userId: number, type?: number, limit: number = 20): Promise<ContentListVO[]> {
    try {
      if (!userId) {
        console.warn('[DiscoveryAPI] 用户ID为空');
        return [];
      }

      const queryParams = buildQueryParams({ type, limit });
      const url = `/xypai-content/api/v1/discovery/user/${userId}${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await apiClient.get<ContentListVO[]>(url);

      console.log('[DiscoveryAPI] 获取用户内容成功', {
        count: response.data?.length || 0,
        userId,
        type,
        limit
      });

      return response.data || [];
    } catch (error) {
      console.error('[DiscoveryAPI] 获取用户内容失败', { userId, error });
      return [];
    }
  }
}

// 导出单例实例
export const discoveryApi = new DiscoveryAPI();

// 默认导出
export default discoveryApi;
