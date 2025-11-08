# ForgotPasswordPage - 忘记密码页面

## 📋 功能概述

忘记密码页面提供完整的密码重置流程，用户可以通过手机号验证身份后重置密码。

## 🎯 核心功能

### 1. 三步流程设计
- **步骤1: 输入手机号** - 用户输入手机号并获取验证码
- **步骤2: 验证身份** - 输入6位验证码验证身份
- **步骤3: 设置新密码** - 输入并确认新密码完成重置

### 2. 表单验证
- 手机号格式验证（11位数字）
- 验证码格式验证（6位数字）
- 密码长度验证（6-20位字符）
- 密码一致性验证

### 3. 倒计时功能
- 60秒验证码发送间隔
- 防止频繁请求

### 4. 交互优化
- 按钮禁用状态管理
- 密码可见性切换
- 加载状态提示
- 错误提示

## 🎨 UI设计

页面完全参考提供的设计图实现：
- 顶部标题"忘记密码"
- 紫色主题色 (#9C27B0)
- 圆角输入框
- 圆角按钮
- 简洁的导航栏

## 📱 使用方式

### 路由访问
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/auth/forgot-password');
```

### 直接导入组件
```typescript
import { ForgotPasswordPage } from '@/features/AuthModule';

<ForgotPasswordPage />
```

## 🔧 技术实现

### 状态管理
```typescript
// 表单数据状态
const [formData, setFormData] = useState<ForgotPasswordFormData>({
  phoneNumber: '',
  countryCode: '+86',
  verificationCode: '',
  newPassword: '',
  confirmPassword: '',
});

// 流程步骤状态
const [currentStep, setCurrentStep] = useState<ResetStep>('phone');

// 加载状态
const [loading, setLoading] = useState({
  sendCode: false,
  verify: false,
  reset: false,
});
```

### 验证逻辑
```typescript
// 手机号验证
const isPhoneValid = () => {
  return formData.phoneNumber.length === 11;
};

// 验证码验证
const isCodeValid = () => {
  return formData.verificationCode.length === 6;
};

// 密码验证
const isPasswordValid = () => {
  return formData.newPassword.length >= 6 && 
         formData.newPassword.length <= 20;
};

// 密码匹配验证
const isPasswordMatched = () => {
  return formData.newPassword === formData.confirmPassword &&
         formData.confirmPassword.length > 0;
};
```

## 🔌 API集成

页面使用以下API方法（目前使用模拟数据）：

```typescript
// 发送重置密码验证码
authApi.sendResetPasswordCode(phone, region)

// 验证验证码
authApi.verifyResetCode(phone, code, region)

// 重置密码
authApi.resetPassword(phone, code, newPassword, region)
```

## 🎭 开发模式

当前使用模拟数据模式：
- ✅ 任何11位手机号都可以发送验证码
- ✅ 任何6位数字都可以通过验证
- ✅ 任何符合格式的密码都可以重置成功

## 🚀 后续计划

1. **后端集成**
   - 接入真实的验证码发送API
   - 接入真实的密码重置API
   - 添加错误处理和重试机制

2. **安全增强**
   - 添加图形验证码防刷
   - 限制重置频率
   - 添加设备指纹验证

3. **用户体验优化**
   - 添加密码强度提示
   - 支持语音验证码
   - 添加找回历史记录

## 📝 文件结构

```
ForgotPasswordPage/
├── index.tsx          # 主组件文件
└── README.md         # 说明文档
```

## 🔗 相关文件

- **路由文件**: `/app/auth/forgot-password.tsx`
- **API文件**: `/src/features/AuthModule/api/authApi.ts`
- **登录页面**: `/src/features/AuthModule/LoginMainPage/index.tsx`

## 📖 使用示例

### 从登录页面跳转
```typescript
// LoginMainPage/index.tsx
const handleForgotPassword = useCallback(() => {
  router.push('/auth/forgot-password');
}, [router]);
```

### 重置成功后返回
```typescript
Alert.alert(
  '重置成功',
  '密码已重置，请使用新密码登录',
  [
    {
      text: '确定',
      onPress: () => router.back(), // 返回登录页面
    },
  ]
);
```

## 🎨 样式定制

主要颜色配置：
```typescript
const COLORS = {
  BACKGROUND: '#FFFFFF',
  PRIMARY: '#9C27B0',           // 主题紫色
  PRIMARY_LIGHT: '#E1BEE7',     // 浅紫色
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  TEXT_HINT: '#999999',
  BORDER: '#E0E0E0',
  ERROR: '#F44336',
};
```

## ⚠️ 注意事项

1. **表单验证** - 所有输入都经过客户端验证
2. **用户反馈** - 使用Alert提供明确的操作反馈
3. **返回导航** - 每个步骤都支持返回上一步
4. **键盘处理** - 使用KeyboardAvoidingView优化键盘体验
5. **安全性** - 密码输入默认隐藏，可切换显示

## 🧪 测试提示

开发模式下测试：
1. 输入任意11位手机号
2. 点击"获取短信验证码"
3. 输入任意6位数字作为验证码
4. 输入新密码（6-20位）
5. 确认密码（需与新密码一致）
6. 点击"完成"重置密码

所有步骤都会有相应的加载状态和成功提示。

