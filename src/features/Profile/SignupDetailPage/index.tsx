// #region 1. File Banner & TOC
/**
 * SignupDetailPage - 报名详情页面
 * 
 * 功能：
 * - 根据报名状态显示不同内容
 * - 待确认：显示等待确认状态、取消报名
 * - 已确认：显示见面码、倒计时、签到功能
 * - 已完成：显示评价功能
 * - 已取消：显示取消原因
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// 子组件
import CompletedStatusArea from './CompletedStatusArea';
import ConfirmedStatusArea from './ConfirmedStatusArea';
import MeetingCodeInput from './MeetingCodeInput';
import PendingStatusArea from './PendingStatusArea';

// 类型和常量
import { SIGNUP_STATUS_CONFIG } from '../MySignupsPage/constants';
import type { SignupDetail } from './types';
// #endregion

// #region 3. Types & Schema
// (使用types.ts中的定义)
// #endregion

// #region 4. Constants & Config
// (使用constants.ts中的配置)
// #endregion

// #region 5. Utils & Helpers
/**
 * 生成模拟报名详情数据
 */
const generateMockSignupDetail = (signupId: string, statusFromList?: string): SignupDetail => {
  const statuses = ['pending', 'confirmed', 'completed', 'cancelled'] as const;
  const status = (statusFromList as typeof statuses[number]) || statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    id: signupId,
    signupNo: `SN${Date.now()}`,
    status,
    activityName: '游戏行业技能交流会',
    activityDesc: '本次活动旨在促进游戏行业从业者之间的技能交流与合作，分享最新的游戏开发技术和行业趋势。',
    activityType: '线下活动',
    companyInfo: {
      companyId: 'company-1',
      companyName: '腾讯游戏',
      companyLogo: 'https://picsum.photos/seed/tencent/200',
      contactPhone: '400-****-1234',
      contactEmail: 'event@tencent.com',
    },
    location: '深圳市南山区',
    detailedAddress: '深圳市南山区科技园南区腾讯大厦',
    activityTime: Date.now() + 2 * 24 * 60 * 60 * 1000, // 2天后
    duration: 180, // 3小时
    signupTime: Date.now() - 24 * 60 * 60 * 1000, // 1天前
    confirmedAt: status !== 'pending' ? Date.now() - 12 * 60 * 60 * 1000 : undefined,
    completedAt: status === 'completed' ? Date.now() - 2 * 60 * 60 * 1000 : undefined,
    cancelledAt: status === 'cancelled' ? Date.now() - 2 * 60 * 60 * 1000 : undefined,
    cancelReason: status === 'cancelled' ? '个人原因取消' : undefined,
    isCheckedIn: status === 'completed',
    checkedInAt: status === 'completed' ? Date.now() - 3 * 60 * 60 * 1000 : undefined,
    participantCount: 45,
    maxParticipants: 100,
    requirements: '请携带身份证件，提前15分钟到场',
    notes: '活动现场提供茶歇，请勿携带宠物',
    rating: status === 'completed' ? undefined : undefined,
    comment: status === 'completed' ? undefined : undefined,
    timeline: [
      {
        time: Date.now() - 24 * 60 * 60 * 1000,
        title: '提交报名',
        desc: '您已成功提交报名申请',
      },
      ...(status !== 'pending' ? [{
        time: Date.now() - 12 * 60 * 60 * 1000,
        title: '报名确认',
        desc: '主办方已确认您的报名',
      }] : []),
      ...(status === 'completed' ? [{
        time: Date.now() - 3 * 60 * 60 * 1000,
        title: '签到成功',
        desc: '您已成功签到',
      }, {
        time: Date.now() - 2 * 60 * 60 * 1000,
        title: '活动完成',
        desc: '期待您的评价',
      }] : []),
      ...(status === 'cancelled' ? [{
        time: Date.now() - 2 * 60 * 60 * 1000,
        title: '报名取消',
        desc: '个人原因取消',
      }] : []),
    ],
  };
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
// #endregion

// #region 6. State Management
/**
 * 报名详情状态管理Hook
 */
