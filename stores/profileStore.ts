/**
 * Profile Store - 个人主页状态管理
 * 
 * 管理：
 * - 用户资料数据
 * - 动态列表数据
 * - Tab状态
 * - 加载和错误状态
 * 
 * 🔗 数据源集成：
 * - authStore.userInfo: 基础身份信息（登录时保存）
 * - profileStore.currentProfile: 完整资料信息（从API加载）
 * - 使用 authStore.userInfo.id 确定当前用户
 */

import { create } from 'zustand';
import type { Post, TabType, UserProfile } from '../src/features/Profile/types';

// ========== 🚫 注释掉真实API导入 ==========
// import { profileApi } from '../services/api/profileApi';
// import { profileDataTransform } from '../src/features/Profile/utils/dataTransform';
// =========================================

// 🆕 导入authStore以获取当前用户信息
import { useAuthStore } from '../src/features/AuthModule/stores/authStore';

// #region 类型定义

export interface ProfileState {
  // 用户信息
  currentProfile: UserProfile | null;
  
  // Tab状态
  activeTab: TabType;
  
  // 动态列表
  posts: {
    dynamic: Post[];
    collection: Post[];
    likes: Post[];
  };
  
  // 分页状态
  page: {
    dynamic: number;
    collection: number;
    likes: number;
  };
  
  hasMore: {
    dynamic: boolean;
    collection: boolean;
    likes: boolean;
  };
  
  // UI状态
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}

