# OtherUserProfilePage - 个人主页页面

> 完整的个人主页页面，用于查看其他用户的个人信息和动态

## 📋 组件概述

### 功能特性

- ✅ 完整的页面布局（非模态框）
- ✅ 顶部导航（返回/昵称/分享）
- ✅ 用户信息展示（头像/昵称/认证/在线状态）
- ✅ 统计数据（关注/粉丝/获赞）
- ✅ Tab切换（动态/资料/技能）
- ✅ 动态列表展示
- ✅ 个人资料展示
- ✅ 技能列表展示
- ✅ 底部操作按钮（关注/发消息）
- ✅ 认证系统集成（guest mode支持）
- ✅ 刷新支持
- ✅ 加载和错误状态

### 架构模式

**🔵 嵌套化架构** - 复杂组件

- **UI层次**: 3层（简化后）
- **功能模块**: 3个核心模块
- **子组件数**: 3个（BackgroundHeaderArea, TabArea, ContentArea）

## 🏗️ 架构结构

```
OtherUserProfilePage/                  # 根目录
├── index.tsx                          # 主组件 - 组合所有子组件
├── types.ts                           # 类型定义 - 所有类型
├── constants.ts                       # 常量配置 - 颜色/尺寸/Tab
├── useOtherUserProfilePage.ts         # 主状态管理 - 核心逻辑
├── onOtherUserProfileShare.ts         # 分享事件处理
├── navigateToMessage.ts               # 消息导航
├── README.md                          # 本文档
├── ARCHITECTURE_DESIGN.md             # 架构设计文档（完整设计规范）
│
├── BackgroundHeaderArea/              # 背景头图区域 ⭐
│   ├── index.tsx                      # 大背景图 + 用户信息 + 关注按钮
│   ├── MODERNIZATION_COMPLETE.md      # 现代化改进报告
│   └── USAGE_GUIDE.md                 # 使用指南
│
├── TabArea/                           # Tab切换区域
│   └── index.tsx                      # 动态/资料/技能（吸顶效果）
│
└── ContentArea/                       # 内容展示区域
    └── index.tsx                      # 动态列表/资料信息/技能服务卡片
```

**注：** 已删除未使用的组件（ActionButtonsArea, HeaderArea, ProfileInfoArea, StatsArea, UserInfoCard），采用更简洁的三组件架构。

## 📖 使用方式

### 基础使用

```typescript
import OtherUserProfilePage from '@/src/features/Profile/OtherUserProfilePage';

// 在页面路由中使用
<OtherUserProfilePage userId="123" />
```

### 路由配置

```typescript
// app/profile/[userId].tsx
import OtherUserProfilePage from '@/src/features/Profile/OtherUserProfilePage';
import { useLocalSearchParams } from 'expo-router';

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  
  return <OtherUserProfilePage userId={userId} />;
}
```

