/**
 * Skill Detail Screen - 技能详情页路由
 * 
 * Route: /skill/[skillId]
 * 
 * Features:
 * - 显示技能详细信息
 * - 用户信息和评价
 * - 预约下单功能
 */

import { ErrorBoundary } from '@/src/components';
import SkillDetailPage from '@/src/features/Profile/OtherUserProfilePage/SkillDetailPage';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SkillDetailScreen() {
  const { skillId, userId } = useLocalSearchParams<{ skillId: string; userId?: string }>();
  
  // Validate skillId
  if (!skillId) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>技能ID无效</Text>
        </View>
      </>
    );
  }
  
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ErrorBoundary>
        <SkillDetailPage skillId={skillId} userId={userId || ''} />
      </ErrorBoundary>
    </>
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

