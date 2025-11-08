/**
 * ShareModal - 分享弹窗组件
 * 
 * 功能：
 * - 多种分享方式
 * - 底部弹出动画
 * - 点击遮罩关闭
 */

import React from 'react';
import {
    Animated,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// 颜色常量
const COLORS = {
  OVERLAY: 'rgba(0, 0, 0, 0.5)',
  CARD_BACKGROUND: '#FFFFFF',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  BORDER: '#E5E5E5',
  WECHAT: '#07C160',
  QQ: '#12B7F5',
  WEIBO: '#E6162D',
  COPY: '#8A2BE2',
} as const;

interface ShareOption {
  id: string;
  name: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  feedId: string;
  feedTitle?: string;
  feedContent?: string;
  onReport?: () => void;
}

export default function ShareModal({
  visible,
  onClose,
  feedId,
  feedTitle,
  feedContent,
  onReport,
}: ShareModalProps) {
  const [slideAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleShareToWechat = () => {
    console.log('[ShareModal] 分享到微信', { feedId });
    // TODO: 调用微信分享SDK
    alert('分享到微信功能开发中...');
    onClose();
  };

  const handleShareToQQ = () => {
    console.log('[ShareModal] 分享到QQ', { feedId });
    // TODO: 调用QQ分享SDK
    alert('分享到QQ功能开发中...');
    onClose();
  };

  const handleShareToWeibo = () => {
    console.log('[ShareModal] 分享到微博', { feedId });
    // TODO: 调用微博分享SDK
    alert('分享到微博功能开发中...');
    onClose();
  };

  const handleCopyLink = async () => {
    console.log('[ShareModal] 复制链接', { feedId });
    // TODO: 复制链接到剪贴板
    // 使用 Expo Clipboard
    try {
      // const link = `https://xiangyupai.com/feed/${feedId}`;
      // await Clipboard.setStringAsync(link);
      alert('链接已复制到剪贴板');
      onClose();
    } catch (error) {
      console.error('复制失败', error);
      alert('复制失败，请重试');
    }
  };

  const handleReport = () => {
    console.log('[ShareModal] 打开举报弹窗', { feedId });
    onClose();
    // 延迟一下，等分享弹窗关闭动画完成后再打开举报弹窗
    setTimeout(() => {
      onReport?.();
    }, 300);
  };

  const shareOptions: ShareOption[] = [
    {
      id: 'wechat',
      name: '微信',
      icon: '💬',
      color: COLORS.WECHAT,
      onPress: handleShareToWechat,
    },
    {
      id: 'qq',
      name: 'QQ',
      icon: '🐧',
      color: COLORS.QQ,
      onPress: handleShareToQQ,
    },
    {
      id: 'weibo',
      name: '微博',
      icon: '📱',
      color: COLORS.WEIBO,
      onPress: handleShareToWeibo,
    },
    {
      id: 'copy',
      name: '复制链接',
      icon: '🔗',
      color: COLORS.COPY,
      onPress: handleCopyLink,
    },
  ];

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            {/* 标题栏 */}
            <View style={styles.header}>
              <Text style={styles.title}>分享到</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 分享选项 */}
            <View style={styles.optionsContainer}>
              {shareOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionItem}
                  onPress={option.onPress}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.optionIcon,
                      { backgroundColor: option.color },
                    ]}
                  >
                    <Text style={styles.optionIconText}>{option.icon}</Text>
                  </View>
                  <Text style={styles.optionName}>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 举报按钮 */}
            {onReport && (
              <TouchableOpacity
                style={styles.reportButton}
                onPress={handleReport}
                activeOpacity={0.7}
              >
                <Text style={styles.reportButtonText}>举报</Text>
              </TouchableOpacity>
            )}

            {/* 取消按钮 */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.OVERLAY,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    position: 'relative',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 16,
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    color: COLORS.TEXT_SECONDARY,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  optionItem: {
    alignItems: 'center',
    width: 70,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  optionIconText: {
    fontSize: 28,
  },
  optionName: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  reportButton: {
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF4444',
  },
  cancelButton: {
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
  },
});

