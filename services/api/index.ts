/**
 * API Services Index - 统一导出所有API服务
 */

// 导入用于工具函数
import { apiClient as client } from './client';
import { homepageApi as homepage } from './homepageApi';
import { locationApi as location } from './locationApi';
import { serviceApi as service } from './serviceApi';
import { userApi as user } from './userApi';

// 导出API客户端和基础配置
export { apiClient } from './client';
export { API_CONFIG, API_ENDPOINTS, buildQueryParams, buildURL, getBaseURL } from './config';

// 导出所有API服务实例
export { authApi } from './authApi';
export { discoveryApi } from './discoveryApi';
export { homepageApi } from './homepageApi';
export { locationApi } from './locationApi';
export { profileApi } from './profileApi';
export { serviceApi } from './serviceApi';
export { userApi } from './userApi';
export * as activityApi from './activityApi';

// 导出API响应和错误类型
export { ERROR_TYPES, HTTP_STATUS } from './client';
export type { ApiError, ApiResponse, RequestConfig } from './client';

// 导出Auth API类型
export type {
  LoginResponse, LogoutRequest, PasswordLoginRequest,
  RefreshTokenRequest, RefreshTokenResponse,
  SendSmsRequest, SendSmsResponse,
  SmsLoginRequest, VerifySmsRequest
} from './authApi';

// 导出Homepage API类型
export type {
  BannerData, FeaturedUser, FeaturedUsersParams, HomepageConfig, HomepageData,
  HomepageDataParams, ServiceConfigParams, ServiceItem, TrackingEvent
} from './homepageApi';

// 导出User API类型
export type {
  FavoriteUserParams, FollowUserParams, ReportUserParams, User, UserDetailInfo, UserListParams,
  UserListResponse, UserRecommendationParams, UserSearchParams,
  UserSearchResponse
} from './userApi';

// 导出Location API类型
export type {
  CityInfo, Coordinates, DistrictInfo, GeocodeResponse, LocationInfo
} from './locationApi';

// 导出Service API类型
export type {
  ServiceDetail, ServiceTypeConfig,
  ServiceUserFilters
} from './serviceApi';

// 导出Discovery API类型
export type {
  AddCommentRequest, CommentItem, CommentListParams, FeedDetail, FeedListItem, FeedListParams, FeedListResponse, InteractionRequest
} from './discoveryApi';

// 导出Profile API类型
export type {
  OccupationDictVO,
  ProfileCompletenessVO,
  UserOccupationUpdateDTO,
  UserOccupationVO,
  UserProfileUpdateDTO,
  UserProfileVO,
  UserStatsVO
} from './profileApi';

// 导出Activity API类型
export type {
  ActivityListParams,
  ActivityListResponse,
  ActivityDetail,
  ActivityListItem,
  ActivityType,
  ActivityStatus,
  Organizer,
  ActivityTag,
  PriceInfo,
  Schedule,
  Location,
  Participants,
  ParticipantItem,
  FilterConfig,
  ActivityFilters,
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

// API工具函数
export const clearAllCache = () => {
  client.clearCache();
};

// 设置全局认证token
export const setAuthToken = (token: string) => {
  client.setAuthToken(token);
};

// 清除全局认证token
export const clearAuthToken = () => {
  client.clearAuthToken();
};

// 批量初始化API数据
export const initializeApiData = async () => {
  try {
    // 并行初始化基础数据
    const [homepageConfig, serviceTypes, cityList] = await Promise.allSettled([
      homepage.getHomepageConfig(),
      service.getServiceTypes(),
      location.getCityList(),
    ]);

    console.log('API数据初始化完成');
    return {
      homepageConfig: homepageConfig.status === 'fulfilled' ? homepageConfig.value : null,
      serviceTypes: serviceTypes.status === 'fulfilled' ? serviceTypes.value : null,
      cityList: cityList.status === 'fulfilled' ? cityList.value : null,
    };
  } catch (error) {
    console.error('API数据初始化失败:', error);
    throw error;
  }
};

// API健康检查
export const checkApiHealth = async (): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: Record<string, boolean>;
  latency: number;
}> => {
  const startTime = Date.now();
  const services = {
    homepage: false,
    user: false,
    location: false,
    service: false,
  };

  try {
    // 并行检查各个服务
    const checks = await Promise.allSettled([
      homepage.getHomepageConfig().then(() => { services.homepage = true; }),
      user.getUserList({ limit: 1 }).then(() => { services.user = true; }),
      location.getCityList().then(() => { services.location = true; }),
      service.getServiceTypes().then(() => { services.service = true; }),
    ]);

    const healthyServices = Object.values(services).filter(Boolean).length;
    const totalServices = Object.keys(services).length;
    const latency = Date.now() - startTime;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyServices === totalServices) {
      status = 'healthy';
    } else if (healthyServices > 0) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return { status, services, latency };
  } catch (error) {
    console.error('API健康检查失败:', error);
    return {
      status: 'unhealthy',
      services,
      latency: Date.now() - startTime,
    };
  }
};

// 网络状态监听
export const createNetworkListener = (callback: (isOnline: boolean) => void) => {
  // TODO: 实现网络状态监听
  // 这里可以集成react-native-netinfo等库
  console.log('网络状态监听器已创建');
  
  return () => {
    console.log('网络状态监听器已清除');
  };
};
