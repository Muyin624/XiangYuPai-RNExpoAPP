/**
 * TopicSelectorModal - 话题选择器Modal
 * 
 * 功能：
 * - 搜索话题
 * - 显示推荐话题列表
 * - 多选话题
 * - 显示热门标签
 */

import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// 颜色常量
const COLORS = {
  PRIMARY: '#8A2BE2',
  BACKGROUND: '#FFFFFF',
  SEARCH_BACKGROUND: '#F5F5F5',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  TEXT_PLACEHOLDER: '#999999',
  BORDER: '#E5E5E5',
  HOT_TAG: '#FF6B6B',
  SELECTED: '#8A2BE2',
} as const;

// 话题类型
export interface Topic {
  id: string;
  name: string;
  description?: string;
  isHot?: boolean;
  participantCount?: number;
  postCount?: number;
}

interface TopicSelectorModalProps {
  visible: boolean;
  selectedTopics: Topic[];
  onSelect: (topics: Topic[]) => void;
  onClose: () => void;
}

// 模拟话题数据
const MOCK_TOPICS: Topic[] = [
  {
    id: '1',
    name: '王者荣耀',
    description: '话题描述话题描述话题描述话题描述话题描述话题描述...',
    isHot: true,
    participantCount: 15000,
    postCount: 50000,
  },
  {
    id: '2',
    name: '话题标题话题标题',
    description: '话题描述话题描述话题描述话题描述话题描述话题描述...',
    isHot: true,
    participantCount: 12000,
    postCount: 45000,
  },
  {
    id: '3',
    name: '话题标题话题标题',
    description: '话题描述话题描述话题描述话题描述话题描述话题描述...',
    isHot: false,
    participantCount: 8000,
    postCount: 30000,
  },
  {
    id: '4',
    name: '话题标题话题标题',
    description: '话题描述话题描述话题描述话题描述话题描述话题描述...',
    isHot: false,
    participantCount: 5000,
    postCount: 20000,
  },
  {
    id: '5',
    name: '话题标题话题标题',
    description: '话题描述话题描述话题描述话题描述话题描述话题描述...',
    isHot: false,
    participantCount: 3000,
    postCount: 15000,
  },
  {
    id: '6',
    name: '话题标题话题标题',
    description: '话题描述话题描述话题描述话题描述话题描述话题描述...',
    isHot: false,
    participantCount: 2000,
    postCount: 10000,
  },
];

// 推荐标签
const RECOMMENDED_TAGS = [
  '王者荣耀', '英雄联盟', '和平精英', '探店', '热门',
];

export default function TopicSelectorModal({
  visible,
  selectedTopics,
  onSelect,
  onClose,
}: TopicSelectorModalProps) {
  const [searchText, setSearchText] = useState('');
  const [topics, setTopics] = useState<Topic[]>(MOCK_TOPICS);
  const [loading, setLoading] = useState(false);
  const [tempSelectedTopics, setTempSelectedTopics] = useState<Topic[]>(selectedTopics);

  // 同步外部选中的话题
  useEffect(() => {
    setTempSelectedTopics(selectedTopics);
  }, [selectedTopics, visible]);

  // 搜索话题
  const handleSearch = async (text: string) => {
    setSearchText(text);
    
    if (!text.trim()) {
      setTopics(MOCK_TOPICS);
      return;
    }

    setLoading(true);
    try {
      // TODO: 调用搜索API
      await new Promise(resolve => setTimeout(resolve, 300));
      const filtered = MOCK_TOPICS.filter(topic => 
        topic.name.toLowerCase().includes(text.toLowerCase())
      );
      setTopics(filtered);
    } catch (error) {
      console.error('搜索话题失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 切换话题选中状态
  const toggleTopic = (topic: Topic) => {
    const isSelected = tempSelectedTopics.some(t => t.id === topic.id);
    
    if (isSelected) {
      setTempSelectedTopics(prev => prev.filter(t => t.id !== topic.id));
    } else {
      setTempSelectedTopics(prev => [...prev, topic]);
    }
  };

  // 确认选择
  const handleConfirm = () => {
    onSelect(tempSelectedTopics);
  };

  // 取消
  const handleCancel = () => {
    setTempSelectedTopics(selectedTopics);
    setSearchText('');
    onClose();
  };

  // 渲染话题项
  const renderTopicItem = ({ item }: { item: Topic }) => {
    const isSelected = tempSelectedTopics.some(t => t.id === item.id);
    
    return (
      <TouchableOpacity
        style={styles.topicItem}
        onPress={() => toggleTopic(item)}
        activeOpacity={0.7}
      >
        <View style={styles.topicIcon}>
          <View style={styles.topicIconInner} />
        </View>
        
        <View style={styles.topicContent}>
          <View style={styles.topicHeader}>
            <Text style={styles.topicName}>{item.name}</Text>
            {item.isHot && (
              <View style={styles.hotBadge}>
                <Text style={styles.hotBadgeText}>热门</Text>
              </View>
            )}
          </View>
          <Text style={styles.topicDescription} numberOfLines={1}>
            {item.description}
          </Text>
        </View>
        
        {isSelected && (
          <View style={styles.checkIcon}>
            <Text style={styles.checkIconText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <SafeAreaView style={styles.container}>
        {/* 顶部导航 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>取消</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>选择话题</Text>
          <View style={styles.placeholder} />
        </View>

        {/* 搜索框 */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="搜索更多话题"
              placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
              value={searchText}
              onChangeText={handleSearch}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Text style={styles.clearIcon}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 推荐标签 */}
        {!searchText && (
          <View style={styles.recommendSection}>
            <Text style={styles.sectionTitle}>推荐</Text>
            <View style={styles.tagList}>
              {RECOMMENDED_TAGS.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.tag}
                  onPress={() => handleSearch(tag)}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 话题列表 */}
        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.PRIMARY} />
            </View>
          ) : (
            <FlatList
              data={topics}
              renderItem={renderTopicItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>暂无相关话题</Text>
                </View>
              }
            />
          )}
        </View>

        {/* 底部确认按钮 */}
        {tempSelectedTopics.length > 0 && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>
                确定 ({tempSelectedTopics.length})
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.BORDER,
  },
  cancelButton: {
    padding: 4,
  },
  cancelButtonText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  placeholder: {
    width: 48,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SEARCH_BACKGROUND,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    padding: 0,
  },
  clearIcon: {
    fontSize: 20,
    color: COLORS.TEXT_SECONDARY,
    paddingHorizontal: 4,
  },
  recommendSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: COLORS.SEARCH_BACKGROUND,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.BORDER,
  },
  topicIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.SEARCH_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topicIconInner: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: COLORS.TEXT_PLACEHOLDER,
  },
  topicContent: {
    flex: 1,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  topicName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
    marginRight: 8,
  },
  hotBadge: {
    backgroundColor: COLORS.HOT_TAG,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  hotBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  topicDescription: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.SELECTED,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkIconText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.BORDER,
  },
  confirmButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

