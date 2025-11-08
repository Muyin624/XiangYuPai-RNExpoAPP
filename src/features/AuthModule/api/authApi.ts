/**
 * Auth API - 认证相关API接口
 * 
 * 提供完整的认证API服务：
 * - 用户登录（密码/验证码）
 * - 令牌管理（刷新/验证）
 * - 用户注册和登出
 * - 错误处理和重试机制
 */

import { AxiosError, AxiosResponse } from 'axios';

// Types
import type {
    LoginRequest,
    LoginResponse,
    SendCodeRequest,
    SendCodeResponse,
    UserInfo,
} from '../LoginMainPage/types';

// Configuration
import { apiClient } from '../../../../services/api/client';

// #region 类型定义

/**
 * 刷新令牌请求
 */
interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * 刷新令牌响应
 */
interface RefreshTokenResponse {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
    expiresIn: number;
  };
  message: string;
}

/**
 * 用户存在检查请求
 */
interface CheckUserExistsRequest {
  phone: string;
  region: string;
}

/**
 * 用户存在检查响应
 */
interface CheckUserExistsResponse {
  success: boolean;
  data: {
    exists: boolean;
    verified: boolean;
  };
  message: string;
}

/**
 * 登出请求
 */
interface LogoutRequest {
  deviceId?: string;
}

/**
 * 通用API响应格式
 */
interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  code?: string;
  timestamp?: string;
}

// #endregion

// #region API配置

/**
 * API端点配置
 */
const API_ENDPOINTS = {
  // 认证相关
  PASSWORD_LOGIN: '/auth/login/password',
  SMS_LOGIN: '/auth/login/sms',
  REFRESH_TOKEN: '/auth/token/refresh',
  LOGOUT: '/auth/logout',
  
  // 用户相关
  CHECK_USER_EXISTS: '/auth/user/exists',
  USER_PROFILE: '/auth/user/profile',
  
  // 验证码相关
  SEND_LOGIN_CODE: '/auth/sms/login',
  SEND_REGISTER_CODE: '/auth/sms/register',
  VERIFY_CODE: '/auth/sms/verify',
  
  // 密码重置相关
  SEND_RESET_CODE: '/auth/sms/reset',
  VERIFY_RESET_CODE: '/auth/reset/verify-code',
  RESET_PASSWORD: '/auth/reset/password',
} as const;

/**
 * API配置常量
 */
const API_CONFIG = {
  TIMEOUT: 30000,           // 30秒超时
  RETRY_COUNT: 3,           // 重试3次
  RETRY_DELAY: 1000,        // 重试延迟1秒
  MAX_CONCURRENT: 5,        // 最大并发请求数
} as const;

// #endregion

// #region 工具函数

/**
 * 错误处理工具
 */
const errorHandler = {
  /**
   * 格式化API错误
   */
  format: (error: AxiosError): Error => {
    const response = error.response;
    const data = response?.data as any;
    
    // 服务器返回的错误信息
    if (data?.message) {
      const customError = new Error(data.message);
      (customError as any).code = data.code;
      (customError as any).status = response?.status;
      return customError;
    }
    
    // 网络错误
    if (error.code === 'NETWORK_ERROR' || !response) {
      return new Error('网络连接失败，请检查网络设置');
    }
    
    // HTTP状态码错误
    const statusCode = response?.status;
    switch (statusCode) {
      case 400:
        return new Error('请求参数错误');
      case 401:
        return new Error('身份验证失败');
      case 403:
        return new Error('访问被拒绝');
      case 404:
        return new Error('服务不存在');
      case 429:
        return new Error('请求过于频繁，请稍后再试');
      case 500:
        return new Error('服务器内部错误');
      case 502:
      case 503:
      case 504:
        return new Error('服务器暂时不可用');
      default:
        return new Error(`请求失败 (${statusCode})`);
    }
  },
  
  /**
   * 判断是否可重试
   */
  isRetryable: (error: AxiosError): boolean => {
    // 网络错误可重试
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return true;
    }
    
    // 5xx错误可重试
    const status = error.response.status;
    return status >= 500 && status < 600;
  },
};

/**
 * 请求重试工具
 */
const retryHandler = {
  /**
   * 延迟函数
   */
  delay: (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  /**
   * 指数退避延迟计算
   */
  calculateDelay: (attempt: number, baseDelay: number = API_CONFIG.RETRY_DELAY): number => {
    return baseDelay * Math.pow(2, attempt - 1);
  },
  
  /**
   * 执行重试请求
   */
  execute: async <T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    maxRetries: number = API_CONFIG.RETRY_COUNT
  ): Promise<AxiosResponse<T>> => {
    let lastError: AxiosError;
    
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as AxiosError;
        
        // 最后一次尝试失败
        if (attempt > maxRetries) {
          break;
        }
        
        // 检查是否可重试
        if (!errorHandler.isRetryable(lastError)) {
          break;
        }
        
        // 计算延迟时间
        const delay = retryHandler.calculateDelay(attempt);
        
        console.warn(`API request failed (attempt ${attempt}), retrying in ${delay}ms...`, {
          error: lastError.message,
          status: lastError.response?.status,
        });
        
        // 延迟后重试
        await retryHandler.delay(delay);
      }
    }
    
    throw errorHandler.format(lastError);
  },
};

