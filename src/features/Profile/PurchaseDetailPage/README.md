# PurchaseDetailPage - 购买订单详情页面（客户视角）

## 📋 模块概述

购买订单详情页面，展示用户作为**客户**下单购买的订单详细信息，根据订单状态显示不同的内容和操作。

## ✨ 功能特性

### 核心功能
- ✅ 根据订单状态显示不同内容
- ✅ 订单基本信息展示
- ✅ 服务提供者信息展示
- ✅ 订单时间轴
- ✅ 状态相关操作

### 状态功能

#### 🟡 待接单 (Pending)
- 显示等待接单状态
- 自动取消倒计时（30分钟）
- 取消订单按钮
- 联系客服按钮

#### 🔵 已接单 / 🟣 进行中 (Accepted / In Progress)
- 显示服务提供者联系方式（手机号、微信号）
- 联系服务提供者按钮
- 服务进度提示

#### 🟢 已完成 (Completed)
- 星级评分（1-5星）
- 文字评价（选填，最多200字）
- 提交评价按钮
- 再来一单按钮
- 显示已提交的评价

#### ⚪ 已取消 (Cancelled)
- 显示取消原因
- 显示取消时间

## 📁 文件结构

```
PurchaseDetailPage/
├── index.tsx                      # 主组件
├── types.ts                       # TypeScript类型定义
├── PendingPurchaseArea/          # 待接单状态组件
│   └── index.tsx
├── InProgressPurchaseArea/       # 进行中状态组件
│   └── index.tsx
├── CompletedPurchaseArea/        # 已完成状态组件
│   └── index.tsx
└── README.md                     # 本文档
```

## 🔄 数据流

```
MyPurchasesPage → PurchaseDetailPage
                       ↓
              接收 orderId + status
                       ↓
              加载订单详情数据
                       ↓
         根据状态渲染对应的子组件
```

## 🎨 UI组件

### 主组件 (PurchaseDetailPage)
- 顶部导航栏
- 订单状态卡片
- 状态区域（动态渲染）
- 订单信息卡片
- 订单时间轴

### PendingPurchaseArea
- 等待接单图标
- 倒计时显示
- 取消订单 / 联系客服按钮
- 温馨提示

### InProgressPurchaseArea
- 服务进行中图标
- 联系方式（手机号、微信号）
- 联系服务提供者按钮
- 温馨提示

### CompletedPurchaseArea
- 完成图标
- 星级评分组件（可交互）
- 评价输入框（多行文本）
- 提交评价 / 再来一单按钮
- 温馨提示

### OrderTimeline
- 时间轴展示
- 订单关键节点
- 时间戳显示

## 🔗 路由配置

- **入口**: `/profile/purchase-detail?orderId={id}&status={status}`
- **返回**: `router.back()`

## 📝 使用示例

```tsx
import PurchaseDetailPage from '@/src/features/Profile/PurchaseDetailPage';

export default function PurchaseDetailScreen() {
  return <PurchaseDetailPage />;
}
```

## 🔧 核心逻辑

### 状态判断
```typescript
// 待接单
if (purchaseDetail.status === 'pending') {
  return <PendingPurchaseArea />;
}

// 已接单 / 进行中
if (purchaseDetail.status === 'accepted' || purchaseDetail.status === 'in_progress') {
  return <InProgressPurchaseArea />;
}

// 已完成
if (purchaseDetail.status === 'completed') {
  return <CompletedPurchaseArea />;
}
```

### 倒计时Hook
```typescript
const useCountdown = (targetTime: number) => {
  const [timeLeft, setTimeLeft] = useState(targetTime - Date.now());
  
  useEffect(() => {
    const timer = setInterval(() => {
      const left = targetTime - Date.now();
      setTimeLeft(left > 0 ? left : 0);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetTime]);
  
  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const isExpired = timeLeft <= 0;
  
  return { minutes, seconds, isExpired };
};
```

### 评价提交
```typescript
const handleSubmitRating = (rating: number, comment: string) => {
  if (rating === 0) {
    Alert.alert('提示', '请选择评分');
    return;
  }
  
  // TODO: 调用评价API
  console.log({ rating, comment });
  Alert.alert('成功', '评价提交成功');
};
```

## 🚀 待实现功能

- [ ] 接入真实API
- [ ] 取消订单确认弹窗
- [ ] 评价图片上传
- [ ] 订单分享功能
- [ ] 申诉/投诉功能
- [ ] 订单导出

## 📌 注意事项

1. **角色视角**: 客户视角，显示服务提供者信息
2. **状态传递**: 从列表页接收订单状态，确保状态一致
3. **倒计时**: 待接单状态下显示30分钟倒计时
4. **评价限制**: 只能评价一次，提交后不可修改
5. **联系方式**: 只在已接单/进行中状态显示
6. **模拟数据**: 当前使用模拟数据，需替换为真实API

## 🔧 技术栈

- React Native
- Expo Router
- TypeScript
- React Hooks (useState, useEffect, useCallback)
- ScrollView (滚动视图)
- Alert (原生弹窗)
- TextInput (评价输入)

## 🎯 业务流程

```
1. 用户下单 → 待接单
   ↓
2. 服务提供者接单 → 已接单
   ↓
3. 服务提供者开始服务 → 进行中
   ↓
4. 服务提供者完成服务 → 已完成
   ↓
5. 用户评价 → 完成闭环
```

## 💡 最佳实践

1. **状态管理**: 使用自定义Hook分离状态逻辑
2. **组件拆分**: 按状态拆分子组件，保持主组件简洁
3. **类型安全**: 使用TypeScript确保类型安全
4. **用户体验**: 提供清晰的状态提示和操作引导
5. **错误处理**: 添加必要的表单验证和错误提示