### 导航跳转

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// 跳转到用户主页
router.push({
  pathname: '/profile/[userId]',
  params: { userId: '123' },
});
```

## 🎨 组件结构

### 页面布局

```
┌─────────────────────────────────┐
│ 🌄 BackgroundHeaderArea         │ ← 大背景头图区域（500px）⭐
│    ┌─────────────────────────┐  │
│    │ [←]           [关注 ✓]  │  │ 顶部按钮悬浮
│    │                         │  │
│    │    背景图片或渐变色       │  │
│    │                         │  │
│    │                         │  │
│    │                         │  │
│    │  昵称12345  [女孩]      │  │ ← 用户信息叠加
│    │  [真人认证] [大神]      │  │ ← 认证标签
│    │  📅 可预约 📍3.2km 102粉丝│ │ ← 状态信息
│    └─────────────────────────┘  │
├─────────────────────────────────┤
│ TabArea                         │ ← Tab导航（吸顶）
│   [动态]  [资料]  [技能]        │
├─────────────────────────────────┤
│                                 │
│ ContentArea                     │ ← Tab对应内容
│   根据activeTab显示不同内容     │
│   - 动态: 瀑布流卡片列表         │
│   - 资料: 详细资料卡片           │
│   - 技能: 服务卡片列表           │
│                                 │
│                                 │
├─────────────────────────────────┤
│ 底部操作按钮（内嵌在 index.tsx） │ ← 固定底部 + 阴影
│ [  💬 私信  ]                   │
└─────────────────────────────────┘
```

**✨ 新架构特点：**
- BackgroundHeaderArea 集成了用户信息、认证标签、关注按钮
- 移除了独立的 UserInfoCard、StatsArea、ActionButtonsArea
- 更简洁的三组件架构，减少了组件层级

## 🔄 状态管理

### 核心状态

```typescript
{
  userInfo: OtherUserInfo | null,     // 用户信息
  activeTab: TabType,                  // 当前Tab
  isFollowing: boolean,                // 是否已关注
  loading: boolean,                    // 加载中
  error: string | null,                // 错误信息
  actionLoading: boolean,              // 操作加载中
  refreshing: boolean,                 // 刷新中
  isAuthenticated: boolean,            // 是否已登录
}
```

### 核心操作

```typescript
{
  handleTabChange: (tab: TabType) => void,        // 切换Tab
  handleFollowToggle: () => Promise<void>,        // 关注/取关
  handleRefresh: () => Promise<void>,             // 刷新
}
```

## 🔐 认证系统

### Guest Mode (游客模式)

**游客可以**:
- ✅ 查看用户信息
- ✅ 查看动态列表
- ✅ 查看资料信息
- ✅ 查看技能列表
- ✅ 分享用户主页

**游客不可以**:
- ❌ 关注用户 → 显示登录提示
- ❌ 发送消息 → 显示登录提示
- ❌ 查看私密信息（微信等）

### 登录后功能

```typescript
// 关注功能
if (!requireAuth({ action: '关注用户' })) return;
await followUser(userId);

// 发消息功能
if (!requireAuth({ action: '发送消息' })) return;
navigateToMessage(router, userId, nickname);
```

## 🎯 核心组件说明

### 1. BackgroundHeaderArea ⭐（现代化集成组件）

**完整功能：**
- 🖼️ 大背景图片或渐变（500px高度）
- 🔙 返回按钮（左上角，半透明背景）
- 💜 关注按钮（右上角，3种状态支持）
- 👤 用户昵称 + 性别标签（"女孩"/"男生"）
- 🏆 认证标签系统（真人认证/大神/VIP + 自定义标签）
- 📍 状态信息（可预约/距离/粉丝数）
- 🎨 真实渐变遮罩（LinearGradient）

**详细文档：**
- [MODERNIZATION_COMPLETE.md](./BackgroundHeaderArea/MODERNIZATION_COMPLETE.md)
- [USAGE_GUIDE.md](./BackgroundHeaderArea/USAGE_GUIDE.md)

### 2. TabArea

**功能：**
- 三个Tab：动态/资料/技能
- 紫色选中指示器（3px底部线条）
- 滚动时吸顶效果（stickyHeaderIndices）
- 平滑切换动画

### 3. ContentArea

**功能：**
- **动态Tab**: 瀑布流卡片列表（2列布局）+ 下拉刷新 + 空状态
- **资料Tab**: 详细资料卡片（基本信息/标签/简介/联系方式）
- **技能Tab**: 服务卡片列表（服务信息/价格/标签/认证）+ 下拉刷新
- 支持加载状态、错误状态、空状态的完整处理

## 📊 数据流

```
组件挂载
    ↓
loadUserProfile(userId)
    ↓
Profile Store
    ↓
profileApi.getUserProfile(userId)
    ↓
Backend: GET /xypai-user/api/v2/user/profile/{userId}
    ↓
返回 UserProfileVO (42 fields)
    ↓
数据转换: transformUserProfileVOToProfile
    ↓
更新 userInfo state
    ↓
