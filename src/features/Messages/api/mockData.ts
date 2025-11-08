/**
 * Messages Mock Data - 消息模块虚拟数据
 * 
 * 用于开发和测试的虚拟数据
 */

import type {
    Conversation,
    ConversationsResponse,
    Message,
    MessagesResponse,
    Notification,
    NotificationsResponse,
    User,
} from '../types';

// ============================================
// 虚拟用户数据
// ============================================

export const MOCK_USERS: User[] = [
  {
    id: '1',
    nickname: '张小明',
    avatar: 'https://i.pravatar.cc/150?img=1',
    isOnline: true,
  },
  {
    id: '2',
    nickname: '李小红',
    avatar: 'https://i.pravatar.cc/150?img=2',
    isOnline: false,
  },
  {
    id: '3',
    nickname: '王大伟',
    avatar: 'https://i.pravatar.cc/150?img=3',
    isOnline: true,
  },
  {
    id: '4',
    nickname: '赵小芳',
    avatar: 'https://i.pravatar.cc/150?img=4',
    isOnline: true,
  },
  {
    id: '5',
    nickname: '刘建国',
    avatar: 'https://i.pravatar.cc/150?img=5',
    isOnline: false,
  },
  {
    id: '6',
    nickname: '陈美丽',
    avatar: 'https://i.pravatar.cc/150?img=6',
    isOnline: true,
  },
  {
    id: '7',
    nickname: '杨志强',
    avatar: 'https://i.pravatar.cc/150?img=7',
    isOnline: false,
  },
  {
    id: '8',
    nickname: '周雪梅',
    avatar: 'https://i.pravatar.cc/150?img=8',
    isOnline: true,
  },
  {
    id: '9',
    nickname: '吴文华',
    avatar: 'https://i.pravatar.cc/150?img=9',
    isOnline: false,
  },
  {
    id: '10',
    nickname: '郑小燕',
    avatar: 'https://i.pravatar.cc/150?img=10',
    isOnline: true,
  },
];

// ============================================
// 虚拟对话数据
// ============================================

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    user: MOCK_USERS[0],
    lastMessage: '好的，明天见！',
    timestamp: Date.now() - 5 * 60 * 1000, // 5分钟前
    isRead: false,
    unreadCount: 2,
  },
  {
    id: 'conv-2',
    user: MOCK_USERS[1],
    lastMessage: '你看到我发的文件了吗？',
    timestamp: Date.now() - 30 * 60 * 1000, // 30分钟前
    isRead: false,
    unreadCount: 1,
  },
  {
    id: 'conv-3',
    user: MOCK_USERS[2],
    lastMessage: '谢谢你的帮助！',
    timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2小时前
    isRead: true,
    unreadCount: 0,
  },
  {
    id: 'conv-4',
    user: MOCK_USERS[3],
    lastMessage: '周末有空一起吃饭吗？',
    timestamp: Date.now() - 5 * 60 * 60 * 1000, // 5小时前
    isRead: false,
    unreadCount: 3,
  },
  {
    id: 'conv-5',
    user: MOCK_USERS[4],
    lastMessage: '项目进展如何了？',
    timestamp: Date.now() - 24 * 60 * 60 * 1000, // 1天前
    isRead: true,
    unreadCount: 0,
  },
  {
    id: 'conv-6',
    user: MOCK_USERS[5],
    lastMessage: '收到，我马上处理',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2天前
    isRead: true,
    unreadCount: 0,
  },
  {
    id: 'conv-7',
    user: MOCK_USERS[6],
    lastMessage: '这个想法不错！',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3天前
    isRead: true,
    unreadCount: 0,
  },
  {
    id: 'conv-8',
    user: MOCK_USERS[7],
    lastMessage: '明天的会议改到下午3点',
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5天前
    isRead: false,
    unreadCount: 1,
  },
  {
    id: 'conv-9',
    user: MOCK_USERS[8],
    lastMessage: '好的，没问题',
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7天前
    isRead: true,
    unreadCount: 0,
  },
  {
    id: 'conv-10',
    user: MOCK_USERS[9],
    lastMessage: '我们下周再讨论吧',
    timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10天前
    isRead: true,
    unreadCount: 0,
  },
];

