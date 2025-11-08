/**
 * Publish Page - 发布动态页面
 * 
 * 功能：
 * - 标题和正文输入
 * - 图片上传（最多9张）
 * - 话题选择
 * - 地点选择（地图）
 * - 发布动态
 */

import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// 导入子组件
import LocationSelectorModal from './modal/location-selector';
import TopicSelectorModal from './modal/topic-selector';

// 颜色常量
const COLORS = {
  PRIMARY: '#8A2BE2',
  BACKGROUND: '#FFFFFF',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  TEXT_PLACEHOLDER: '#CCCCCC',
  BORDER: '#E5E5E5',
  DISABLED: '#CCCCCC',
  TAG_BACKGROUND: '#F5F5F5',
  TAG_TEXT: '#8A2BE2',
} as const;

// 话题类型
interface Topic {
  id: string;
  name: string;
  description?: string;
  isHot?: boolean;
}

// 位置类型
interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export default function PublishPage() {
  const router = useRouter();
  
  // 表单状态
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Modal状态
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // 选择图片
  const pickImages = async () => {
    if (images.length >= 9) {
      Alert.alert('提示', '最多只能选择9张图片');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...newImages].slice(0, 9));
    }
  };

  // 移除图片
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // 打开话题选择器
  const openTopicSelector = () => {
    setShowTopicModal(true);
  };

  // 选择话题
  const handleTopicSelect = (topics: Topic[]) => {
    setSelectedTopics(topics);
    setShowTopicModal(false);
  };

  // 打开地点选择器
  const openLocationSelector = () => {
    setShowLocationModal(true);
  };

  // 选择地点
  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setShowLocationModal(false);
  };

  // 移除话题
  const removeTopic = (topicId: string) => {
    setSelectedTopics(prev => prev.filter(t => t.id !== topicId));
  };

  // 发布动态
  const handlePublish = async () => {
    if (!content.trim() && images.length === 0) {
      Alert.alert('提示', '请输入内容或上传图片');
      return;
    }

    setIsPublishing(true);
    try {
      // TODO: 调用发布API
      const publishData = {
        title: title.trim(),
        content: content.trim(),
        images,
        topics: selectedTopics.map(t => t.id),
        location: selectedLocation ? {
          id: selectedLocation.id,
          name: selectedLocation.name,
          address: selectedLocation.address,
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        } : undefined,
      };
      
      console.log('发布数据:', publishData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
      
      Alert.alert('成功', '发布成功！', [
        { text: '确定', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('错误', '发布失败，请重试');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={isPublishing}
        >
          <Text style={styles.cancelButtonText}>取消</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>动态</Text>
        <TouchableOpacity 
          style={[
            styles.publishButton,
            ((!content.trim() && images.length === 0) || isPublishing) && styles.publishButtonDisabled
          ]}
          onPress={handlePublish}
          disabled={(!content.trim() && images.length === 0) || isPublishing}
        >
          <Text style={[
            styles.publishButtonText,
            ((!content.trim() && images.length === 0) || isPublishing) && styles.publishButtonTextDisabled
          ]}>
            {isPublishing ? '发布中...' : '发布'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 标题输入 */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.titleInput}
            placeholder="添加标题"
            placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
        </View>

        {/* 正文输入 */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.contentInput}
            placeholder="添加正文"
            placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            maxLength={5000}
          />
        </View>

        {/* 图片网格 */}
        <View style={styles.imageSection}>
          <View style={styles.imageGrid}>
            {/* 已上传的图片 */}
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity 
                  style={styles.imageRemoveButton}
                  onPress={() => removeImage(index)}
                >
                  <Text style={styles.imageRemoveText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            
            {/* 添加图片按钮 */}
            {images.length < 9 && (
              <TouchableOpacity 
                style={styles.addImageButton}
                onPress={pickImages}
              >
                <Text style={styles.addImageIcon}>+</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 已选话题 */}
        {selectedTopics.length > 0 && (
          <View style={styles.selectedTopicsSection}>
            {selectedTopics.map((topic) => (
              <View key={topic.id} style={styles.topicTag}>
                <Text style={styles.topicTagText}>#{topic.name}</Text>
                <TouchableOpacity 
                  onPress={() => removeTopic(topic.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.topicRemoveText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* 已选地点 */}
        {selectedLocation && (
          <View style={styles.selectedLocationSection}>
            <View style={styles.locationTag}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText}>{selectedLocation.name}</Text>
              <TouchableOpacity 
                onPress={() => setSelectedLocation(null)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.locationRemoveText}>×</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* 底部操作栏 */}
      <View style={styles.bottomBar}>
        {/* 选择话题按钮 */}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={openTopicSelector}
        >
          <Text style={styles.actionIcon}>#</Text>
          <Text style={styles.actionText}>
            {selectedTopics.length > 0 ? `已选${selectedTopics.length}个话题` : '选择话题'}
          </Text>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        {/* 选择地点按钮 */}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={openLocationSelector}
        >
          <Text style={styles.actionIcon}>📍</Text>
          <Text style={styles.actionText}>
            {selectedLocation ? selectedLocation.name : '选择地点'}
          </Text>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 话题选择Modal */}
      <TopicSelectorModal
        visible={showTopicModal}
        selectedTopics={selectedTopics}
        onSelect={handleTopicSelect}
        onClose={() => setShowTopicModal(false)}
      />

      {/* 地点选择Modal */}
      <LocationSelectorModal
        visible={showLocationModal}
        onSelect={handleLocationSelect}
        onClose={() => setShowLocationModal(false)}
      />
    </KeyboardAvoidingView>
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
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 12,
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.BORDER,
  },
  cancelButton: {
    padding: 4,
  },
  cancelButtonText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  publishButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
  },
  publishButtonDisabled: {
    backgroundColor: COLORS.DISABLED,
  },
  publishButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  publishButtonTextDisabled: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  inputSection: {
    marginBottom: 16,
  },
  titleInput: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  contentInput: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 0,
    minHeight: 100,
  },
  imageSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: COLORS.TAG_BACKGROUND,
  },
  imageRemoveButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageRemoveText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    lineHeight: 16,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.TAG_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderStyle: 'dashed',
  },
  addImageIcon: {
    fontSize: 32,
    color: COLORS.TEXT_PLACEHOLDER,
    fontWeight: '300',
  },
  selectedTopicsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  topicTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.TAG_BACKGROUND,
    borderRadius: 4,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
    gap: 6,
  },
  topicTagText: {
    fontSize: 14,
    color: COLORS.TAG_TEXT,
  },
  topicRemoveText: {
    fontSize: 18,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '400',
  },
  selectedLocationSection: {
    marginBottom: 12,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.TAG_BACKGROUND,
    borderRadius: 4,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 8,
    gap: 6,
  },
  locationIcon: {
    fontSize: 14,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
  },
  locationRemoveText: {
    fontSize: 18,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '400',
  },
  bottomBar: {
    backgroundColor: COLORS.BACKGROUND,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.BORDER,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.BORDER,
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
  },
  actionArrow: {
    fontSize: 20,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '300',
  },
});
