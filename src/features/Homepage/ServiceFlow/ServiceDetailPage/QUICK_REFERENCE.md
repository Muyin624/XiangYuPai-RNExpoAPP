# 服务详情页快速参考

## 🚀 快速开始

### 基本使用

```typescript
import ServiceDetailPage from '@/src/features/Homepage/ServiceFlow/ServiceDetailPage';

// 方式1: 直接使用组件
<ServiceDetailPage serviceType="honor_of_kings" />

// 方式2: 通过路由跳转
router.push({
  pathname: '/(tabs)/homepage/service-detail',
  params: { serviceType: 'honor_of_kings' }
});
```

## 📋 支持的服务类型

### 游戏类服务
```typescript
'honor_of_kings'      // 王者荣耀
'league_of_legends'   // 英雄联盟
'pubg_mobile'         // 和平精英
'brawl_stars'         // 荒野乱斗
```

### 生活服务类
```typescript
'explore_shop'        // 探店
'private_cinema'      // 私影
'billiards'           // 台球
'ktv'                 // K歌
'drinking'            // 喝酒
'massage'             // 按摩
```

## 🎨 主题色配置

### 修改主题色
```typescript
// constants.ts
export const SERVICE_THEME_MAP = {
  honor_of_kings: {
    primaryColor: '#DAA520',
    gradient: ['#DAA520', '#FFD700'],
  },
  // ... 其他服务
};
```

### 使用主题色
```typescript
const serviceInfo = getServiceInfo(serviceType);
const theme = serviceInfo.serviceConfig.theme;

<View style={{ backgroundColor: theme.primaryColor }}>
  {/* 内容 */}
</View>
```

## 🏷️ 标签配置

### 添加新标签
```typescript
// constants.ts
export const GAME_SERVICE_TAGS = {
  honor_of_kings: [
    { id: 'master', name: '荣誉主者' },
    { id: 'rank_up', name: '荣耀上分' },
    { id: 'esports', name: '电竞陪练师' },
    { id: 'casual', name: '随玩' },
    // 添加新标签
    { id: 'new_tag', name: '新标签' },
  ],
};
```

### 标签筛选
```typescript
// 组件内部自动处理
// 用户点击标签时会自动筛选
const handleTagPress = (tagId: string) => {
  // 自动更新 filterState.selectedTags
};
```

## 🎯 筛选功能

### 筛选选项
```typescript
interface FilterState {
  sortBy: 'smart' | 'price' | 'rating' | 'distance';
  gender: 'all' | 'male' | 'female';
  selectedTags: string[];
  advancedFilters: {
    priceRange: [number, number];
    distanceRange: number;
    ratingMin: number;
    onlineOnly: boolean;
    features: string[];
  };
}
```

### 应用筛选
```typescript
// 排序
handleFilterChange('sortBy', 'price');

// 性别
handleFilterChange('gender', 'female');

// 标签（多选）
handleTagPress('master');
handleTagPress('rank_up');
```

## 💾 数据结构

### 用户数据
```typescript
interface User {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  location: {
    city: string;
    district: string;
    distance?: number; // 单位：米
  };
  tags: string[];
  price: number;
  rating: number;
  reviewCount: number;
  isOnline: boolean;
  isHot?: boolean; // 是否热门
  description: string;
  // ... 其他字段
}
```

### Mock数据
```typescript
// stores/userStore.ts
const generateMockUsers = (page: number, limit: number): User[] => {
  // 自动生成测试数据
};
```

## 🎨 样式定制

### 修改卡片样式
```typescript
// index.tsx - styles
providerCard: {
  marginBottom: 12,
  marginTop: 4,
},
cardContainer: {
  padding: 12,
},
```

### 修改头像样式
```typescript
avatar: {
  width: 60,
  height: 60,
  borderRadius: 8,
  backgroundColor: '#F8FAFC',
},
```

### 修改标签样式
```typescript
tagPrimary: {
  backgroundColor: '#E6F7FF',
},
tagSecondary: {
  backgroundColor: '#FFF7E6',
},
tagTertiary: {
  backgroundColor: '#F6FFED',
},
```

## 🔧 常用方法

### 格式化价格
```typescript
const formatPrice = (price: number): string => {
  return `¥${price}`;
};

// 使用
<Text>{formatPrice(10)}</Text> // ¥10
```

### 格式化距离
```typescript
const formatDistance = (distance: number): string => {
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  }
  return `${(distance / 1000).toFixed(1)}km`;
};

// 使用
<Text>{formatDistance(3200)}</Text> // 3.2km
```

### 格式化评分
```typescript
const formatRating = (rating: number, count: number): string => {
  return `${rating.toFixed(1)} (${count > 999 ? `${(count / 1000).toFixed(1)}k` : count})`;
};

// 使用
<Text>{formatRating(4.8, 1234)}</Text> // 4.8 (1.2k)
```

## 🎭 组件拆分

