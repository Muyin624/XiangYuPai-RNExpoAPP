/**
 * SkillsEditScreen - 技能编辑路由适配器
 * 
 * Features:
 * - 添加/编辑技能
 * - 使用假数据（前端模式）
 */

import SkillsEditPage from '@/src/features/Profile/ProfileEditPage/SkillsEditPage';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function SkillsEditScreen() {
  const params = useLocalSearchParams<{ skillId?: string }>();
  
  return <SkillsEditPage skillId={params.skillId} />;
}