export interface ProfileActions {
  // 用户信息
  loadUserProfile: (userId?: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  
  // 🆕 从authStore初始化基础信息
  initializeFromAuth: () => void;
  
  // Tab操作
  setActiveTab: (tab: TabType) => void;
  
  // 动态列表
  loadPosts: (tab: TabType, page: number) => Promise<void>;
  loadMorePosts: (tab: TabType) => Promise<void>;
  refreshPosts: (tab: TabType) => Promise<void>;
  
  // 用户关系
  followUser: (targetUserId: number) => Promise<void>;
  unfollowUser: (targetUserId: number) => Promise<void>;
  
  // 互动操作
  toggleLike: (postId: string, tab: TabType) => Promise<void>;
  toggleCollect: (postId: string, tab: TabType) => Promise<void>;
  
  // 状态管理
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

export type ProfileStore = ProfileState & ProfileActions;

// #endregion

// #region Mock Data Generator

/**
 * 生成模拟动态数据
 */
const generateMockPosts = (count: number = 10, isCurrentUser: boolean = true): Post[] => {
  const posts: Post[] = [];
  const titles = [
    '请你们看雪',
    '今天的日落很美',
    '分享一下我的日常',
    '最近爱上了摄影',
    '周末出游记录',
    '美食探店',
    '健身打卡第N天',
    '读书笔记分享',
  ];
  
  const images = [
    'https://picsum.photos/400/500?random=',
    'https://picsum.photos/400/600?random=',
    'https://picsum.photos/400/450?random=',
  ];
  
  // 🎯 根据是否是当前用户，使用不同的昵称
  const mockNickname = isCurrentUser ? '我的昵称' : '他人昵称';
  
  for (let i = 0; i < count; i++) {
    posts.push({
      id: `post_${Date.now()}_${i}`,
      userId: 'mock_user_001',
      userInfo: {
        id: 'mock_user_001',
        nickname: mockNickname,
        avatar: `https://picsum.photos/48/48?random=${i}`,
      },
      title: titles[i % titles.length],
      content: isCurrentUser 
        ? '这是我发布的动态内容，记录生活点滴。' 
        : '这是他发布的动态内容，分享生活瞬间。',
      coverImage: `${images[i % images.length]}${i}`,
      mediaList: [{
        id: `media_${i}`,
        type: Math.random() > 0.7 ? 'video' : 'image',
        url: `${images[i % images.length]}${i}`,
        width: 400,
        height: 500 + (i % 3) * 50,
      }],
      likeCount: Math.floor(Math.random() * 200) + 10,
      commentCount: Math.floor(Math.random() * 50),
      shareCount: Math.floor(Math.random() * 20),
      isLiked: Math.random() > 0.5,
      isCollected: Math.random() > 0.7,
      createdAt: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
    });
  }
  
  return posts;
};

// #endregion

// #region 初始状态

const initialState: ProfileState = {
  currentProfile: null,
  activeTab: 'dynamic',
  posts: {
    dynamic: [],
    collection: [],
    likes: [],
  },
  page: {
    dynamic: 1,
    collection: 1,
    likes: 1,
  },
  hasMore: {
    dynamic: true,
    collection: true,
    likes: true,
  },
  loading: false,
  refreshing: false,
  error: null,
};

// #endregion

// #region Store创建

export const useProfileStore = create<ProfileStore>((set, get) => ({
  // 初始状态
  ...initialState,
  
  // 加载用户资料（使用假数据）
  loadUserProfile: async (userId?: string) => {
    console.log('\n🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥');
    console.log('🔥 [PROFILE STORE] loadUserProfile 被调用（使用假数据）！');
    console.log('🔥 传入参数 userId:', userId || '(未传入)');
    console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥\n');
    
    try {
      set({ loading: true, error: null });
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔄 加载用户资料开始（假数据）');
      
      // 🆕 智能用户ID解析
      const authState = useAuthStore.getState();
      const targetUserId = userId || authState.userInfo?.id;
      
      console.log('   传入userId:', userId || '未传入');
      console.log('   authStore用户ID:', authState.userInfo?.id || '未登录');
      console.log('   最终使用:', targetUserId || 'current-user');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      // ========== 🚫 注释掉真实API调用 ==========
      // console.log('🔥 准备调用 API...');
      // const api = profileApi;
      // 
      // console.log('🔥 开始执行 API 请求:', targetUserId ? `getUserProfile(${targetUserId})` : 'getCurrentUserProfile()');
      // 
      // const profileData = targetUserId 
      //   ? await api.getUserProfile(Number(targetUserId))
      //   : await api.getCurrentUserProfile();
      // 
      // console.log('🔥 API请求完成！');
      // console.log('✅ API调用成功，获取到资料数据');
      // console.log('   昵称:', profileData.nickname);
      // console.log('   粉丝数:', profileData.stats?.followerCount);
      // 
      // // 🔄 转换后端数据为前端格式
      // const profile = profileDataTransform.transformUserProfileVOToProfile(profileData);
      // =========================================
      
      // ========== ✅ 使用假数据 ==========
      console.log('   模拟网络延迟（800ms）');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 生成模拟用户资料
      // 🎯 区分个人中心和他人主页的昵称
      const isCurrentUser = !userId || userId === authState.userInfo?.id;
      const mockNickname = isCurrentUser 
        ? (authState.userInfo?.nickname || '我的昵称')  // 个人中心：我的昵称
        : `他人昵称_${targetUserId?.slice(-4) || '0001'}`;  // 他人主页：他人昵称_XXXX
      
      const profile: UserProfile = {
        id: targetUserId || 'mock_user_001',
        nickname: mockNickname,
        avatar: authState.userInfo?.avatar || `https://picsum.photos/96/96?random=${Date.now()}`,
        backgroundImage: `https://picsum.photos/800/500?random=${Date.now()}`,
        gender: 'male',
        age: 25,
        height: 175, // 身高 cm
        location: '深圳市',
        bio: isCurrentUser 
          ? '这是我的个人简介，展示我的个性和特点。热爱生活，喜欢交友。' 
          : '这是他的个人简介，展示他的个性和特点。热爱生活，喜欢交友。',
        skills: ['摄影', '旅游', '美食', '音乐'],
        followerCount: 1234,
        followingCount: 567,
        postCount: 89,
        likeCount: 4567,
        isRealVerified: true,
        isGodVerified: false,
        isVip: true,
        isPopular: true,
        isOnline: true,
        vipLevel: 3,
        phone: '13800138000',
      };
      
      console.log('✅ 假数据生成完成');
      console.log('   昵称:', profile.nickname);
      console.log('   粉丝数:', profile.followerCount);
      console.log('   前端ID:', profile.id);
      console.log('   关注数:', profile.followingCount);
      // =========================================
      
      // 🆕 与authStore数据同步
      if (!userId && authState.userInfo) {
        console.log('🔗 同步基础信息到profile');
        console.log('   手机号:', authState.userInfo.phone);
        console.log('   认证状态:', authState.userInfo.verified);
      }
      
      set({ currentProfile: profile, loading: false });
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎉 用户资料加载完成（假数据）！');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } catch (error) {
      console.error('\n❌ 加载用户资料失败:', error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : '加载失败',
      });
    }
  },
  
  // 🆕 从authStore初始化基础信息
  initializeFromAuth: () => {
    const authState = useAuthStore.getState();
    
    if (!authState.isAuthenticated || !authState.userInfo) {
      console.log('⚠️ 未登录，跳过profile初始化');
      return;
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔗 从authStore初始化profile基础信息');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const { userInfo } = authState;
    
    // 创建基础profile（只包含authStore已有的信息）
    const basicProfile: UserProfile = {
      id: userInfo.id,
      nickname: userInfo.nickname || '用户',
      avatar: userInfo.avatar || 'https://via.placeholder.com/96',
      // 其他字段从API加载时填充
    };
    
    console.log('   用户ID:', basicProfile.id);
    console.log('   昵称:', basicProfile.nickname);
    console.log('   手机号:', userInfo.phone);
    console.log('   认证状态:', userInfo.verified);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    set({ currentProfile: basicProfile });
  },
  
  // 更新用户资料
  updateUserProfile: (updates) => {
    set((state) => ({
      currentProfile: state.currentProfile
        ? { ...state.currentProfile, ...updates }
        : null,
    }));
  },
  
  // 设置活动Tab
  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },
  
  // 加载动态列表
  loadPosts: async (tab, page) => {
    // 只为dynamic/collection/likes三个tab加载数据
    if (tab === 'profile') {
      console.log('资料Tab不需要加载动态列表');
      return;
    }
    
    try {
      set({ loading: true, error: null });
      
      console.log(`\n📋 加载${tab}列表 - 第${page}页（使用假数据）`);
      
      // ========== ✅ 使用假数据 ==========
      console.log('   模拟网络延迟（800ms）');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 🎯 判断是否是当前用户（用于生成不同的昵称）
      const { currentProfile } = get();
      const authState = useAuthStore.getState();
      const isCurrentUser = !currentProfile?.id || currentProfile.id === authState.userInfo?.id;
      
      const mockPosts = generateMockPosts(10, isCurrentUser);
      const tabKey = tab as 'dynamic' | 'collection' | 'likes';
      
      set((state) => ({
        posts: {
          ...state.posts,
          [tabKey]: page === 1 ? mockPosts : [...state.posts[tabKey], ...mockPosts],
        },
        page: {
          ...state.page,
          [tabKey]: page,
        },
        hasMore: {
          ...state.hasMore,
          [tabKey]: page < 3, // 模拟3页数据
        },
        loading: false,
      }));
      
      console.log(`✅ ${tab}数据加载完成，共${mockPosts.length}条`);
      console.log(`   昵称类型: ${isCurrentUser ? '我的昵称' : '他人昵称'}`);
      // =========================================
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : '加载失败',
      });
    }
  },
  
  // 加载更多
  loadMorePosts: async (tab) => {
    if (tab === 'profile') return;
    
    const { page, hasMore } = get();
    const tabKey = tab as 'dynamic' | 'collection' | 'likes';
    if (!hasMore[tabKey]) return;
    
    await get().loadPosts(tab, page[tabKey] + 1);
  },
  
  // 刷新
  refreshPosts: async (tab) => {
    if (tab === 'profile') return;
    
    set({ refreshing: true });
    await get().loadPosts(tab, 1);
    set({ refreshing: false });
  },
  
  // 关注用户（使用假数据）
  followUser: async (targetUserId: number) => {
    try {
      console.log('🔄 关注用户（假数据）:', targetUserId);
      
      // ========== 🚫 注释掉真实API调用 ==========
      // const api = profileApi;
      // await api.followUser(targetUserId);
      // =========================================
      
      // ========== ✅ 使用假数据 ==========
      console.log('   模拟网络延迟（500ms）');
      await new Promise(resolve => setTimeout(resolve, 500));
      // =========================================
      
      // 更新关系状态
      set((state) => ({
        currentProfile: state.currentProfile ? {
          ...state.currentProfile,
          followingCount: (state.currentProfile.followingCount || 0) + 1,
        } : null,
      }));
      
      console.log('✅ 关注成功（假数据）');
    } catch (error) {
      console.error('❌ 关注失败:', error);
      throw error;
    }
  },
  
  // 取消关注（使用假数据）
  unfollowUser: async (targetUserId: number) => {
    try {
      console.log('🔄 取消关注（假数据）:', targetUserId);
      
      // ========== 🚫 注释掉真实API调用 ==========
      // const api = profileApi;
      // await api.unfollowUser(targetUserId);
      // =========================================
      
      // ========== ✅ 使用假数据 ==========
      console.log('   模拟网络延迟（500ms）');
      await new Promise(resolve => setTimeout(resolve, 500));
      // =========================================
      
      // 更新关系状态
      set((state) => ({
        currentProfile: state.currentProfile ? {
          ...state.currentProfile,
          followingCount: Math.max((state.currentProfile.followingCount || 0) - 1, 0),
        } : null,
      }));
      
      console.log('✅ 取消关注成功（假数据）');
    } catch (error) {
      console.error('❌ 取消关注失败:', error);
      throw error;
    }
  },
  
  // 点赞
  toggleLike: async (postId, tab) => {
    if (tab === 'profile') return;
    
    const tabKey = tab as 'dynamic' | 'collection' | 'likes';
    
    // 乐观更新
    set((state) => ({
      posts: {
        ...state.posts,
        [tabKey]: state.posts[tabKey].map((post: Post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
              }
            : post
        ),
      },
    }));
    
    try {
      // TODO: 调用内容模块的点赞API
      console.log('点赞动态:', postId);
    } catch (error) {
      // 失败时回滚
      set((state) => ({
        posts: {
          ...state.posts,
          [tabKey]: state.posts[tabKey].map((post: Post) =>
            post.id === postId
              ? {
                  ...post,
                  isLiked: !post.isLiked,
                  likeCount: post.isLiked ? post.likeCount + 1 : post.likeCount - 1,
                }
              : post
          ),
        },
      }));
    }
  },
  
  // 收藏
  toggleCollect: async (postId, tab) => {
    if (tab === 'profile') return;
    
    const tabKey = tab as 'dynamic' | 'collection' | 'likes';
    
    // 乐观更新
    set((state) => ({
      posts: {
        ...state.posts,
        [tabKey]: state.posts[tabKey].map((post: Post) =>
          post.id === postId
            ? {
                ...post,
                isCollected: !post.isCollected,
              }
            : post
        ),
      },
    }));
    
    try {
      // TODO: 调用内容模块的收藏API
      console.log('收藏动态:', postId);
    } catch (error) {
      // 失败时回滚
      set((state) => ({
        posts: {
          ...state.posts,
          [tabKey]: state.posts[tabKey].map((post: Post) =>
            post.id === postId
              ? {
                  ...post,
                  isCollected: !post.isCollected,
                }
              : post
          ),
        },
      }));
    }
  },
  
  // 设置加载状态
  setLoading: (loading) => {
    set({ loading });
  },
  
  // 设置错误
  setError: (error) => {
    set({ error });
  },
  
  // 重置状态
  resetState: () => {
    set(initialState);
  },
}));

// #endregion

// #region 选择器

export const useCurrentProfile = () => useProfileStore((state) => state.currentProfile);
export const useActiveTab = () => useProfileStore((state) => state.activeTab);
export const usePosts = (tab: 'dynamic' | 'collection' | 'likes') => useProfileStore((state) => state.posts[tab]);
export const useProfileLoading = () => useProfileStore((state) => state.loading);
export const useProfileError = () => useProfileStore((state) => state.error);

// #endregion

