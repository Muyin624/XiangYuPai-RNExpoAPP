// #region 1. File Banner & TOC
/**
 * MySignupsPage - 我的报名列表页面
 * 
 * 功能：
 * - Tab切换（全部/待确认/已确认/已完成/已取消）
 * - 报名记录列表展示
 * - 报名状态筛选
 * - 跳转报名详情
 * - 下拉刷新
 * 
 * TOC (快速跳转):
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Schema
 * [4] Constants & Config
 * [5] Utils & Helpers
 * [6] State Management
 * [7] Domain Logic
 * [8] UI Components & Rendering
 * [9] Exports
 */
// #endregion

// #region 2. Imports
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// 类型和常量
import { COLORS, SIGNUP_STATUS_CONFIG, TABS } from './constants';
import type { Signup, SignupStatus, TabType } from './types';
// #endregion

// #region 3. Types & Schema
// (使用types.ts中的定义)
// #endregion

// #region 4. Constants & Config
// (使用constants.ts中的配置)
// #endregion

// #region 5. Utils & Helpers
/**
 * 生成模拟报名数据
 */
const generateMockSignups = (status?: SignupStatus): Signup[] => {
  const statuses: SignupStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];
  const filterStatuses = status ? [status] : statuses;
  
  const activityTypes = ['线下活动', '培训课程', '技能交流', '行业峰会'];
  const companies = [
    { id: 'company-1', name: '腾讯游戏', logo: 'https://picsum.photos/seed/tencent/100' },
    { id: 'company-2', name: '网易游戏', logo: 'https://picsum.photos/seed/netease/100' },
    { id: 'company-3', name: '米哈游', logo: 'https://picsum.photos/seed/mihoyo/100' },
    { id: 'company-4', name: '完美世界', logo: 'https://picsum.photos/seed/perfect/100' },
  ];
  
  return Array.from({ length: 10 }, (_, index) => {
    const signupStatus = filterStatuses[Math.floor(Math.random() * filterStatuses.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    
    return {
      id: `signup-${index + 1}`,
      signupNo: `SN${Date.now()}${index}`,
      status: signupStatus,
      activityName: `${activityTypes[Math.floor(Math.random() * activityTypes.length)]} - 第${index + 1}期`,
      activityType: activityTypes[Math.floor(Math.random() * activityTypes.length)],
      companyInfo: {
        companyId: company.id,
        companyName: company.name,
        companyLogo: company.logo,
      },
      location: ['深圳市南山区', '北京市朝阳区', '上海市浦东新区', '广州市天河区'][Math.floor(Math.random() * 4)],
      activityTime: Date.now() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000), // 未来7天内
      signupTime: Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000), // 过去3天内
      confirmedAt: signupStatus !== 'pending' ? Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000) : undefined,
      completedAt: signupStatus === 'completed' ? Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000) : undefined,
      cancelledAt: signupStatus === 'cancelled' ? Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000) : undefined,
      cancelReason: signupStatus === 'cancelled' ? '个人原因取消' : undefined,
      participantCount: Math.floor(Math.random() * 50) + 10,
      maxParticipants: 100,
    };
  });
};

