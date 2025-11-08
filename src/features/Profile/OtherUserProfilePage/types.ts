// #region 1. File Banner & TOC
/**
 * OtherUserProfilePage - Types
 * 
 * 对方用户主页的类型定义
 * 
 * TOC:
 * [1] File Banner & TOC
 * [2] Component Props Types
 * [3] State Types
 * [4] Tab Types
 * [5] User Data Types
 * [6] Export All
 */
// #endregion

// #region 2. Component Props Types

/**
 * 主页面组件 Props
 */
export interface OtherUserProfilePageProps {
  /** 用户ID */
  userId: string;
}

// #endregion

// #region 3. State Types

/**
 * 页面状态
 */
export interface OtherUserProfileState {
  /** 当前激活的Tab */
  activeTab: TabType;
  /** 是否正在加载 */
  loading: boolean;
  /** 是否正在刷新 */
  refreshing: boolean;
  /** 错误信息 */
  error: string | null;
  /** 是否已关注 */
  isFollowing: boolean;
  /** 操作加载中 */
  actionLoading: boolean;
}

// #endregion

// #region 4. Tab Types

/**
 * Tab类型
 * 注意：必须与constants.ts中的TAB_ITEMS的key保持一致
 */
export type TabType = 'dynamics' | 'profile' | 'skills';

/**
 * Tab配置项
 */
export interface TabItem {
  key: TabType;
  label: string;
  icon?: string;
}

// #endregion

// #region 5. User Data Types

/**
 * 用户基本信息
 */
export interface OtherUserInfo {
  id: string;
  nickname: string;
  avatar: string;
  backgroundImage?: string;
  bio?: string;
  gender?: number; // 0: 未知, 1: 男, 2: 女
  age?: number;
  location?: string;
  occupation?: string;
  
  // 认证状态
  isVip: boolean;
  isRealVerified: boolean;
  isGodVerified: boolean;
  isPopular: boolean;
  
  // 在线状态
  isOnline?: boolean;
  lastActiveTime?: string;
  
  // 统计数据
  followerCount: number;
  followingCount: number;
  likeCount: number;
  postCount: number;
  
  // 个人资料
  height?: number;
  weight?: number;
  skills?: string[];
  wechat?: string;
  wechatMasked?: string;
  wechatUnlockCondition?: number; // 0=公开, 1=关注后, 2=付费, 3=私密
  wechatUnlockDesc?: string;
  canViewWechat?: boolean;
  phone?: string;
  
  // 其他信息
  createdAt: string;
  distance?: number;
}

/**
 * 动态内容项
 */
export interface PostItem {
  id: string;
  userId: string;
  content: string;
  images?: string[];
  video?: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  isCollected: boolean;
  createdAt: string;
  location?: string;
  tags?: string[];
}

/**
 * 技能项
 */
export interface SkillItem {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  location?: string;
}

// #endregion

// #region 6. Export All

export type { };

// #endregion

