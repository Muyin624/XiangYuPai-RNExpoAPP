# 话题详情页 (TopicDetailPage)

## 📋 概述

话题详情页面，展示特定话题下的所有动态内容，用户可以浏览、互动和发现相关内容。

## ✨ 功能特性

### 1. 话题信息展示
- ✅ 话题名称
- ✅ 话题描述
- ✅ 参与人数统计
- ✅ 帖子数量统计
- ✅ 浏览量统计

### 2. 动态列表
- ✅ 瀑布流式动态卡片
- ✅ 用户信息展示
- ✅ 动态内容预览
- ✅ 图片展示
- ✅ 互动数据（点赞、评论）

### 3. 交互功能
- ✅ 点击动态卡片 → 跳转动态详情
- ✅ 点击用户头像/昵称 → 跳转用户主页
- ✅ 点赞动态
- ✅ 下拉刷新
- ✅ 上拉加载更多

### 4. 导航功能
- ✅ 返回按钮
- ✅ 话题标题显示

## 🎨 UI结构

```
TopicDetailPage
├── 头部导航栏
│   ├── 返回按钮
│   ├── 话题名称
│   └── 占位符
├── 话题信息区域
│   └── 话题名称 (# + 名称)
└── 动态列表
    └── 动态卡片 (循环)
        ├── 用户信息
        │   ├── 头像
        │   ├── 昵称
        │   └── 标签（达人等）
        ├── 内容区域
        │   ├── 标题
        │   ├── 正文内容
        │   ├── 图片
        │   └── 话题标签
        └── 底部互动栏
            ├── 发布时间
            ├── 地点
            └── 互动按钮
                ├── 点赞
                └── 评论
```

## 📦 组件接口

```typescript
interface TopicDetailPageProps {
  topicId: string;  // 话题ID
}

interface TopicInfo {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  participantCount: number;
  postCount: number;
  viewCount?: number;
}
```

## 🔧 使用方法

### 路由配置

```tsx
// app/topic/[topicId].tsx
import TopicDetailPage from '@/src/features/Discovery/TopicDetailPage';

export default function TopicDetailScreen() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  
  return (
    <ErrorBoundary>
      <TopicDetailPage topicId={topicId} />
    </ErrorBoundary>
  );
}
```

### 跳转到话题页

```tsx
// 从动态详情页跳转
const handleTopicPress = (topicName: string) => {
  router.push({
    pathname: '/topic/[topicId]',
    params: { topicId: topicName },
  });
};

// 从话题标签跳转
<TouchableOpacity onPress={() => handleTopicPress(topic.name)}>
  <Text>#{topic.name}</Text>
</TouchableOpacity>
```

## 🎯 数据流

### 1. 加载话题数据

```typescript
const loadTopicData = async () => {
  // 1. 获取话题信息
  const topicInfo = await fetchTopicInfo(topicId);
  
  // 2. 获取话题下的动态列表
  const feeds = await fetchTopicFeeds(topicId, page);
  
  setTopicInfo(topicInfo);
  setFeeds(feeds);
};
```

### 2. 刷新数据

```typescript
const handleRefresh = async () => {
  setRefreshing(true);
  await loadTopicData();
  setRefreshing(false);
};
```

### 3. 加载更多

```typescript
const handleLoadMore = async () => {
  if (loadingMore || !hasMore) return;
  
  setLoadingMore(true);
  const moreFeeds = await fetchTopicFeeds(topicId, page + 1);
  setFeeds([...feeds, ...moreFeeds]);
  setPage(page + 1);
  setLoadingMore(false);
};
```

## 🎨 样式特点

### 1. 卡片设计
- 白色背景
- 16px 内边距
- 8px 底部间距
- 圆角图片

### 2. 用户信息
- 40x40 圆形头像
- 用户标签（橙色背景）
- 紧凑布局

### 3. 内容展示
- 标题：16px，加粗
- 正文：15px，最多3行
- 图片：1:1 比例，圆角

### 4. 互动栏
- 时间和地点左对齐
- 互动按钮右对齐
- 图标 + 数字组合

## 📱 交互设计

### 1. 点击反馈
- 卡片：activeOpacity 0.9
- 按钮：activeOpacity 0.7
- 平滑过渡

### 2. 加载状态
- 初始加载：居中转圈
- 下拉刷新：系统刷新控件
- 加载更多：底部小转圈

### 3. 空状态
- 话题不存在：提示文字
- 无动态：空列表

## 🔄 后续优化

### 功能增强
- [ ] 话题关注功能
- [ ] 话题搜索
- [ ] 动态筛选（最新/最热）
- [ ] 话题相关推荐
- [ ] 发布动态到话题

### 性能优化
- [ ] 图片懒加载
- [ ] 虚拟列表优化
- [ ] 缓存话题数据
- [ ] 预加载下一页

### 用户体验
- [ ] 骨架屏加载
- [ ] 平滑滚动动画
- [ ] 返回顶部按钮
- [ ] 分享话题功能

## 🎯 API 集成

### 需要对接的接口

```typescript
// 1. 获取话题信息
GET /api/topic/{topicId}
Response: {
  id: string;
  name: string;
  description: string;
  participantCount: number;
  postCount: number;
  viewCount: number;
}

// 2. 获取话题下的动态列表
GET /api/topic/{topicId}/feeds?page=1&pageSize=10
Response: {
  list: Feed[];
  hasMore: boolean;
  total: number;
}

// 3. 点赞动态
POST /api/feed/{feedId}/like
Response: {
  success: boolean;
  likeCount: number;
}
```

## 📝 注意事项

1. **话题ID处理**
   - 当前使用话题名称作为ID
   - 实际应该使用唯一的话题ID
   - 需要后端提供话题ID映射

2. **数据同步**
   - 点赞状态需要与详情页同步
   - 评论数需要实时更新
   - 考虑使用全局状态管理

3. **性能考虑**
   - 大量图片需要优化加载
   - 列表滚动性能优化
   - 避免重复请求

4. **用户体验**
   - 加载状态要明确
   - 错误提示要友好
   - 网络异常处理

## 🎨 设计规范

### 颜色
- 主色：#8A2BE2（紫色）
- 背景色：#F5F5F5（浅灰）
- 卡片背景：#FFFFFF（白色）
- 文字主色：#000000（黑色）
- 文字次要：#666666（深灰）
- 文字三级：#999999（中灰）

### 字体
- 标题：16-20px，加粗
- 正文：15px，常规
- 辅助信息：13-14px，常规
- 小字：11-12px，常规

### 间距
- 卡片间距：8px
- 内容边距：16px
- 元素间距：12px
- 小间距：4-8px

## ✅ 完成状态

- [x] 创建话题详情页路由
- [x] 实现话题详情页组件
- [x] 动态列表展示
- [x] 用户交互功能
- [x] 导航跳转功能
- [x] 下拉刷新功能
- [x] 上拉加载更多
- [ ] API 对接
- [ ] 真实数据展示
- [ ] 性能优化