// ============================================
// 虚拟聊天消息数据
// ============================================

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1-1',
      conversationId: 'conv-1',
      senderId: '1',
      content: '你好，最近怎么样？',
      timestamp: Date.now() - 60 * 60 * 1000,
      status: 'read',
    },
    {
      id: 'msg-1-2',
      conversationId: 'conv-1',
      senderId: 'current-user',
      content: '挺好的，你呢？',
      timestamp: Date.now() - 50 * 60 * 1000,
      status: 'read',
    },
    {
      id: 'msg-1-3',
      conversationId: 'conv-1',
      senderId: '1',
      content: '也不错，明天有时间吗？想约你聊聊新项目的事情',
      timestamp: Date.now() - 40 * 60 * 1000,
      status: 'read',
    },
    {
      id: 'msg-1-4',
      conversationId: 'conv-1',
      senderId: 'current-user',
      content: '可以啊，几点？',
      timestamp: Date.now() - 30 * 60 * 1000,
      status: 'read',
    },
    {
      id: 'msg-1-5',
      conversationId: 'conv-1',
      senderId: '1',
      content: '下午2点怎么样？在咖啡厅见面',
      timestamp: Date.now() - 20 * 60 * 1000,
      status: 'read',
    },
    {
      id: 'msg-1-6',
      conversationId: 'conv-1',
      senderId: 'current-user',
      content: '好的，明天见！',
      timestamp: Date.now() - 5 * 60 * 1000,
      status: 'sent',
    },
  ],
  'conv-2': [
    {
      id: 'msg-2-1',
      conversationId: 'conv-2',
      senderId: '2',
      content: '我刚发了一个文件给你',
      timestamp: Date.now() - 60 * 60 * 1000,
      status: 'read',
    },
    {
      id: 'msg-2-2',
      conversationId: 'conv-2',
      senderId: '2',
      content: '你看到我发的文件了吗？',
      timestamp: Date.now() - 30 * 60 * 1000,
      status: 'delivered',
    },
  ],
  'conv-3': [
    {
      id: 'msg-3-1',
      conversationId: 'conv-3',
      senderId: '3',
      content: '能帮我看看这个问题吗？',
      timestamp: Date.now() - 5 * 60 * 60 * 1000,
      status: 'read',
    },
    {
      id: 'msg-3-2',
      conversationId: 'conv-3',
      senderId: 'current-user',
      content: '当然可以，发给我看看',
      timestamp: Date.now() - 4 * 60 * 60 * 1000,
      status: 'read',
    },
    {
      id: 'msg-3-3',
      conversationId: 'conv-3',
      senderId: '3',
      content: '已经解决了，谢谢你的帮助！',
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      status: 'read',
    },
  ],
  'conv-4': [
    {
      id: 'msg-4-1',
      conversationId: 'conv-4',
      senderId: '4',
      content: '好久不见！',
      timestamp: Date.now() - 10 * 60 * 60 * 1000,
      status: 'read',
    },
    {
      id: 'msg-4-2',
      conversationId: 'conv-4',
      senderId: '4',
      content: '周末有空一起吃饭吗？',
      timestamp: Date.now() - 5 * 60 * 60 * 1000,
      status: 'delivered',
    },
  ],
  'conv-5': [
    {
      id: 'msg-5-1',
      conversationId: 'conv-5',
      senderId: '5',
      content: '项目进展如何了？',
      timestamp: Date.now() - 24 * 60 * 60 * 1000,
      status: 'read',
    },
  ],
};

// ============================================
// 虚拟通知数据
// ============================================

export const MOCK_LIKES_NOTIFICATIONS: Notification[] = [
  {
    id: 'like-1',
    type: 'like',
    user: MOCK_USERS[0],
    content: '赞了你的动态',
    timestamp: Date.now() - 10 * 60 * 1000,
    isRead: false,
    relatedContent: {
      type: 'post',
      preview: '今天天气真不错，适合出去走走...',
      imageUrl: 'https://picsum.photos/200/200?random=1',
    },
  },
  {
    id: 'like-2',
    type: 'like',
    user: MOCK_USERS[1],
    content: '赞了你的动态',
    timestamp: Date.now() - 30 * 60 * 1000,
    isRead: false,
    relatedContent: {
      type: 'post',
      preview: '分享一个很棒的学习资源...',
      imageUrl: 'https://picsum.photos/200/200?random=2',
    },
  },
  {
    id: 'like-3',
    type: 'like',
    user: MOCK_USERS[2],
    content: '收藏了你的动态',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    isRead: true,
    relatedContent: {
      type: 'post',
      preview: 'React Native开发技巧总结...',
    },
  },
  {
    id: 'like-4',
    type: 'like',
    user: MOCK_USERS[3],
    content: '赞了你的动态',
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    isRead: true,
    relatedContent: {
      type: 'post',
      preview: '周末去爬山的照片...',
      imageUrl: 'https://picsum.photos/200/200?random=3',
    },
  },
  {
    id: 'like-5',
    type: 'like',
    user: MOCK_USERS[4],
    content: '赞了你的评论',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    isRead: true,
    relatedContent: {
      type: 'comment',
      preview: '这个想法很有创意！',
    },
  },
];

