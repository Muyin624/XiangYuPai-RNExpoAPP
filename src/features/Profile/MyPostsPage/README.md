# 我的发布页面 (MyPostsPage)

## 📋 功能概述

展示当前用户发布的所有内容，包括动态、服务和活动。

## 🎨 设计特点

- **布局风格**: 完全参考技能卡片（SkillCard）的布局设计
- **背景色**: 淡紫色背景 (#F9F5FF)
- **边框**: 紫色边框 (#E8D5FF)
- **卡片结构**: 横向布局，左侧封面图，右侧信息，右边箭头

## 🚀 路由配置

### 入口
- 路径: `/profile/my-posts`
- 从"我的"页面点击"我的发布"进入

### 跳转
- 点击卡片 → `/skill/[skillId]` (技能详情页)
- 传递参数 `isMyProduct=true` 标识这是自己的产品
- 技能详情页会显示"管理"按钮而不是"下单"按钮
- 点击"管理"按钮 → `/profile/manage-post` (接单页面)

## 📦 组件结构

```
MyPostsPage/
├── index.tsx          # 主组件
├── mockData.ts        # 虚拟数据
└── README.md          # 说明文档
```

## 🔧 使用的数据

### 当前状态
使用虚拟数据（mockData.ts）进行开发和测试

### 切换到真实API
在 `index.tsx` 中找到 `loadMyPosts` 函数，注释掉虚拟数据代码，取消注释真实API代码：

```typescript
// 🔥 使用虚拟数据
// const data = await getMockMyPosts(page, 20);

// 使用真实API
const data = await contentApi.getMyContents({
  pageNum: page,
  pageSize: 20,
});
```

## 📱 卡片内容

每个卡片显示：
1. **封面图** (100x140)
2. **标题** + **类型标签**（动态/服务/活动）
3. **摘要**（最多2行）
4. **标签**（最多3个）
5. **价格/浏览量** + **距离**
6. **位置信息**
7. **活动时间**（仅活动类型）
8. **箭头图标**

## 🎯 交互功能

- ✅ 下拉刷新
- ✅ 上拉加载更多
- ✅ 点击卡片跳转详情
- ✅ 空状态提示
- ✅ 加载状态显示

## 🔗 相关文件

- **路由配置**: `app/profile/_layout.tsx`
- **路由文件**: `app/profile/my-posts.tsx`
- **详情页**: `app/skill/[skillId].tsx` → `src/features/Profile/OtherUserProfilePage/DetailPage.tsx`
- **管理页面**: `app/profile/manage-post.tsx` → `src/features/Profile/ManagePostPage/index.tsx`
- **API接口**: `services/api/contentApi.ts`

## 📝 虚拟数据说明

虚拟数据包含8条测试内容：
- 2条服务类型（陪玩）
- 2条活动类型（K歌、桌游）
- 4条动态类型（咖啡、市集等）

每条数据都包含完整的字段：
- 标题、摘要、封面图
- 位置、距离
- 标签、类型
- 统计数据（浏览量、点赞等）

## ✨ 样式参考

完全参考 `src/features/Profile/MainPage/TabContentArea/ProfileContent/SkillCard.tsx` 的样式设计。

## 🐛 调试

查看控制台日志：
- `[MyPostsPage] 使用虚拟数据加载我的发布`
- `[MyPostsPage] 加载成功`
- `🧭 导航: 我的发布 → 技能详情页（我的产品）`

