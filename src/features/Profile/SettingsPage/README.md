# SettingsPage - 设置页面

## 📋 功能概述

设置页面提供用户账号相关的配置功能。

## ✨ 主要功能

### 1. 设置菜单
- **修改密码**: 修改登录密码
- **微信绑定**: 绑定/解绑微信账号
- **支付其他密码**: 其他支付方式密码设置
- **支付密码**: 设置6位数字支付密码

### 2. 账号管理
- **退出账号**: 退出当前登录账号

## 🎨 UI 特性

- 清晰的菜单列表布局
- 绑定状态显示（已绑定/未绑定）
- 醒目的退出账号按钮
- 统一的导航栏样式

## 🔗 路由配置

```typescript
// app/profile/_layout.tsx
<Stack.Screen 
  name="settings" 
  options={{ 
    headerShown: false,
    animation: 'slide_from_right',
  }} 
/>
```

## 📱 使用方式

```typescript
// 从我的页面导航到设置
router.push('/profile/settings');
```

## 🔄 状态管理

使用 `useAuthStore` 进行登出操作：

```typescript
const logout = useAuthStore((state) => state.logout);
```

## 🎯 待实现功能

- [ ] 修改密码功能
- [ ] 微信绑定功能
- [ ] 支付其他密码功能
- [x] 支付密码功能

## 📝 注意事项

1. 退出账号需要二次确认
2. 支付密码页面已实现，其他功能显示"开发中"提示
3. 绑定状态需要从后端API获取