/**
 * 请求验证工具
 */
const validator = {
  /**
   * 验证手机号
   */
  phone: (phone: string, region: string = '+86'): boolean => {
    if (!phone) return false;
    
    // 根据地区验证手机号格式
    const phoneRegexMap: Record<string, RegExp> = {
      '+86': /^1[3-9]\d{9}$/,
      '+1': /^\d{10}$/,
      '+44': /^\d{10}$/,
    };
    
    const regex = phoneRegexMap[region] || phoneRegexMap['+86'];
    return regex.test(phone);
  },
  
  /**
   * 验证密码
   */
  password: (password: string): boolean => {
    return password && password.length >= 6;
  },
  
  /**
   * 验证验证码
   */
  code: (code: string): boolean => {
    return /^\d{6}$/.test(code);
  },
  
  /**
   * 验证地区代码
   */
  region: (region: string): boolean => {
    const validRegions = ['+86', '+1', '+44', '+81', '+82', '+852', '+853', '+886'];
    return validRegions.includes(region);
  },
};

// #endregion

// #region API实现

/**
 * 认证API类
 */
class AuthAPI {
  /**
   * 通用登录方法
   */
  async login(request: LoginRequest): Promise<LoginResponse> {
    // 参数验证
    if (!validator.phone(request.phone, request.region)) {
      throw new Error('手机号格式不正确');
    }
    
    if (!validator.region(request.region)) {
      throw new Error('地区代码不正确');
    }
    
    // 根据登录类型选择不同的端点
    let endpoint: string;
    const requestData: any = {
      phone: request.phone,
      region: request.region,
      deviceId: request.deviceId,
    };
    
    if (request.password) {
      // 密码登录
      if (!validator.password(request.password)) {
        throw new Error('密码长度至少6位');
      }
      endpoint = API_ENDPOINTS.PASSWORD_LOGIN;
      requestData.password = request.password;
    } else if (request.smsCode) {
      // 验证码登录
      if (!validator.code(request.smsCode)) {
        throw new Error('验证码格式不正确');
      }
      endpoint = API_ENDPOINTS.SMS_LOGIN;
      requestData.smsCode = request.smsCode;
    } else {
      throw new Error('请提供密码或验证码');
    }
    
    // 执行登录请求
    const response = await retryHandler.execute(
      () => apiClient.post<LoginResponse>(endpoint, requestData)
    );
    
    return response.data;
  }
  
