// #region 1. File Banner & TOC
/**
 * TabContentArea - 他人信息页Tab内容区域
 * 
 * 功能：
 * - 根据activeTab渲染不同内容
 * - 动态Tab：显示用户发布的动态（复用MainPage组件）
 * - 资料Tab：显示用户详细资料（复用MainPage组件）
 * - 技能Tab：显示用户技能列表
 */
// #endregion

// #region 2. Imports
import { useProfileStore } from '@/stores/profileStore';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// 复用MainPage的Tab内容组件
import DynamicContent from '../MainPage/TabContentArea/DynamicContent';
import ProfileContent from '../MainPage/TabContentArea/ProfileContent';

import type { TabType } from './types';
// #endregion

// #region 3. Types
interface TabContentAreaProps {
  activeTab: TabType;
  userId: string;
  isOwnProfile?: boolean;
}
// #endregion

// #region 4. UI Components & Rendering

/**
 * 技能卡片组件
 */
interface SkillCardProps {
  id: string;
  avatar: string;
  nickname: string;
  isRealVerified?: boolean;
  isGodVerified?: boolean;
  gender?: number;
  distance?: string;
  description: string;
  price: number;
  unit: string;
  tags?: string[];
  onPress?: (skillId: string) => void;
}

const SkillCard: React.FC<SkillCardProps> = ({
  id, 
  avatar, 
  nickname, 
  isRealVerified, 
  isGodVerified,
  gender,
  distance,
  description, 
  price, 
  unit, 
  tags = [],
  onPress
}) => {
  return (
    <TouchableOpacity 
      style={styles.skillCard}
      onPress={() => onPress?.(id)}
      activeOpacity={0.7}
    >
      {/* 左侧头像 */}
      <Image 
        source={{ uri: avatar || 'https://via.placeholder.com/80' }}
        style={styles.skillAvatar}
      />
      
      {/* 中间内容 */}
      <View style={styles.skillContent}>
        {/* 第一行：昵称 + 性别 */}
        <View style={styles.skillHeaderRow}>
          <View style={styles.skillHeaderLeft}>
            <Text style={styles.skillName}>{nickname}</Text>
            {gender && (
              <Text style={[styles.genderIcon, gender === 1 ? styles.male : styles.female]}>
                {gender === 1 ? '♂' : '♀'}
              </Text>
            )}
          </View>
        </View>
        
        {/* 认证标签（换行显示） */}
        {(isRealVerified || isGodVerified) && (
          <View style={styles.verificationBadges}>
            {isRealVerified && (
              <View style={styles.realBadge}>
                <Text style={styles.badgeText}>实名认证</Text>
              </View>
            )}
            {isGodVerified && (
              <View style={styles.godBadge}>
                <Text style={styles.badgeText}>大神</Text>
              </View>
            )}
          </View>
        )}
        
        {/* 第二行：个人简介 */}
        <Text style={styles.skillDescription} numberOfLines={2}>
          {description}
        </Text>
        
        {/* 第三行：技能标签 */}
        {tags.length > 0 && (
          <View style={styles.skillTags}>
            {tags.map((tag, index) => (
              <Text key={index} style={styles.skillTagText}>{tag}</Text>
            ))}
          </View>
        )}
      </View>
      
      {/* 右侧：距离（上）和价格（下） */}
      <View style={styles.rightColumn}>
        {/* 右上角：距离 */}
        {distance && (
          <Text style={styles.distance}>{distance}</Text>
        )}
        
        {/* 右下角：价格 */}
        <View style={styles.skillPrice}>
          <Text style={styles.priceNumber}>{price}</Text>
          <Text style={styles.priceUnit}>金币/{unit}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/**
 * 技能Tab内容
 */
const SkillsContent: React.FC<{ userId: string }> = ({ userId }) => {
  const router = useRouter();
  const currentProfile = useProfileStore((state) => state.currentProfile);
  
  // 处理技能点击
  const handleSkillPress = (skillId: string) => {
    console.log('点击技能:', skillId);
    // 跳转到详情页
    router.push(`/skill/${skillId}?userId=${userId}` as any);
  };
  
  // 模拟技能数据（使用当前用户信息）
  const mockSkills: SkillCardProps[] = currentProfile ? [
    {
      id: 'skill_1',
      avatar: currentProfile.avatar,
      nickname: currentProfile.nickname,
      isRealVerified: currentProfile.isRealVerified,
      isGodVerified: currentProfile.isGodVerified,
      gender: currentProfile.gender,
      distance: '3.2km',
      description: '主打鲜其他位置都能补 能c技术方式战韩信 这里是技能介绍这里...',
      price: 10,
      unit: '局',
      tags: ['微信区', '荣耀王者', '巅峰1800+'],
    },
    {
      id: 'skill_2',
      avatar: currentProfile.avatar,
      nickname: currentProfile.nickname,
      isRealVerified: currentProfile.isRealVerified,
      isGodVerified: currentProfile.isGodVerified,
      gender: currentProfile.gender,
      distance: '3.2km',
      description: '主打鲜其他位置都能补 能c技术方式战韩信 这里是技能介绍这里...',
      price: 10,
      unit: '局',
      tags: ['微信区', '和平精英'],
    },
    {
      id: 'skill_3',
      avatar: currentProfile.avatar,
      nickname: currentProfile.nickname,
      isRealVerified: currentProfile.isRealVerified,
      isGodVerified: currentProfile.isGodVerified,
      gender: currentProfile.gender,
      distance: '3.2km',
      description: '主打鲜其他位置都能补 能c技术方式战韩信 这里是技能介绍这里...',
      price: 100,
      unit: '小时',
      tags: ['探店'],
    },
  ] : [];
  
  if (mockSkills.length === 0) {
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎯</Text>
          <Text style={styles.emptyText}>暂无技能信息</Text>
          <Text style={styles.emptyHint}>该用户还未添加技能标签</Text>
        </View>
      </ScrollView>
    );
  }
  
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.skillsScrollContent}>
      {mockSkills.map((skill) => (
        <SkillCard key={skill.id} {...skill} onPress={handleSkillPress} />
      ))}
    </ScrollView>
  );
};

