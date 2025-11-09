/**
 * ExpertVerificationPage - 达人认证页面
 * 
 * 功能：
 * - 上传身份证正面照片
 * - 填写真实姓名
 * - 填写身份证号码
 * - 提交认证申请
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const ExpertVerificationPage = () => {
  const router = useRouter();
  const [realName, setRealName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [idCardImage, setIdCardImage] = useState<string | null>(null);

  // 选择身份证照片
  const handleSelectImage = () => {
    console.log('📷 打开图片选择器');
    // TODO: 实现图片选择功能
    Alert.alert('提示', '图片选择功能开发中');
  };

  // 提交认证
  const handleSubmit = () => {
    // 验证表单
    if (!realName.trim()) {
      Alert.alert('提示', '请填写真实姓名');
      return;
    }
    if (!idNumber.trim()) {
      Alert.alert('提示', '请填写身份证号码');
      return;
    }
    if (!idCardImage) {
      Alert.alert('提示', '请上传身份证正面照片');
      return;
    }

    // 验证身份证号码格式
    const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!idCardRegex.test(idNumber)) {
      Alert.alert('提示', '请输入正确的身份证号码');
      return;
    }

    console.log('📤 提交认证申请:', { realName, idNumber });
    Alert.alert('提交成功', '您的认证申请已提交，我们会尽快审核', [
      { text: '确定', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>达人认证</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 提示信息 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>上传身份证正面</Text>
          <Text style={styles.tipDesc}>
            实名认证需要提供身份证正面，请按以下规范拍摄
          </Text>
        </View>

        {/* 身份证上传区域 */}
        <TouchableOpacity
          style={styles.uploadArea}
          onPress={handleSelectImage}
          activeOpacity={0.7}
        >
          {idCardImage ? (
            <Image source={{ uri: idCardImage }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <View style={styles.uploadIcon}>
                <Text style={styles.uploadIconText}>👤</Text>
              </View>
              <Text style={styles.uploadText}>点击上传身份证正面照片</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* 表单区域 */}
        <View style={styles.formSection}>
          {/* 真实姓名 */}
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>真实姓名</Text>
            <TextInput
              style={styles.formInput}
              placeholder="请输入真实姓名"
              placeholderTextColor="#9CA3AF"
              value={realName}
              onChangeText={setRealName}
              maxLength={20}
            />
          </View>

          {/* 身份证号码 */}
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>身份证号码</Text>
            <TextInput
              style={styles.formInput}
              placeholder="请输入身份证号码"
              placeholderTextColor="#9CA3AF"
              value={idNumber}
              onChangeText={setIdNumber}
              maxLength={18}
              autoCapitalize="characters"
            />
          </View>
        </View>

        {/* 提交按钮 */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>开始上传</Text>
        </TouchableOpacity>

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
  // 顶部导航栏
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 32,
    color: '#1F2937',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerRight: {
    width: 40,
  },
  // 滚动区域
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  // 提示卡片
  tipCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  tipDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
  // 上传区域
  uploadArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  uploadPlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  uploadIconText: {
    fontSize: 40,
  },
  uploadText: {
    fontSize: 14,
    color: '#6B7280',
  },
  uploadedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  // 表单区域
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  formItem: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  formInput: {
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  // 提交按钮
  submitButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default ExpertVerificationPage;

