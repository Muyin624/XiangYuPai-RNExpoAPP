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
      {/* 个人中心 - 当前用户详情页 */}
      <Stack.Screen 
        name="user-profile" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
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
      
      {/* 我的发布 */}
      <Stack.Screen 
        name="my-posts" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 管理发布/接单页面 */}
      <Stack.Screen 
        name="manage-post" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 我的订单列表 */}
      <Stack.Screen 
        name="my-orders" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 订单详情 */}
      <Stack.Screen 
        name="order-detail" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 我的购买列表 */}
      <Stack.Screen 
        name="my-purchases" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 购买订单详情 */}
      <Stack.Screen 
        name="purchase-detail" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 我的报名列表 */}
      <Stack.Screen 
        name="my-signups" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 报名详情 */}
      <Stack.Screen 
        name="signup-detail" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 状态管理 */}
      <Stack.Screen 
        name="my-status" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 钱包主页 */}
      <Stack.Screen 
        name="wallet" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 钱包提现 */}
      <Stack.Screen 
        name="wallet-withdraw" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 钱包提现成功 */}
      <Stack.Screen 
        name="wallet-withdraw-success" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 钱包账单明细 */}
      <Stack.Screen 
        name="wallet-bills" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 金币主页 */}
      <Stack.Screen 
        name="coins" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 金币充值 */}
      <Stack.Screen 
        name="coins-recharge" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 金币充值成功 */}
      <Stack.Screen 
        name="coins-recharge-success" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 金币明细 */}
      <Stack.Screen 
        name="coins-bills" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 设置 */}
      <Stack.Screen 
        name="settings" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 支付密码 */}
      <Stack.Screen 
        name="payment-password" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 客服 */}
      <Stack.Screen 
        name="customer-service" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      
      {/* 达人认证 */}
      <Stack.Screen 
        name="expert-verification" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
    </Stack>
  );
}

