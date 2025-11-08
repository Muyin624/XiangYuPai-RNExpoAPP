/**
 * AvatarPicker - 头像选择组件
 * 
 * 功能：
 * - 拍照
 * - 从相册选择
 * - 保存头像（使用假数据）
 */

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    ActionSheetIOS,
    Alert,
    Image,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface AvatarPickerProps {
  currentAvatar: string;
  onAvatarChange: (uri: string) => void;
}

const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#666666',
  BORDER: '#E5E5E5',
  PRIMARY: '#9C27B0',
  OVERLAY: 'rgba(0, 0, 0, 0.5)',
} as const;

const AvatarPicker: React.FC<AvatarPickerProps> = ({ currentAvatar, onAvatarChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 请求相机权限
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('提示', '需要相机权限才能拍照');
      return false;
    }
    return true;
  };

  // 请求相册权限
  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('提示', '需要相册权限才能选择照片');
      return false;
    }
    return true;
  };

  // 拍照
  const handleTakePhoto = async () => {
    setModalVisible(false);
    
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('拍照失败:', error);
      Alert.alert('错误', '拍照失败，请重试');
    }
  };

  // 从相册选择
  const handlePickFromLibrary = async () => {
    setModalVisible(false);
    
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('选择照片失败:', error);
      Alert.alert('错误', '选择照片失败，请重试');
    }
  };

  // 保存头像（使用假数据）
  const handleSaveAvatar = () => {
    if (!selectedImage) return;

    console.log('💾 保存头像（假数据模式）');
    console.log('   新头像URI:', selectedImage);
    
    // 模拟保存延迟
    setTimeout(() => {
      onAvatarChange(selectedImage);
      setSelectedImage(null);
      Alert.alert('成功', '头像已更新\n\n💡 开发提示：这是前端假数据模式，仅保存在本地');
    }, 500);
  };

  // 取消选择
  const handleCancel = () => {
    setSelectedImage(null);
  };

  // 显示选项（iOS使用ActionSheet，Android使用Modal）
  const showOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['取消', '拍照', '从相册选择'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleTakePhoto();
          } else if (buttonIndex === 2) {
            handlePickFromLibrary();
          }
        }
      );
    } else {
      setModalVisible(true);
    }
  };

  return (
    <>
      {/* 头像显示和点击区域 */}
      <TouchableOpacity onPress={showOptions} activeOpacity={0.7}>
        <Image
          source={{ uri: selectedImage || currentAvatar }}
          style={styles.avatar}
        />
        <View style={styles.cameraIconContainer}>
          <Ionicons name="camera" size={20} color={COLORS.WHITE} />
        </View>
      </TouchableOpacity>

      {/* Android选项模态框 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleTakePhoto}
            >
              <Ionicons name="camera" size={24} color={COLORS.PRIMARY} />
              <Text style={styles.optionText}>拍照</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.optionButton}
              onPress={handlePickFromLibrary}
            >
              <Ionicons name="images" size={24} color={COLORS.PRIMARY} />
              <Text style={styles.optionText}>从相册选择</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.optionText, styles.cancelText]}>取消</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 预览和保存模态框 */}
      {selectedImage && (
        <Modal
          visible={true}
          transparent
          animationType="fade"
        >
          <View style={styles.previewOverlay}>
            <View style={styles.previewContent}>
              <Text style={styles.previewTitle}>预览头像</Text>
              
              <Image
                source={{ uri: selectedImage }}
                style={styles.previewImage}
              />

              <View style={styles.previewActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>取消</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleSaveAvatar}
                >
                  <Text style={styles.saveButtonText}>保存</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.BORDER,
  },
  cameraIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.WHITE,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.OVERLAY,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  cancelText: {
    color: COLORS.TEXT_SECONDARY,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginHorizontal: 20,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: COLORS.OVERLAY,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  previewContent: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    minWidth: 300,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 20,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 24,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.BORDER,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
});

export default AvatarPicker;