### 导航区域
```typescript
<ServiceNavigationArea
  serviceName="王者荣耀"
  onBack={handleBack}
/>
```

### 筛选工具栏
```typescript
<ServiceFilterToolbar
  filterState={filterState}
  onFilterChange={handleFilterChange}
  onAdvancedFilter={handleFilterPress}
/>
```

### 标签栏
```typescript
<ServiceTagsBar
  tags={tags}
  selectedTags={selectedTags}
  onTagPress={handleTagPress}
/>
```

### 提供者卡片
```typescript
<ProviderCard
  provider={user}
  serviceCategory="game"
  onPress={() => handleProviderPress(user.id)}
/>
```

## 🔄 状态管理

### 使用Zustand Store
```typescript
import { useUserStore } from '@/stores';

// 在组件中
const { userList, loadUserList } = useUserStore();

// 加载数据
await loadUserList({ 
  page: 1, 
  limit: 20,
  filters: { serviceType: 'honor_of_kings' }
});

// 访问数据
const users = userList.data;
```

### 本地状态
```typescript
const [localState, setLocalState] = useState({
  loading: false,
  refreshing: false,
  error: null,
});
```

## 🐛 调试技巧

### 查看当前筛选状态
```typescript
console.log('Filter State:', filterState);
console.log('Selected Tags:', filterState.selectedTags);
console.log('Sort By:', filterState.sortBy);
```

### 查看用户数据
```typescript
console.log('User List:', userList.data);
console.log('Filtered Users:', filteredProviders);
```

### 查看服务配置
```typescript
console.log('Service Info:', serviceInfo);
console.log('Service Tags:', serviceInfo.serviceConfig.tags);
```

## ⚡ 性能优化

### 列表优化
```typescript
<FlatList
  removeClippedSubviews={Platform.OS === 'android'}
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={10}
/>
```

### 组件优化
```typescript
// 使用 React.memo
const ProviderCard = React.memo(({ provider, onPress }) => {
  // ...
});

// 使用 useCallback
const handlePress = useCallback(() => {
  // ...
}, [dependencies]);
```

## 🧪 测试

### 单元测试
```typescript
describe('ServiceDetailPage', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <ServiceDetailPage serviceType="honor_of_kings" />
    );
    expect(getByText('王者荣耀')).toBeTruthy();
  });
});
```

### 集成测试
```typescript
it('should filter by tags', async () => {
  const { getByText } = render(<ServiceDetailPage />);
  
  fireEvent.press(getByText('荣誉主者'));
  
  await waitFor(() => {
    expect(filteredUsers.length).toBeGreaterThan(0);
  });
});
```

## 📱 路由集成

### Expo Router
```typescript
// app/(tabs)/homepage/service-detail.tsx
export default function ServiceDetailScreen() {
  const { serviceType } = useLocalSearchParams();
  
  return (
    <ServiceDetailPage serviceType={serviceType as ServiceType} />
  );
}
```

### 跳转示例
```typescript
// 从首页跳转
router.push({
  pathname: '/(tabs)/homepage/service-detail',
  params: { serviceType: 'honor_of_kings' }
});

// 从功能卡片跳转
const handleServicePress = (functionId: string) => {
  const serviceType = FUNCTION_ID_TO_SERVICE_TYPE[functionId];
  router.push({
    pathname: '/(tabs)/homepage/service-detail',
    params: { serviceType }
  });
};
```

## 🎯 常见问题

### Q: 如何添加新的服务类型？
A: 在 `constants.ts` 中添加配置：
```typescript
export const SERVICE_TYPE_MAP = {
  // ... 现有配置
  new_service: {
    name: '新服务',
    category: 'game',
    icon: '🎮',
  },
};
```

### Q: 如何自定义卡片样式？
A: 修改 `styles.ts` 中的相关样式：
```typescript
providerCard: {
  // 自定义样式
},
```

### Q: 如何修改筛选逻辑？
A: 在 `useServiceDetailState` Hook中修改：
```typescript
const filteredProviders = useMemo(() => {
  // 自定义筛选逻辑
}, [dependencies]);
```

### Q: 如何集成真实API？
A: 修改 `stores/userStore.ts`：
```typescript
loadUserList: async (params) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  const data = await response.json();
  // 更新状态
},
```

## 📚 相关文档

- [设计更新总结](./DESIGN_UPDATE_SUMMARY.md)
- [视觉对比](./VISUAL_COMPARISON.md)
- [类型定义](./types.ts)
- [常量配置](./constants.ts)

## 🆘 获取帮助

- 查看代码注释
- 阅读相关文档
- 查看示例代码
- 提交Issue

## 📝 更新日志

### v2.0.0 (2025-11-09)
- ✨ 全新的卡片设计
- ✨ 新增标签栏
- ✨ 新增HOT标签
- ✨ 新增性别标签
- 🎨 优化视觉效果
- 🐛 修复已知问题

### v1.0.0
- 🎉 初始版本

