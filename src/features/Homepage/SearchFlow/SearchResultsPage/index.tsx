// #region 1. File Banner & TOC
/**
 * SearchResultsPage - 搜索结果页面
 * 
 * 功能描述：显示搜索结果，分为四个Tab：全部、用户、下单、话题
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema
 * [3] Constants & Config
 * [4] Mock Data
 * [5] UI Components
 * [6] Main Component
 * [7] Exports
 */
// #endregion

// #region 2. Imports
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
// #endregion

// #region 3. Types & Schema
export interface SearchResultsPageProps {
  query: string;
  onBack: () => void;
  onQueryChange: (text: string) => void;
  onSearchSubmit: () => void;
}

type TabType = 'all' | 'users' | 'orders' | 'topics';

interface UserResult {
  id: string;
  avatar: string;
  nickname: string;
  tags: string[];
  isOnline?: boolean;
  isVerified?: boolean;
}

interface OrderResult {
  id: string;
  avatar: string;
  nickname: string;
  tags: string[];
  title: string;
  description: string;
  price: string;
  distance: string;
}

interface TopicResult {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  tag?: string;
}
// #endregion

// #region 4. Constants & Config
const COLORS = {
  BACKGROUND: '#F5F5F5',
  WHITE: '#FFFFFF',
  PRIMARY: '#9C27B0',
  TEXT: '#333333',
  TEXT_SECONDARY: '#666666',
  TEXT_LIGHT: '#999999',
  BORDER: '#E0E0E0',
  TAG_BG: '#E8F5E9',
  TAG_TEXT: '#4CAF50',
  ONLINE: '#4CAF50',
  PRICE: '#FF5722',
};

const TABS = [
  { key: 'all' as TabType, label: '全部' },
  { key: 'users' as TabType, label: '用户' },
  { key: 'orders' as TabType, label: '下单' },
  { key: 'topics' as TabType, label: '话题' },
];
// #endregion

// #region 5. Mock Data
const generateMockUserResults = (query: string): UserResult[] => {
  return [
    {
      id: '1',
      avatar: 'https://via.placeholder.com/60',
      nickname: `王者荣耀112`,
      tags: ['王者荣耀'],
      isVerified: true,
    },
    {
      id: '2',
      avatar: 'https://via.placeholder.com/60',
      nickname: `王者荣耀348`,
      tags: ['王者荣耀'],
      isVerified: true,
    },
    {
      id: '3',
      avatar: 'https://via.placeholder.com/60',
      nickname: `王者荣耀大师`,
      tags: ['王者荣耀'],
      isOnline: true,
    },
  ];
};

const generateMockOrderResults = (query: string): OrderResult[] => {
  return [
    {
      id: '1',
      avatar: 'https://via.placeholder.com/80',
      nickname: '昵称123',
      tags: ['女'],
      title: '王者荣耀陪玩',
      description: '王打野位出租 擅长韩信、兰陵王力量感慨 能C能躺 随叫随到',
      price: '10 金币/局',
      distance: '3.3km',
    },
    {
      id: '2',
      avatar: 'https://via.placeholder.com/80',
      nickname: '昵称123',
      tags: ['女'],
      title: '王者荣耀陪玩',
      description: '王打野位出租 擅长韩信、兰陵王力量感慨 能C能躺 随叫随到',
      price: '10 金币/局',
      distance: '3.3km',
    },
    {
      id: '3',
      avatar: 'https://via.placeholder.com/80',
      nickname: '昵称123',
      tags: ['女'],
      title: '王者荣耀陪玩',
      description: '王打野位出租 擅长韩信、兰陵王力量感慨 能C能躺 随叫随到',
      price: '10 金币/局',
      distance: '1.2km',
    },
  ];
};

const generateMockTopicResults = (query: string): TopicResult[] => {
  return [
    {
      id: '1',
      icon: 'https://via.placeholder.com/50',
      title: '王者荣耀',
      subtitle: '这是有关王者荣耀的话题',
      tag: 'HOT',
    },
    {
      id: '2',
      icon: 'https://via.placeholder.com/50',
      title: '王者荣耀陪位',
      subtitle: '这是有关王者荣耀陪位的话题',
      tag: 'HOT',
    },
    {
      id: '3',
      icon: 'https://via.placeholder.com/50',
      title: '王者荣耀交友',
      subtitle: '这是有关王者荣耀交友的话题',
    },
  ];
};
// #endregion

