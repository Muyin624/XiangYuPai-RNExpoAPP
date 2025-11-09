# SignupDetailPage - 报名详情页面

## 📋 模块概述

报名详情页面，展示用户报名参加的公司活动的详细信息，根据报名状态显示不同的内容和操作。

## ✨ 功能特性

### 核心功能
- ✅ 根据报名状态显示不同内容
- ✅ 活动基本信息展示
- ✅ 主办方信息展示
- ✅ 报名时间轴
- ✅ 状态相关操作
- ✅ 见面码输入签到功能

### 状态功能

#### 🟡 待确认 (Pending)
- 显示等待确认状态
- 报名信息展示
- 取消报名按钮
- 联系主办方按钮

#### 🔵 已确认 (Confirmed)
- 显示见面码（6位数字）
- 活动倒计时（天/时/分/秒）
- 输入见面码签到按钮
- 联系主办方按钮
- 签到状态标识

#### 🟢 已完成 (Completed)
- 完成信息展示
- 星级评分（1-5星）
- 文字评价（选填，最多200字）
- 提交评价按钮
- 显示已提交的评价

#### ⚪ 已取消 (Cancelled)
- 显示取消原因
- 显示取消时间

## 📁 文件结构

```
SignupDetailPage/
├── index.tsx                      # 主组件
├── types.ts                       # TypeScript类型定义
├── PendingStatusArea/            # 待确认状态组件
│   └── index.tsx
├── ConfirmedStatusArea/          # 已确认状态组件
│   └── index.tsx
├── CompletedStatusArea/          # 已完成状态组件
│   └── index.tsx
├── MeetingCodeInput/             # 见面码输入组件
│   └── index.tsx
└── README.md                     # 本文档
```

## 🔄 数据流

```
MySignupsPage → SignupDetailPage
                     ↓
            接收 signupId + status
                     ↓
            加载报名详情数据
                     ↓
       根据状态渲染对应的子组件
                     ↓
       见面码输入 → 签到成功
```

## 🎨 UI组件

### 主组件 (SignupDetailPage)
- 顶部导航栏
- 报名状态卡片
- 状态区域（动态渲染）
- 活动信息卡片
- 报名时间轴

### PendingStatusArea
- 等待确认图标
- 报名信息展示
- 取消报名 / 联系主办方按钮
- 温馨提示

### ConfirmedStatusArea
- 见面码卡片（大号显示）
- 活动倒计时（天/时/分/秒）
- 输入见面码签到按钮
- 联系主办方按钮
- 签到成功状态
- 温馨提示

### CompletedStatusArea
- 完成图标
- 完成信息展示
- 星级评分组件（可交互）
- 评价输入框（多行文本）
- 提交评价按钮
- 温馨提示

### MeetingCodeInput
- 6位数字输入框
- 自动聚焦和跳转
- 输入验证
- 重置按钮
- 确认签到按钮
- 模态弹窗形式

### ActivityTimeline
- 时间轴展示
- 报名关键节点
- 时间戳显示

## 🔗 路由配置

- **入口**: `/profile/signup-detail?signupId={id}&status={status}`
- **返回**: `router.back()`

## 📝 使用示例

```tsx
import SignupDetailPage from '@/src/features/Profile/SignupDetailPage';

export default function SignupDetailScreen() {
  return <SignupDetailPage />;
}
```

## 🔧 核心逻辑

### 状态判断
```typescript
// 待确认
if (signupDetail.status === 'pending') {
  return <PendingStatusArea />;
}

// 已确认
if (signupDetail.status === 'confirmed') {
  return <ConfirmedStatusArea />;
}

// 已完成
if (signupDetail.status === 'completed') {
  return <CompletedStatusArea />;
}
```

