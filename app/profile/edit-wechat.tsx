/**
 * Profile Edit Wechat Route
 * 路由: /profile/edit-wechat
 * 
 * 参数:
 * - currentWechat: 当前微信号
 * - wechatLocked: 微信锁定状态
 */

import WechatEditPage from '@/src/features/Profile/ProfileEditPage/WechatEditPage';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function EditWechatScreen() {
  const params = useLocalSearchParams<{
    currentWechat?: string;
    wechatLocked?: string;
  }>();

  return (
    <WechatEditPage
      currentWechat={params.currentWechat}
      wechatLocked={params.wechatLocked === 'true'}
    />
  );
}