  /**
   * 刷新令牌
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    if (!refreshToken) {
      throw new Error('刷新令牌不能为空');
    }
    
    const request: RefreshTokenRequest = { refreshToken };
    
    const response = await retryHandler.execute(
      () => apiClient.post<RefreshTokenResponse>(API_ENDPOINTS.REFRESH_TOKEN, request)
    );
    
    return response.data;
  }
  
  /**
   * 登出
   */
  async logout(request?: LogoutRequest): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>(API_ENDPOINTS.LOGOUT, request || {});
    return response.data;
  }
  
  /**
   * 检查用户是否存在
   */
  async checkUserExists(phone: string, region: string): Promise<CheckUserExistsResponse> {
    if (!validator.phone(phone, region)) {
      throw new Error('手机号格式不正确');
    }
    
    const request: CheckUserExistsRequest = { phone, region };
    
    const response = await apiClient.post<CheckUserExistsResponse>(
      API_ENDPOINTS.CHECK_USER_EXISTS,
      request
    );
    
    return response.data;
  }
  
  /**
   * 获取用户资料
   */
  async getUserProfile(): Promise<ApiResponse<UserInfo>> {
    const response = await apiClient.get<ApiResponse<UserInfo>>(API_ENDPOINTS.USER_PROFILE);
    return response.data;
  }
  
  /**
   * 发送登录验证码
   */
  async sendLoginCode(phone: string, region: string): Promise<SendCodeResponse> {
    if (!validator.phone(phone, region)) {
      throw new Error('手机号格式不正确');
    }
    
    const request: SendCodeRequest = {
      phone,
      region,
      type: 'login',
    };
    
    const response = await retryHandler.execute(
      () => apiClient.post<SendCodeResponse>(API_ENDPOINTS.SEND_LOGIN_CODE, request)
    );
    
    return response.data;
  }
  
  /**
   * 发送注册验证码
   */
  async sendRegisterCode(phone: string, region: string): Promise<SendCodeResponse> {
    if (!validator.phone(phone, region)) {
      throw new Error('手机号格式不正确');
    }
    
    const request: SendCodeRequest = {
      phone,
      region,
      type: 'register',
    };
    
    const response = await retryHandler.execute(
      () => apiClient.post<SendCodeResponse>(API_ENDPOINTS.SEND_REGISTER_CODE, request)
    );
    
    return response.data;
  }
  
  /**
   * 验证验证码
   */
  async verifyCode(phone: string, code: string, region: string): Promise<ApiResponse> {
    if (!validator.phone(phone, region)) {
      throw new Error('手机号格式不正确');
    }
    
    if (!validator.code(code)) {
      throw new Error('验证码格式不正确');
    }
    
    const request = {
      phone,
      code,
      region,
    };
    
    const response = await apiClient.post<ApiResponse>(API_ENDPOINTS.VERIFY_CODE, request);
    return response.data;
  }
  
  /**
   * 发送重置密码验证码
   */
  async sendResetPasswordCode(phone: string, region: string): Promise<SendCodeResponse> {
    if (!validator.phone(phone, region)) {
      throw new Error('手机号格式不正确');
    }
    
    const request: SendCodeRequest = {
      phone,
      region,
      type: 'reset',
    };
    
    const response = await retryHandler.execute(
      () => apiClient.post<SendCodeResponse>(API_ENDPOINTS.SEND_RESET_CODE, request)
    );
    
    return response.data;
  }
  
  /**
   * 验证重置密码验证码
   */
  async verifyResetCode(phone: string, code: string, region: string): Promise<ApiResponse> {
    if (!validator.phone(phone, region)) {
      throw new Error('手机号格式不正确');
    }
    
    if (!validator.code(code)) {
      throw new Error('验证码格式不正确');
    }
    
    const request = {
      phone,
      code,
      region,
    };
    
    const response = await apiClient.post<ApiResponse>(API_ENDPOINTS.VERIFY_RESET_CODE, request);
    return response.data;
  }
  
  /**
   * 重置密码
   */
  async resetPassword(phone: string, code: string, newPassword: string, region: string): Promise<ApiResponse> {
    if (!validator.phone(phone, region)) {
      throw new Error('手机号格式不正确');
    }
    
    if (!validator.code(code)) {
      throw new Error('验证码格式不正确');
    }
    
    if (!validator.password(newPassword)) {
      throw new Error('密码长度至少6位');
    }
    
    const request = {
      phone,
      code,
      newPassword,
      region,
    };
    
    const response = await retryHandler.execute(
      () => apiClient.post<ApiResponse>(API_ENDPOINTS.RESET_PASSWORD, request)
    );
    
    return response.data;
  }
}

// #endregion

// #region 实例和导出

/**
 * 认证API实例
 */
export const authApi = new AuthAPI();

/**
 * 导出类型
 */
export type {
    ApiResponse, CheckUserExistsRequest,
    CheckUserExistsResponse, LoginRequest,
    LoginResponse, LogoutRequest, RefreshTokenRequest,
    RefreshTokenResponse, SendCodeRequest,
    SendCodeResponse
};

/**
 * 导出工具函数
 */
    export {
        API_CONFIG, API_ENDPOINTS, errorHandler,
        retryHandler,
        validator
    };

// #endregion

// #region Mock数据（开发测试用）

/**
 * Mock API响应（开发环境使用）
 */
export const mockAuthApi = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟登录成功
    return {
      success: true,
      data: {
        token: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        userInfo: {
          id: 'mock_user_id',
          phone: request.phone,
          nickname: '测试用户',
          avatar: '',
          verified: true,
          createdAt: new Date().toISOString(),
        },
        expiresIn: 3600, // 1小时
      },
      message: '登录成功',
    };
  },
  
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: {
        token: 'mock_new_access_token_' + Date.now(),
        refreshToken: 'mock_new_refresh_token_' + Date.now(),
        expiresIn: 3600,
      },
      message: '令牌刷新成功',
    };
  },
  
  async sendLoginCode(phone: string, region: string): Promise<SendCodeResponse> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      data: {
        codeId: 'mock_code_id_' + Date.now(),
        expiresIn: 300, // 5分钟
        nextSendTime: 60, // 60秒后可重发
      },
      message: '验证码发送成功',
    };
  },
  
  async sendResetPasswordCode(phone: string, region: string): Promise<SendCodeResponse> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      data: {
        codeId: 'mock_code_id_' + Date.now(),
        expiresIn: 300, // 5分钟
        nextSendTime: 60, // 60秒后可重发
      },
      message: '重置密码验证码发送成功',
    };
  },
  
  async verifyResetCode(phone: string, code: string, region: string): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: {},
      message: '验证码验证成功',
    };
  },
  
  async resetPassword(phone: string, code: string, newPassword: string, region: string): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      data: {},
      message: '密码重置成功',
    };
  },
};

// #endregion
