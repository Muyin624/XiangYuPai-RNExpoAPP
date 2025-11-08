/**
 * PersonalCenterPage - 个人中心页面
 * 
 * 这是原来的用户详情页面，现在从"我的"页面的"个人中心"菜单进入
 * 
 * 功能：
 * - 用户资料展示
 * - 四Tab切换（动态/收藏/点赞/资料）
 * - 社交数据展示
 * - 背景头图展示
 */

import React from 'react';
import MainPage from '../MainPage';

export interface PersonalCenterPageProps {
  userId?: string;
}

const PersonalCenterPage: React.FC<PersonalCenterPageProps> = ({ userId }) => {
  // 直接使用原来的MainPage组件
  return <MainPage userId={userId} />;
};

export default PersonalCenterPage;

