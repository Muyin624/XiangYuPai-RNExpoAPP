/**
 * Payment Password Page - 支付密码页面
 * 
 * 功能：
 * - 设置6位数字支付密码
 * - 数字键盘输入
 * - 密码圆点显示
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const PaymentPasswordPage = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const maxLength = 6;

  // 数字键盘布局
  const keypadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'delete'],
  ];

  // 处理数字按键
  const handleNumberPress = (num: string) => {
    if (num === '') return;
    
    if (num === 'delete') {
      // 删除最后一位
      setPassword(password.slice(0, -1));
    } else {
      // 添加数字
      if (password.length < maxLength) {
        const newPassword = password + num;
        setPassword(newPassword);
        
        // 如果输入完成6位，自动提交
        if (newPassword.length === maxLength) {
          setTimeout(() => {
            handleSubmit(newPassword);
          }, 300);
        }
      }
    }
  };

  // 提交密码
  const handleSubmit = (pwd: string) => {
    console.log('🔐 设置支付密码:', pwd);
    Alert.alert(
      '设置成功',
      '支付密码设置成功！',
      [
        {
          text: '确定',
          onPress: () => router.back(),
        },
      ]
    );
  };

  // 处理返回
  const handleBack = () => {
    router.back();
  };

  // 处理忘记密码
  const handleForgotPassword = () => {
    Alert.alert('提示', '请联系客服重置支付密码');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>支付密码</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* 提示文本 */}
        <View style={styles.hintSection}>
          <Text style={styles.hintText}>请设置6位数字密码</Text>
          <Text style={styles.subHintText}>不能是重复或连续的数字密码</Text>
        </View>

        {/* 密码输入显示 */}
        <View style={styles.passwordDisplay}>
          {Array.from({ length: maxLength }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.passwordDot,
                index < password.length && styles.passwordDotFilled,
              ]}
            >
              {index < password.length && (
                <View style={styles.dotInner} />
              )}
            </View>
          ))}
        </View>

        {/* 忘记密码链接 */}
        <TouchableOpacity 
          style={styles.forgotPasswordButton}
          onPress={handleForgotPassword}
        >
          <Text style={styles.forgotPasswordText}>忘记密码</Text>
        </TouchableOpacity>

        {/* 数字键盘 */}
        <View style={styles.keypad}>
          {keypadNumbers.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((num, colIndex) => (
                <TouchableOpacity
                  key={colIndex}
                  style={[
                    styles.keypadButton,
                    num === '' && styles.keypadButtonEmpty,
                  ]}
                  onPress={() => handleNumberPress(num)}
                  activeOpacity={0.7}
                  disabled={num === ''}
                >
                  {num === 'delete' ? (
                    <Text style={styles.deleteIcon}>⌫</Text>
                  ) : (
                    <Text style={styles.keypadButtonText}>{num}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // 顶部导航栏
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  // 内容区域
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  // 提示区域
  hintSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  hintText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  subHintText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  // 密码显示
  passwordDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  passwordDot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordDotFilled: {
    borderColor: '#8B5CF6',
  },
  dotInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#8B5CF6',
  },
  // 忘记密码
  forgotPasswordButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 40,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#8B5CF6',
  },
  // 数字键盘
  keypad: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  keypadButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  keypadButtonEmpty: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  keypadButtonText: {
    fontSize: 28,
    fontWeight: '500',
    color: '#1F2937',
  },
  deleteIcon: {
    fontSize: 28,
    color: '#6B7280',
  },
});

export default PaymentPasswordPage;

