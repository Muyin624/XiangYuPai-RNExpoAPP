/**
 * Activity API - 组局中心相关API接口
 * 支持Mock模式，开发时无需后端即可测试
 */

import { apiClient, ApiResponse } from './client';
import { buildQueryParams } from './config';
import type {
  ActivityListParams,
  ActivityListResponse,
  ActivityDetail,
  PublishConfig,
  PublishActivityParams,
  PublishActivityResponse,
  RegisterParams,
  RegisterResponse,
  ApproveRegistrationParams,
  CancelRegistrationResponse,
  ShareResponse,
  UploadImageResponse,
  PaymentInfo,
} from './types/activity';
import { 
  mockActivityList, 
  mockActivityDetail, 
  mockPublishConfig 
} from './activityMockData';

// 🎯 Mock模式配置
// 设置为true时，所有API将返回虚拟数据，无需后端
const USE_MOCK_DATA = true; // 开发时设为true，生产环境设为false

/**
 * 创建Mock响应
 */
const createMockResponse = <T>(data: T, delay: number = 300): Promise<ApiResponse<T>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data,
        code: 200,
        message: 'Success (Mock Data)',
        timestamp: Date.now(),
        success: true,
      });
    }, delay);
  });
};

/**
 * 获取活动列表
 */
export const getActivityList = async (
  params: ActivityListParams
): Promise<ApiResponse<ActivityListResponse>> => {
  if (USE_MOCK_DATA) {
    console.log('📦 [Mock] 获取活动列表 - 返回虚拟数据');
    // 支持筛选逻辑
    let filteredList = [...mockActivityList.list];
    if (params.filters?.activityType && params.filters.activityType.length > 0) {
      filteredList = filteredList.filter(
        item => params.filters!.activityType!.includes(item.activityType.type)
      );
    }
    return createMockResponse({
      ...mockActivityList,
      list: filteredList,
    });
  }
  
  const queryParams = buildQueryParams(params);
  return apiClient.get(`/api/activity/list?${queryParams}`);
};

/**
 * 获取活动详情
 */
export const getActivityDetail = async (
  activityId: number
): Promise<ApiResponse<ActivityDetail>> => {
  if (USE_MOCK_DATA) {
    console.log('📦 [Mock] 获取活动详情 - 返回虚拟数据', { activityId });
    return createMockResponse(mockActivityDetail);
  }
  
  const queryParams = buildQueryParams({ activityId });
  return apiClient.get(`/api/activity/detail?${queryParams}`);
};

/**
 * 获取发布配置
 */
export const getPublishConfig = async (): Promise<ApiResponse<PublishConfig>> => {
  if (USE_MOCK_DATA) {
    console.log('📦 [Mock] 获取发布配置 - 返回虚拟数据');
    return createMockResponse(mockPublishConfig);
  }
  
  return apiClient.get('/api/activity/publish/config');
};

/**
 * 上传活动图片
 */
