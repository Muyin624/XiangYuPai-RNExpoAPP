/**
 * Profile模块 - 类型定义
 * 
 * 包含：
 * - 页面组Props和状态类型
 * - 用户资料类型
 * - Tab相关类型
 * - API交互类型
 */

import type { StyleProp, ViewStyle } from 'react-native';

// ==================== 页面组级别类型 ====================

/**
 * Profile页面组Props接口
 */
export interface ProfileProps {
  userId?: string;  // 用户ID（不传表示查看自己）
  initialTab?: TabType;
}

/**
 * Tab类型
 */
export type TabType = 'dynamic' | 'collection' | 'likes' | 'profile';

// ==================== 用户资料类型 ====================

/**
 * 用户信息
 */
export interface UserProfile {
  id: string;
  nickname: string;
  avatar: string;
  backgroundImage?: string;
  
  // 基本信息
  gender?: 'male' | 'female';
  age?: number;
  birthday?: string;
  bio?: string;
  intro?: string; // 个人介绍（别名，与bio相同）
  
  // 位置信息
  location?: string;
  city?: string;
  district?: string;
  ipLocation?: string;
  distance?: number;
  
  // 联系方式
  wechat?: string;
  wechatLocked?: boolean;
  
  // 身体信息
  height?: number;  // cm
  weight?: number;  // kg
  
  // 职业信息
  occupations?: string[];
  occupation?: string; // 单个职业（简化版）
  
  // 认证标识
  isRealVerified?: boolean;  // 实名认证
  isGodVerified?: boolean;   // 大神认证
  isVip?: boolean;
  vipLevel?: number;
  isPopular?: boolean;       // 热门用户
  
  // 在线状态
  isOnline?: boolean;
  onlineStatus?: number;  // 0=离线, 1=在线, 2=忙碌
  
  // 统计数据
  followingCount?: number;  // 关注数
  followerCount?: number;   // 粉丝数
  likeCount?: number;       // 获赞数
  collectCount?: number;    // 收藏数
  postCount?: number;       // 动态数
  
  // 技能和联系方式
  skills?: string[];        // 技能列表
  phone?: string;           // 电话号码
  
  // 时间
  createdAt?: number;
  lastActiveAt?: number;
}

/**
 * 技能项
 */
export interface SkillItem {
  id: string;
  name: string;
  icon?: string;
  iconId?: string;  // 图标ID
  type?: 'game' | 'lifestyle';
  skillType?: 'online' | 'offline';  // 技能类型：线上/线下
  description?: string;  // 技能描述
  level?: string;  // 段位/等级（线上）
  location?: string;  // 地点（线下）
  price?: number;  // 定价（金币/局）
  rating?: number;  // 评分
}

/**
 * 个人资料字段
 */
export interface ProfileFields {
  location?: string;
  ipLocation?: string;
  height?: number;
  userId?: string;
  weight?: number;
  occupation?: string;
  wechat?: string;
  birthday?: string;
}

// ==================== 动态相关类型 ====================

/**
 * 动态数据
 */
export interface Post {
  id: string;
  userId: string;
  userInfo: {
    id: string;
    nickname: string;
    avatar: string;
  };
  
  // 内容
  title?: string;
  content: string;
  coverImage?: string;
  mediaList: MediaItem[];
  topicList?: Topic[];
  
  // 位置
  location?: string;
  
  // 统计
  likeCount: number;
  commentCount: number;
  shareCount: number;
  
  // 用户状态
  isLiked: boolean;
  isCollected: boolean;
  
  // 时间
  createdAt: number;
}

/**
 * 媒体项
 */
export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  duration?: number;
}

/**
 * 话题
 */
export interface Topic {
  id: string;
  name: string;
  coverUrl?: string;
}

/**
 * 评论
 */
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userInfo: {
    id: string;
    nickname: string;
    avatar: string;
  };
  content: string;
  likeCount: number;
  isLiked: boolean;
  createdAt: number;
}

// ==================== API交互类型 ====================

/**
 * API响应基础类型
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
  success: boolean;
}

/**
 * 分页响应
 */
export interface PageResponse<T> {
  list: T[];
  total: number;
  hasMore: boolean;
  page: number;
  pageSize: number;
}

// ==================== 组件Props类型 ====================

/**
 * MainPage Props
 */
export interface MainPageProps {
  userId?: string;
  initialTab?: TabType;
  style?: StyleProp<ViewStyle>;
}

/**
 * BackgroundArea Props
 */
export interface BackgroundAreaProps {
  imageUrl?: string;
  onBack: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * UserInfoArea Props
 */
export interface UserInfoAreaProps {
  userInfo: UserProfile;
  isOwnProfile: boolean;
  onEditPress?: () => void;
  onFollowPress?: () => void;
  onAvatarPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * SocialStatsArea Props
 */
export interface SocialStatsAreaProps {
  followingCount: number;
  followerCount: number;
  likeCount: number;
  onFollowingPress: () => void;
  onFollowerPress: () => void;
  onLikePress: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * TabNavigationArea Props
 */
export interface TabNavigationAreaProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * TabContentArea Props
 */
export interface TabContentAreaProps {
  activeTab: TabType;
  userId: string;
  posts: Post[];
  loading: boolean;
  onPostPress: (postId: string) => void;
  onUserPress: (userId: string) => void;
  onLoadMore: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * ProfileInfoPage Props
 */
export interface ProfileInfoPageProps {
  userId: string;
  profileFields: ProfileFields;
  skills: SkillItem[];
  onSkillPress: (skillId: string) => void;
  onAddSkillPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

