# 导航跳转更新说明

## 📋 更新内容

### 变更前
点击服务提供者卡片 → 打开用户详情弹窗 (`/modal/user-detail`)

### 变更后
点击服务提供者卡片 → 跳转到技能详情页 (`/skill/[skillId]`)

## 🎯 变更原因

用户反馈：在服务详情页中，点击服务提供者应该直接查看该服务的详细信息（技能详情），而不是打开用户资料弹窗。这样更符合用户的使用习惯和业务流程。

## 🔧 技术实现

### 1. 路由配置更新

**文件：** `constants.ts`

```typescript
// 新增技能详情路由
export const SERVICE_DETAIL_ROUTES = {
  USER_DETAIL: '/modal/user-detail',
  SKILL_DETAIL: '/skill',  // 新增
  FILTER_ONLINE: '/(tabs)/homepage/filter-online',
  FILTER_OFFLINE: '/(tabs)/homepage/filter-offline',
  // ...
};
```

### 2. 点击处理逻辑更新

**文件：** `index.tsx`

**变更前：**
```typescript
const handleProviderPress = useCallback((providerId: string) => {
  router.push({
    pathname: SERVICE_DETAIL_ROUTES.USER_DETAIL as any,
    params: { userId: providerId, serviceType }
  });
}, [router, serviceType]);
```

**变更后：**
```typescript
const handleProviderPress = useCallback((provider: any) => {
  // 获取用户的第一个技能作为默认技能
  const skillId = provider.skills?.[0]?.id || `skill_${provider.id}_${serviceType}`;
  
  router.push({
    pathname: `${SERVICE_DETAIL_ROUTES.SKILL_DETAIL}/${skillId}` as any,
    params: { 
      skillId: skillId,
      userId: provider.id,
      serviceType: serviceType
    }
  });
}, [router, serviceType]);
```

### 3. 调用方式更新

**变更前：**
```typescript
<ProviderCard
  provider={item}
  onPress={() => handleProviderPress(item.id)}  // 只传ID
/>
```

**变更后：**
```typescript
<ProviderCard
  provider={item}
  onPress={() => handleProviderPress(item)}  // 传整个对象
/>
```

### 4. 数据模型更新

**文件：** `stores/userStore.ts`

#### User 接口更新
```typescript
interface User {
  // ... 其他字段
  skills: Array<{
    id?: string;  // 新增：技能ID
    type: string;
    level: string;
    price: number;
  }>;
}
```

#### Mock 数据更新
```typescript
skills: [
  {
    id: `skill_${index + 1}`,  // 新增：生成技能ID
    type: serviceTypes[index % serviceTypes.length],
    level: ['荣耀王者', '最强王者', '星耀', '钻石', '铂金'][index % 5],
    price: [10, 15, 20, 25, 30][index % 5],
  },
],
```

## 📱 用户体验流程

### 新的导航流程

```
服务详情页
  ↓ (点击服务提供者卡片)
技能详情页
  ├─ 查看技能详情
  ├─ 查看价格信息
  ├─ 查看用户评价
  └─ 预约下单
```

### 传递的参数

| 参数 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `skillId` | string | 技能ID | `skill_1` |
| `userId` | string | 用户ID | `user_1` |
| `serviceType` | string | 服务类型 | `honor_of_kings` |

## 🎨 详情页接收参数

详情页路由文件：`app/skill/[skillId].tsx`

```typescript
export default function DetailScreen() {
  const { skillId, userId, isMyProduct } = useLocalSearchParams<{ 
    skillId: string; 
    userId?: string;
    isMyProduct?: string;
  }>();
  
  return (
    <DetailPage 
      skillId={skillId} 
      userId={userId || ''} 
      isMyProduct={isMyProduct === 'true'}
    />
  );
}
```

## 🔄 向后兼容性

### 技能ID生成规则

如果用户的 `skills` 数组中没有 `id` 字段，系统会自动生成一个：

```typescript
const skillId = provider.skills?.[0]?.id || `skill_${provider.id}_${serviceType}`;
```

生成规则：`skill_${用户ID}_${服务类型}`

示例：
- 用户ID: `user_123`
- 服务类型: `honor_of_kings`
- 生成的技能ID: `skill_user_123_honor_of_kings`

### 数据迁移

现有数据无需修改，系统会自动处理：
- ✅ 有 `id` 字段：直接使用
- ✅ 无 `id` 字段：自动生成

