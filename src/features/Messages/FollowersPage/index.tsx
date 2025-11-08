// #region 1. File Banner & TOC
/**
 * FollowersPage - 粉丝消息页面
 */
// #endregion

// #region 2. Imports
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { notificationsApi } from '../api';
import { FollowerItem } from './FollowerItem';
// #endregion

// #region 6. State Management
const useFollowersPageState = () => {
  const [notifications, setNotifications] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationsApi.getNotifications('follow');
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error('[FollowersPage] loadNotifications error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { notifications, loading, loadNotifications };
};
// #endregion

// #region 8. UI Components & Rendering
const FollowersPage: React.FC = () => {
  const router = useRouter();
  const state = useFollowersPageState();

  useEffect(() => {
    state.loadNotifications();
  }, []);

  // 处理点击粉丝项
  const handleFollowerPress = useCallback((userId: string) => {
    // TODO: 导航到用户详情页
    console.log('查看用户详情:', userId);
    // router.push(`/profile/${userId}`);
  }, []);

  // 处理回关操作
  const handleFollowPress = useCallback(async (followerId: string) => {
    try {
      // TODO: 调用关注API
      console.log('回关用户:', followerId);
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 显示成功提示
      Alert.alert('成功', '已关注该用户');
    } catch (error) {
      console.error('[FollowersPage] handleFollowPress error:', error);
      Alert.alert('失败', '关注失败，请重试');
      throw error;
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>粉丝</Text>
      </View>
      
      <FlatList
        data={state.notifications}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: any) => (
          <FollowerItem
            id={item.user?.id || item.id}
            avatar={item.user?.avatar || ''}
            nickname={item.user?.nickname || ''}
            content={item.content}
            timestamp={item.timestamp}
            isRead={item.isRead}
            isFollowing={item.isFollowing || false}
            isMutualFollow={item.isMutualFollow || false}
            onPress={() => handleFollowerPress(item.user?.id || item.id)}
            onFollowPress={handleFollowPress}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>暂无粉丝消息</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { height: 56, justifyContent: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  title: { fontSize: 20, fontWeight: '600' },
  empty: { padding: 48, textAlign: 'center', color: '#9CA3AF' },
});
// #endregion

// #region 9. Exports
export default FollowersPage;
// #endregion