export const uploadActivityImage = async (
  file: File | FormData
): Promise<ApiResponse<UploadImageResponse>> => {
  if (USE_MOCK_DATA) {
    console.log('📦 [Mock] 上传活动图片 - 返回虚拟数据');
    return createMockResponse({
      imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
      thumbnailUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200',
    }, 800);
  }
  
  const formData = file instanceof FormData ? file : new FormData();
  if (!(file instanceof FormData)) {
    formData.append('file', file);
    formData.append('type', 'activity');
  }
  
  return apiClient.post('/api/common/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * 发布活动
 */
export const publishActivity = async (
  params: PublishActivityParams
): Promise<ApiResponse<PublishActivityResponse>> => {
  if (USE_MOCK_DATA) {
    console.log('📦 [Mock] 发布活动 - 返回虚拟数据', params);
    return createMockResponse({
      activityId: Math.floor(Math.random() * 10000) + 1000,
      needPayment: false,
    }, 500);
  }
  
  return apiClient.post('/api/activity/publish', params);
};

/**
 * 支付平台费用
 */
export const payPublishFee = async (params: {
  activityId: number;
  paymentMethod: 'balance' | 'alipay' | 'wechat';
  amount: number;
}): Promise<ApiResponse<PaymentInfo>> => {
  if (USE_MOCK_DATA) {
    console.log('📦 [Mock] 支付平台费用 - 返回虚拟数据', params);
    return createMockResponse({
      orderId: `ORDER_${Date.now()}`,
      paymentStatus: 'success',
      activityId: params.activityId,
      balance: 500,
    }, 600);
  }
  
  return apiClient.post('/api/activity/publish/pay', params);
};

/**
 * 报名参加活动
 */
export const registerActivity = async (
  params: RegisterParams
): Promise<ApiResponse<RegisterResponse>> => {
  if (USE_MOCK_DATA) {
    console.log('📦 [Mock] 报名参加活动 - 返回虚拟数据', params);
    return createMockResponse({
      registrationId: Math.floor(Math.random() * 10000) + 3000,
      status: 'approved',
      needPayment: false,
      approvalRequired: false,
    }, 400);
  }
  
  return apiClient.post('/api/activity/register', params);
};

/**
 * 支付报名费用
 */
export const payRegistrationFee = async (params: {
  activityId: number;
  registrationId: number;
  paymentMethod: 'balance' | 'alipay' | 'wechat';
  amount: number;
}): Promise<ApiResponse<PaymentInfo>> => {
  if (USE_MOCK_DATA) {
    console.log('📦 [Mock] 支付报名费用 - 返回虚拟数据', params);
    return createMockResponse({
      orderId: `REG_ORDER_${Date.now()}`,
      paymentStatus: 'success',
      registrationStatus: 'approved',
      balance: 450,
    }, 600);
  }
  
  return apiClient.post('/api/activity/register/pay', params);
};

/**
 * 审核报名
 */
export const approveRegistration = async (
  params: ApproveRegistrationParams
): Promise<ApiResponse<{ registrationId: number; status: string; success: boolean }>> => {
  if (USE_MOCK_DATA) {
    console.log('📦 [Mock] 审核报名 - 返回虚拟数据', params);
    return createMockResponse({
      registrationId: params.registrationId,
      status: params.action === 'approve' ? 'approved' : 'rejected',
      success: true,
    }, 400);
  }
  
  return apiClient.post('/api/activity/registration/approve', params);
};

/**
 * 取消报名
 */
export const cancelRegistration = async (params: {
  activityId: number;
  registrationId: number;
}): Promise<ApiResponse<CancelRegistrationResponse>> => {
  if (USE_MOCK_DATA) {
    console.log('📦 [Mock] 取消报名 - 返回虚拟数据', params);
    return createMockResponse({
      success: true,
      refundAmount: 50,
      cancelPolicy: '活动开始前24小时取消可全额退款',
    }, 400);
  }
  
  return apiClient.post('/api/activity/register/cancel', params);
};

/**
 * 分享活动
 */
export const shareActivity = async (params: {
  activityId: number;
  shareType: 'link' | 'image' | 'miniprogram';
}): Promise<ApiResponse<ShareResponse>> => {
  if (USE_MOCK_DATA) {
    console.log('📦 [Mock] 分享活动 - 返回虚拟数据', params);
    return createMockResponse({
      shareUrl: `https://app.xiangyupai.com/activity/${params.activityId}`,
      shareImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
      shareText: '快来参加这个精彩活动！',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://app.xiangyupai.com',
    }, 500);
  }
  
  return apiClient.post('/api/activity/share', params);
};

export default {
  getActivityList,
  getActivityDetail,
  getPublishConfig,
  uploadActivityImage,
  publishActivity,
  payPublishFee,
  registerActivity,
  payRegistrationFee,
  approveRegistration,
  cancelRegistration,
  shareActivity,
};
