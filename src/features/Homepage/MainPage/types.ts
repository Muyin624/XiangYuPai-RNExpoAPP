// 共享类型定义

// ========== API响应类型定义（根据接口文档） ==========

/**
 * 首页初始化数据 - /api/home/init
 */
export interface HomeInitResponse {
  userInfo: {
    userId: number;
    avatar: string;           // 左上角头像
    unreadCount: number;      // 右上角消息未读数
  };
  banner: {
    imageUrl: string;         // Banner图片URL
    linkType?: 'webview' | 'native';
    linkUrl?: string;         // 点击跳转链接
  };
  quickEntries: Array<{       // 快捷入口（签到、电竞赛事等）
    icon: string;
    title: string;
    linkUrl: string;
  }>;
  giftItems: Array<{          // 横向滚动的礼物/道具
    icon: string;
    name?: string;
  }>;
}

/**
 * 明日专家推荐 - /api/home/experts
 */
export interface ExpertsResponse {
  title: string;              // 模块标题（如：明日专家）
  tag?: string;               // 标签（如：HOT推广中）
  experts: Array<{
    userId: number;
    avatar: string;
    label: string;            // 标签（如：明日23）
  }>;
}

/**
 * 你什么名模块 - /api/home/topic-banner
 */
export interface TopicBannerResponse {
  title: string;              // 模块标题（如：你什么名）
  bannerImage: string;        // Banner图片URL
  linkUrl?: string;           // 点击跳转链接
}

/**
 * 内容Feed流单项
 */
export interface FeedItem {
  postId: number;
  author: {
    userId: number;
    avatar: string;
    nickname: string;         // 如：昵称屑屑123
    tags?: string[];          // 用户标签
  };
  description: string;        // 描述文字（如：明天见，两个相机开播加油！）
  thumbnails: string[];       // 缩略图列表（最多3张）
  mediaType: 'image' | 'video';
  location?: string;          // 发布地点（如：舞厅1号台）
  additionalInfo?: string;    // 附加信息（如：查看他的信息）
}

/**
 * 内容Feed流响应 - /api/home/feed
 */
export interface FeedResponse {
  total: number;
  hasMore: boolean;
  list: FeedItem[];
}

/**
 * 签到响应 - /api/user/check-in
 */
export interface CheckInResponse {
  success: boolean;
  todayChecked: boolean;      // 今日是否已签到
  continuousDays: number;     // 连续签到天数
  reward?: {
    type: 'points' | 'coins';
    amount: number;
  };
}

// ========== 前端使用类型定义 ==========

/**
 * 用户卡片（保留用于向后兼容）
 */
export interface UserCard {
  id: string;
  avatar: string;
  username: string;
  age: number;
  bio: string;
  services: string[];
  distance: number;
  status: 'online' | 'available' | 'offline';
  photos: string[];
  price?: string;
  region?: string;
  lastActive?: number;
  rating?: number;
  reviewCount?: number;
  // 扩展字段
  isSpecialOffer?: boolean;
  orderCount?: number;
  displayService?: string;
  listIndex?: number;
}

/**
 * 功能项（快捷入口）
 */
export interface FunctionItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  isHot?: boolean;
  iconSource?: any; // PNG图标源
  linkUrl?: string; // 点击跳转链接
}

export interface LocationInfo {
  city: string;
  district?: string;
}