/**
 * Tab内容区域主组件
 */
const TabContentArea: React.FC<TabContentAreaProps> = ({
  activeTab,
  userId,
  isOwnProfile = false,
}) => {
  const router = useRouter();
  
  // 从 profileStore 获取数据
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const posts = useProfileStore((state) => state.posts);
  const loading = useProfileStore((state) => state.loading);
  const loadMorePosts = useProfileStore((state) => state.loadMorePosts);
  
  // 处理文章点击 - 跳转到动态详情页
  const handlePostPress = (postId: string) => {
    console.log('点击动态:', postId);
    router.push(`/feed/${postId}` as any);
  };
  
  // 处理加载更多
  const handleLoadMore = () => {
    loadMorePosts('dynamic');
  };
  
  // 根据activeTab渲染不同内容
  switch (activeTab) {
    case 'dynamics':
      return (
        <DynamicContent
          posts={posts.dynamic}
          loading={loading}
          onPostPress={handlePostPress}
          onLoadMore={handleLoadMore}
        />
      );
    
    case 'profile':
      if (!currentProfile) {
        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>加载中...</Text>
          </View>
        );
      }
      return (
        <ProfileContent
          userInfo={currentProfile}
          skills={[]}
          isOwnProfile={isOwnProfile}
          onSkillPress={(skillId) => {
            console.log('查看技能详情:', skillId);
          }}
          onAddSkillPress={() => {
            console.log('添加技能');
          }}
          onEditInfoPress={() => {
            console.log('编辑个人资料');
          }}
        />
      );
    
    case 'skills':
      return <SkillsContent userId={userId} />;
    
    default:
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>未知的Tab类型</Text>
        </View>
      );
  }
};
// #endregion

// #region 5. Exports & Styles
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  skillsScrollContent: {
    padding: 12,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: '#999999',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
  
  // 技能卡片样式
  skillCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    minHeight: 104, // 确保卡片有足够高度
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  skillAvatar: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginRight: 12,
  },
  skillContent: {
    flex: 1,
    justifyContent: 'flex-start',
    marginRight: 8,
  },
  skillHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  skillHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginRight: 4,
  },
  verificationBadges: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  realBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  godBadge: {
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    color: '#2196F3',
    fontWeight: '500',
  },
  genderIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  male: {
    color: '#2196F3',
  },
  female: {
    color: '#FF4081',
  },
  skillDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
    marginBottom: 6,
  },
  skillTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTagText: {
    fontSize: 11,
    color: '#999999',
  },
  
  // 右侧列（距离和价格）
  rightColumn: {
    height: 80, // 与头像高度一致
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  distance: {
    fontSize: 12,
    color: '#999999',
  },
  skillPrice: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  priceNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF4444',
  },
  priceUnit: {
    fontSize: 11,
    color: '#999999',
    marginTop: 2,
  },
});

export default TabContentArea;
// #endregion

