# 筛选弹窗功能说明

## 📋 概述

服务详情页现在包含三个底部弹窗筛选组件，提供完整的筛选功能体验。

## 🎨 三个筛选弹窗

### 1. 智能排序弹窗（SortBottomSheet）

**触发方式：** 点击"智能排序 ▼"按钮

**功能：** 选择列表排序方式

**选项：**
- ✅ 智能排序（默认）
- 📅 最新排序
- 📍 最近排序
- 🔥 人气排序

**特点：**
- 单选模式
- 选中项显示紫色 + ✓ 标记
- 选择后自动关闭
- 平滑动画效果

**代码示例：**
```typescript
<SortBottomSheet
  visible={bottomSheetState.sortVisible}
  selectedSort="smart"
  onSelect={(sort) => handleSortSelect(sort)}
  onClose={closeBottomSheets}
/>
```

---

### 2. 性别筛选弹窗（GenderBottomSheet）

**触发方式：** 点击"不限性别 ▼"按钮

**功能：** 筛选服务提供者性别

**选项：**
- 👥 不限性别（默认）
- 👧 只看女生
- 👦 只看男生

**特点：**
- 单选模式
- 选中项显示紫色 + ✓ 标记
- 底部有确认按钮（✓）
- 选择后自动关闭

**代码示例：**
```typescript
<GenderBottomSheet
  visible={bottomSheetState.genderVisible}
  selectedGender="all"
  onSelect={(gender) => handleGenderSelect(gender)}
  onClose={closeBottomSheets}
/>
```

---

### 3. 高级筛选弹窗（AdvancedFilterSheet）

**触发方式：** 点击"筛选 ▼"按钮

**功能：** 多维度高级筛选

**筛选维度：**

#### 状态
- 在线

#### 大区
- QQ区
- 微信区

#### 段位
- 荣耀铂金
- 永恒钻石
- 至尊星耀
- 最强王者
- 荣耀王者

#### 价格
- 4-9币
- 10-19币
- 20币以上

#### 位置
- 打野
- 上路
- 中路
- 下路
- 辅助
- 全能

#### 标签
- 荣耀王者
- 大神认证
- 巅峰赛
- 带粉上分
- 官方认证
- 声优陪玩

#### 所在地
- 同城

**特点：**
- 多选模式
- 可滚动内容
- 底部有"重置"和"完成"按钮
- 选中项显示紫色背景和边框
- 支持多维度组合筛选

**代码示例：**
```typescript
<AdvancedFilterSheet
  visible={bottomSheetState.advancedVisible}
  filters={{
    status: 'all',
    area: [],
    rank: [],
    priceRange: [],
    position: [],
    tags: [],
    location: [],
  }}
  onApply={(filters) => handleAdvancedFilterApply(filters)}
  onReset={handleAdvancedFilterReset}
  onClose={closeBottomSheets}
/>
```

## 🎯 使用流程

### 用户操作流程

```
1. 进入服务详情页
   ↓
2. 点击筛选按钮
   ↓
3. 弹出对应筛选弹窗
   ↓
4. 选择筛选条件
   ↓
5. 确认/自动应用
   ↓
6. 列表更新显示筛选结果
```

### 开发者集成流程

```typescript
// 1. 导入组件
import { 
  SortBottomSheet, 
  GenderBottomSheet, 
  AdvancedFilterSheet 
} from './components';

// 2. 添加状态管理
const [bottomSheetState, setBottomSheetState] = useState({
  sortVisible: false,
  genderVisible: false,
  advancedVisible: false,
});

// 3. 添加处理函数
const handleSortPress = () => {
  setBottomSheetState(prev => ({ ...prev, sortVisible: true }));
};

// 4. 渲染弹窗组件
<SortBottomSheet
  visible={bottomSheetState.sortVisible}
  selectedSort={selectedSort}
  onSelect={handleSortSelect}
  onClose={closeBottomSheets}
/>
```

## 🎨 设计规范

### 颜色系统

| 用途 | 颜色值 | 说明 |
|------|--------|------|
| 主题色 | #8B5CF6 | 紫色，用于选中状态 |
| 背景色 | #FFFFFF | 白色，弹窗背景 |
| 遮罩层 | rgba(0,0,0,0.4) | 半透明黑色 |
| 选中背景 | #F3E8FF | 浅紫色 |
| 未选中背景 | #F3F4F6 | 浅灰色 |
| 文字颜色 | #1F2937 | 深灰色 |
| 选中文字 | #8B5CF6 | 紫色 |

### 尺寸规范

| 元素 | 尺寸 | 说明 |
|------|------|------|
| 弹窗圆角 | 20px | 顶部圆角 |
| 选项高度 | 56px | 最小点击区域 |
| 按钮高度 | 48-56px | 根据类型 |
| Chip高度 | 自适应 | 内边距8px |
| 底部安全区 | 34px | iOS安全区域 |

### 动画效果

```typescript
// 弹出动画
Animated.spring(slideAnim, {
  toValue: 1,
  useNativeDriver: true,
  tension: 65,
  friction: 11,
}).start();

// 关闭动画
Animated.timing(slideAnim, {
  toValue: 0,
  duration: 200,
  useNativeDriver: true,
}).start();
```

## 📱 交互细节

### 1. 打开弹窗
- 点击筛选按钮
- 遮罩层淡入（fade）
- 弹窗从底部滑入（spring动画）

### 2. 选择选项
- 点击选项
- 立即更新选中状态
- 显示视觉反馈（颜色变化 + ✓）

### 3. 关闭弹窗
- 点击遮罩层
- 点击确认按钮
- 选择选项后自动关闭（排序和性别）
- 弹窗滑出 + 遮罩层淡出

