// #region 1. File Banner & TOC
/**
 * TabContentArea - 他人信息页Tab内容区域
 * 
 * 功能：
 * - 根据activeTab渲染不同内容
 * - 动态Tab：显示用户发布的动态
 * - 资料Tab：显示用户详细资料
 * - 技能Tab：显示用户技能列表
 */
// #endregion

// #region 2. Imports
import { useProfileStore } from '@/stores/profileStore';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
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
 * 动态Tab内容
 */
const DynamicsContent: React.FC<{ userId: string }> = ({ userId }) => {
  const posts = useProfileStore((state) => state.posts.dynamic);
  const loading = useProfileStore((state) => state.loading);
  
  if (loading && posts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>加载中...</Text>
      </View>
    );
  }
  
  if (posts.length === 0) {
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyText}>暂无动态</Text>
          <Text style={styles.emptyHint}>该用户还未发布任何动态</Text>
        </View>
      </ScrollView>
    );
  }
  
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.postsContainer}>
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <Text style={styles.postContent}>{post.content}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

/**
 * 资料Tab内容
 */
const ProfileContent: React.FC<{ userId: string }> = ({ userId }) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  
  if (!currentProfile) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>加载中...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.infoContainer}>
        {/* 基本信息 */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>基本信息</Text>
          
          {currentProfile.bio && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>个人简介</Text>
              <Text style={styles.infoValue}>{currentProfile.bio}</Text>
            </View>
          )}
          
          {currentProfile.location && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>所在地</Text>
              <Text style={styles.infoValue}>{currentProfile.location}</Text>
            </View>
          )}
          
          {currentProfile.occupations && currentProfile.occupations.length > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>职业</Text>
              <Text style={styles.infoValue}>
                {currentProfile.occupations.map(o => o.occupationName).join('、')}
              </Text>
            </View>
          )}
        </View>
        
        {/* 身体信息 */}
        {(currentProfile.height || currentProfile.weight) && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>身体信息</Text>
            
            {currentProfile.height && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>身高</Text>
                <Text style={styles.infoValue}>{currentProfile.height}cm</Text>
              </View>
            )}
            
            {currentProfile.weight && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>体重</Text>
                <Text style={styles.infoValue}>{currentProfile.weight}kg</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

/**
 * 技能Tab内容
 */
const SkillsContent: React.FC<{ userId: string }> = ({ userId }) => {
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🎯</Text>
        <Text style={styles.emptyText}>暂无技能信息</Text>
        <Text style={styles.emptyHint}>该用户还未添加技能标签</Text>
      </View>
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
  // 根据activeTab渲染不同内容
  switch (activeTab) {
    case 'dynamics':
      return <DynamicsContent userId={userId} />;
    
    case 'profile':
      return <ProfileContent userId={userId} />;
    
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
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
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
  postsContainer: {
    gap: 12,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  postContent: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
  },
  infoContainer: {
    gap: 16,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoLabel: {
    fontSize: 14,
    color: '#999999',
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
});

export default TabContentArea;
// #endregion