// #region 6. UI Components
/**
 * Tab导航栏
 */
const TabBar: React.FC<{
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}> = ({ activeTab, onTabChange }) => (
  <View style={styles.tabBar}>
    {TABS.map(tab => (
      <TouchableOpacity
        key={tab.key}
        style={[styles.tab, activeTab === tab.key && styles.activeTab]}
        onPress={() => onTabChange(tab.key)}
      >
        <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

/**
 * 用户结果卡片
 */
const UserResultCard: React.FC<{ user: UserResult; onPress: () => void }> = ({
  user,
  onPress,
}) => (
  <TouchableOpacity style={styles.userCard} onPress={onPress}>
    <View style={styles.userCardContent}>
      <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <View style={styles.userNameRow}>
          <Text style={styles.userName}>{user.nickname}</Text>
          {user.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>已认证</Text>
            </View>
          )}
        </View>
        <View style={styles.userTags}>
          {user.tags.map((tag, index) => (
            <View key={index} style={styles.userTag}>
              <Text style={styles.userTagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
      {user.isOnline && (
        <View style={styles.onlineIndicator}>
          <View style={styles.onlineDot} />
        </View>
      )}
    </View>
    <TouchableOpacity style={styles.followButton}>
      <Text style={styles.followButtonText}>已关注</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

/**
 * 下单结果卡片
 */
const OrderResultCard: React.FC<{ order: OrderResult; onPress: () => void }> = ({
  order,
  onPress,
}) => (
  <TouchableOpacity style={styles.orderCard} onPress={onPress}>
    <Image source={{ uri: order.avatar }} style={styles.orderAvatar} />
    <View style={styles.orderContent}>
      <View style={styles.orderHeader}>
        <View style={styles.orderUserInfo}>
          <Text style={styles.orderNickname}>{order.nickname}</Text>
          {order.tags.map((tag, index) => (
            <View key={index} style={styles.orderTag}>
              <Text style={styles.orderTagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.orderDistance}>{order.distance}</Text>
      </View>
      <Text style={styles.orderTitle}>{order.title}</Text>
      <Text style={styles.orderDescription} numberOfLines={2}>
        {order.description}
      </Text>
      <View style={styles.orderFooter}>
        <Text style={styles.orderPrice}>{order.price}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

/**
 * 话题结果卡片
 */
const TopicResultCard: React.FC<{ topic: TopicResult; onPress: () => void }> = ({
  topic,
  onPress,
}) => (
  <TouchableOpacity style={styles.topicCard} onPress={onPress}>
    <Image source={{ uri: topic.icon }} style={styles.topicIcon} />
    <View style={styles.topicContent}>
      <View style={styles.topicHeader}>
        <Text style={styles.topicTitle}>{topic.title}</Text>
        {topic.tag && (
          <View style={styles.topicTagBadge}>
            <Text style={styles.topicTagText}>{topic.tag}</Text>
          </View>
        )}
      </View>
      <Text style={styles.topicSubtitle}>{topic.subtitle}</Text>
    </View>
  </TouchableOpacity>
);

/**
 * 全部结果混合列表
 */
const AllResultsList: React.FC<{
  users: UserResult[];
  orders: OrderResult[];
  topics: TopicResult[];
  onUserPress: (id: string) => void;
  onOrderPress: (id: string) => void;
  onTopicPress: (id: string) => void;
}> = ({ users, orders, topics, onUserPress, onOrderPress, onTopicPress }) => {
  // 混合所有结果
  const allResults = [
    ...users.slice(0, 2).map(u => ({ type: 'user' as const, data: u })),
    ...orders.slice(0, 2).map(o => ({ type: 'order' as const, data: o })),
    ...topics.slice(0, 2).map(t => ({ type: 'topic' as const, data: t })),
  ];

  return (
    <FlatList
      data={allResults}
      renderItem={({ item }) => {
        if (item.type === 'user') {
          return <UserResultCard user={item.data} onPress={() => onUserPress(item.data.id)} />;
        } else if (item.type === 'order') {
          return <OrderResultCard order={item.data} onPress={() => onOrderPress(item.data.id)} />;
        } else {
          return <TopicResultCard topic={item.data} onPress={() => onTopicPress(item.data.id)} />;
        }
      }}
      keyExtractor={(item, index) => `${item.type}-${index}`}
      contentContainerStyle={styles.listContent}
    />
  );
};
// #endregion

// #region 7. Main Component
const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ 
  query, 
  onBack, 
  onQueryChange, 
  onSearchSubmit 
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // 生成模拟数据
  const users = generateMockUserResults(query);
  const orders = generateMockOrderResults(query);
  const topics = generateMockTopicResults(query);

  const handleUserPress = (id: string) => {
    router.push({ pathname: '/modal/user-detail' as any, params: { userId: id } });
  };

  const handleOrderPress = (id: string) => {
    console.log('Order pressed:', id);
    // TODO: Navigate to order detail
  };

  const handleTopicPress = (id: string) => {
    router.push({ pathname: '/topic/[topicId]' as any, params: { topicId: id } });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <FlatList
            data={users}
            renderItem={({ item }) => (
              <UserResultCard user={item} onPress={() => handleUserPress(item.id)} />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
          />
        );
      case 'orders':
        return (
          <FlatList
            data={orders}
            renderItem={({ item }) => (
              <OrderResultCard order={item} onPress={() => handleOrderPress(item.id)} />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
          />
        );
      case 'topics':
        return (
          <FlatList
            data={topics}
            renderItem={({ item }) => (
              <TopicResultCard topic={item} onPress={() => handleTopicPress(item.id)} />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
          />
        );
      case 'all':
      default:
        return (
          <AllResultsList
            users={users}
            orders={orders}
            topics={topics}
            onUserPress={handleUserPress}
            onOrderPress={handleOrderPress}
            onTopicPress={handleTopicPress}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />
      {/* 搜索栏 */}
      <View style={styles.searchBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text 
            style={styles.searchText}
            numberOfLines={1}
          >
            {query}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.searchButton} onPress={onSearchSubmit}>
          <Text style={styles.searchButtonText}>搜索</Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab栏 */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* 结果内容 */}
      {renderContent()}
    </SafeAreaView>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  // Search Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.TEXT,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 36,
    marginRight: 8,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.TEXT,
  },
  searchButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 18,
  },
  searchButtonText: {
    fontSize: 14,
    color: COLORS.WHITE,
    fontWeight: '600',
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.PRIMARY,
  },
  tabText: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
  },
  activeTabText: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },

  // List
  listContent: {
    padding: 12,
  },

  // User Card
  userCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  userCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: COLORS.TAG_BG,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  verifiedText: {
    fontSize: 11,
    color: COLORS.TAG_TEXT,
  },
  userTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  userTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 6,
  },
  userTagText: {
    fontSize: 12,
    color: '#2196F3',
  },
  onlineIndicator: {
    marginLeft: 8,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.ONLINE,
  },
  followButton: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 15,
  },
  followButtonText: {
    fontSize: 13,
    color: COLORS.PRIMARY,
  },

  // Order Card
  orderCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
  },
  orderAvatar: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  orderContent: {
    flex: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderNickname: {
    fontSize: 14,
    color: COLORS.TEXT,
    marginRight: 6,
  },
  orderTag: {
    backgroundColor: '#FCE4EC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  orderTagText: {
    fontSize: 11,
    color: '#E91E63',
  },
  orderDistance: {
    fontSize: 13,
    color: COLORS.TEXT_LIGHT,
  },
  orderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  orderDescription: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 18,
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.PRICE,
  },

  // Topic Card
  topicCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  topicContent: {
    flex: 1,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginRight: 8,
  },
  topicTagBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  topicTagText: {
    fontSize: 11,
    color: '#F44336',
    fontWeight: '600',
  },
  topicSubtitle: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default SearchResultsPage;
// #endregion