### 见面码输入
```typescript
const MeetingCodeInput: React.FC<Props> = ({ visible, meetingCode, onSubmit }) => {
  const [inputCode, setInputCode] = useState(['', '', '', '', '', '']);
  
  const handleSubmit = () => {
    const code = inputCode.join('');
    if (code === meetingCode) {
      onSubmit(code);
    } else {
      Alert.alert('错误', '见面码不正确');
    }
  };
  
  return (
    <Modal visible={visible}>
      {/* 6位输入框 */}
      {inputCode.map((digit, index) => (
        <TextInput
          key={index}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          keyboardType="number-pad"
          maxLength={1}
        />
      ))}
    </Modal>
  );
};
```

### 倒计时Hook
```typescript
const useCountdown = (targetTime: number) => {
  const [timeLeft, setTimeLeft] = useState(targetTime - Date.now());
  
  useEffect(() => {
    const timer = setInterval(() => {
      const left = targetTime - Date.now();
      setTimeLeft(left > 0 ? left : 0);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetTime]);
  
  const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
  const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
  
  return { days, hours, minutes, seconds };
};
```

### 签到流程
```typescript
const handleCheckIn = (signupId: string, code: string) => {
  // 1. 验证见面码
  if (code !== meetingCode) {
    Alert.alert('错误', '见面码不正确');
    return;
  }
  
  // 2. 调用签到API
  // TODO: API call
  
  // 3. 更新本地状态
  setSignupDetail(prev => ({
    ...prev,
    isCheckedIn: true,
    checkedInAt: Date.now(),
  }));
  
  // 4. 提示成功
  Alert.alert('成功', '签到成功！');
};
```

## 🚀 待实现功能

- [ ] 接入真实API
- [ ] 取消报名确认弹窗
- [ ] 评价图片上传
- [ ] 活动分享功能
- [ ] 添加到日历
- [ ] 导航到活动地点
- [ ] 申诉/投诉功能

## 📌 注意事项

1. **见面码**: 6位数字，确认后生成，到场时输入完成签到
2. **状态传递**: 从列表页接收报名状态，确保状态一致
3. **倒计时**: 已确认状态下显示活动开始倒计时
4. **签到验证**: 输入的见面码必须与系统生成的一致
5. **评价限制**: 只能评价一次，提交后不可修改
6. **联系方式**: 显示主办方联系电话和邮箱
7. **模拟数据**: 当前使用模拟数据，需替换为真实API

## 🔧 技术栈

- React Native
- Expo Router
- TypeScript
- React Hooks (useState, useEffect, useCallback)
- ScrollView (滚动视图)
- Modal (见面码输入弹窗)
- Alert (原生弹窗)
- TextInput (见面码输入、评价输入)

## 🎯 业务流程

```
1. 用户报名 → 待确认
   ↓
2. 主办方确认 → 已确认（生成见面码）
   ↓
3. 用户到场输入见面码 → 签到成功
   ↓
4. 活动结束 → 已完成
   ↓
5. 用户评价 → 完成闭环
```

## 💡 最佳实践

1. **状态管理**: 使用自定义Hook分离状态逻辑
2. **组件拆分**: 按状态拆分子组件，保持主组件简洁
3. **类型安全**: 使用TypeScript确保类型安全
4. **用户体验**: 提供清晰的状态提示和操作引导
5. **输入验证**: 见面码输入时进行实时验证
6. **错误处理**: 添加必要的表单验证和错误提示
7. **倒计时**: 实时更新倒计时，提醒用户活动时间

## 🆚 与订单系统的区别

| 特性 | 我的报名 | 我的订单/购买 |
|------|---------|--------------|
| 发布方 | 公司/企业 | 个人服务提供者 |
| 核心功能 | 见面码签到 | 接单/评价 |
| 参与方式 | 报名参加活动 | 购买个人服务 |
| 确认流程 | 主办方确认 | 服务者接单 |
| 签到方式 | 输入6位见面码 | 无需签到 |
| 时间特性 | 固定活动时间 | 灵活服务时间 |

