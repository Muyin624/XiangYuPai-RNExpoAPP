// #region 1. File Banner & TOC
/**
 * Profile页面组 - 个人主页模块主文件
 * 
 * 职责：
 * - 页面组导航协调
 * - 状态初始化
 * - 子页面统一包装
 * 
 * TOC (快速跳转):
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Schema
 * [4] Constants & Config
 * [5] Utils & Helpers
 * [6] State Management
 * [7] Domain Logic
 * [8] UI Components & Rendering
 * [9] Exports
 */
// #endregion

// #region 2. Imports
import React from 'react';

// 类型和常量
import type { ProfileProps } from './types';

// 主页面
import MainPage from './MainPage';
// #endregion

// #region 3. Types & Schema
// (使用types.ts中的ProfileProps)
// #endregion

// #region 4. Constants & Config
// (使用constants.ts中的配置)
// #endregion

// #region 5. Utils & Helpers
// (暂无工具函数)
// #endregion

// #region 6. State Management
/**
 * Profile页面组状态管理
 */
const useProfileState = (props: ProfileProps) => {
  return {
    userId: props.userId,
    initialTab: props.initialTab || 'dynamic',
  };
};
// #endregion

// #region 7. Domain Logic
/**
 * Profile页面组业务逻辑
 */
const useProfileLogic = (props: ProfileProps) => {
  const state = useProfileState(props);
  
  return {
    ...state,
  };
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * Profile页面组主组件
 */
const Profile: React.FC<ProfileProps> = (props) => {
  const { userId, initialTab } = useProfileLogic(props);
  
  return (
    <MainPage 
      userId={userId}
      initialTab={initialTab}
    />
  );
};
// #endregion

// #region 9. Exports
export default Profile;
export type { ProfileProps } from './types';

// 导出子页面
export { default as CollectionPage } from './CollectionPage';
export { default as DynamicPage } from './DynamicPage';
export { default as FollowListPage } from './FollowListPage';
export { default as LikesPage } from './LikesPage';
export { default as MainPage } from './MainPage';
export { default as MyPage } from './MyPage';
export { default as PersonalCenterPage } from './PersonalCenterPage';
export { default as PostDetailPage } from './PostDetailPage';
export { default as ProfileEditPage } from './ProfileEditPage';
export { default as SkillsEditPage } from './ProfileEditPage/SkillsEditPage';
export { default as ProfileInfoPage } from './ProfileInfoPage';
// #endregion