const useSignupDetailState = (signupId: string, statusFromList?: string) => {
  const [signupDetail, setSignupDetail] = useState<SignupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMeetingCodeInput, setShowMeetingCodeInput] = useState(false);
  
  // 加载报名详情
  useEffect(() => {
    setLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      const detail = generateMockSignupDetail(signupId, statusFromList);
      setSignupDetail(detail);
      setLoading(false);
    }, 500);
  }, [signupId, statusFromList]);
  
  return {
    signupDetail,
    setSignupDetail,
    loading,
    showMeetingCodeInput,
    setShowMeetingCodeInput,
  };
};
// #endregion

// #region 7. Domain Logic
/**
 * 报名详情业务逻辑Hook
 */
const useSignupDetailLogic = (setSignupDetail: (detail: SignupDetail) => void) => {
  const router = useRouter();
  
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  
  /**
   * 取消报名
   */
  const handleCancelSignup = useCallback((signupId: string) => {
    Alert.alert(
      '确认取消',
      '确定要取消报名吗？',
      [
        { text: '再想想', style: 'cancel' },
        {
          text: '确定取消',
          style: 'destructive',
          onPress: () => {
            console.log('取消报名:', signupId);
            // TODO: 调用取消报名API
            Alert.alert('成功', '已取消报名');
          },
        },
      ]
    );
  }, []);
  
  /**
   * 联系主办方
   */
  const handleContactOrganizer = useCallback((companyId: string) => {
    console.log('联系主办方:', companyId);
    // TODO: 跳转联系页面或拨打电话
  }, []);
  
  /**
   * 签到（输入主办方提供的4位见面码）
   */
  const handleCheckIn = useCallback((signupId: string, code: string) => {
    console.log('签到:', { signupId, code });
    // TODO: 调用签到API验证主办方提供的见面码
    Alert.alert('成功', '签到成功！');
    
    // 更新状态为已签到
    setSignupDetail((prev) => prev ? {
      ...prev,
      isCheckedIn: true,
      checkedInAt: Date.now(),
    } : prev as SignupDetail);
  }, [setSignupDetail]);
  
  /**
   * 提交评价
   */
  const handleSubmitRating = useCallback((signupId: string, rating: number, comment: string) => {
    console.log('提交评价:', { signupId, rating, comment });
    // TODO: 调用评价API
  }, []);
  
  return {
    handleBack,
    handleCancelSignup,
    handleContactOrganizer,
    handleCheckIn,
    handleSubmitRating,
  };
};
// #endregion

// #region 8. UI Components & Rendering

/**
 * ActivityTimeline - 活动时间轴
 */
