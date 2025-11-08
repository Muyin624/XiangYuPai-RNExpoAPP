/**
 * ManagePostPage - 接单/管理发布页面
 * 
 * 功能：
 * - 展示发布的详细信息（参考图片样式）
 * - 顶部标签选择（王者荣耀、从组到梦等）
 * - 添加标题
 * - 添加正文
 * - 添加图片
 * - 段位选择
 * - 定价设置
 * - 编辑和删除功能
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface ManagePostPageProps {
  postId: string;
}

// 模拟标签数据
const MOCK_TAGS = [
  { id: '1', name: '王者荣耀', icon: '👑' },
  { id: '2', name: '从组到梦', icon: '🎮' },
  { id: '3', name: '和平精英', icon: '🔫' },
  { id: '4', name: '吃鸡陪玩', icon: '🍗' },
  { id: '5', name: '声鉴', icon: '🎤' },
  { id: '6', name: '台球', icon: '🎱' },
  { id: '7', name: '大富翁', icon: '🎲' },
  { id: '8', name: '喝酒', icon: '🍺' },
  { id: '9', name: '掼蛋', icon: '🃏' },
  { id: '10', name: '挖库', icon: '⛏️' },
];

const ManagePostPage: React.FC<ManagePostPageProps> = ({ postId }) => {
  const router = useRouter();
  
  // 状态管理
  const [selectedTags, setSelectedTags] = useState<string[]>(['1']); // 默认选中王者荣耀
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rank, setRank] = useState('幸福王者');
  const [price, setPrice] = useState('10');
  const [priceUnit, setPriceUnit] = useState('金币/周');

  // 返回
  const handleBack = () => {
    router.back();
  };

  // 发布
  const handlePublish = () => {
    console.log('发布', { selectedTags, title, content, rank, price });
    Alert.alert('提示', '发布成功！', [
      { text: '确定', onPress: () => router.back() },
    ]);
  };

  // 切换标签选择
  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  // 删除发布
  const handleDelete = () => {
    Alert.alert(
      '确认删除',
      '确定要删除这条发布吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            console.log('删除发布', postId);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#333" />
          <Text style={styles.headerButtonText}>取消</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>接单</Text>
        
        <TouchableOpacity style={styles.publishButton} onPress={handlePublish} activeOpacity={0.7}>
          <Text style={styles.publishButtonText}>发布</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 标签选择区域 */}
        <View style={styles.tagsSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsContainer}
          >
            {MOCK_TAGS.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                style={[
                  styles.tagItem,
                  selectedTags.includes(tag.id) && styles.tagItemSelected,
                ]}
                onPress={() => toggleTag(tag.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.tagIcon}>{tag.icon}</Text>
                <Text
                  style={[
                    styles.tagText,
                    selectedTags.includes(tag.id) && styles.tagTextSelected,
                  ]}
                >
                  {tag.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 添加标题 */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.titleInput}
            placeholder="添加标题"
            placeholderTextColor="#CCCCCC"
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
        </View>

        {/* 添加正文 */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.contentInput}
            placeholder="添加正文"
            placeholderTextColor="#CCCCCC"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={200}
          />
          <Text style={styles.charCount}>0/200</Text>
        </View>

        {/* 添加图片 */}
        <View style={styles.imageSection}>
          <TouchableOpacity style={styles.addImageButton} activeOpacity={0.7}>
            <Ionicons name="add" size={32} color="#CCCCCC" />
          </TouchableOpacity>
        </View>

        {/* 段位选择 */}
        <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
          <Text style={styles.optionLabel}>段位</Text>
          <View style={styles.optionRight}>
            <Text style={styles.optionValue}>{rank}</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
          </View>
        </TouchableOpacity>

        {/* 定价 */}
        <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
          <Text style={styles.optionLabel}>定价</Text>
          <View style={styles.optionRight}>
            <Text style={styles.optionValue}>{price}{priceUnit}</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
          </View>
        </TouchableOpacity>

        {/* 删除按钮 */}
        {postId && (
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>删除发布</Text>
          </TouchableOpacity>
        )}

        {/* 底部间距 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  // 头部
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  publishButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#FF2D55',
    borderRadius: 16,
  },
  publishButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  // 标签区域
  tagsSection: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tagsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  tagItem: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    minWidth: 70,
  },
  tagItemSelected: {
    backgroundColor: '#FFF0F5',
    borderWidth: 1,
    borderColor: '#FF2D55',
  },
  tagIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  tagTextSelected: {
    color: '#FF2D55',
    fontWeight: '500',
  },
  // 输入区域
  inputSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
  },
  titleInput: {
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  contentInput: {
    fontSize: 14,
    color: '#333',
    minHeight: 100,
    padding: 0,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  // 图片区域
  imageSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  // 选项行
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 12,
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionValue: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  // 删除按钮
  deleteButton: {
    marginHorizontal: 16,
    marginTop: 32,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF3B30',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default ManagePostPage;

