# MySignupsPage - 我的报名列表页面

## 📋 模块概述

我的报名列表页面，展示用户报名参加的所有公司发布的活动/订单。

## ✨ 功能特性

### 核心功能
- ✅ Tab切换（全部/待确认/已确认/已完成/已取消）
- ✅ 报名记录列表展示
- ✅ 报名状态筛选
- ✅ 跳转报名详情
- ✅ 下拉刷新
- ✅ 见面码显示（已确认状态）

### 报名状态
- 🟡 **待确认** - 等待主办方确认报名
- 🔵 **已确认** - 主办方已确认，待参加活动
- 🟢 **已完成** - 活动已完成，可评价
- ⚪ **已取消** - 报名已取消

## 📁 文件结构

```
MySignupsPage/
├── index.tsx           # 主组件（列表页面）
├── types.ts            # TypeScript类型定义
├── constants.ts        # 常量配置
└── README.md          # 本文档
```

## 🔄 数据流

```
用户操作 → MySignupsPage → SignupDetailPage
         ↓
    报名列表（显示公司信息）
         ↓
    点击报名卡片 → 传递报名ID和状态 → 详情页
```

## 🎨 UI组件

### TabBar
- 全部/待确认/已确认/已完成/已取消
- 选中状态高亮显示

### SignupCard
- 报名编号 + 状态标签
- 公司Logo + 公司名称
- 活动名称 + 活动类型
- 活动地点 + 活动时间
- 参与人数统计
- 见面码显示（已确认状态）

### EmptyState
- 空状态提示

## 🔗 路由配置

- **入口**: `/profile/my-signups`
- **跳转**: `/profile/signup-detail?signupId={id}&status={status}`

## 📝 使用示例

```tsx
import MySignupsPage from '@/src/features/Profile/MySignupsPage';

export default function MySignupsScreen() {
  return <MySignupsPage />;
}
```

## 🚀 待实现功能

- [ ] 接入真实API
- [ ] 报名搜索功能
- [ ] 报名筛选（按时间、地点等）
- [ ] 日历视图
- [ ] 批量操作
- [ ] 分享功能

## 📌 注意事项

1. **活动类型**: 公司发布的活动/订单，非个人服务
2. **见面码**: 确认后生成6位数字见面码
3. **状态传递**: 跳转详情页时传递报名状态，确保状态一致
4. **时间显示**: 显示相对时间（X天后、X小时后）
5. **模拟数据**: 当前使用模拟数据，需替换为真实API

## 🔧 技术栈

- React Native
- Expo Router
- TypeScript
- React Hooks (useState, useCallback)
- FlatList (列表渲染)
- RefreshControl (下拉刷新)

