# ExpertVerificationPage - 达人认证页面

## 功能概述
达人认证申请页面，用户通过上传身份证和填写实名信息来申请成为平台达人。

## 主要功能
1. **身份证上传**
   - 上传身份证正面照片
   - 图片预览
   - 拍摄规范提示

2. **信息填写**
   - 真实姓名输入
   - 身份证号码输入
   - 表单验证

3. **提交审核**
   - 表单完整性验证
   - 身份证号码格式验证
   - 提交认证申请

## 页面结构
```
ExpertVerificationPage
├── Header（顶部导航栏）
│   ├── 返回按钮
│   └── 标题"达人认证"
├── TipCard（提示信息）
│   ├── 标题
│   └── 说明文字
├── UploadArea（上传区域）
│   ├── UploadPlaceholder（上传占位符）
│   └── UploadedImage（已上传图片）
├── FormSection（表单区域）
│   ├── RealNameInput（真实姓名）
│   └── IdNumberInput（身份证号码）
└── SubmitButton（提交按钮）
```

## 表单验证规则
1. **真实姓名**
   - 必填项
   - 最大长度 20 字符

2. **身份证号码**
   - 必填项
   - 支持 15 位或 18 位
   - 格式验证：`/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/`

3. **身份证照片**
   - 必须上传

## 数据结构
```typescript
interface VerificationData {
  realName: string;      // 真实姓名
  idNumber: string;      // 身份证号码
  idCardImage: string;   // 身份证照片 URI
}
```

## 路由配置
- 路由路径: `/profile/expert-verification`
- 导航方式: `router.push('/profile/expert-verification')`

## API 接口（待对接）
```typescript
// POST /api/user/expert-verification
interface VerificationRequest {
  realName: string;
  idNumber: string;
  idCardImageUrl: string;
}

interface VerificationResponse {
  success: boolean;
  message: string;
  verificationId?: string;
}
```

## 待实现功能
1. 图片选择器集成（expo-image-picker）
2. 图片上传到服务器
3. 实名认证 API 对接
4. 认证状态查询
5. 认证进度展示
6. OCR 自动识别身份证信息

## 使用示例
```typescript
// 从"我的"页面导航
router.push('/profile/expert-verification');
```

## 注意事项
1. 身份证照片需要清晰可见
2. 需要提示用户照片拍摄规范
3. 敏感信息需要加密传输
4. 需要实现图片压缩以减少上传大小
5. 认证审核需要后台人工审核

