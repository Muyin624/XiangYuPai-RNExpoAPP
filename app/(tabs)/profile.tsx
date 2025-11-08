/**
 * ProfileScreen - 我的页面路由
 * 
 * Features:
 * - 显示"我的"页面（菜单式布局）
 * - 用户可以从这里进入"个人中心"查看详细资料
 */

import MyPage from '@/src/features/Profile/MyPage';
import React from 'react';

export default function ProfileScreen() {
  return <MyPage />;
}
