// #region 1. File Banner & TOC
/**
 * FeaturedPage - 限时专享页面
 * 功能描述：精选用户展示系统，限时优惠推荐
 * TOC: [1] Imports - [2] Types - [3] Constants - [4] Utils - [5] State - [6] Logic - [7] UI - [8] Exports
 */
// #endregion

// #region 2. Imports
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUserStore } from '../../../../../stores';
import { Card, ErrorBoundary } from '../../../../components';
// #endregion

// #region 3. Types & Schema
interface FeaturedPageProps {}
// #endregion

// #region 4. Constants & Config
const COLORS = { BACKGROUND: '#FFFFFF', PRIMARY: '#6366F1', TEXT: '#1F2937', TEXT_SECONDARY: '#6B7280', BORDER: '#E5E7EB', ERROR: '#EF4444', SUCCESS: '#10B981' };
// #endregion

// #region 5-6. Utils, State & Logic
const useFeaturedLogic = () => {
  const router = useRouter();
  const { userList, loadUserList } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    loadUserList({ page: 1, limit: 20 });
  }, [loadUserList]);
  
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadUserList({ page: 1, limit: 20, refresh: true });
    } finally {
      setRefreshing(false);
    }
  }, [loadUserList]);
  
  const handleUserPress = useCallback((userId: string, serviceType?: string) => {
    // 跳转到服务详情页（限时优惠）
    router.push({ 
      pathname: '/(tabs)/homepage/service-detail' as any, 
      params: { 
        serviceType: serviceType || 'honor_of_kings',
        isLimitedOffer: 'true',
        userId: userId
      } 
    });
  }, [router]);
  
  return { userList, loading, refreshing, handleRefresh, handleUserPress, handleBack: () => router.back() };
};
// #endregion

// #region 7. UI Components & Rendering
const FeaturedPage: React.FC<FeaturedPageProps> = () => {
  const { userList, loading, refreshing, handleRefresh, handleUserPress, handleBack } = useFeaturedLogic();
  
  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.BACKGROUND} />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}><Text style={styles.backButton}>←</Text></TouchableOpacity>
          <Text style={styles.title}>限时专享</Text>
          <View style={styles.headerRight} />
        </View>
        
        <FlatList
          data={userList.data}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleUserPress(item.id, item.services?.[0])}>
              <Card style={styles.userCard}>
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <View style={styles.limitedBadge}>
                      <Text style={styles.limitedBadgeText}>限时</Text>
                    </View>
                  </View>
                  <Text style={styles.userInfo}>⭐ {item.rating.toFixed(1)} · ¥{Math.floor(item.price * 0.8)}/小时</Text>
                  <View style={styles.tagsContainer}>
                    {item.tags.slice(0, 2).map((tag, idx) => (
                      <View key={idx} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
                    ))}
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.PRIMARY} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💎</Text>
              <Text style={styles.emptyTitle}>暂无精选用户</Text>
              <Text style={styles.emptySubtitle}>优质服务者即将上线</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    </ErrorBoundary>
  );
};
// #endregion

// #region 8. Exports & Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.BORDER },
  backButton: { fontSize: 24, color: COLORS.TEXT, width: 40 },
  title: { flex: 1, fontSize: 18, fontWeight: '600', color: COLORS.TEXT, textAlign: 'center' },
  headerRight: { width: 40 },
  listContent: { padding: 16 },
  userCard: { marginBottom: 12, padding: 16 },
  cardContent: {},
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  userName: { fontSize: 16, fontWeight: '600', color: COLORS.TEXT },
  limitedBadge: { backgroundColor: '#FF4D4F', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  limitedBadgeText: { fontSize: 10, fontWeight: '600', color: '#FFFFFF' },
  userInfo: { fontSize: 14, color: COLORS.TEXT_SECONDARY, marginBottom: 8 },
  tagsContainer: { flexDirection: 'row' },
  tag: { backgroundColor: COLORS.PRIMARY, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginRight: 6 },
  tagText: { fontSize: 11, color: COLORS.BACKGROUND },
  emptyState: { paddingTop: 100, alignItems: 'center' },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: COLORS.TEXT, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: COLORS.TEXT_SECONDARY },
});

export default FeaturedPage;
// #endregion
