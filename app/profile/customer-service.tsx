/**
 * CustomerServicePage - 客服页面
 * 
 * 功能：
 * - 在线客服聊天界面
 * - 发送文字消息
 * - 发送图片
 * - 显示客服欢迎消息
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface Message {
  id: string;
  type: 'user' | 'service';
  content: string;
  timestamp: Date;
}

const CustomerServicePage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'service',
      content: 'Hi，上午好~请描述您遇到的问题或您想咨询的内容',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  // 发送消息
  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: inputText.trim(),
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputText('');

      // 模拟客服回复
      setTimeout(() => {
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          type: 'service',
          content: '感谢您的反馈，我们的客服人员会尽快为您处理',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, reply]);
      }, 1000);
    }
  };

  // 选择图片
  const handleImagePicker = () => {
    console.log('📷 打开图片选择器');
    // TODO: 实现图片选择功能
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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
        <Text style={styles.headerTitle}>客服</Text>
        <View style={styles.headerRight} />
      </View>

      {/* 聊天消息区域 */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageRow,
              message.type === 'user' ? styles.messageRowUser : styles.messageRowService,
            ]}
          >
            {/* 客服头像 */}
            {message.type === 'service' && (
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarIcon}>👤</Text>
                </View>
              </View>
            )}

            {/* 消息内容 */}
            <View
              style={[
                styles.messageBubble,
                message.type === 'user' ? styles.messageBubbleUser : styles.messageBubbleService,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.type === 'user' ? styles.messageTextUser : styles.messageTextService,
                ]}
              >
                {message.content}
              </Text>
            </View>

            {/* 用户头像 */}
            {message.type === 'user' && (
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarIcon}>😊</Text>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* 底部输入栏 */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="请输入内容"
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleImagePicker}
            activeOpacity={0.7}
          >
            <Text style={styles.iconButtonText}>🖼️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleImagePicker}
            activeOpacity={0.7}
          >
            <Text style={styles.iconButtonText}>😊</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  // 消息区域
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  messageRowService: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    marginHorizontal: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    fontSize: 20,
  },
  messageBubble: {
    maxWidth: '70%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  messageBubbleService: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageBubbleUser: {
    backgroundColor: '#8B5CF6',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  messageTextService: {
    color: '#1F2937',
  },
  messageTextUser: {
    color: '#fff',
  },
  // 底部输入栏
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
    color: '#1F2937',
    marginRight: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  iconButtonText: {
    fontSize: 22,
  },
});

export default CustomerServicePage;

