// #region 1. File Banner & TOC
/**
 * DetailPage - 详情页
 * 
 * 功能：
 * - 显示详细信息（技能/服务/组局等）
 * - 用户信息展示
 * - 评价列表
 * - 底部私信和下单按钮
 */
// #endregion

// #region 2. Imports
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
// #endregion

// #region 3. Types
interface DetailPageProps {
  skillId: string;
  userId: string;
  isMyProduct?: boolean;  // 是否是我的产品
  contentType?: 'service' | 'event';  // 内容类型：服务或组局活动
}

interface Review {
  id: string;
  userName: string;
  avatar: string;
  rating: number;
  date: string;
  content: string;
}
// #endregion

// #region 4. UI Components & Rendering

/**
 * 评价卡片组件
 */
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Text key={index} style={styles.star}>
        {index < rating ? '⭐' : '☆'}
      </Text>
    ));
  };

  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
        <View style={styles.reviewHeaderInfo}>
          <Text style={styles.reviewUserName}>{review.userName}</Text>
          <View style={styles.reviewStars}>{renderStars(review.rating)}</View>
        </View>
        <Text style={styles.reviewDate}>{review.date}</Text>
      </View>
      <Text style={styles.reviewContent}>{review.content}</Text>
    </View>
  );
};

/**
 * 详情页主组件
 */
