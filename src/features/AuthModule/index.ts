/**
 * AuthModule - 认证模块统一导出
 * 
 * 提供认证模块的所有组件、类型、工具函数和API的统一导出入口
 */

// #region 主要页面组件
export { default as ForgotPasswordPage } from './ForgotPasswordPage';
export { default as LoginMainPage } from './LoginMainPage';

// #endregion

// #region 状态管理
export { authSelectors, useAuthStore } from './stores/authStore';
export type { AuthActions, AuthState } from './stores/authStore';

// #endregion

// #region API服务
export { authApi, mockAuthApi } from './api/authApi';
export type {
  ApiResponse, LoginRequest,
  LoginResponse,
  SendCodeRequest,
  SendCodeResponse
} from './api/authApi';

// #endregion

// #region 类型定义
export type {
  ActionButtonAreaProps, AgreementAreaProps, AuthInputAreaProps,
  // 基础类型
  AuthMode, AuxiliaryAreaProps, CountdownState, ErrorState, LoadingState, LoginFormData,
  // 组件Props类型
  LoginMainPageProps, PhoneInputAreaProps, RegionInfo, TopWelcomeAreaProps, UseLoginPageLogicReturn,
  // Hook返回类型
  UseLoginPageStateReturn, UserInfo, ValidationState
} from './LoginMainPage/types';

// #endregion

// #region 常量配置
export {
  AUTH_COLORS,
  AUTH_ROUTES, COMMON_REGIONS, DEFAULT_REGION, ERROR_MESSAGES, LOGIN_CONSTANTS, MODAL_ROUTES, VALIDATION_RULES
} from './LoginMainPage/constants';

// #endregion

// #region 样式工具
export {
  colorUtils, mediaQuery, responsive, safeArea, styleUtils
} from './LoginMainPage/styles';

// #endregion

// #region Hooks
export {
  useAuthInitialization,
  useAuthStateListener,
  useAutoLoginCheck,
  useRouteGuard
} from './hooks';

export type {
  InitializationState, RouteGuardState, UseAuthInitializationReturn, UseRouteGuardReturn
} from './hooks';

// #endregion

// #region 配置
export { canAccessAnonymously, getTabLoginPrompt, isPublicRoute, PROTECTED_ROUTES, PUBLIC_ROUTES, ROUTE_WHITELIST_CONFIG, routeGuard, SEMI_PUBLIC_ROUTES, TAB_ACCESS_CONTROL, tabRequiresAuth } from './config';

// #endregion

// #region 模块信息
export const MODULE_INFO = {
  name: 'AuthModule',
  version: '1.0.0',
  description: '探店APP认证模块 - 提供完整的用户认证功能',
  features: [
    '密码登录',
    '验证码登录',
    '密码重置流程',
    '用户注册',
    '自动登录',
    '生物识别认证',
    '多地区支持',
    '安全令牌管理',
  ],
  dependencies: [
    'zustand',
    'expo-secure-store',
    '@react-native-async-storage/async-storage',
    'react-native-safe-area-context',
  ],
} as const;

// #endregion
