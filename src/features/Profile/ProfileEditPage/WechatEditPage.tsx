// #region 1. File Banner & TOC
/**
 * WechatEditPage - 微信编辑页面
 * 
 * 功能：
 * - 编辑微信号
 * - 设置微信号锁定状态（是否对陌生人显示）
 * - 保存到ProfileStore
 */
// #endregion

// #region 2. Imports
import { useProfileStore } from '@/stores/profileStore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
// #endregion

// #region 3-7. Types, Constants, Utils, State & Logic
interface WechatEditPageProps {
  currentWechat?: string;
  wechatLocked?: boolean;
}

const COLORS = {
  WHITE: '#FFFFFF',
  BG_GRAY: '#F5F5F5',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#999999',
  TEXT_TERTIARY: '#CCCCCC',
  BORDER: '#E5E5E5',
  PRIMARY: '#9C27B0',
} as const;

const useWechatEditLogic = (props: WechatEditPageProps) => {
  const router = useRouter();
  const updateUserProfile = useProfileStore(state => state.updateUserProfile);
  
  const [wechat, setWechat] = useState(props.currentWechat || '');
  const [wechatLocked, setWechatLocked] = useState(props.wechatLocked || false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };
  
  const handleSave = () => {
    // 验证
    const trimmedWechat = wechat.trim();
    
    if (!trimmedWechat) {
      Alert.alert('提示', '微信号不能为空');
      return;
    }
    
    // 简单验证微信号格式（6-20位字母、数字、下划线、减号）
    const wechatRegex = /^[a-zA-Z0-9_-]{6,20}$/;
    if (!wechatRegex.test(trimmedWechat)) {
      Alert.alert('提示', '微信号格式不正确\n6-20位字母、数字、下划线或减号');
      return;
    }
    
    if (trimmedWechat === props.currentWechat && wechatLocked === props.wechatLocked) {
      Alert.alert('提示', '内容未修改');
      return;
    }
    
    // 模拟保存
    setIsSaving(true);
    console.log('💾 保存微信（假数据模式）');
    console.log('   微信号:', trimmedWechat);
    console.log('   锁定状态:', wechatLocked);
    
    setTimeout(() => {
      setIsSaving(false);
      
      // 更新到Store
      updateUserProfile({ 
        wechat: trimmedWechat,
        wechatLocked: wechatLocked,
      });
      
      Alert.alert(
        '成功',
        `微信信息已更新\n\n💡 开发提示：这是前端假数据模式，仅保存在本地`,
        [
          {
            text: '确定',
            onPress: () => {
              if (router.canGoBack()) {
                router.back();
              }
            },
          },
        ]
      );
    }, 500);
  };
  
  return {
    wechat,
    setWechat,
    wechatLocked,
    setWechatLocked,
    isSaving,
    handleBack,
    handleSave,
  };
};
// #endregion

// #region 8. UI Components & Rendering
const WechatEditPage: React.FC<WechatEditPageProps> = (props) => {
  const {
    wechat,
    setWechat,
    wechatLocked,
    setWechatLocked,
    isSaving,
    handleBack,
    handleSave,
  } = useWechatEditLogic(props);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            {/* 顶部导航栏 */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Text style={styles.backButtonText}>取消</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>微信</Text>
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                disabled={isSaving}
              >
                <Text style={[styles.saveButtonText, isSaving && styles.saveButtonTextDisabled]}>
                  {isSaving ? '保存中...' : '完成'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* 微信号输入区域 */}
            <View style={styles.section}>
              <View style={styles.inputRow}>
                <Text style={styles.label}>微信</Text>
                <TextInput
                  style={styles.input}
                  value={wechat}
                  onChangeText={setWechat}
                  placeholder="请输入微信号"
                  placeholderTextColor={COLORS.TEXT_TERTIARY}
                  maxLength={20}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>
            
            {/* 锁定状态设置 */}
            <View style={styles.section}>
              <View style={styles.switchRow}>
                <View style={styles.switchLeft}>
                  <Text style={styles.switchLabel}>转换微信锁</Text>
                  <Text style={styles.switchHint}>暂未开放</Text>
                </View>
                <Switch
                  value={wechatLocked}
                  onValueChange={setWechatLocked}
                  trackColor={{ false: COLORS.BORDER, true: COLORS.PRIMARY }}
                  thumbColor={COLORS.WHITE}
                  disabled={true}
                />
              </View>
            </View>
            
            {/* 提示信息 */}
            <View style={styles.tipContainer}>
              <Text style={styles.tipText}>💡 微信号格式要求：</Text>
              <Text style={styles.tipSubtext}>• 6-20位字符</Text>
              <Text style={styles.tipSubtext}>• 可包含字母、数字、下划线、减号</Text>
              <Text style={styles.tipSubtext} />
              <Text style={styles.tipText}>🔒 转换微信锁说明：</Text>
              <Text style={styles.tipSubtext}>开启后，陌生人无法直接查看您的微信号</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_GRAY,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    padding: 4,
    minWidth: 60,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    minWidth: 60,
    alignItems: 'flex-end',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.PRIMARY,
  },
  saveButtonTextDisabled: {
    color: COLORS.TEXT_SECONDARY,
  },
  section: {
    backgroundColor: COLORS.WHITE,
    marginTop: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    minWidth: 60,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    padding: 0,
    textAlign: 'right',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  switchLeft: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  switchHint: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  tipContainer: {
    padding: 24,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
    fontWeight: '500',
  },
  tipSubtext: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
    paddingLeft: 8,
  },
});

export default WechatEditPage;
// #endregion