UI 渲染更新
```

## 🔧 配置项

### 颜色配置
```typescript
COLORS = {
  primary: '#9333EA',      // 主色调
  success: '#10B981',      // 在线状态
  error: '#EF4444',        // 错误提示
  blue: '#3B82F6',         // 男性
  pink: '#EC4899',         // 女性
  // ... 更多颜色
}
```

### 尺寸配置
```typescript
SIZES = {
  avatarLarge: 100,        // 大头像
  badgeSize: 20,           // 徽章尺寸
  buttonHeight: 48,        // 按钮高度
  // ... 更多尺寸
}
```

### Tab配置
```typescript
TAB_ITEMS = [
  { key: 'dynamic', label: '动态' },
  { key: 'profile', label: '资料' },
  { key: 'skills', label: '技能' },
]
```

## 🚀 架构改进历程

### ✅ v2.0 已完成（现代化架构）
- [x] ⭐ BackgroundHeaderArea 现代化升级
  - [x] 真实渐变遮罩效果（LinearGradient）
  - [x] 完整的性别标签系统（"女孩"/"男生"）
  - [x] 完整的认证标签系统（图标+文字）
  - [x] 可扩展的自定义标签系统
  - [x] 增强的关注按钮状态（3种状态）
  - [x] 集成用户信息展示
- [x] 🧹 删除未使用组件
  - [x] 移除 ActionButtonsArea（功能集成到 index.tsx）
  - [x] 移除 HeaderArea（被 BackgroundHeaderArea 替代）
  - [x] 移除 ProfileInfoArea（被 BackgroundHeaderArea 替代）
  - [x] 移除 StatsArea（粉丝数集成到 BackgroundHeaderArea）
  - [x] 移除 UserInfoCard（被 BackgroundHeaderArea 替代）
- [x] Tab吸顶效果
- [x] 技能服务卡片设计
- [x] 认证系统集成（AuthGuard）
- [x] 下拉刷新支持

### 📋 待完成功能
- [ ] 动态列表API接入（瀑布流布局）
- [ ] 技能服务列表API接入
- [ ] 分页加载（上拉加载更多）
- [ ] 关注列表页面
- [ ] 粉丝列表页面
- [ ] 原生分享功能（React Native Share）
- [ ] 图片预览功能
- [ ] 视频播放功能
- [ ] 服务预订功能（点击技能卡片跳转）
- [ ] 实时在线状态（WebSocket）

## 🐛 已知问题

- 动态列表暂时为空状态（待接入API）
- 技能服务列表暂时显示占位数据（待接入API）
- 分享功能使用Alert（待接入原生分享）
- 背景头图暂时显示默认紫色渐变（待接入用户背景图API）

**✅ 已解决：**
- ~~组件冗余问题~~ - 已删除5个未使用的组件
- ~~渐变效果问题~~ - 已使用 LinearGradient 实现真实渐变
- ~~标签系统不完善~~ - 已实现完整的标签系统（性别/认证/自定义）

## 📝 注意事项

1. **必须传入 userId**  
   组件需要 userId 参数才能正常工作

2. **认证系统集成**  
   已集成 AuthGuard，自动处理游客和登录用户

3. **Profile Store 依赖**  
   依赖 `stores/profileStore.ts` 和 `services/api/profileApi.ts`

4. **Tab 内容动态加载**  
   切换Tab时应该触发对应内容的加载

5. **刷新功能**  
   支持下拉刷新，会重新加载用户信息

## 📚 相关文档

- [UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md](../../.cursor/rules/UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md) - 架构标准
- [Profile API Integration Guide](../API_INTEGRATION_GUIDE.md) - API集成指南
- [AuthGuard Documentation](../../utils/auth/AuthGuard.tsx) - 认证系统

---

**版本**: 2.1.0 🎉  
**创建日期**: 2025-10-27  
**最后更新**: 2025-10-28  
**架构标准**: 嵌套化架构（简化版 - 3组件）  
**设计参考**: 对方主页原型图 + 纯结构架构图标准模板  
**状态**: ✅ 核心功能完成 | ✅ 架构优化完成 | 🚧 API接入进行中  
**改进**: 已删除5个未使用组件，实现更简洁的架构设计

