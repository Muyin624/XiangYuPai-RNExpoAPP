/**
 * MeetingCodeInput - 见面码输入组件
 * 
 * 功能：
 * - 4位数字见面码输入（由主办方提供）
 * - 自动聚焦和跳转
 * - 输入验证
 * - 提交签到
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface MeetingCodeInputProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
}

const COLORS = {
  primary: '#8B5CF6',
  success: '#10B981',
  danger: '#EF4444',
} as const;

const MeetingCodeInput: React.FC<MeetingCodeInputProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [inputCode, setInputCode] = useState(['', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  
  /**
   * 处理输入变化
   */
  const handleChange = (text: string, index: number) => {
    // 只允许数字
    if (text && !/^\d$/.test(text)) {
      return;
    }
    
    const newCode = [...inputCode];
    newCode[index] = text;
    setInputCode(newCode);
    
    // 自动跳转到下一个输入框
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  /**
   * 处理删除
   */
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !inputCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  /**
   * 提交签到
   */
  const handleSubmit = () => {
    const code = inputCode.join('');
    
    if (code.length !== 4) {
      Alert.alert('提示', '请输入完整的4位见面码');
      return;
    }
    
    // 提交见面码到服务器验证
    onSubmit(code);
  };
  
  /**
   * 重置输入
   */
  const handleReset = () => {
    setInputCode(['', '', '', '']);
    inputRefs.current[0]?.focus();
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 关闭按钮 */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#666666" />
          </TouchableOpacity>
          
          {/* 标题 */}
          <View style={styles.header}>
            <Ionicons name="qr-code" size={48} color={COLORS.primary} />
            <Text style={styles.title}>输入见面码</Text>
            <Text style={styles.subtitle}>请向主办方索取4位见面码完成签到</Text>
          </View>
          
          {/* 输入框 */}
          <View style={styles.inputContainer}>
            {inputCode.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.input,
                  digit && styles.inputFilled,
                ]}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                autoFocus={index === 0}
              />
            ))}
          </View>
          
          {/* 提示信息 */}
          <View style={styles.tips}>
            <Ionicons name="information-circle-outline" size={16} color="#999999" />
            <Text style={styles.tipsText}>
              见面码由主办方持有，请到达活动现场后向工作人员索取
            </Text>
          </View>
          
          {/* 操作按钮 */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>重置</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>确认签到</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  container: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    position: 'relative',
  },
  
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  
  // 头部
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  
  // 输入框
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333333',
    backgroundColor: '#F9FAFB',
  },
  inputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: '#EDE9FE',
  },
  
  // 提示信息
  tips: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  tipsText: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 6,
    flex: 1,
  },
  
  // 操作按钮
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666666',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default MeetingCodeInput;

