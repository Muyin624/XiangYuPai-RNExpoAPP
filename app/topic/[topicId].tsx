/**
 * Topic Detail Screen - 话题详情页面
 * 
 * Route: /topic/[topicId]
 * 
 * Features:
 * - 话题信息展示
 * - 话题下的动态列表
 * - 返回导航
 */

import { ErrorBoundary } from '@/src/components';
import TopicDetailPage from '@/src/features/Discovery/TopicDetailPage';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TopicDetailScreen() {
  const router = useRouter();
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  
  if (!topicId) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>无效的话题ID</Text>
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen
        options={{
          title: topicId,
          headerShown: true,
          headerBackTitle: '返回',
        }}
      />
      <ErrorBoundary>
        <TopicDetailPage topicId={topicId} />
      </ErrorBoundary>
    </>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 14,
    color: '#6B7280',
  },
});

