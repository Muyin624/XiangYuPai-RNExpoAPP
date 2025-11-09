# MyPurchasesPage - 我的购买列表页面（客户视角）

## 📋 模块概述

我的购买列表页面，展示用户作为**客户**下单购买的所有订单。

## ✨ 功能特性

### 核心功能
- ✅ Tab切换（全部/待接单/进行中/已完成/已取消）
- ✅ 购买订单列表展示
- ✅ 订单状态筛选
- ✅ 跳转订单详情
- ✅ 下拉刷新

### 订单状态
- 🟡 **待接单** - 等待服务提供者接单
- 🔵 **已接单** - 服务提供者已接单，待开始
- 🟣 **进行中** - 服务正在进行
- 🟢 **已完成** - 服务已完成，可评价
- ⚪ **已取消** - 订单已取消

## 📁 文件结构

```
MyPurchasesPage/
├── index.tsx           # 主组件（列表页面）
├── types.ts            # TypeScript类型定义
├── constants.ts        # 常量配置
└── README.md          # 本文档
```

## 🔄 数据流

```
用户操作 → MyPurchasesPage → PurchaseDetailPage
         ↓
    订单列表（显示服务提供者信息）
         ↓
    点击订单卡片 → 传递订单ID和状态 → 详情页
```

## 🎨 UI组件

### TabBar
- 全部/待接单/进行中/已完成/已取消
- 选中状态高亮显示

### PurchaseCard
- 订单号 + 状态标签
- 服务提供者头像 + 昵称 + 性别
- 技能名称
- 单价 × 数量
- 创建时间
- 合计金额
- 快捷操作按钮

### EmptyState
- 空状态提示

## 🔗 路由配置

- **入口**: `/profile/my-purchases`
- **跳转**: `/profile/purchase-detail?orderId={id}&status={status}`

## 📝 使用示例

```tsx
import MyPurchasesPage from '@/src/features/Profile/MyPurchasesPage';

export default function MyPurchasesScreen() {
  return <MyPurchasesPage />;
}
```

## 🚀 待实现功能

- [ ] 接入真实API
- [ ] 订单搜索功能
- [ ] 订单筛选（按时间、金额等）
- [ ] 订单删除功能
- [ ] 批量操作

## 📌 注意事项

1. **角色视角**: 客户视角，显示服务提供者信息
2. **状态传递**: 跳转详情页时传递订单状态，确保状态一致
3. **模拟数据**: 当前使用模拟数据，需替换为真实API
4. **性能优化**: 列表较长时考虑虚拟化滚动

## 🔧 技术栈

- React Native
- Expo Router
- TypeScript
- React Hooks (useState, useCallback)
- FlatList (列表渲染)
- RefreshControl (下拉刷新)

