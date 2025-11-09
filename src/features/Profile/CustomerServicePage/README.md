# CustomerServicePage - 客服页面

## 功能概述
在线客服聊天界面，用户可以与客服进行实时沟通。

## 主要功能
1. **消息展示**
   - 客服消息（左侧，白色气泡）
   - 用户消息（右侧，紫色气泡）
   - 显示消息时间戳

2. **消息发送**
   - 文字消息输入
   - 多行文本支持
   - 实时发送

3. **富媒体支持**
   - 图片上传功能（待实现）
   - 表情选择功能（待实现）

4. **用户体验**
   - 自动滚动到最新消息
   - 键盘自适应
   - 消息气泡样式区分

## 页面结构
```
CustomerServicePage
├── Header（顶部导航栏）
│   ├── 返回按钮
│   └── 标题"客服"
├── MessagesContainer（消息列表）
│   └── MessageItem（消息项）
│       ├── Avatar（头像）
│       └── MessageBubble（消息气泡）
└── InputContainer（输入栏）
    ├── TextInput（文本输入框）
    ├── ImageButton（图片按钮）
    └── EmojiButton（表情按钮）
```

## 数据结构
```typescript
interface Message {
  id: string;
  type: 'user' | 'service';  // 消息类型
  content: string;            // 消息内容
  timestamp: Date;            // 时间戳
}
```

## 路由配置
- 路由路径: `/profile/customer-service`
- 导航方式: `router.push('/profile/customer-service')`

## 待实现功能
1. 图片选择与上传
2. 表情选择面板
3. WebSocket 实时通信
4. 消息历史记录加载
5. 客服在线状态显示
6. 消息已读/未读状态

## 使用示例
```typescript
// 从"我的"页面导航
router.push('/profile/customer-service');
```

## 注意事项
1. 当前为模拟客服回复，实际需要接入后端 WebSocket
2. 图片上传功能需要集成图片选择器
3. 需要处理消息发送失败的情况
4. 需要实现消息重发机制

