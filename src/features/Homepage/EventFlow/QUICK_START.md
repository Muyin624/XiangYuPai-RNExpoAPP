# 组局中心 - Quick Start Guide

## 🚀 快速开始

### 访问组局中心
在应用中导航到组局中心：
```
首页 → 组局中心
```

或通过代码：
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/homepage/event-center');
```

## 📋 主要功能

### 1. 浏览组局列表
- 查看所有可用的组局活动
- 查看活动详情（标题、时间、地点、价格、人数）
- 点击卡片查看详细信息

### 2. 筛选组局
点击顶部的三个筛选按钮：

#### 智能排序
- 智能排序（默认）
- 最新排序
- 最近排序
- 人气排序

#### 性别筛选
- 不限性别（默认）
- 只看女生
- 只看男生

#### 高级筛选
- 状态筛选
- 价格范围
- 活动标签
- 所在地

### 3. 发布组局
1. 点击右上角"发布组局"按钮
2. 选择活动类型（6个图标）
3. 填写活动信息：
   - 标题
   - 正文
   - 时间
   - 地点
   - 定价
   - 人数
   - 报名截止时间
4. 点击"发布"按钮
5. 在支付弹窗中：
   - 选择支付方式
   - 输入支付密码（6位）
   - 确认支付
6. 发布成功！

## 🎯 使用场景

### 场景1：寻找K歌活动
1. 进入组局中心
2. 点击"筛选"按钮
3. 选择价格范围和标签
4. 浏览筛选后的结果
5. 点击感兴趣的活动查看详情

### 场景2：发布线下聚会
1. 点击"发布组局"
2. 选择"饭店"图标
3. 填写聚会详情
4. 设置时间和地点
5. 设置价格和人数
6. 完成支付后发布

### 场景3：查看附近活动
1. 点击"最近排序"
2. 查看按距离排序的活动列表
3. 点击活动查看详细地址

## 🔧 开发者指南

### 添加新的活动类型
在 `PublishEventPage/index.tsx` 中修改：

```typescript
const TOPIC_ICONS = [
  { id: 'restaurant', emoji: '🍽️', label: '饭店' },
  { id: 'movie', emoji: '🎬', label: '私影' },
  // 添加新类型
  { id: 'new-type', emoji: '🎨', label: '新类型' },
];
```

### 修改筛选选项
在对应的 BottomSheet 组件中修改选项数组：

```typescript
// SortBottomSheet.tsx
const SORT_OPTIONS = [
  { id: 'smart', label: '智能排序' },
  // 添加新选项
  { id: 'new-sort', label: '新排序' },
];
```

### 自定义颜色
在组件文件中修改 `COLORS` 常量：

```typescript
const COLORS = {
  PRIMARY: '#8B5CF6',    // 主色
  BACKGROUND: '#F8F9FA', // 背景色
  // 修改或添加新颜色
};
```

### 连接API
在相应的处理函数中添加API调用：

```typescript
const handleEventPress = useCallback(async (eventId: string) => {
  // 添加API调用
  const response = await fetch(`/api/events/${eventId}`);
  const data = await response.json();
  // 处理数据
}, []);
```

## 📱 测试清单

### 功能测试
- [ ] 组局列表正常显示
- [ ] 筛选功能正常工作
- [ ] 发布组局流程完整
- [ ] 支付弹窗正常显示
- [ ] 导航跳转正确

### UI测试
- [ ] 卡片布局正确
- [ ] 颜色符合设计
- [ ] 字体大小合适
- [ ] 间距正确
- [ ] 圆角和阴影正确

### 交互测试
- [ ] 点击反馈正常
- [ ] 动画流畅
- [ ] 弹窗打开/关闭正常
- [ ] 表单验证正确
- [ ] 键盘处理正确

### 兼容性测试
- [ ] iOS 正常运行
- [ ] Android 正常运行
- [ ] 不同屏幕尺寸适配
- [ ] 刘海屏适配
- [ ] 横屏模式（如需要）

## 🐛 常见问题

### Q: 组局列表为空？
A: 当前使用模拟数据，如果列表为空，请检查 `MOCK_EVENTS` 数组是否有数据。

### Q: 筛选功能不生效？
A: 当前筛选功能只更新了状态，需要连接API后才能真正过滤数据。

### Q: 支付密码输入不显示？
A: 检查是否选择了"余额支付"方式，只有选择余额支付才显示密码输入。

### Q: 发布按钮点击无反应？
A: 检查是否填写了所有必填字段，表单验证会阻止提交。

### Q: 导航跳转失败？
A: 检查路由配置是否正确，确保在 `_layout.tsx` 中已添加对应的路由。

## 📚 相关文档

- [实现总结](./IMPLEMENTATION_SUMMARY.md) - 完整的实现说明
- [视觉指南](./VISUAL_GUIDE.md) - 详细的UI设计说明
- [组件API文档](./API_REFERENCE.md) - 组件接口文档（待创建）

## 🎓 学习资源

### React Native
- [React Native 官方文档](https://reactnative.dev/)
- [Expo 官方文档](https://docs.expo.dev/)

### Expo Router
- [Expo Router 文档](https://docs.expo.dev/router/introduction/)
- [文件路由系统](https://docs.expo.dev/router/create-pages/)

### TypeScript
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## 💡 最佳实践

### 1. 组件设计
- 保持组件单一职责
- 使用 TypeScript 定义清晰的接口
- 提取可复用的组件

### 2. 状态管理
- 使用 `useState` 管理本地状态
- 使用 `useCallback` 优化回调函数
- 考虑使用全局状态管理（如需要）

### 3. 性能优化
- 使用 `React.memo` 避免不必要的重渲染
- 使用 `FlatList` 处理长列表
- 图片使用合适的尺寸和格式

### 4. 用户体验
- 提供即时的操作反馈
- 添加加载状态
- 处理错误情况
- 提供友好的空状态

### 5. 代码质量
- 遵循项目代码规范
- 添加必要的注释
- 编写可维护的代码
- 定期重构优化

## 🔄 更新日志

### v1.0.0 (2024-11-09)
- ✅ 实现组局中心页面
- ✅ 实现三个筛选功能
- ✅ 实现发布组局页面
- ✅ 实现支付弹窗
- ✅ 完成路由配置
- ✅ 添加完整文档

## 📞 获取帮助

如有问题或建议，请：
1. 查看相关文档
2. 检查代码注释
3. 查看 TODO 注释了解待实现功能
4. 联系开发团队

## 🎉 下一步

1. **连接API**: 将模拟数据替换为真实API
2. **完善功能**: 实现时间/地点选择器等待开发功能
3. **优化体验**: 添加加载状态、错误处理等
4. **测试**: 进行完整的功能和UI测试
5. **发布**: 准备发布到生产环境

---

**Happy Coding! 🚀**

