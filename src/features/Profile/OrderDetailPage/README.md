# OrderDetailPage - 订单详情页面（服务提供者视角）

## 📋 功能概述

订单详情页面，展示订单的完整信息，根据订单状态显示不同的操作界面。

**视角**：服务提供者（接单方）

## 🎯 核心功能

### 1. 订单状态展示

#### 待接单 (pending)
- 显示新订单提示
- 显示订单摘要信息
- 提供**接单**和**拒绝**按钮
- 可联系客户

#### 已接单 (accepted)
- 显示已接单状态
- 显示客户联系方式
- 提供**开始服务**按钮
- 可联系客户

#### 进行中 (in_progress)
- 显示服务进行中状态
- 显示客户联系方式
- 提供**完成服务**按钮
- 可联系客户

#### 已完成 (completed)
- 显示服务完成状态
- 显示客户评价（如有）
- 显示本单收入

#### 已取消 (cancelled)
- 显示取消原因
- 显示取消时间

### 2. 订单信息卡片
- 订单号
- 客户信息
- 服务项目
- 下单时间
- 预约时间
- 购买数量
- 单价和总价

### 3. 订单时间轴
- 订单创建
- 已接单
- 服务开始
- 服务完成
- 订单取消

## 📁 文件结构

```
OrderDetailPage/
├── index.tsx                      # 主组件文件
├── types.ts                       # 类型定义
├── constants.ts                   # 常量配置
├── PendingStatusArea/             # 待接单状态区域
│   └── index.tsx
├── InProgressStatusArea/          # 进行中状态区域
│   └── index.tsx
├── CompletedStatusArea/           # 已完成状态区域
│   └── index.tsx
└── README.md                      # 本文档
```

## 🎨 组件架构

### 主组件：OrderDetailPage
- 职责：页面整体布局和逻辑协调
- 状态管理：订单详情数据、加载状态

### 状态区域组件（根据订单状态显示）

#### 1. PendingStatusArea（待接单）
- Props：
  - `order`: 订单详情
  - `onAccept`: 接单回调
  - `onReject`: 拒绝回调
  - `onContact`: 联系客户回调

#### 2. InProgressStatusArea（进行中）
- Props：
  - `order`: 订单详情
  - `onContact`: 联系客户回调
  - `onStartService`: 开始服务回调（已接单状态）
  - `onCompleteService`: 完成服务回调（进行中状态）

#### 3. CompletedStatusArea（已完成）
- Props：
  - `order`: 订单详情

### 信息展示组件

#### OrderInfoCard（订单信息卡片）
- 显示订单详细信息
- 显示客户信息
- 显示价格信息

#### TimelineCard（订单时间轴）
- 显示订单流程节点
- 显示时间信息

## 📊 数据结构

### OrderDetail（订单详情）
```typescript
interface OrderDetail {
  id: string;
  orderNo: string;                    // 订单号
  status: OrderStatus;                // 订单状态
  skillName: string;                  // 技能名称
  skillDesc: string;                  // 技能描述
  price: number;                      // 单价（金币）
  quantity: number;                   // 数量
  totalPrice: number;                 // 总价（金币）
  
  // 客户信息（下单的人）
  customerInfo: {
    userId: string;
    nickname: string;
    avatar: string;
    gender: 1 | 2;
    phone?: string;                   // 手机号（脱敏）
    wechat?: string;                  // 微信号
  };
  
  // 时间信息
  appointmentTime: number;            // 预约时间
  createdAt: number;                  // 创建时间
  updatedAt: number;                  // 更新时间
  acceptedAt?: number;                // 接单时间
  startedAt?: number;                 // 开始时间
  completedAt?: number;               // 完成时间
  cancelledAt?: number;               // 取消时间
  
  // 取消信息
  cancelReason?: string;              // 取消原因
  
  // 评价信息
  rating?: number;                    // 评分（1-5）
  comment?: string;                   // 评价内容
  
  // 订单时间轴
  timeline: Array<{
    time: number;
    title: string;
    desc: string;
  }>;
}
```

