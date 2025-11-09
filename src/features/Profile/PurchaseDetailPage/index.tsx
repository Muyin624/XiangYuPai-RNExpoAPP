// #region 1. File Banner & TOC
/**
 * PurchaseDetailPage - 购买订单详情页面（客户视角）
 * 
 * 功能：
 * - 根据订单状态显示不同内容
 * - 待接单：显示等待接单状态、倒计时、取消订单
 * - 已接单：显示服务提供者联系方式
 * - 进行中：显示服务进度、联系服务提供者
 * - 已完成：显示评价功能、再来一单
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
import CompletedPurchaseArea from './CompletedPurchaseArea';
import InProgressPurchaseArea from './InProgressPurchaseArea';
import PendingPurchaseArea from './PendingPurchaseArea';

// 类型和常量
import { PURCHASE_STATUS_CONFIG } from '../MyPurchasesPage/constants';
import type { PurchaseDetail } from './types';
// #endregion

// #region 3. Types & Schema
// (使用types.ts中的定义)
// #endregion

// #region 4. Constants & Config
// (使用constants.ts中的配置)
// #endregion

// #region 5. Utils & Helpers
/**
 * 生成模拟购买订单详情数据
 */
const generateMockPurchaseDetail = (orderId: string, statusFromList?: string): PurchaseDetail => {
  // 如果从列表传入了状态，使用列表的状态；否则随机生成
  const statuses = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'] as const;
  const status = (statusFromList as typeof statuses[number]) || statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    id: orderId,
    orderNo: `XYP${Date.now()}`,
    status,
    skillName: '王者荣耀',
    skillDesc: '陪玩服务 - 上分局',
    price: 15,
    quantity: 2,
    totalPrice: 30,
    providerInfo: {
      userId: 'provider-123',
      nickname: '服务者昵称',
      avatar: 'https://picsum.photos/seed/provider/200',
      gender: 1,
      phone: '138****1234',
      wechat: 'provider_wechat',
    },
    appointmentTime: Date.now() + 2 * 60 * 60 * 1000, // 2小时后
    createdAt: Date.now() - 30 * 60 * 1000, // 30分钟前
    updatedAt: Date.now() - 10 * 60 * 1000,
    acceptedAt: status !== 'pending' ? Date.now() - 20 * 60 * 1000 : undefined,
    startedAt: status === 'in_progress' || status === 'completed' ? Date.now() - 10 * 60 * 1000 : undefined,
    completedAt: status === 'completed' ? Date.now() - 5 * 60 * 1000 : undefined,
    cancelledAt: status === 'cancelled' ? Date.now() - 5 * 60 * 1000 : undefined,
    cancelReason: status === 'cancelled' ? '用户主动取消' : undefined,
    rating: status === 'completed' ? undefined : undefined, // 客户视角：待评价
    comment: status === 'completed' ? undefined : undefined,
    timeline: [
      {
        time: Date.now() - 30 * 60 * 1000,
        title: '订单已创建',
        desc: '等待服务者接单',
      },
      ...(status !== 'pending' ? [{
        time: Date.now() - 20 * 60 * 1000,
        title: '服务者已接单',
        desc: '服务者正在准备',
      }] : []),
      ...(status === 'in_progress' || status === 'completed' ? [{
        time: Date.now() - 10 * 60 * 1000,
        title: '服务已开始',
        desc: '享受愉快的游戏时光',
      }] : []),
      ...(status === 'completed' ? [{
        time: Date.now() - 5 * 60 * 1000,
        title: '服务已完成',
        desc: '期待您的评价',
      }] : []),
      ...(status === 'cancelled' ? [{
        time: Date.now() - 5 * 60 * 1000,
        title: '订单已取消',
        desc: '用户主动取消',
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
 * 购买订单详情状态管理Hook
 */
const usePurchaseDetailState = (orderId: string, statusFromList?: string) => {
  const [purchaseDetail, setPurchaseDetail] = useState<PurchaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 加载订单详情
  useEffect(() => {
    setLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      const detail = generateMockPurchaseDetail(orderId, statusFromList);
      setPurchaseDetail(detail);
      setLoading(false);
    }, 500);
  }, [orderId, statusFromList]);
  
  return {
    purchaseDetail,
    loading,
  };
};
// #endregion

// #region 7. Domain Logic
/**
 * 购买订单详情业务逻辑Hook
 */
const usePurchaseDetailLogic = () => {
  const router = useRouter();
  
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  
  const handleCancelOrder = useCallback((orderId: string) => {
    console.log('取消订单:', orderId);
    // TODO: 调用取消订单API
  }, []);
  
  /**
   * 联系服务提供者
   */
  const handleContactProvider = useCallback((userId: string) => {
    console.log('联系服务提供者:', userId);
    // TODO: 跳转聊天页面
  }, []);
  
  /**
   * 提交评价
   */
  const handleSubmitRating = useCallback((orderId: string, rating: number, comment: string) => {
    console.log('提交评价:', { orderId, rating, comment });
    // TODO: 调用评价API
  }, []);
  
  /**
   * 再来一单
   */
  const handleReorder = useCallback((orderId: string) => {
    console.log('再来一单:', orderId);
    // TODO: 跳转到下单页面
  }, []);
  
  return {
    handleBack,
    handleCancelOrder,
    handleContactProvider,
    handleSubmitRating,
    handleReorder,
  };
};
// #endregion

// #region 8. UI Components & Rendering

/**
 * OrderTimeline - 订单时间轴
 */
const OrderTimeline: React.FC<{ timeline: PurchaseDetail['timeline'] }> = ({ timeline }) => {
  return (
    <View style={styles.timelineSection}>
      <Text style={styles.sectionTitle}>订单进度</Text>
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
 * PurchaseDetailPage 主组件
 */
const PurchaseDetailPage: React.FC = () => {
  const params = useLocalSearchParams<{ orderId: string; status?: string }>();
  const { purchaseDetail, loading } = usePurchaseDetailState(params.orderId || '', params.status);
  const {
    handleBack,
    handleCancelOrder,
    handleContactProvider,
    handleSubmitRating,
    handleReorder,
  } = usePurchaseDetailLogic();
  
  // 加载中
  if (loading || !purchaseDetail) {
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
  
  const statusConfig = PURCHASE_STATUS_CONFIG[purchaseDetail.status];
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>订单详情</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 订单状态卡片 */}
        <View style={styles.statusCard}>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
          <Text style={styles.orderNo}>订单号：{purchaseDetail.orderNo}</Text>
        </View>
        
        {/* 状态区域（根据订单状态显示不同内容） */}
        {purchaseDetail.status === 'pending' && (
          <PendingPurchaseArea
            order={purchaseDetail}
            onCancel={() => handleCancelOrder(purchaseDetail.id)}
            onContact={() => handleContactProvider(purchaseDetail.providerInfo.userId)}
          />
        )}
        
        {(purchaseDetail.status === 'accepted' || purchaseDetail.status === 'in_progress') && (
          <InProgressPurchaseArea
            order={purchaseDetail}
            onContact={() => handleContactProvider(purchaseDetail.providerInfo.userId)}
          />
        )}
        
        {purchaseDetail.status === 'completed' && (
          <CompletedPurchaseArea
            order={purchaseDetail}
            onRate={(rating, comment) => handleSubmitRating(purchaseDetail.id, rating, comment)}
            onReorder={() => handleReorder(purchaseDetail.id)}
          />
        )}
        
        {/* 订单信息 */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>订单信息</Text>
          
          {/* 服务提供者信息 */}
          <View style={styles.providerSection}>
            <Image
              source={{ uri: purchaseDetail.providerInfo.avatar }}
              style={styles.providerAvatar}
            />
            <View style={styles.providerInfo}>
              <View style={styles.providerNameRow}>
                <Text style={styles.providerName}>{purchaseDetail.providerInfo.nickname}</Text>
                <Text style={[
                  styles.genderIcon,
                  purchaseDetail.providerInfo.gender === 1 ? styles.male : styles.female
                ]}>
                  {purchaseDetail.providerInfo.gender === 1 ? '♂' : '♀'}
                </Text>
              </View>
              <Text style={styles.providerLabel}>服务提供者</Text>
            </View>
          </View>
          
          {/* 订单详情 */}
          <View style={styles.orderDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>服务项目</Text>
              <Text style={styles.detailValue}>{purchaseDetail.skillName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>服务描述</Text>
              <Text style={styles.detailValue}>{purchaseDetail.skillDesc}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>单价</Text>
              <Text style={styles.detailValue}>{purchaseDetail.price} 金币</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>数量</Text>
              <Text style={styles.detailValue}>{purchaseDetail.quantity}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>合计</Text>
              <Text style={[styles.detailValue, styles.totalPrice]}>
                {purchaseDetail.totalPrice} 金币
              </Text>
            </View>
            {purchaseDetail.appointmentTime && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>预约时间</Text>
                <Text style={styles.detailValue}>
                  {formatTime(purchaseDetail.appointmentTime)}
                </Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>下单时间</Text>
              <Text style={styles.detailValue}>
                {formatTime(purchaseDetail.createdAt)}
              </Text>
            </View>
          </View>
        </View>
        
        {/* 订单时间轴 */}
        <OrderTimeline timeline={purchaseDetail.timeline} />
      </ScrollView>
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
  
  // 订单状态卡片
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
  orderNo: {
    fontSize: 13,
    color: '#999999',
  },
  
  // 订单信息卡片
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
  
  // 服务提供者信息
  providerSection: {
    flexDirection: 'row',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 16,
  },
  providerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E5E5E5',
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  providerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginRight: 4,
  },
  genderIcon: {
    fontSize: 14,
  },
  male: {
    color: '#2196F3',
  },
  female: {
    color: '#FF4081',
  },
  providerLabel: {
    fontSize: 13,
    color: '#999999',
  },
  
  // 订单详情
  orderDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 16,
    color: '#FF4444',
    fontWeight: '700',
  },
  
  // 订单时间轴
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
export default PurchaseDetailPage;
// #endregion

