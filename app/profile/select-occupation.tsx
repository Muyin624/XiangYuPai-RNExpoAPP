/**
 * Profile Select Occupation Route
 * 路由: /profile/select-occupation
 * 
 * 参数:
 * - currentOccupations: 当前已选职业（JSON字符串）
 */

import OccupationSelectPage from '@/src/features/Profile/ProfileEditPage/OccupationSelectPage';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function SelectOccupationScreen() {
  const params = useLocalSearchParams<{
    currentOccupations?: string;
  }>();

  // 解析当前职业列表
  let currentOccupations: string[] = [];
  if (params.currentOccupations) {
    try {
      currentOccupations = JSON.parse(params.currentOccupations);
    } catch (e) {
      console.error('解析职业列表失败:', e);
    }
  }

  return (
    <OccupationSelectPage currentOccupations={currentOccupations} />
  );
}

