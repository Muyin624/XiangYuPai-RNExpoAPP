// #region 1. File Banner & TOC
/**
 * TextFieldEditPage - 单个文本字段编辑页
 * 
 * 功能：
 * - 编辑昵称、个人介绍等文本字段
 * - 字符计数
 * - 保存验证
 * - 使用假数据（前端模式）
 */
// #endregion

// #region 2. Imports
import { useProfileStore } from '@/stores/profileStore';
import { Ionicons } from '@expo/vector-icons';
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
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
// #endregion

// #region 3-7. Types, Constants, Utils, State & Logic
interface TextFieldEditPageProps {
  fieldKey: string;
  fieldLabel: string;
  fieldValue: string;
  maxLength?: number;
  multiline?: boolean;
  placeholder?: string;
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

// 字段配置
const FIELD_CONFIG: Record<string, { maxLength: number; multiline: boolean; placeholder: string }> = {
  nickname: {
    maxLength: 20,
    multiline: false,
    placeholder: '请输入昵称',
  },
  intro: {
    maxLength: 200,
    multiline: true,
    placeholder: '请输入个人介绍',
  },
  occupation: {
    maxLength: 30,
    multiline: false,
    placeholder: '请输入职业',
  },
  wechat: {
    maxLength: 50,
    multiline: false,
    placeholder: '请输入微信号',
  },
};

const useTextFieldEditLogic = (params: TextFieldEditPageProps) => {
  const router = useRouter();
  const updateUserProfile = useProfileStore(state => state.updateUserProfile);
  
  const [text, setText] = useState(params.fieldValue || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const config = FIELD_CONFIG[params.fieldKey] || {
    maxLength: 100,
    multiline: false,
    placeholder: '请输入内容',
  };
  
  const handleBack = () => {
    if (text !== params.fieldValue) {
      Alert.alert(
        '提示',
        '是否放弃修改？',
        [
          { text: '取消', style: 'cancel' },
          {
            text: '放弃',
            style: 'destructive',
            onPress: () => {
              if (router.canGoBack()) {
                router.back();
              }
            },
          },
        ]
      );
    } else {
      if (router.canGoBack()) {
        router.back();
      }
    }
  };
  
  const handleSave = () => {
    // 验证
    const trimmedText = text.trim();
    
    if (!trimmedText) {
      Alert.alert('提示', `${params.fieldLabel}不能为空`);
      return;
    }
    
    if (trimmedText === params.fieldValue) {
      Alert.alert('提示', '内容未修改');
      return;
    }
    
    // 模拟保存
    setIsSaving(true);
    console.log(`💾 保存${params.fieldLabel}（假数据模式）`);
    console.log(`   字段: ${params.fieldKey}`);
    console.log(`   新值: ${trimmedText}`);
    
    setTimeout(() => {
      setIsSaving(false);
      
      // 更新到Store（假数据模式）
      updateUserProfile({ [params.fieldKey]: trimmedText });
      
      Alert.alert(
        '成功',
        `${params.fieldLabel}已更新\n\n💡 开发提示：这是前端假数据模式，仅保存在本地`,
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
    text,
    setText,
    config,
    isSaving,
    handleBack,
    handleSave,
  };
};
// #endregion

// #region 8. UI Components & Rendering
const TextFieldEditPage: React.FC<TextFieldEditPageProps> = (props) => {
  const { text, setText, config, isSaving, handleBack, handleSave } = useTextFieldEditLogic(props);
  
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
                <Ionicons name="chevron-back" size={24} color={COLORS.TEXT_PRIMARY} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{props.fieldLabel}</Text>
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                disabled={isSaving}
              >
                <Text style={[styles.saveButtonText, isSaving && styles.saveButtonTextDisabled]}>
                  {isSaving ? '保存中...' : '保存'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* 编辑区域 */}
            <View style={styles.editArea}>
              <TextInput
                style={[
                  styles.textInput,
                  config.multiline && styles.textInputMultiline,
                ]}
                value={text}
                onChangeText={setText}
                placeholder={config.placeholder}
                placeholderTextColor={COLORS.TEXT_TERTIARY}
                maxLength={config.maxLength}
                multiline={config.multiline}
                autoFocus
                textAlignVertical={config.multiline ? 'top' : 'center'}
              />
              
              {/* 字符计数 */}
              <View style={styles.counterContainer}>
                <Text style={styles.counterText}>
                  {text.length}/{config.maxLength}
                </Text>
              </View>
            </View>
            
            {/* 底部提示 */}
            <View style={styles.tipContainer}>
              <Text style={styles.tipText}>💡 当前为前端假数据模式</Text>
              <Text style={styles.tipSubtext}>保存后仅存储在本地</Text>
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
  editArea: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    marginTop: 12,
    padding: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    padding: 0,
  },
  textInputMultiline: {
    minHeight: 120,
  },
  counterContainer: {
    alignItems: 'flex-end',
    paddingTop: 8,
  },
  counterText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  tipContainer: {
    padding: 24,
    alignItems: 'center',
  },
  tipText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  tipSubtext: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default TextFieldEditPage;
// #endregion