const ActivityTimeline: React.FC<{ timeline: SignupDetail['timeline'] }> = ({ timeline }) => {
  return (
    <View style={styles.timelineSection}>
      <Text style={styles.sectionTitle}>报名进度</Text>
      <View style={styles.timeline}>
        {timeline.map((item, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineDot, index === 0 && styles.timelineDotActive]} />
              {index < timeline.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <View style={styles.timelineRight}>
              <Text style={[styles.timelineTitle, index === 0 && styles.timelineTitleActive]}>
                {item.title}
              </Text>
              {item.desc && <Text style={styles.timelineDesc}>{item.desc}</Text>}
              <Text style={styles.timelineTime}>{formatTime(item.time)}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

/**
 * SignupDetailPage 主组件
 */
const SignupDetailPage: React.FC = () => {
  const params = useLocalSearchParams<{ signupId: string; status?: string }>();
  const {
    signupDetail,
    setSignupDetail,
    loading,
    showMeetingCodeInput,
    setShowMeetingCodeInput,
  } = useSignupDetailState(params.signupId || '', params.status);
  
  const {
    handleBack,
    handleCancelSignup,
    handleContactOrganizer,
    handleCheckIn,
    handleSubmitRating,
  } = useSignupDetailLogic(setSignupDetail);
  
  // 加载中
  if (loading || !signupDetail) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const statusConfig = SIGNUP_STATUS_CONFIG[signupDetail.status];
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>报名详情</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 报名状态卡片 */}
        <View style={styles.statusCard}>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
          <Text style={styles.signupNo}>报名编号：{signupDetail.signupNo}</Text>
        </View>
        
        {/* 状态区域（根据报名状态显示不同内容） */}
        {signupDetail.status === 'pending' && (
          <PendingStatusArea
            signup={signupDetail}
            onCancel={() => handleCancelSignup(signupDetail.id)}
            onContact={() => handleContactOrganizer(signupDetail.companyInfo.companyId)}
          />
        )}
        
        {signupDetail.status === 'confirmed' && (
          <ConfirmedStatusArea
            signup={signupDetail}
            onCheckIn={() => setShowMeetingCodeInput(true)}
            onContact={() => handleContactOrganizer(signupDetail.companyInfo.companyId)}
          />
        )}
        
        {signupDetail.status === 'completed' && (
          <CompletedStatusArea
            signup={signupDetail}
            onRate={(rating, comment) => handleSubmitRating(signupDetail.id, rating, comment)}
          />
        )}
        
        {/* 活动信息 */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>活动信息</Text>
          
          {/* 主办方信息 */}
          <View style={styles.companySection}>
            <Image
              source={{ uri: signupDetail.companyInfo.companyLogo }}
              style={styles.companyLogo}
            />
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{signupDetail.companyInfo.companyName}</Text>
              <Text style={styles.companyLabel}>主办方</Text>
            </View>
          </View>
          
          {/* 活动详情 */}
          <View style={styles.activityDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>活动名称</Text>
              <Text style={styles.detailValue}>{signupDetail.activityName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>活动类型</Text>
              <Text style={styles.detailValue}>{signupDetail.activityType}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>活动时间</Text>
              <Text style={styles.detailValue}>{formatTime(signupDetail.activityTime)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>活动时长</Text>
              <Text style={styles.detailValue}>{signupDetail.duration}分钟</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>活动地点</Text>
              <Text style={styles.detailValue}>{signupDetail.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>详细地址</Text>
              <Text style={styles.detailValue}>{signupDetail.detailedAddress}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>参与人数</Text>
              <Text style={styles.detailValue}>
                {signupDetail.participantCount}/{signupDetail.maxParticipants}人
              </Text>
            </View>
          </View>
          
          {/* 活动描述 */}
          {signupDetail.activityDesc && (
            <View style={styles.descSection}>
              <Text style={styles.descLabel}>活动描述</Text>
              <Text style={styles.descText}>{signupDetail.activityDesc}</Text>
            </View>
          )}
          
          {/* 参与要求 */}
          {signupDetail.requirements && (
            <View style={styles.descSection}>
              <Text style={styles.descLabel}>参与要求</Text>
              <Text style={styles.descText}>{signupDetail.requirements}</Text>
            </View>
          )}
          
          {/* 注意事项 */}
          {signupDetail.notes && (
            <View style={styles.descSection}>
              <Text style={styles.descLabel}>注意事项</Text>
              <Text style={styles.descText}>{signupDetail.notes}</Text>
            </View>
          )}
        </View>
        
        {/* 活动时间轴 */}
        <ActivityTimeline timeline={signupDetail.timeline} />
      </ScrollView>
      
      {/* 见面码输入弹窗 */}
      <MeetingCodeInput
        visible={showMeetingCodeInput}
        onClose={() => setShowMeetingCodeInput(false)}
        onSubmit={(code) => {
          handleCheckIn(signupDetail.id, code);
          setShowMeetingCodeInput(false);
        }}
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
  
  // 加载状态
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999999',
  },
  
  // 滚动区域
  scrollView: {
    flex: 1,
  },
  
  // 报名状态卡片
  statusCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  signupNo: {
    fontSize: 13,
    color: '#999999',
  },
  
  // 活动信息卡片
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  
  // 主办方信息
  companySection: {
    flexDirection: 'row',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 16,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E5E5E5',
    marginRight: 12,
  },
  companyInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  companyLabel: {
    fontSize: 13,
    color: '#999999',
  },
  
  // 活动详情
  activityDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  
  // 描述区域
  descSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  descLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  descText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
  
  // 活动时间轴
  timelineSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
  },
  timeline: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    paddingBottom: 20,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 12,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CCCCCC',
  },
  timelineDotActive: {
    backgroundColor: '#8B5CF6',
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E5E5E5',
    marginTop: 4,
  },
  timelineRight: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  timelineTitleActive: {
    color: '#333333',
    fontWeight: '600',
  },
  timelineDesc: {
    fontSize: 13,
    color: '#999999',
    marginBottom: 4,
  },
  timelineTime: {
    fontSize: 12,
    color: '#CCCCCC',
  },
});
// #endregion

// #region 10. Exports
export default SignupDetailPage;
// #endregion

