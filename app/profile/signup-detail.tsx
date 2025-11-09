/**
 * Signup Detail Screen - 报名详情页面
 * 
 * Route: /profile/signup-detail?signupId={signupId}
 * 
 * Features:
 * - 根据报名状态显示不同内容
 * - 待确认：显示等待确认状态
 * - 已确认：显示见面码、活动信息
 * - 已完成：显示完成信息、评价
 * - 已取消：显示取消原因
 * - 见面码输入功能
 */

import SignupDetailPage from '@/src/features/Profile/SignupDetailPage';
import React from 'react';

export default function SignupDetailScreen() {
  return <SignupDetailPage />;
}