## 🧪 测试场景

### 场景1：正常跳转
1. 进入服务详情页（如：王者荣耀）
2. 点击任意服务提供者卡片
3. ✅ 应该跳转到技能详情页
4. ✅ 页面显示该技能的详细信息

### 场景2：参数传递
1. 点击服务提供者卡片
2. ✅ `skillId` 参数正确传递
3. ✅ `userId` 参数正确传递
4. ✅ `serviceType` 参数正确传递

### 场景3：无技能ID
1. 用户数据中没有技能ID
2. 点击卡片
3. ✅ 自动生成技能ID
4. ✅ 正常跳转到技能详情页

### 场景4：返回导航
1. 从技能详情页返回
2. ✅ 返回到服务详情页
3. ✅ 保持之前的筛选状态

## 📊 影响范围

### 受影响的文件
- ✅ `src/features/Homepage/ServiceFlow/ServiceDetailPage/index.tsx`
- ✅ `src/features/Homepage/ServiceFlow/ServiceDetailPage/constants.ts`
- ✅ `stores/userStore.ts`

### 不受影响的功能
- ✅ 筛选功能
- ✅ 标签功能
- ✅ 排序功能
- ✅ 下拉刷新
- ✅ 卡片样式

## 🎯 业务逻辑

### 为什么选择第一个技能？

```typescript
const skillId = provider.skills?.[0]?.id
```

**原因：**
1. 大多数服务提供者只有一个主要技能
2. 第一个技能通常是主推技能
3. 简化用户操作流程

**未来优化：**
如果用户有多个技能，可以考虑：
- 显示技能选择器
- 跳转到用户的技能列表页
- 根据当前服务类型智能匹配技能

## 🚀 后续优化建议

### 1. 技能选择
如果用户有多个技能，可以添加技能选择功能：

```typescript
// 卡片长按显示技能列表
const handleLongPress = (provider: any) => {
  if (provider.skills.length > 1) {
    showSkillSelector(provider.skills);
  }
};
```

### 2. 智能匹配
根据当前服务类型自动匹配对应的技能：

```typescript
const findMatchingSkill = (provider: any, serviceType: string) => {
  return provider.skills.find(skill => skill.type === serviceType) 
    || provider.skills[0];
};
```

### 3. 预加载
预加载技能详情数据，提升用户体验：

```typescript
const prefetchSkillDetail = async (skillId: string) => {
  await queryClient.prefetchQuery(['skill', skillId], () => 
    fetchSkillDetail(skillId)
  );
};
```

## 📝 开发者注意事项

### 1. 技能ID必须唯一
确保每个技能都有唯一的ID：

```typescript
// ✅ 正确
{ id: 'skill_123', type: 'honor_of_kings', ... }

// ❌ 错误
{ type: 'honor_of_kings', ... }  // 缺少ID
```

### 2. 处理空技能列表
始终检查技能列表是否为空：

```typescript
if (!provider.skills || provider.skills.length === 0) {
  // 处理无技能的情况
  console.warn('Provider has no skills');
  return;
}
```

### 3. 错误处理
添加适当的错误处理：

```typescript
try {
  router.push({ pathname: skillDetailPath, params });
} catch (error) {
  console.error('Navigation failed:', error);
  // 显示错误提示
}
```

## 🔗 相关文档

- [详情页文档](../../Profile/OtherUserProfilePage/README.md)
- [路由配置文档](../../../../app/skill/README.md)
- [用户数据模型](../../../../stores/userStore.ts)

## ✅ 检查清单

部署前请确认：

- [ ] 所有服务提供者都有技能数据
- [ ] 技能ID格式正确
- [ ] 路由跳转正常
- [ ] 参数传递正确
- [ ] 返回导航正常
- [ ] 错误处理完善
- [ ] 测试通过

## 📅 更新日期

2025-11-09

## 👥 更新人员

AI Assistant (Claude Sonnet 4.5)

---

## 💡 快速测试

```typescript
// 1. 进入服务详情页
router.push({
  pathname: '/(tabs)/homepage/service-detail',
  params: { serviceType: 'honor_of_kings' }
});

// 2. 点击任意卡片，应该跳转到技能详情页
// 3. 检查URL是否为: /skill/[skillId]
// 4. 检查参数是否正确传递
```