### 4. 应用筛选
- 排序：立即应用
- 性别：立即应用
- 高级筛选：点击"完成"后应用

## 🔧 API 接口

### SortBottomSheet Props

```typescript
interface SortBottomSheetProps {
  visible: boolean;              // 是否显示
  selectedSort: SortOption;      // 当前选中的排序
  onSelect: (sort: SortOption) => void;  // 选择回调
  onClose: () => void;           // 关闭回调
}

type SortOption = 'smart' | 'latest' | 'nearest' | 'popular';
```

### GenderBottomSheet Props

```typescript
interface GenderBottomSheetProps {
  visible: boolean;              // 是否显示
  selectedGender: GenderOption;  // 当前选中的性别
  onSelect: (gender: GenderOption) => void;  // 选择回调
  onClose: () => void;           // 关闭回调
}

type GenderOption = 'all' | 'female' | 'male';
```

### AdvancedFilterSheet Props

```typescript
interface AdvancedFilterSheetProps {
  visible: boolean;              // 是否显示
  filters: AdvancedFilters;      // 当前筛选条件
  onApply: (filters: AdvancedFilters) => void;  // 应用回调
  onReset: () => void;           // 重置回调
  onClose: () => void;           // 关闭回调
}

interface AdvancedFilters {
  status: 'online' | 'all';      // 在线状态
  area: string[];                // 大区
  rank: string[];                // 段位
  priceRange: string[];          // 价格范围
  position: string[];            // 位置
  tags: string[];                // 标签
  location: string[];            // 所在地
}
```

## 🎭 状态管理

### 本地状态

```typescript
// 弹窗显示状态
interface BottomSheetState {
  sortVisible: boolean;
  genderVisible: boolean;
  advancedVisible: boolean;
}

// 筛选条件状态
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

### 状态同步

```typescript
// 排序状态映射
const sortMap: Record<SortOption, FilterState['sortBy']> = {
  smart: 'smart',
  latest: 'smart',
  nearest: 'distance',
  popular: 'rating',
};

// 性别状态直接映射
gender: GenderOption → FilterState['gender']

// 高级筛选状态转换
AdvancedFilters → FilterState['advancedFilters']
```

## 🧪 测试要点

### 功能测试

- [ ] 点击排序按钮，弹窗正常显示
- [ ] 选择排序选项，列表正确排序
- [ ] 点击性别按钮，弹窗正常显示
- [ ] 选择性别选项，列表正确筛选
- [ ] 点击筛选按钮，弹窗正常显示
- [ ] 多选筛选条件，正确应用
- [ ] 点击重置，清空所有筛选
- [ ] 点击遮罩层，弹窗正常关闭

### 交互测试

- [ ] 弹窗动画流畅
- [ ] 选中状态正确显示
- [ ] 按钮点击响应及时
- [ ] 滚动流畅无卡顿
- [ ] 安全区域正确处理

### 兼容性测试

- [ ] iOS正常显示
- [ ] Android正常显示
- [ ] 不同屏幕尺寸适配
- [ ] 横屏模式正常

## 🐛 常见问题

### Q1: 弹窗不显示？
**A:** 检查 `visible` 属性是否正确设置为 `true`

### Q2: 选择后没有反应？
**A:** 检查 `onSelect` 回调是否正确实现并更新状态

### Q3: 弹窗无法关闭？
**A:** 检查 `onClose` 回调是否正确设置状态为 `false`

### Q4: 动画不流畅？
**A:** 确保使用了 `useNativeDriver: true`

### Q5: 高级筛选选项太多？
**A:** 使用 `ScrollView` 并设置合理的 `maxHeight`

## 📝 最佳实践

### 1. 性能优化

```typescript
// 使用 useCallback 避免重复创建函数
const handleSortPress = useCallback(() => {
  setBottomSheetState(prev => ({ ...prev, sortVisible: true }));
}, []);

// 使用 React.memo 优化组件
export const SortBottomSheet = React.memo<SortBottomSheetProps>(({ ... }) => {
  // ...
});
```

### 2. 用户体验

```typescript
// 延迟关闭，让用户看到选中效果
const handleSelect = (sort: SortOption) => {
  onSelect(sort);
  setTimeout(onClose, 150);  // 150ms延迟
};
```

### 3. 状态管理

```typescript
// 统一管理弹窗状态
const closeBottomSheets = useCallback(() => {
  setBottomSheetState({
    sortVisible: false,
    genderVisible: false,
    advancedVisible: false,
  });
}, []);
```

### 4. 错误处理

```typescript
// 添加错误边界
<ErrorBoundary>
  <SortBottomSheet {...props} />
</ErrorBoundary>
```

## 🔄 未来优化

### 短期优化
- [ ] 添加触觉反馈（Haptic Feedback）
- [ ] 支持键盘快捷键
- [ ] 添加搜索功能（高级筛选）
- [ ] 记住用户筛选偏好

### 长期优化
- [ ] 支持自定义筛选项
- [ ] 添加筛选预设
- [ ] 支持筛选历史
- [ ] AI智能推荐筛选

## 📚 相关文档

- [服务详情页主文档](./README.md)
- [设计更新总结](./DESIGN_UPDATE_SUMMARY.md)
- [快速参考指南](./QUICK_REFERENCE.md)

## 📅 更新日期

2025-11-09

## 👥 开发人员

AI Assistant (Claude Sonnet 4.5)

---

## 💡 快速上手

```typescript
// 1. 导入组件
import { 
  SortBottomSheet, 
  GenderBottomSheet, 
  AdvancedFilterSheet 
} from './components';

// 2. 添加到你的页面
<SortBottomSheet
  visible={visible}
  selectedSort="smart"
  onSelect={handleSelect}
  onClose={handleClose}
/>
```

就这么简单！🎉

