/**
 * ServiceDetailPage 类型定义
 */

import { StyleProp, ViewStyle } from 'react-native';

// 服务类型
export type ServiceType = 
  | 'honor_of_kings' 
  | 'league_of_legends' 
  | 'pubg_mobile' 
  | 'brawl_stars'
  | 'explore_shop' 
  | 'private_cinema' 
  | 'billiards' 
  | 'ktv' 
  | 'drinking' 
  | 'massage';

// 服务大类
export type ServiceCategory = 'game' | 'lifestyle';

// 服务详情页面Props
export interface ServiceDetailPageProps {
  serviceType: ServiceType;
  serviceCategory?: ServiceCategory;
  initialFilters?: FilterState;
  isLimitedOffer?: boolean; // 是否为限时优惠
  userId?: string; // 可选：特定用户ID
  style?: StyleProp<ViewStyle>;
}

// 筛选状态
export interface FilterState {
  sortBy: 'smart' | 'price' | 'rating' | 'distance';
  gender: 'all' | 'male' | 'female';
  selectedTags: string[];
  advancedFilters: {
    priceRange: [number, number];
    distanceRange: number;
    ratingMin: number;
    onlineOnly: boolean;
    features: string[];
  };
}

// 游戏陪玩师数据
export interface GameProviderData {
  providerId: string;
  nickname: string;
  avatar: string;
  gender: 'male' | 'female';
  age: number;
  location: {
    city: string;
    district: string;
    distance: number;
  };
  certifications: {
    realName: boolean;
    expert: boolean;
    verified: boolean;
  };
  onlineStatus: {
    status: 'online' | 'offline' | 'busy';
    lastActive: string;
  };
  gameSkills: {
    currentRank: string;
    highestRank: string;
    winRate: number;
    positions: Array<{
      position: string;
      proficiency: number;
    }>;
    heroes: Array<{
      heroName: string;
      heroAvatar: string;
      level: 'city' | 'province' | 'national';
    }>;
  };
  serviceInfo: {
    serviceTypes: string[];
    features: string[];
    pricing: Array<{
      serviceType: string;
      price: number;
      unit: string;
      description: string;
    }>;
    stats: {
      serviceCount: number;
      rating: number;
      responseTime: string;
    };
  };
  profile: {
    introduction: string;
    voiceSample?: string;
    photos: string[];
  };
}

// 生活服务商数据
export interface LifestyleProviderData {
  providerId: string;
  nickname: string;
  avatar: string;
  gender: 'male' | 'female';
  age: number;
  location: {
    city: string;
    district: string;
    distance: number;
  };
  certifications: {
    realName: boolean;
    business: boolean;
    verified: boolean;
  };
  serviceStatus: {
    status: 'available' | 'busy' | 'offline';
    nextAvailableTime?: string;
  };
  serviceInfo: {
    serviceType: string;
    serviceArea: string;
    features: string[];
    serviceLocation: {
      address: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      transportation: string[];
    };
    pricing: {
      basePrice: number;
      unit: string;
      description: string;
      discounts?: Array<{
        type: string;
        amount: number;
        description: string;
      }>;
    };
    availability: {
      timeSlots: string[];
      duration: string;
      advanceBooking: number;
    };
    stats: {
      serviceCount: number;
      rating: number;
      responseTime: string;
    };
  };
  serviceDescription: {
    title: string;
    description: string;
    images: string[];
    tags: string[];
  };
}

// 服务提供者数据（联合类型）
export type ProviderData = GameProviderData | LifestyleProviderData;

// 服务配置
export interface ServiceConfig {
  displayName: string;
  category: ServiceCategory;
  theme: {
    primaryColor: string;
    bannerGradient: string[];
  };
  serviceTags: Array<{
    id: string;
    name: string;
    selected: boolean;
  }>;
  filterOptions: {
    [key: string]: string[];
  };
}

// 页面状态
export interface ServiceDetailPageState {
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastRefreshTime: number;
}