/**
 * 格式化时间
 */
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${month}-${day} ${hours}:${minutes}`;
};

/**
 * 格式化相对时间
 */
const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = timestamp - now;
  
  if (diff < 0) {
    return '已过期';
  }
  
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  
  if (days > 0) {
    return `${days}天后`;
  } else if (hours > 0) {
    return `${hours}小时后`;
  } else {
    return '即将开始';
  }
};
// #endregion

// #region 6. State Management
/**
 * 报名列表状态管理Hook
 */
const useSignupsState = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [signups, setSignups] = useState<Signup[]>(() => generateMockSignups());
  const [refreshing, setRefreshing] = useState(false);
  
  // 根据Tab筛选报名
  const filteredSignups = signups.filter(signup => {
    if (activeTab === 'all') return true;
    return signup.status === activeTab;
  });
  
  return {
    activeTab,
    setActiveTab,
    signups: filteredSignups,
    refreshing,
    setRefreshing,
    setSignups,
  };
};
// #endregion

// #region 7. Domain Logic
/**
 * 报名列表业务逻辑Hook
 */
const useSignupsLogic = (
  setRefreshing: (value: boolean) => void,
  setSignups: (signups: Signup[]) => void,
  activeTab: TabType
) => {
  const router = useRouter();
  
  /**
   * 下拉刷新
   */
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    
    // 模拟API请求
    setTimeout(() => {
      const status = activeTab === 'all' ? undefined : activeTab as SignupStatus;
      setSignups(generateMockSignups(status));
      setRefreshing(false);
    }, 1000);
  }, [setRefreshing, setSignups, activeTab]);
  
  /**
   * 跳转报名详情
   */
  const handleSignupPress = useCallback((signup: Signup) => {
    console.log(`🧭 导航: 我的报名 → 报名详情 (${signup.signupNo})`);
    router.push({
      pathname: '/profile/signup-detail',
      params: { 
        signupId: signup.id,
        status: signup.status,
      },
    });
  }, [router]);
  
  /**
   * 返回上一页
   */
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  
  return {
    handleRefresh,
    handleSignupPress,
    handleBack,
  };
};
// #endregion

// #region 8. UI Components & Rendering

/**
 * TabBar - Tab切换栏
 */
const TabBar: React.FC<{
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.tabBar}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

/**
 * SignupCard - 报名卡片
 */
const SignupCard: React.FC<{
  signup: Signup;
  onPress: (signup: Signup) => void;
}> = ({ signup, onPress }) => {
  const statusConfig = SIGNUP_STATUS_CONFIG[signup.status];
  
  return (
    <TouchableOpacity
      style={styles.signupCard}
      onPress={() => onPress(signup)}
      activeOpacity={0.7}
    >
      {/* 报名头部 */}
      <View style={styles.signupHeader}>
        <Text style={styles.signupNo}>报名编号：{signup.signupNo}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>
      
      {/* 报名内容 */}
      <View style={styles.signupContent}>
        {/* 公司Logo */}
        <Image
          source={{ uri: signup.companyInfo.companyLogo }}
          style={styles.companyLogo}
        />
        
        <View style={styles.signupInfo}>
          <Text style={styles.activityName} numberOfLines={1}>
            {signup.activityName}
          </Text>
          <Text style={styles.companyName}>{signup.companyInfo.companyName}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={14} color="#999999" />
            <Text style={styles.infoText} numberOfLines={1}>{signup.location}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={14} color="#999999" />
            <Text style={styles.infoText}>
              {formatTime(signup.activityTime)} ({formatRelativeTime(signup.activityTime)})
            </Text>
          </View>
        </View>
      </View>
      
      {/* 报名底部 */}
      <View style={styles.signupFooter}>
        <View style={styles.participantInfo}>
          <Ionicons name="people-outline" size={16} color="#666666" />
          <Text style={styles.participantText}>
            {signup.participantCount}/{signup.maxParticipants}人
          </Text>
        </View>
        
        {/* 已确认状态标识 */}
        {signup.status === 'confirmed' && (
          <View style={styles.confirmedBadge}>
            <Ionicons name="checkmark-circle" size={14} color={COLORS.info} />
            <Text style={styles.confirmedText}>已确认</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

/**
 * EmptyState - 空状态
 */
const EmptyState: React.FC = () => {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={64} color="#CCCCCC" />
      <Text style={styles.emptyText}>暂无报名记录</Text>
    </View>
  );
};

/**
 * MySignupsPage 主组件
 */
const MySignupsPage: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    signups,
    refreshing,
    setRefreshing,
    setSignups,
  } = useSignupsState();
  
  const {
    handleRefresh,
    handleSignupPress,
    handleBack,
  } = useSignupsLogic(setRefreshing, setSignups, activeTab);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的报名</Text>
        <View style={styles.headerRight} />
      </View>
      
      {/* Tab栏 */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* 报名列表 */}
      <FlatList
        data={signups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SignupCard signup={item} onPress={handleSignupPress} />
        )}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={signups.length === 0 ? styles.emptyContainer : styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
          />
        }
      />
    </SafeAreaView>
  );
};
// #endregion

// #region 9. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  
  // 顶部导航
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  headerRight: {
    width: 40,
  },
  
  // Tab栏
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  tabText: {
    fontSize: 14,
    color: '#666666',
  },
  tabTextActive: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 1.5,
  },
  
  // 列表
  listContent: {
    paddingVertical: 12,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  
  // 报名卡片
  signupCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // 报名头部
  signupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  signupNo: {
    fontSize: 12,
    color: '#999999',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  // 报名内容
  signupContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E5E5E5',
    marginRight: 12,
  },
  signupInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  activityName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 4,
    flex: 1,
  },
  
  // 报名底部
  signupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantText: {
    fontSize: 13,
    color: '#666666',
    marginLeft: 4,
  },
  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confirmedText: {
    fontSize: 12,
    color: COLORS.info,
    fontWeight: '600',
    marginLeft: 4,
  },
  
  // 空状态
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 14,
    color: '#999999',
    marginTop: 16,
  },
});
// #endregion

// #region 10. Exports
export default MySignupsPage;
// #endregion

