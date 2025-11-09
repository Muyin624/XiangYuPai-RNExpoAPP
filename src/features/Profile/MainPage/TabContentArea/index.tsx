// #region 1. File Banner & TOC
/**
 * TabContentArea - Tab内容区域
 * 
 * 功能：
 * - 根据activeTab显示不同内容
 * - 集成各个Tab子页面
 */
// #endregion

// #region 2. Imports
import { useProfileStore } from '@/stores/profileStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../constants';
import type { TabContentAreaProps } from '../types';

// Tab内容组件
import CollectionContent from './CollectionContent';
import DynamicContent from './DynamicContent';
import LikesContent from './LikesContent';
import ProfileContent from './ProfileContent';
// #endregion

// #region 3-7. Types, Constants, Utils, State & Logic
// (简单组件，作为容器)
// #endregion

// #region 8. UI Components & Rendering
const TabContentArea: React.FC<TabContentAreaProps> = ({
  activeTab,
  userId,
  isOwnProfile,
  style,
}) => {
  const router = useRouter();
  
  // 从 profileStore 获取完整用户资料、动态数据和actions
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const posts = useProfileStore((state) => state.posts);
  const loading = useProfileStore((state) => state.loading);
  const loadMorePosts = useProfileStore((state) => state.loadMorePosts);
  
  const skills: any[] = []; // TODO: 从 profileStore 或 API 获取技能列表
  
  // 根据activeTab获取对应的posts数据
  const getCurrentPosts = () => {
    if (activeTab === 'profile') return [];
    const tabKey = activeTab as 'dynamic' | 'collection' | 'likes';
    return posts[tabKey];
  };
  
  const currentPosts = getCurrentPosts();
  
  // 处理文章点击 - 跳转到动态详情页
  const handlePostPress = (postId: string) => {
    console.log('点击动态:', postId);
    router.push(`/feed/${postId}` as any);
  };
  
  // 处理加载更多
  const handleLoadMore = () => {
    if (activeTab !== 'profile') {
      loadMorePosts(activeTab);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* 动态Tab */}
      {activeTab === 'dynamic' && (
        <DynamicContent
          posts={currentPosts}
          loading={loading}
          onPostPress={handlePostPress}
          onLoadMore={handleLoadMore}
        />
      )}

      {/* 收藏Tab */}
      {activeTab === 'collection' && (
        <CollectionContent
          posts={currentPosts}
          loading={loading}
          onPostPress={handlePostPress}
          onLoadMore={handleLoadMore}
        />
      )}

      {/* 点赞Tab */}
      {activeTab === 'likes' && (
        <LikesContent
          posts={currentPosts}
          loading={loading}
          onPostPress={handlePostPress}
          onLoadMore={handleLoadMore}
        />
      )}

      {/* 资料Tab */}
      {activeTab === 'profile' && currentProfile && (
        <ProfileContent
          userInfo={currentProfile}
          skills={skills}
          isOwnProfile={isOwnProfile}
          onSkillPress={(skillId) => {
            console.log('查看技能详情:', skillId);
            // TODO: 跳转到详情页
          }}
          onAddSkillPress={() => {
            console.log('添加技能');
            router.push('/profile/skills-edit');
          }}
          onEditInfoPress={() => {
            console.log('编辑个人资料');
            // TODO: 跳转到资料编辑页
          }}
        />
      )}
    </View>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.GRAY_BG,
  },
});

export default TabContentArea;
// #endregion

