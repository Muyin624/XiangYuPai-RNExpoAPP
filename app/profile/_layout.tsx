/**
 * Profile Stack Layout - 个人资料路由组配置
 * 
 * 功能：
 * - 配置个人资料相关页面的导航栏
 * - 统一管理标题和样式
 */

import { Stack } from 'expo-router';
import React from 'react';

export default function ProfileLayout() {
  return (
    <Stack>
      {/* 用户主页详情 - 查看他人资料 */}
      <Stack.Screen 
        name="[userId]" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 编辑个人资料主页 */}
      <Stack.Screen 
        name="edit" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 编辑字段页面（昵称、简介等） */}
      <Stack.Screen 
        name="edit-field" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 编辑微信号 */}
      <Stack.Screen 
        name="edit-wechat" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 选择职业 */}
      <Stack.Screen 
        name="select-occupation" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 添加技能 */}
      <Stack.Screen 
        name="skills-edit" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 关注列表 */}
      <Stack.Screen 
        name="following" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 粉丝列表 */}
      <Stack.Screen 
        name="followers" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
    </Stack>
  );
}

