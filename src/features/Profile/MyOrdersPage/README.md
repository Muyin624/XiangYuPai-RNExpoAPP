# MyOrdersPage - 我的订单列表页面

## 📋 功能概述

我的订单列表页面，展示用户的所有订单，支持按状态筛选和查看订单详情。

## 🎯 核心功能

### 1. Tab切换
- **全部**：显示所有订单
- **待接单**：等待服务者接单的订单
- **进行中**：正在进行的订单
- **已完成**：已完成的订单
- **已取消**：已取消的订单

### 2. 订单列表
- 订单卡片展示
- 订单状态标识
- 服务者信息
- 订单金额
- 创建时间

### 3. 订单操作
- 根据订单状态显示不同操作按钮
- 待接单：取消订单、联系客服
- 已完成：评价、再来一单
- 已取消：删除订单

### 4. 交互功能
- 下拉刷新
- 点击跳转订单详情
- 返回上一页

## 📁 文件结构

```
MyOrdersPage/
├── index.tsx           # 主组件文件
├── types.ts            # 类型定义
├── constants.ts        # 常量配置
└── README.md           # 本文档
```

## 🎨 组件架构

### 主组件：MyOrdersPage
- 职责：页面整体布局和逻辑协调
- 状态管理：订单列表、Tab状态、刷新状态

### 子组件

#### 1. TabBar
- 职责：Tab切换栏
- Props：
  - `activeTab`: 当前激活的Tab
  - `onTabChange`: Tab切换回调

#### 2. OrderCard
- 职责：订单卡片展示
- Props：
  - `order`: 订单数据
  - `onPress`: 点击回调

#### 3. EmptyState
- 职责：空状态展示
- 显示时机：订单列表为空

## 📊 数据结构

### Order（订单信息）
```typescript
interface Order {
  id: string;
  orderNo: string;              // 订单号
  status: OrderStatus;          // 订单状态
  skillName: string;            // 技能名称
  price: number;                // 单价（金币）
  quantity: number;             // 数量
  totalPrice: number;           // 总价（金币）
  providerInfo: {               // 服务提供者信息
    userId: string;
    nickname: string;
    avatar: string;
    gender: 1 | 2;
  };
  createdAt: number;            // 创建时间
  updatedAt: number;            // 更新时间
}
```

### OrderStatus（订单状态）
```typescript
type OrderStatus = 
  | 'pending'      // 待接单
  | 'accepted'     // 已接单（待开始）
  | 'in_progress'  // 进行中
  | 'completed'    // 已完成
  | 'cancelled';   // 已取消
```

## 🎨 样式设计

### 颜色规范
- 主色调：`#8B5CF6`（紫色）
- 成功色：`#10B981`（绿色）
- 警告色：`#F59E0B`（橙色）
- 危险色：`#EF4444`（红色）
- 信息色：`#3B82F6`（蓝色）

### 订单状态颜色
- 待接单：橙色 `#F59E0B`
- 已接单：蓝色 `#3B82F6`
- 进行中：紫色 `#8B5CF6`
- 已完成：绿色 `#10B981`
- 已取消：灰色 `#6B7280`

## 🔄 状态管理

### 本地状态
- `activeTab`: 当前激活的Tab
- `orders`: 订单列表数据
- `refreshing`: 下拉刷新状态

### 状态更新
- Tab切换时筛选订单
- 下拉刷新时重新加载数据

## 🚀 使用示例

```tsx
import MyOrdersPage from '@/src/features/Profile/MyOrdersPage';

// 在路由页面中使用
export default function MyOrdersScreen() {
  return <MyOrdersPage />;
}
```

## 🔗 导航路由

### 入口
- 路由：`/profile/my-orders`
- 来源：我的页面 → 我的订单

### 出口
- 订单详情：`/profile/order-detail?orderId={orderId}`

## 📱 交互流程

```
1. 用户进入页面
   ↓
2. 加载订单列表（默认显示全部）
   ↓
3. 用户切换Tab
   ↓
4. 筛选对应状态的订单
   ↓
5. 用户点击订单卡片
   ↓
6. 跳转订单详情页面
```

## 🎯 TODO

- [ ] 集成真实API接口
- [ ] 添加无限滚动加载
- [ ] 添加订单搜索功能
- [ ] 添加订单筛选（时间、金额等）
- [ ] 优化性能（虚拟列表）

## 📝 注意事项

1. **数据模拟**：当前使用模拟数据，需要替换为真实API
2. **状态同步**：订单状态变更需要实时同步
3. **性能优化**：订单列表较多时考虑虚拟列表
4. **错误处理**：需要完善网络错误和异常处理
5. **缓存策略**：考虑添加订单列表缓存

## 🔧 维护指南

### 添加新的订单状态
1. 在 `types.ts` 中添加新状态类型
2. 在 `constants.ts` 中添加状态配置
3. 在 `TABS` 中添加Tab配置
4. 更新 `ORDER_STATUS_CONFIG` 添加样式和操作

### 修改订单卡片样式
1. 找到 `OrderCard` 组件
2. 修改对应的样式定义
3. 确保响应式布局正常

### 添加新的操作按钮
1. 在 `constants.ts` 的 `ORDER_STATUS_CONFIG` 中添加操作
2. 在 `OrderCard` 组件中实现操作逻辑

## 📚 相关文档

- [订单详情页面](../OrderDetailPage/README.md)
- [我的页面](../MyPage/README.md)
- [前端架构标准](../../../../前端写页面/FRONTEND_ARCHITECTURE_STANDARD.md)

