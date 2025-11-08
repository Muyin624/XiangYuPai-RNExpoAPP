/**
 * Profile Edit Field Route
 * 路由: /profile/edit-field
 * 
 * 参数:
 * - fieldKey: 字段键名 (nickname, intro, occupation, wechat)
 * - fieldLabel: 字段显示名称
 * - fieldValue: 当前值
 */

import TextFieldEditPage from '@/src/features/Profile/ProfileEditPage/TextFieldEditPage';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function EditFieldScreen() {
  const params = useLocalSearchParams<{
    fieldKey: string;
    fieldLabel: string;
    fieldValue: string;
  }>();

  return (
    <TextFieldEditPage
      fieldKey={params.fieldKey || ''}
      fieldLabel={params.fieldLabel || ''}
      fieldValue={params.fieldValue || ''}
    />
  );
}

