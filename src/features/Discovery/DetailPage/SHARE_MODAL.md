# 分享弹窗组件 (ShareModal)

## 📋 概述

分享弹窗组件，用于动态详情页的分享功能，提供多种社交平台分享选项。

## ✨ 功能特性

### 1. 分享选项
- ✅ 微信分享
- ✅ QQ分享
- ✅ 微博分享
- ✅ 复制链接

### 2. 交互特性
- ✅ 底部弹出动画
- ✅ 点击遮罩关闭
- ✅ 平滑的弹簧动画效果
- ✅ 触摸反馈

### 3. UI设计
- ✅ 圆角卡片设计
- ✅ 彩色图标背景
- ✅ 清晰的视觉层次
- ✅ 适配iOS安全区域

## 🎨 UI结构

```
ShareModal
├── 遮罩层 (点击关闭)
└── 内容卡片
    ├── 标题栏
    │   ├── "分享到" 标题
    │   └── 关闭按钮 (✕)
    ├── 分享选项区域
    │   ├── 微信 (绿色)
    │   ├── QQ (蓝色)
    │   ├── 微博 (红色)
    │   └── 复制链接 (紫色)
    └── 取消按钮
```

## 📦 组件接口

```typescript
interface ShareModalProps {
  visible: boolean;           // 是否显示弹窗
  onClose: () => void;         // 关闭回调
  feedId: string;              // 动态ID
  feedTitle?: string;          // 动态标题（可选）
  feedContent?: string;        // 动态内容（可选）
}
```

## 🔧 使用方法

### 基础用法

```tsx
import ShareModal from './ShareModal';

function DetailPage() {
  const [showShareModal, setShowShareModal] = useState(false);
  
  return (
    <>
      <TouchableOpacity onPress={() => setShowShareModal(true)}>
        <Text>分享</Text>
      </TouchableOpacity>
      
      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        feedId="123"
        feedTitle="动态标题"
        feedContent="动态内容"
      />
    </>
  );
}
```

## 🎯 分享功能实现

### 当前状态
- ✅ UI完成
- ⏳ 微信SDK集成（待实现）
- ⏳ QQ SDK集成（待实现）
- ⏳ 微博SDK集成（待实现）
- ⏳ 剪贴板功能（待实现）

### 待集成的SDK

#### 1. 微信分享
```bash
# 安装依赖
npm install react-native-wechat-lib
```

#### 2. QQ分享
```bash
# 安装依赖
npm install react-native-qq
```

#### 3. 微博分享
```bash
# 安装依赖
npm install react-native-weibo
```

#### 4. 剪贴板
```bash
# Expo已内置
import * as Clipboard from 'expo-clipboard';
```

## 🎨 样式定制

### 颜色配置

```typescript
const COLORS = {
  WECHAT: '#07C160',   // 微信绿
  QQ: '#12B7F5',       // QQ蓝
  WEIBO: '#E6162D',    // 微博红
  COPY: '#8A2BE2',     // 紫色
};
```

### 动画配置

```typescript
// 弹簧动画参数
Animated.spring(slideAnim, {
  toValue: 1,
  useNativeDriver: true,
  tension: 65,      // 张力
  friction: 11,     // 摩擦力
}).start();
```

## 📱 平台适配

### iOS
- ✅ 安全区域适配（底部34px）
- ✅ 状态栏透明

### Android
- ✅ 底部间距适配（20px）
- ✅ 返回键关闭

## 🔄 后续优化

### 功能增强
- [ ] 添加更多分享平台（抖音、小红书等）
- [ ] 分享成功/失败提示
- [ ] 分享统计埋点
- [ ] 生成分享海报
- [ ] 二维码分享

### 性能优化
- [ ] 懒加载SDK
- [ ] 分享图片预加载
- [ ] 动画性能优化

### 用户体验
- [ ] 分享历史记录
- [ ] 常用分享方式排序
- [ ] 自定义分享文案

## 📝 注意事项

1. **SDK集成**
   - 需要在各平台注册应用
   - 配置应用ID和密钥
   - 添加URL Scheme

2. **权限配置**
   - iOS: Info.plist添加LSApplicationQueriesSchemes
   - Android: AndroidManifest.xml添加权限

3. **测试要点**
   - 各平台分享功能
   - 动画流畅度
   - 点击区域响应
   - 遮罩关闭功能

## 🎯 集成清单

- [x] 创建ShareModal组件
- [x] 集成到DetailPage
- [x] UI设计实现
- [x] 动画效果
- [ ] 微信SDK集成
- [ ] QQ SDK集成
- [ ] 微博SDK集成
- [ ] 剪贴板功能
- [ ] 分享统计
- [ ] 错误处理

