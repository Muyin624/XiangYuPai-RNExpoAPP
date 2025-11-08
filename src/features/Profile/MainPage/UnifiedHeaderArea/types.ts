/**
 * UnifiedHeaderArea - Type Definitions
 * 统一头部区域类型定义
 */

// #region Core Types
export interface UnifiedHeaderAreaProps {
  // Background
  backgroundImage?: string;
  
  // User Basic Info
  nickname: string;
  gender?: 1 | 2; // 1: male, 2: female
  age?: number;
  height?: number; // 身高（cm）
  
  // Verification Badges
  isRealVerified?: boolean; // 真人认证
  isGodVerified?: boolean; // 大神认证
  isVipVerified?: boolean; // VIP认证
  
  // Status Info
  isOnline?: boolean; // 在线状态
  distance?: number; // 距离（km）
  followerCount?: number; // 粉丝数
  followingCount?: number; // 关注数
  likeCount?: number; // 获赞数
  
  // Follow Status (for other user's profile)
  isFollowing?: boolean;
  isMutualFollowing?: boolean;
  
  // Custom Tags
  customTags?: TagItem[];
  
  // Page Type
  isOwnProfile: boolean;
  
  // Event Callbacks
  onBack?: () => void;
  onEditPress?: () => void;
  onFollowPress?: () => void;
  onFollowingPress?: () => void; // 点击关注数
  onFollowerPress?: () => void; // 点击粉丝数
  onLikePress?: () => void; // 点击获赞数
}

export interface TagItem {
  text: string;
  backgroundColor: string;
  textColor: string;
  icon?: string;
}
// #endregion

// #region Sub-component Props
export interface BackgroundLayerProps {
  backgroundImage?: string;
}

export interface TopActionBarProps {
  isOwnProfile: boolean;
  isFollowing?: boolean;
  isMutualFollowing?: boolean;
  onBack?: () => void;
  onEditPress?: () => void;
  onFollowPress?: () => void;
}

export interface UserInfoCardProps {
  nickname: string;
  gender?: 1 | 2;
  age?: number;
  isRealVerified?: boolean;
  isGodVerified?: boolean;
  isVipVerified?: boolean;
  isOnline?: boolean;
  distance?: number;
  followerCount?: number;
  customTags?: TagItem[];
  isOwnProfile: boolean;
  onEditPress?: () => void;
}

export interface NameGenderRowProps {
  nickname: string;
  gender?: 1 | 2;
  age?: number;
  isOwnProfile: boolean;
  onEditPress?: () => void;
}

export interface TagsRowProps {
  isRealVerified?: boolean;
  isGodVerified?: boolean;
  isVipVerified?: boolean;
  customTags?: TagItem[];
}

export interface StatusRowProps {
  isOnline?: boolean;
  distance?: number;
  followerCount?: number;
}
// #endregion

