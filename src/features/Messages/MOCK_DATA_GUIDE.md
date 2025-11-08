# 消息模块虚拟数据指南

## 概述

消息模块已配置完整的虚拟数据（Mock Data），用于开发和测试。所有API调用都可以在不连接真实后端的情况下正常工作。

## 虚拟数据内容

### 1. 用户数据
- **10个虚拟用户**，包含昵称、头像、在线状态
- 头像使用 `pravatar.cc` 服务提供
- 包含在线/离线状态模拟

### 2. 对话数据
- **10个对话**，包含不同时间戳的消息
- 包含已读/未读状态
- 包含未读消息计数
- 时间范围：从5分钟前到10天前

### 3. 聊天消息数据
- **5个对话的完整聊天记录**
- 包含发送者、接收者、时间戳
- 包含消息状态（发送中、已发送、已送达、已读、失败）
- 模拟真实对话场景

### 4. 通知数据

#### 赞和收藏通知
- **5条通知**，包含点赞和收藏
- 包含关联内容预览和图片
- 2条未读，3条已读

#### 评论通知
- **4条通知**，包含评论和回复
- 包含关联内容预览
- 2条未读，2条已读

#### 粉丝通知
- **5条通知**，显示新增粉丝
- 1条未读，4条已读

#### 系统通知
- **4条通知**，包含系统维护、安全提示、版本更新等
- 2条未读，2条已读

## 开关控制

在以下文件中可以控制是否使用虚拟数据：

### messagesApi.ts
```typescript
const USE_MOCK_DATA = true; // 设置为 false 使用真实API
```

### chatApi.ts
```typescript
const USE_MOCK_DATA = true; // 设置为 false 使用真实API
```

### notificationsApi.ts
```typescript
const USE_MOCK_DATA = true; // 设置为 false 使用真实API
```

## 虚拟数据特性

### 1. 模拟延迟
所有API调用都包含模拟网络延迟：
- 读取操作：200-300ms
- 写入操作：500ms

### 2. 错误模拟
可以通过 `simulateError()` 函数模拟网络错误（默认关闭）

### 3. 数据持久化
- 对话列表通过 Zustand persist 中间件持久化
- 聊天消息不持久化，每次从"服务器"加载

## 使用示例

### 查看对话列表
```typescript
import { useMessagesStore } from '@/src/features/Messages/stores';

const MyComponent = () => {
  const { conversations, loadConversations } = useMessagesStore();
  
  useEffect(() => {
    loadConversations();
  }, []);
  
  return (
    // 渲染对话列表
  );
};
```

### 查看聊天消息
```typescript
import { useChatStore } from '@/src/features/Messages/stores';

const ChatComponent = ({ conversationId }) => {
  const { messages, loadMessages } = useChatStore();
  
  useEffect(() => {
    loadMessages(conversationId);
  }, [conversationId]);
  
  return (
    // 渲染聊天消息
  );
};
```

### 查看通知
```typescript
import { notificationsApi } from '@/src/features/Messages/api';

const NotificationsComponent = () => {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    notificationsApi.getNotifications('like').then(response => {
      setNotifications(response.notifications);
    });
  }, []);
  
  return (
    // 渲染通知列表
  );
};
```

## 数据结构

### Conversation（对话）
```typescript
{
  id: string;
  user: User;
  lastMessage: string;
  timestamp: number;
  isRead: boolean;
  unreadCount: number;
}
```

### Message（消息）
```typescript
{
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: number;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}
```

### Notification（通知）
```typescript
{
  id: string;
  type: 'like' | 'comment' | 'follow' | 'system';
  user?: User;
  content: string;
  timestamp: number;
  isRead: boolean;
  relatedContent?: {
    type: 'post' | 'comment';
    preview?: string;
    imageUrl?: string;
  };
}
```

## 切换到真实API

当后端API准备就绪时，按以下步骤切换：

1. **更新API开关**
   ```typescript
   // 在 messagesApi.ts, chatApi.ts, notificationsApi.ts 中
   const USE_MOCK_DATA = false;
   ```

2. **验证API端点**
   ```typescript
   // 在 constants.ts 中检查 API_ENDPOINTS
   export const API_ENDPOINTS = {
     CONVERSATIONS: '/api/conversations',
     // ... 其他端点
   };
   ```

3. **测试真实API**
   - 确保后端服务运行
   - 测试所有页面功能
   - 验证数据格式匹配

## 自定义虚拟数据

如需修改虚拟数据，编辑以下文件：

```
src/features/Messages/api/mockData.ts
```

可以修改：
- 用户数量和信息
- 对话内容和时间
- 通知类型和内容
- 模拟延迟时间

## 调试技巧

### 查看API调用
所有API调用都有 console.log，可以在开发者工具中查看：
```
[messagesApi] getConversations
[chatApi] getMessages
[notificationsApi] getNotifications
```

### 查看Store状态
使用 Zustand DevTools：
```typescript
// 在浏览器中安装 Redux DevTools Extension
// Store 状态会自动显示在 DevTools 中
```

### 清除持久化数据
```typescript
// 在浏览器控制台执行
localStorage.removeItem('messages-storage');
```

## 常见问题

### Q: 为什么看不到虚拟数据？
A: 检查 `USE_MOCK_DATA` 是否设置为 `true`

### Q: 如何添加更多虚拟对话？
A: 在 `mockData.ts` 的 `MOCK_CONVERSATIONS` 数组中添加新对象

### Q: 虚拟数据会影响生产环境吗？
A: 不会，只需将 `USE_MOCK_DATA` 设置为 `false` 即可使用真实API

### Q: 如何模拟网络错误？
A: 在 API 调用中使用 `simulateError()` 函数

## 相关文件

- `src/features/Messages/api/mockData.ts` - 虚拟数据定义
- `src/features/Messages/api/messagesApi.ts` - 消息API
- `src/features/Messages/api/chatApi.ts` - 聊天API
- `src/features/Messages/api/notificationsApi.ts` - 通知API
- `src/features/Messages/stores/messagesStore.ts` - 消息Store
- `src/features/Messages/stores/chatStore.ts` - 聊天Store

## 更新日志

- **2024-11-08**: 初始版本，完整虚拟数据支持
  - 10个用户
  - 10个对话
  - 5组聊天记录
  - 4类通知（赞、评论、粉丝、系统）

