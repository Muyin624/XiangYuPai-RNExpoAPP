// #region 1. File Banner & TOC
/**
 * MyOrdersPage - 我的订单列表页面
 * 
 * 功能：
 * - Tab切换（全部/待接单/进行中/已完成/已取消）
 * - 订单列表展示
 * - 订单状态筛选
 * - 跳转订单详情
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
import { COLORS, ORDER_STATUS_CONFIG, TABS } from './constants';
import type { Order, OrderStatus, TabType } from './types';
// #endregion

// #region 3. Types & Schema
// (使用types.ts中的定义)
// #endregion

// #region 4. Constants & Config
// (使用constants.ts中的配置)
// #endregion

// #region 5. Utils & Helpers
/**
 * 生成模拟订单数据
 */
const generateMockOrders = (status?: OrderStatus): Order[] => {
  const statuses: OrderStatus[] = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];
  const filterStatuses = status ? [status] : statuses;
  
  return Array.from({ length: 10 }, (_, index) => {
    const orderStatus = filterStatuses[Math.floor(Math.random() * filterStatuses.length)];
    return {
      id: `order-${index + 1}`,
      orderNo: `XYP${Date.now()}${index}`,
      status: orderStatus,
      skillName: ['王者荣耀', '英雄联盟', '和平精英', '原神'][Math.floor(Math.random() * 4)],
      price: Math.floor(Math.random() * 50) + 10,
      quantity: Math.floor(Math.random() * 3) + 1,
      totalPrice: 0, // 将在下面计算
      customerInfo: {
        userId: `customer-${index + 1}`,
        nickname: `客户${index + 1}`,
        avatar: `https://picsum.photos/seed/${index}/100`,
        gender: Math.random() > 0.5 ? 1 : 2,
      },
      createdAt: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
      updatedAt: Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000),
    };
  }).map(order => ({
    ...order,
    totalPrice: order.price * order.quantity,
  }));
};

/**
 * 格式化时间
 */
const formatTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  
  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  } else if (diff < 7 * day) {
    return `${Math.floor(diff / day)}天前`;
  } else {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}-${date.getDate()}`;
  }
};
// #endregion

// #region 6. State Management
/**
 * 订单列表状态管理Hook
 */
const useOrdersState = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [orders, setOrders] = useState<Order[]>(() => generateMockOrders());
  const [refreshing, setRefreshing] = useState(false);
  
  // 根据Tab筛选订单
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });
  
  return {
    activeTab,
    setActiveTab,
    orders: filteredOrders,
    refreshing,
    setRefreshing,
    setOrders,
  };
};
// #endregion

// #region 7. Domain Logic
/**
 * 订单列表业务逻辑Hook
 */
const useOrdersLogic = (
  setRefreshing: (value: boolean) => void,
  setOrders: (orders: Order[]) => void,
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
      const status = activeTab === 'all' ? undefined : activeTab as OrderStatus;
      setOrders(generateMockOrders(status));
      setRefreshing(false);
    }, 1000);
  }, [setRefreshing, setOrders, activeTab]);
  
  /**
   * 跳转订单详情
   */
  const handleOrderPress = useCallback((order: Order) => {
    console.log(`🧭 导航: 我的订单 → 订单详情 (${order.orderNo})`);
    router.push({
      pathname: '/profile/order-detail',
      params: { 
        orderId: order.id,
        status: order.status, // 传递订单状态
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
    handleOrderPress,
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
 * OrderCard - 订单卡片
 */
const OrderCard: React.FC<{
  order: Order;
  onPress: (order: Order) => void;
}> = ({ order, onPress }) => {
  const statusConfig = ORDER_STATUS_CONFIG[order.status];
  
  return (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => onPress(order)}
      activeOpacity={0.7}
    >
      {/* 订单头部 */}
      <View style={styles.orderHeader}>
        <Text style={styles.orderNo}>订单号：{order.orderNo}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>
      
      {/* 订单内容 */}
      <View style={styles.orderContent}>
        {/* 客户信息 */}
        <Image
          source={{ uri: order.customerInfo.avatar }}
          style={styles.avatar}
        />
        
        <View style={styles.orderInfo}>
          <View style={styles.orderInfoRow}>
            <Text style={styles.userName}>{order.customerInfo.nickname}</Text>
            <Text style={[styles.genderIcon, order.customerInfo.gender === 1 ? styles.male : styles.female]}>
              {order.customerInfo.gender === 1 ? '♂' : '♀'}
            </Text>
          </View>
          
          <Text style={styles.skillName}>{order.skillName}</Text>
          
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderPrice}>
              {order.price}金币 × {order.quantity}
            </Text>
            <Text style={styles.orderTime}>{formatTime(order.createdAt)}</Text>
          </View>
        </View>
      </View>
      
      {/* 订单底部 */}
      <View style={styles.orderFooter}>
        <Text style={styles.totalPrice}>
          合计：<Text style={styles.totalPriceValue}>{order.totalPrice}</Text> 金币
        </Text>
        
        <View style={styles.orderActions}>
          {statusConfig.actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionButton,
                action.type === 'primary' && styles.actionButtonPrimary,
              ]}
              onPress={() => console.log(`${action.label} - ${order.orderNo}`)}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  action.type === 'primary' && styles.actionButtonTextPrimary,
                ]}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
      <Ionicons name="document-text-outline" size={64} color="#CCCCCC" />
      <Text style={styles.emptyText}>暂无订单</Text>
    </View>
  );
};

/**
 * MyOrdersPage 主组件
 */
const MyOrdersPage: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    orders,
    refreshing,
    setRefreshing,
    setOrders,
  } = useOrdersState();
  
  const {
    handleRefresh,
    handleOrderPress,
    handleBack,
  } = useOrdersLogic(setRefreshing, setOrders, activeTab);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的订单</Text>
        <View style={styles.headerRight} />
      </View>
      
      {/* Tab栏 */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* 订单列表 */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard order={item} onPress={handleOrderPress} />
        )}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={orders.length === 0 ? styles.emptyContainer : styles.listContent}
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
  
  // 订单卡片
  orderCard: {
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
  
  // 订单头部
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  orderNo: {
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
  
  // 订单内容
  orderContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E5E5E5',
    marginRight: 12,
  },
  orderInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  orderInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 15,
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
  skillName: {
    fontSize: 14,
    color: '#666666',
    marginVertical: 4,
  },
  orderPrice: {
    fontSize: 13,
    color: '#999999',
    flex: 1,
  },
  orderTime: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  
  // 订单底部
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalPrice: {
    fontSize: 13,
    color: '#666666',
  },
  totalPriceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF4444',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
  },
  actionButtonPrimary: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: 13,
    color: '#666666',
  },
  actionButtonTextPrimary: {
    color: '#FFFFFF',
    fontWeight: '500',
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
export default MyOrdersPage;
// #endregion

