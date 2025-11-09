# 首页导航快速指南

## 🗺️ 导航流程图

```
首页 (MainPage)
├── 游戏横幅 → 服务详情页 (game)
├── 功能网格
│   ├── 王者荣耀 → 服务详情页 (honor_of_kings)
│   ├── 英雄联盟 → 服务详情页 (league_of_legends)
│   ├── 和平精英 → 服务详情页 (pubg_mobile)
│   ├── 荒野乱斗 → 服务详情页 (brawl_stars)
│   ├── 探店 → 服务详情页 (explore_shop)
│   ├── 私人影院 → 服务详情页 (private_cinema)
│   ├── 台球 → 服务详情页 (billiards)
│   ├── KTV → 服务详情页 (ktv)
│   ├── 酒局 → 服务详情页 (drinking)
│   └── 按摩 → 服务详情页 (massage)
├── 限时专项
│   ├── 卡片点击 → 服务详情页 (限时优惠模式)
│   └── 查看更多 → 限时专享列表页 → 服务详情页 (限时优惠模式)
├── 组局中心 → 组局中心页面
└── 用户列表 → 其他用户主页
```

## 📍 关键导航函数

### 1. 功能模块导航
```typescript
const handleFunctionPress = useCallback((functionId: string) => {
  router.push({
    pathname: '/(tabs)/homepage/service-detail',
    params: { serviceType: functionId },
  });
}, [router]);
```

### 2. 限时专项导航
```typescript
const handleLimitedOfferPress = useCallback((user: UserCard) => {
  const serviceType = user.services?.[0] || 'honor_of_kings';
  router.push({
    pathname: '/(tabs)/homepage/service-detail',
    params: { 
      serviceType: serviceType,
      isLimitedOffer: 'true',
      userId: user.id,
    },
  });
}, [router]);
```

### 3. 用户列表导航
```typescript
const handleUserPress = useCallback((user: UserCard) => {
  router.push({
    pathname: '/profile/[userId]',
    params: { userId: user.id },
  });
}, [router]);
```

## 🎯 服务详情页参数

### 标准模式
```typescript
{
  serviceType: 'honor_of_kings' | 'league_of_legends' | ...
}
```

### 限时优惠模式
```typescript
{
  serviceType: 'honor_of_kings' | 'league_of_legends' | ...,
  isLimitedOffer: 'true',
  userId?: string // 可选
}
```

## 💡 使用场景对比

| 场景 | 目标页面 | 参数 | 价格显示 |
|------|---------|------|---------|
| 功能网格点击 | 服务详情页 | `{ serviceType }` | 正常价格 |
| 限时专项点击 | 服务详情页 | `{ serviceType, isLimitedOffer: 'true' }` | 折扣价格 (8折) |
| 用户列表点击 | 用户主页 | `{ userId }` | - |
| 组局中心点击 | 组局中心页 | - | - |

## 🔄 页面关系

```
MainPage (首页)
  ↓
ServiceDetailPage (服务详情)
  ├── 正常模式: 显示标准价格
  └── 限时优惠模式: 显示折扣价格 + 限时徽章
```

## 📝 开发注意事项

1. **服务类型映射**: 功能ID会自动映射到服务类型
2. **价格计算**: 限时优惠价格 = 原价 × 0.8（向下取整）
3. **参数传递**: 使用路由参数传递状态，避免全局状态污染
4. **兼容性**: 服务详情页同时支持正常模式和限时优惠模式

