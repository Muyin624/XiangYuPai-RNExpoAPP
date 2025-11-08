/**
 * ReportModal - 举报弹窗组件
 * 
 * 功能：
 * - 多种举报类型选择
 * - 举报描述输入
 * - 图片上传（可选）
 * - 表单验证
 */

import React, { useState } from 'react';
import {
    Alert,
    Animated,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// 颜色常量
const COLORS = {
  OVERLAY: 'rgba(0, 0, 0, 0.5)',
  CARD_BACKGROUND: '#FFFFFF',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  TEXT_TERTIARY: '#999999',
  BORDER: '#E5E5E5',
  PRIMARY: '#8A2BE2',
  SELECTED: '#F0E6FF',
  INPUT_BG: '#F5F5F5',
  PLACEHOLDER: '#CCCCCC',
} as const;

// 举报类型 - 按照图片顺序
const REPORT_TYPES = [
  { id: 'spam', label: '辱骂引战' },
  { id: 'inappropriate', label: '色情低俗' },
  { id: 'fraud', label: '诈骗' },
  { id: 'illegal', label: '违法犯罪' },
  { id: 'false', label: '不实信息' },
  { id: 'infringement', label: '未成年人相关' },
  { id: 'harassment', label: '内容引人不适' },
  { id: 'other', label: '其他' },
];

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  feedId: string;
  feedTitle?: string;
}

export default function ReportModal({
  visible,
  onClose,
  feedId,
  feedTitle,
}: ReportModalProps) {
  const [selectedType, setSelectedType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      // 重置状态
      setTimeout(() => {
        setSelectedType('');
        setDescription('');
        setUploadedImages([]);
      }, 200);
    }
  }, [visible]);

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleImageUpload = () => {
    // TODO: 实现图片上传功能
    console.log('[ReportModal] 上传图片');
    Alert.alert('提示', '图片上传功能开发中...');
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // 验证
    if (!selectedType) {
      Alert.alert('提示', '请选择举报的类型');
      return;
    }

    if (!description.trim()) {
      Alert.alert('提示', '请描述你的举报原因');
      return;
    }

    try {
      console.log('[ReportModal] 提交举报', {
        feedId,
        type: selectedType,
        description,
        images: uploadedImages,
      });

      // TODO: 调用举报API
      await new Promise(resolve => setTimeout(resolve, 1000));

      Alert.alert('提交成功', '感谢你的反馈，我们会尽快处理', [
        {
          text: '确定',
          onPress: onClose,
        },
      ]);
    } catch (error) {
      console.error('[ReportModal] 举报失败', error);
      Alert.alert('错误', '提交失败，请重试');
    }
  };

  const characterCount = description.length;
  const maxCharacters = 200;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View
          style={[
            styles.container,
            {
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {/* 头部 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>举报</Text>
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>提交</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* 举报类型选择 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>请选择你举报的类型</Text>
              <View style={styles.typeGrid}>
                {REPORT_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeButton,
                      selectedType === type.id && styles.typeButtonSelected,
                    ]}
                    onPress={() => handleTypeSelect(type.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        selectedType === type.id && styles.typeButtonTextSelected,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 举报描述 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>举报描述</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="请描述你的举报原因"
                  placeholderTextColor={COLORS.PLACEHOLDER}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  maxLength={maxCharacters}
                  textAlignVertical="top"
                />
                <Text style={styles.characterCount}>
                  {characterCount}/{maxCharacters}
                </Text>
              </View>
            </View>

            {/* 上传图片 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>上传图片 (选填)</Text>
              <View style={styles.imageUploadContainer}>
                {uploadedImages.map((image, index) => (
                  <View key={index} style={styles.uploadedImageWrapper}>
                    <Image source={{ uri: image }} style={styles.uploadedImage} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <Text style={styles.removeImageButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                
                {uploadedImages.length < 3 && (
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={handleImageUpload}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.uploadButtonIcon}>+</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.OVERLAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    width: '90%',
    maxWidth: 400,
    height: '80%',
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    padding: 4,
    width: 60,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.TEXT_PRIMARY,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    textAlign: 'center',
  },
  submitButton: {
    padding: 4,
    width: 60,
    alignItems: 'flex-end',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.PRIMARY,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.CARD_BACKGROUND,
    minWidth: '45%',
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: COLORS.SELECTED,
    borderColor: COLORS.PRIMARY,
  },
  typeButtonText: {
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
  },
  typeButtonTextSelected: {
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  textInputContainer: {
    backgroundColor: COLORS.INPUT_BG,
    borderRadius: 8,
    padding: 12,
    minHeight: 150,
  },
  textInput: {
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    minHeight: 100,
    padding: 0,
  },
  characterCount: {
    fontSize: 12,
    color: COLORS.TEXT_TERTIARY,
    textAlign: 'right',
    marginTop: 8,
  },
  imageUploadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  uploadedImageWrapper: {
    position: 'relative',
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.INPUT_BG,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.TEXT_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageButtonText: {
    color: COLORS.CARD_BACKGROUND,
    fontSize: 14,
    fontWeight: '600',
  },
  uploadButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderStyle: 'dashed',
    backgroundColor: COLORS.INPUT_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonIcon: {
    fontSize: 32,
    color: COLORS.TEXT_TERTIARY,
  },
});