export const MOCK_COMMENTS_NOTIFICATIONS: Notification[] = [
  {
    id: 'comment-1',
    type: 'comment',
    user: MOCK_USERS[5],
    content: '评论了你的动态：很有意思的分享！',
    timestamp: Date.now() - 15 * 60 * 1000,
    isRead: false,
    relatedContent: {
      type: 'post',
      preview: '今天学到了一个新技能...',
      imageUrl: 'https://picsum.photos/200/200?random=4',
    },
  },
  {
    id: 'comment-2',
    type: 'comment',
    user: MOCK_USERS[6],
    content: '回复了你的评论：我也这么认为',
    timestamp: Date.now() - 45 * 60 * 1000,
    isRead: false,
    relatedContent: {
      type: 'comment',
      preview: '关于项目管理的讨论...',
    },
  },
  {
    id: 'comment-3',
    type: 'comment',
    user: MOCK_USERS[7],
    content: '评论了你的动态：能分享一下经验吗？',
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    isRead: true,
    relatedContent: {
      type: 'post',
      preview: '职场成长的一些心得...',
    },
  },
  {
    id: 'comment-4',
    type: 'comment',
    user: MOCK_USERS[8],
    content: '评论了你的动态：谢谢分享！',
    timestamp: Date.now() - 6 * 60 * 60 * 1000,
    isRead: true,
    relatedContent: {
      type: 'post',
      preview: '推荐几本好书...',
      imageUrl: 'https://picsum.photos/200/200?random=5',
    },
  },
];

export const MOCK_FOLLOWERS_NOTIFICATIONS: Notification[] = [
  {
    id: 'follow-1',
    type: 'follow',
    user: MOCK_USERS[9],
    content: '关注了你',
    timestamp: Date.now() - 20 * 60 * 1000,
    isRead: false,
    isFollowing: false,
    isMutualFollow: false,
  },
  {
    id: 'follow-2',
    type: 'follow',
    user: MOCK_USERS[0],
    content: '关注了你',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    isRead: false,
    isFollowing: false,
    isMutualFollow: false,
  },
  {
    id: 'follow-3',
    type: 'follow',
    user: MOCK_USERS[1],
    content: '关注了你',
    timestamp: Date.now() - 12 * 60 * 60 * 1000,
    isRead: true,
    isFollowing: true,
    isMutualFollow: true,
  },
  {
    id: 'follow-4',
    type: 'follow',
    user: MOCK_USERS[2],
    content: '关注了你',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    isRead: true,
    isFollowing: false,
    isMutualFollow: false,
  },
  {
    id: 'follow-5',
    type: 'follow',
    user: MOCK_USERS[3],
    content: '关注了你',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    isRead: true,
    isFollowing: true,
    isMutualFollow: true,
  },
];

export const MOCK_SYSTEM_NOTIFICATIONS: Notification[] = [
  {
    id: 'system-1',
    type: 'system',
    content: '系统将于今晚22:00进行维护，预计持续2小时',
    timestamp: Date.now() - 30 * 60 * 1000,
    isRead: false,
  },
  {
    id: 'system-2',
    type: 'system',
    content: '你的账号安全等级为优秀',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    isRead: false,
  },
  {
    id: 'system-3',
    type: 'system',
    content: '新版本v2.0已发布，快去更新体验吧！',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    isRead: true,
  },
  {
    id: 'system-4',
    type: 'system',
    content: '恭喜你获得"活跃用户"徽章',
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
    isRead: true,
  },
];

// ============================================
// API响应数据生成器
// ============================================

/**
 * 获取对话列表响应
 */
export const getMockConversationsResponse = (): ConversationsResponse => {
  return {
    conversations: MOCK_CONVERSATIONS,
    total: MOCK_CONVERSATIONS.length,
    hasMore: false,
  };
};

/**
 * 获取聊天消息响应
 */
export const getMockMessagesResponse = (chatId: string): MessagesResponse => {
  const messages = MOCK_MESSAGES[chatId] || [];
  return {
    messages,
    total: messages.length,
    hasMore: false,
  };
};

/**
 * 获取通知列表响应
 */
export const getMockNotificationsResponse = (
  type: 'like' | 'comment' | 'follow' | 'system'
): NotificationsResponse => {
  let notifications: Notification[] = [];
  
  switch (type) {
    case 'like':
      notifications = MOCK_LIKES_NOTIFICATIONS;
      break;
    case 'comment':
      notifications = MOCK_COMMENTS_NOTIFICATIONS;
      break;
    case 'follow':
      notifications = MOCK_FOLLOWERS_NOTIFICATIONS;
      break;
    case 'system':
      notifications = MOCK_SYSTEM_NOTIFICATIONS;
      break;
  }
  
  return {
    notifications,
    total: notifications.length,
    hasMore: false,
  };
};

/**
 * 获取分类未读计数
 */
export const getMockCategoryUnreadCounts = () => {
  return {
    likes: MOCK_LIKES_NOTIFICATIONS.filter(n => !n.isRead).length,
    comments: MOCK_COMMENTS_NOTIFICATIONS.filter(n => !n.isRead).length,
    followers: MOCK_FOLLOWERS_NOTIFICATIONS.filter(n => !n.isRead).length,
    notifications: MOCK_SYSTEM_NOTIFICATIONS.filter(n => !n.isRead).length,
  };
};

// ============================================
// 辅助函数
// ============================================

/**
 * 模拟API延迟
 */
export const simulateDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 模拟API错误
 */
export const simulateError = (errorRate: number = 0.1): void => {
  if (Math.random() < errorRate) {
    throw new Error('模拟网络错误');
  }
};

