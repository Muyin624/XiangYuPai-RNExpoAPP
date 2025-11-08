/**
 * Messages Module Types - 消息模块类型定义
 * 
 * 包含所有页面、组件、Store、API的TypeScript类型定义
 */

// ============================================
// 基础数据类型
// ============================================

/**
 * 用户基础信息
 */
export interface User {
  id: string;
  nickname: string;
  avatar: string;
  isOnline?: boolean;
}

/**
 * 对话类型
 */
export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: number;
  isRead: boolean;
  unreadCount: number;
}

/**
 * 消息类型
 */
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: number;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}

/**
 * 通知类型
 */
export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'system';
  user?: User;
  content: string;
  timestamp: number;
  isRead: boolean;
  isFollowing?: boolean; // 是否已回关（仅用于follow类型）
  isMutualFollow?: boolean; // 是否互相关注（仅用于follow类型）
  relatedContent?: {
    type: 'post' | 'comment';
    preview?: string;
    imageUrl?: string;
  };
}

// ============================================
// 消息分类类型
// ============================================

/**
 * 消息分类枚举
 */
export enum MessageCategory {
  LIKES = 'likes',
  COMMENTS = 'comments',
  FOLLOWERS = 'followers',
  NOTIFICATIONS = 'notifications',
}

/**
 * 消息分类卡片数据
 */
export interface CategoryCardData {
  id: MessageCategory;
  title: string;
  icon: string;
  unreadCount: number;
  route: string;
}

// ============================================
// 页面Props类型
// ============================================

/**
 * 通用页面Props
 */
export interface BasePageProps {
  style?: any;
}

/**
 * MainPage Props
 */
export interface MainPageProps extends BasePageProps {}

/**
 * LikesPage Props
 */
export interface LikesPageProps extends BasePageProps {}

/**
 * CommentsPage Props
 */
export interface CommentsPageProps extends BasePageProps {}

/**
 * FollowersPage Props
 */
export interface FollowersPageProps extends BasePageProps {}

/**
 * NotificationsPage Props
 */
export interface NotificationsPageProps extends BasePageProps {}

/**
 * ChatPage Props
 */
export interface ChatPageProps extends BasePageProps {
  conversationId: string;
}

// ============================================
// 组件Props类型
// ============================================

/**
 * MessageItem Props
 */
export interface MessageItemProps {
  id: string;
  type: 'conversation' | 'notification';
  avatar: string;
  title: string;
  subtitle: string;
  timestamp: number;
  isRead: boolean;
  unreadCount?: number;
  onPress: () => void;
  onLongPress?: () => void;
  onDelete?: () => void;
  style?: any;
}

/**
 * UserAvatar Props
 */
export interface UserAvatarProps {
  avatar: string;
  size?: 'small' | 'medium' | 'large' | number;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
  unreadCount?: number;
  onPress?: () => void;
  style?: any;
}

/**
 * ChatBubble Props
 */
export interface ChatBubbleProps {
  id: string;
  content: string;
  timestamp: number;
  isSelf: boolean;
  status?: 'sending' | 'sent' | 'failed';
  onPress?: () => void;
  onLongPress?: () => void;
  onResend?: () => void;
}

/**
 * SwipeActions Props
 */
export interface SwipeActionsProps {
  children: React.ReactNode;
  rightActions?: Array<{
    text: string;
    color: string;
    onPress: () => void;
  }>;
  leftActions?: Array<{
    text: string;
    color: string;
    onPress: () => void;
  }>;
  closeOnPress?: boolean;
}

// ============================================
// Store类型
// ============================================

/**
 * 分类未读计数类型
 */
export interface CategoryUnreadCounts {
  likes: number;
  comments: number;
  followers: number;
  notifications: number;
}

/**
 * MessagesStore状态类型
 */
export interface MessagesState {
  conversations: Conversation[];
  unreadCount: number;
  categoryUnreadCounts: CategoryUnreadCounts;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadConversations: () => Promise<void>;
  loadCategoryUnreadCounts: () => Promise<void>;
  markAsRead: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  refreshConversations: () => Promise<void>;
  clearAllConversations: () => void;
}

/**
 * ChatStore状态类型
 */
export interface ChatState {
  currentChat: Conversation | null;
  messages: Message[];
  inputText: string;
  loading: boolean;
  
  // Actions
  setCurrentChat: (conversation: Conversation | null) => void;
  loadMessages: (chatId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  setInputText: (text: string) => void;
  clearChat: () => void;
}

/**
 * WebSocketStore状态类型
 */
export interface WebSocketState {
  connected: boolean;
  reconnectAttempts: number;
  
  // Actions
  connect: () => void;
  disconnect: () => void;
  sendEvent: (event: string, data: any) => void;
}

// ============================================
// API响应类型
// ============================================

/**
 * API通用响应
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 对话列表响应
 */
export interface ConversationsResponse {
  conversations: Conversation[];
  total: number;
  hasMore: boolean;
}

/**
 * 消息列表响应
 */
export interface MessagesResponse {
  messages: Message[];
  total: number;
  hasMore: boolean;
}

/**
 * 通知列表响应
 */
export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  hasMore: boolean;
}
