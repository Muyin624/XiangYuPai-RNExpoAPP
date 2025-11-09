/**
 * User Profile Screen - 个人主页路由
 * 
 * Route: /profile/[userId]
 * 
 * Features:
 * - 查看其他用户的个人主页
 * - 动态参数路由
 * - 错误边界保护
 */

import { ErrorBoundary } from '@/src/components';
import OtherUserProfilePage from '@/src/features/Profile/OtherUserProfilePage';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  
  // Validate userId
  if (!userId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>用户ID无效</Text>
      </View>
    );
  }
  
  return (
    <ErrorBoundary>
      <OtherUserProfilePage userId={userId} />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
  },
});