## 🎨 样式设计

### 颜色规范
- 主色调：`#8B5CF6`（紫色）
- 成功色：`#10B981`（绿色）
- 警告色：`#F59E0B`（橙色）
- 危险色：`#EF4444`（红色）
- 信息色：`#3B82F6`（蓝色）

## 🔄 状态流转

```
待接单 (pending)
  ↓ 接单
已接单 (accepted)
  ↓ 开始服务
进行中 (in_progress)
  ↓ 完成服务
已完成 (completed)

任何状态都可以 → 已取消 (cancelled)
```

## 🚀 使用示例

```tsx
import OrderDetailPage from '@/src/features/Profile/OrderDetailPage';

// 在路由页面中使用
export default function OrderDetailScreen() {
  return <OrderDetailPage />;
}

// 路由参数
// /profile/order-detail?orderId={orderId}
```

## 🔗 导航路由

### 入口
- 路由：`/profile/order-detail?orderId={orderId}`
- 来源：我的订单列表

### 出口
- 返回：我的订单列表
- 联系客户：跳转聊天页面（TODO）

## 📱 交互流程

### 待接单流程
```
1. 查看订单详情
   ↓
2. 决定是否接单
   ↓
3a. 点击"接单" → 订单状态变为"已接单"
3b. 点击"拒绝" → 订单状态变为"已取消"
```

### 服务流程
```
1. 已接单状态
   ↓
2. 点击"开始服务" → 订单状态变为"进行中"
   ↓
3. 提供服务
   ↓
4. 点击"完成服务" → 订单状态变为"已完成"
   ↓
5. 等待客户评价
```

## 🎯 业务逻辑

### 接单逻辑
- 检查是否有冲突订单
- 更新订单状态为"已接单"
- 通知客户

### 开始服务逻辑
- 更新订单状态为"进行中"
- 记录开始时间
- 通知客户

### 完成服务逻辑
- 更新订单状态为"已完成"
- 记录完成时间
- 结算收入
- 通知客户评价

### 拒绝订单逻辑
- 更新订单状态为"已取消"
- 记录取消原因
- 通知客户
- 释放订单给其他服务者

## 🎯 TODO

- [ ] 集成真实API接口
- [ ] 实现接单逻辑
- [ ] 实现拒绝订单逻辑
- [ ] 实现开始服务逻辑
- [ ] 实现完成服务逻辑
- [ ] 实现联系客户功能（跳转聊天）
- [ ] 添加订单取消功能
- [ ] 添加申诉功能
- [ ] 优化加载状态

## 📝 注意事项

1. **数据模拟**：当前使用模拟数据，需要替换为真实API
2. **状态同步**：订单状态变更需要实时同步
3. **权限控制**：只有订单的服务提供者可以查看和操作
4. **错误处理**：需要完善网络错误和异常处理
5. **通知机制**：状态变更需要通知客户

## 🔧 维护指南

### 添加新的订单状态
1. 在 `types.ts` 中添加新状态类型
2. 在 `constants.ts` 中添加状态配置
3. 创建对应的状态区域组件
4. 在主组件中添加状态判断和渲染

### 修改状态区域样式
1. 找到对应的状态区域组件
2. 修改组件内的样式定义
3. 确保响应式布局正常

### 添加新的操作按钮
1. 在业务逻辑Hook中添加处理函数
2. 在状态区域组件中添加按钮
3. 连接回调函数

## 📚 相关文档

- [我的订单列表](../MyOrdersPage/README.md)
- [我的页面](../MyPage/README.md)
- [前端架构标准](../../../../前端写页面/FRONTEND_ARCHITECTURE_STANDARD.md)

## 🎉 完成状态

✅ 页面结构完整  
✅ 组件架构清晰  
✅ 状态流转完整  
✅ 样式设计统一  
✅ 类型定义完整  
🔄 待集成真实API

