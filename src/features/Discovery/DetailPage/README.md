# 动态详情页 (DetailPage)

## 功能概述

动态详情页展示单个动态的完整内容，包括：
- ✅ 顶部图片轮播（支持左右滑动切换）
- ✅ 用户信息和关注按钮
- ✅ 标题和正文内容
- ✅ 话题标签
- ✅ 地理位置
- ✅ 互动统计（浏览、点赞、评论数）
- ✅ 评论列表（支持点赞评论）
- ✅ 底部互动栏（评论输入、点赞、收藏、分享）

## 路由

```
/feed/[id]  -> app/feed/[id].tsx -> DetailPage
```

## 使用方式

### 1. 从其他页面导航到详情页

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// 方式1：通过路由参数
router.push(`/feed/${feedId}` as any);

// 方式2：直接传入 props（如果作为组件使用）
<DetailPage feedId={feedId} />
```

### 2. 图片轮播特性

- 支持水平滑动切换图片
- 右下角显示当前图片索引（如 1/3）
- 3:4 比例展示（适配手机竖屏）
- 黑色背景，突出图片内容

### 3. 评论功能

- 展示一级评论列表
- 支持点赞评论
- 底部输入框发送新评论
- 实时更新评论数量

## API 集成 TODO

当前使用模拟数据，需要对接真实 API：

### 获取动态详情

```typescript
// TODO: src/features/Discovery/DetailPage/index.tsx - loadDetail()
// 接口: GET /api/content/{contentId}
// 响应: Feed 对象（参考 src/features/Discovery/types.ts）

const loadDetail = async () => {
  setLoading(true);
  try {
    // 替换为真实 API 调用
    const response = await fetch(`${API_BASE_URL}/content/${feedId}`);
    const data = await response.json();
    setFeed(data);
    
    // 加载评论
    const commentsResponse = await fetch(`${API_BASE_URL}/content/${feedId}/comments`);
    const commentsData = await commentsResponse.json();
    setComments(commentsData);
  } catch (error) {
    Alert.alert('错误', '加载失败，请重试');
  } finally {
    setLoading(false);
  }
};
```

### 互动操作

```typescript
// TODO: 对接以下 API
// - 点赞/取消点赞: POST /api/content/{contentId}/like
// - 收藏/取消收藏: POST /api/content/{contentId}/collect
// - 关注用户: POST /api/user/{userId}/follow
// - 发送评论: POST /api/content/{contentId}/comment
// - 点赞评论: POST /api/comment/{commentId}/like
```

## 数据结构

参考 `src/features/Discovery/types.ts`:
- `Feed` - 动态数据
- `Comment` - 评论数据
- `MediaItem` - 媒体项（图片/视频）
- `Topic` - 话题标签

## 样式规范

- 主色调：`#8A2BE2` (紫色)
- 卡片背景：`#FFFFFF`
- 页面背景：`#F5F5F5`
- 文字主色：`#000000`
- 文字次色：`#666666`
- 文字三级：`#999999`
- 点赞激活色：`#FF4444`

## 优化建议

1. **图片预加载**: 预加载下一张图片，提升滑动体验
2. **评论分页**: 当评论过多时，实现分页加载
3. **视频支持**: 添加视频播放器组件
4. **图片预览**: 点击图片全屏预览
5. **回复评论**: 支持二级回复功能
6. **长按菜单**: 复制、举报等操作

