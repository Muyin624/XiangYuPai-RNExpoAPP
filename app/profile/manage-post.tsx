/**
 * Manage Post Screen - 接单/管理发布页面
 * 
 * Route: /profile/manage-post
 * 
 * Features:
 * - 显示发布的详细信息
 * - 编辑发布内容
 * - 删除发布
 * - 管理接单状态
 */

import { ErrorBoundary } from '@/src/components';
import ManagePostPage from '@/src/features/Profile/ManagePostPage';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function ManagePostScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ErrorBoundary>
        <ManagePostPage postId={postId || ''} />
      </ErrorBoundary>
    </>
  );
}