const DetailPage: React.FC<DetailPageProps> = ({ skillId, userId, isMyProduct = false, contentType = 'service' }) => {
  const router = useRouter();

  // 判断是否为组局活动
  const isEvent = contentType === 'event';

  // 模拟数据
  const skillData = {
    coverImage: 'https://picsum.photos/400/200',
    userName: '昵称123',
    avatar: 'https://picsum.photos/80',
    isRealVerified: true,
    isGodVerified: true,
    gender: 2,
    distance: '3.2km',
    price: 10,
    unit: isEvent ? '人' : '局',
    tags: ['实名认证', '大神', '微信区', '荣耀王者', '巅峰1800+'],
    description: '主打鲜其他位置都能补 能c技术方式战韩信 这里是技能介绍这里是技能介绍这里是技能介绍',
    rating: 99,
    reviewCount: 100,
    reviewTags: ['带妹上分', '声音好听'],
    availableTime: 'I小时30分钟后可接单',
    // 组局活动特有字段
    currentCount: 12,  // 当前报名人数
    maxCount: 16,      // 最大报名人数
    startTime: '6月10日18:00',  // 活动开始时间
  };

  const reviews: Review[] = [
    {
      id: '1',
      userName: '昵称123',
      avatar: 'https://picsum.photos/40',
      rating: 4,
      date: '2025-14-49',
      content: '非常好 声音也很好听 人超级有耐心 soo全场接稳地 让人很安心 技术超级好',
    },
    {
      id: '2',
      userName: '昵称123',
      avatar: 'https://picsum.photos/40',
      rating: 5,
      date: '2025-14-49',
      content: '非常好 声音也很好听 人超级有耐心 soo全场接稳地 让人很安心 技术超级好',
    },
  ];

  const handleBack = () => {
    router.back();
  };

  const handleMessage = () => {
    console.log('发送私信');
    // TODO: 跳转到私信页面
  };

  const handleOrder = () => {
    if (isEvent) {
      console.log('报名组局');
      // TODO: 跳转到报名页面或显示报名确认弹窗
      // router.push(`/event/signup?eventId=${skillId}` as any);
    } else {
      console.log('下单');
      // 跳转到订单页面
      router.push(`/order/create?skillId=${skillId}&userId=${userId}` as any);
    }
  };

  // 处理管理（编辑）
  const handleManage = () => {
    console.log('管理发布', { skillId });
    router.push(`/profile/manage-post?postId=${skillId}` as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>详情</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 封面图 */}
        <Image source={{ uri: skillData.coverImage }} style={styles.coverImage} />

        {/* 用户信息卡片 */}
        <View style={styles.userCard}>
          <Image source={{ uri: skillData.avatar }} style={styles.userAvatar} />
          
          <View style={styles.userInfo}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{skillData.userName}</Text>
              <Text style={[styles.genderIcon, skillData.gender === 1 ? styles.male : styles.female]}>
                {skillData.gender === 1 ? '♂' : '♀'}
              </Text>
              <Text style={styles.distance}>{skillData.distance}</Text>
            </View>
            
            <View style={styles.userTags}>
              {skillData.tags.map((tag, index) => (
                <View key={index} style={styles.userTag}>
                  <Text style={styles.userTagText}>{tag}</Text>
                </View>
              ))}
            </View>
            
            <Text style={styles.userDescription} numberOfLines={3}>
              {skillData.description}
            </Text>
          </View>

          <View style={styles.priceColumn}>
            <Text style={styles.priceNumber}>{skillData.price}</Text>
            <Text style={styles.priceUnit}>金币/{skillData.unit}</Text>
          </View>
        </View>

        {/* 组局活动报名信息 */}
        {isEvent && (
          <View style={styles.eventInfoCard}>
            <View style={styles.eventInfoRow}>
              <View style={styles.eventInfoItem}>
                <Text style={styles.eventInfoIcon}>👥</Text>
                <Text style={styles.eventInfoLabel}>报名人数</Text>
                <Text style={styles.eventInfoValue}>
                  {skillData.currentCount}/{skillData.maxCount}人
                </Text>
              </View>
              
              <View style={styles.eventInfoDivider} />
              
              <View style={styles.eventInfoItem}>
                <Text style={styles.eventInfoIcon}>🕐</Text>
                <Text style={styles.eventInfoLabel}>活动时间</Text>
                <Text style={styles.eventInfoValue}>{skillData.startTime}</Text>
              </View>
            </View>
            
            {/* 报名进度条 */}
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${(skillData.currentCount / skillData.maxCount) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              还差 {skillData.maxCount - skillData.currentCount} 人满员
            </Text>
          </View>
        )}

        {/* 评价区域 */}
        <View style={styles.reviewSection}>
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewTitle}>
              评价 ({skillData.reviewCount}+)
            </Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>好评率{skillData.rating}%</Text>
            </View>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>查看全部</Text>
              <Ionicons name="chevron-forward" size={16} color="#999999" />
            </TouchableOpacity>
          </View>

          {/* 评价标签 */}
          <View style={styles.reviewTagsContainer}>
            {skillData.reviewTags.map((tag, index) => (
              <View key={index} style={styles.reviewTag}>
                <Text style={styles.reviewTagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* 评价列表 */}
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}

          {/* 可预约时间 */}
          <View style={styles.availableTimeContainer}>
            <Text style={styles.availableTimeText}>{skillData.availableTime}</Text>
          </View>
        </View>
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.bottomButtons}>
        {isMyProduct ? (
          // 我的产品：显示编辑和删除按钮
          <>
            <TouchableOpacity style={styles.editButton} onPress={handleManage}>
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              <Text style={styles.editButtonText}>编辑</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.manageButton} onPress={handleManage}>
              <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
              <Text style={styles.manageButtonText}>管理</Text>
            </TouchableOpacity>
          </>
        ) : (
          // 他人产品：显示私信和下单/报名按钮
          <>
            <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
              <Ionicons name="mail-outline" size={20} color="#FFFFFF" />
              <Text style={styles.messageButtonText}>私信</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
              <Ionicons name={isEvent ? "person-add-outline" : "cart-outline"} size={20} color="#FFFFFF" />
              <Text style={styles.orderButtonText}>{isEvent ? '报名' : '下单'}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};
// #endregion

// #region 5. Exports & Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
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
  scrollView: {
    flex: 1,
  },
  coverImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E5E5E5',
  },
  
  // 用户信息卡片
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    marginRight: 8,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginRight: 4,
  },
  genderIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  male: {
    color: '#2196F3',
  },
  female: {
    color: '#FF4081',
  },
  distance: {
    fontSize: 12,
    color: '#999999',
  },
  userTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  userTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  userTagText: {
    fontSize: 10,
    color: '#2196F3',
  },
  userDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  priceColumn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  priceNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF4444',
  },
  priceUnit: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },
  
  // 组局活动信息卡片
  eventInfoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
  },
  eventInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  eventInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  eventInfoIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  eventInfoLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  eventInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  eventInfoDivider: {
    width: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 16,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: '#8B5CF6',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // 评价区域
  reviewSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginRight: 8,
  },
  ratingBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 'auto',
  },
  ratingText: {
    fontSize: 12,
    color: '#FF9800',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#999999',
    marginRight: 2,
  },
  reviewTagsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  reviewTag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  reviewTagText: {
    fontSize: 13,
    color: '#666666',
  },
  
  // 评价卡片
  reviewCard: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewHeaderInfo: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  reviewStars: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 12,
    marginRight: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999999',
  },
  reviewContent: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  
  // 可预约时间
  availableTimeContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  availableTimeText: {
    fontSize: 13,
    color: '#999999',
  },
  
  // 底部按钮
  bottomButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  orderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D946EF',
  },
  orderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // 编辑按钮（我的产品）
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // 管理按钮（我的产品）
  manageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
  },
  manageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default DetailPage;
// #endregion

