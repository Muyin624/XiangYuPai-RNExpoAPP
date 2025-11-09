# 客服与达人认证功能实现文档

## 📋 功能概述
本文档记录了"我的"页面中**客服**和**达人认证**两个功能的实现细节。

## ✅ 已完成功能

### 1. 客服功能（Customer Service）

#### 功能特点
- ✅ 聊天界面设计（参考图片一）
- ✅ 客服欢迎消息："Hi，上午好~请描述您遇到的问题或您想咨询的内容"
- ✅ 消息气泡样式区分（客服左侧白色，用户右侧紫色）
- ✅ 头像显示
- ✅ 文本输入框
- ✅ 图片和表情按钮（UI 已实现，功能待完善）
- ✅ 键盘自适应

#### 文件结构
```
app/profile/customer-service.tsx          # 路由页面
src/features/Profile/CustomerServicePage/
  ├── index.tsx                           # 功能组件导出
  └── README.md                           # 功能文档
```

#### 路由配置
- 路径: `/profile/customer-service`
- 已在 `app/profile/_layout.tsx` 中注册
- 已在 `src/features/Profile/MyPage/index.tsx` 中添加导航处理

#### 使用方式
```typescript
// 从"我的"页面点击"客服"图标
router.push('/profile/customer-service');
```

---

### 2. 达人认证功能（Expert Verification）

#### 功能特点
- ✅ 认证页面设计（参考图片二）
- ✅ 提示信息："上传身份证正面"
- ✅ 说明文字："实名认证需要提供身份证正面，请按以下规范拍摄"
- ✅ 身份证照片上传区域（带占位符）
- ✅ 真实姓名输入框
- ✅ 身份证号码输入框
- ✅ 表单验证（姓名、身份证号格式）
- ✅ "开始上传"提交按钮

#### 文件结构
```
app/profile/expert-verification.tsx       # 路由页面
src/features/Profile/ExpertVerificationPage/
  ├── index.tsx                           # 功能组件导出
  └── README.md                           # 功能文档
```

#### 路由配置
- 路径: `/profile/expert-verification`
- 已在 `app/profile/_layout.tsx` 中注册
- 已在 `src/features/Profile/MyPage/index.tsx` 中添加导航处理

#### 表单验证规则
1. **真实姓名**: 必填，最大 20 字符
2. **身份证号码**: 必填，支持 15/18 位，格式验证
3. **身份证照片**: 必须上传

#### 使用方式
```typescript
// 从"我的"页面点击"达人认证"图标
router.push('/profile/expert-verification');
```

---

## 🎨 UI 设计规范

### 客服页面
- **消息气泡**
  - 客服消息: 白色背景 (#fff)，左对齐
  - 用户消息: 紫色背景 (#8B5CF6)，右对齐
- **头像**
  - 尺寸: 36x36
  - 圆角: 18
  - 背景色: #E0E7FF
- **输入框**
  - 背景色: #F9FAFB
  - 圆角: 18
  - 支持多行输入

### 达人认证页面
- **提示卡片**
  - 背景色: #EEF2FF
  - 圆角: 12
  - 内边距: 16
- **上传区域**
  - 高度: 200
  - 边框: 虚线 (#E5E7EB)
  - 占位符图标: 80x80
- **表单输入框**
  - 高度: 48
  - 背景色: #F9FAFB
  - 边框: 1px solid #E5E7EB
- **提交按钮**
  - 背景色: #8B5CF6
  - 高度: 48
  - 圆角: 24

---

## 🔧 待完善功能

### 客服功能
1. **图片上传**
   - 集成 `expo-image-picker`
   - 实现图片选择与上传
   - 显示图片消息

2. **表情选择**
   - 实现表情选择面板
   - 插入表情到输入框

3. **实时通信**
   - WebSocket 连接
   - 实时消息推送
   - 消息已读状态

4. **消息历史**
   - 加载历史消息
   - 分页加载
   - 消息缓存

### 达人认证功能
1. **图片选择器**
   - 集成 `expo-image-picker`
   - 相机拍照功能
   - 相册选择功能

2. **图片处理**
   - 图片压缩
   - 图片裁剪
   - 图片预览

3. **API 对接**
   - 图片上传接口
   - 认证提交接口
   - 认证状态查询接口

4. **OCR 识别**（可选）
   - 自动识别身份证信息
   - 自动填充姓名和号码

---

## 📦 依赖包（待安装）

```json
{
  "expo-image-picker": "^14.x.x",  // 图片选择器
  "expo-file-system": "^16.x.x",   // 文件系统操作
  "react-native-image-crop-picker": "^0.40.x"  // 图片裁剪（可选）
}
```

安装命令:
```bash
npx expo install expo-image-picker expo-file-system
```

---

## 🔗 相关文件

### 修改的文件
1. `app/profile/_layout.tsx` - 添加路由配置
2. `src/features/Profile/MyPage/index.tsx` - 添加导航处理

### 新增的文件
1. `app/profile/customer-service.tsx` - 客服页面
2. `app/profile/expert-verification.tsx` - 达人认证页面
3. `src/features/Profile/CustomerServicePage/` - 客服功能模块
4. `src/features/Profile/ExpertVerificationPage/` - 达人认证功能模块

---

## 🧪 测试建议

### 客服功能测试
1. 发送文本消息
2. 检查消息气泡样式
3. 测试键盘弹出/收起
4. 测试多行文本输入
5. 测试返回按钮

### 达人认证功能测试
1. 测试表单验证（空值、格式错误）
2. 测试身份证号码格式验证
3. 测试图片上传占位符
4. 测试提交按钮
5. 测试返回按钮

---

## 📝 注意事项

1. **安全性**
   - 身份证信息需要加密传输
   - 敏感数据不应明文存储
   - 需要 HTTPS 协议

2. **用户体验**
   - 提供清晰的错误提示
   - 上传进度显示
   - 网络异常处理

3. **性能优化**
   - 图片压缩后上传
   - 消息列表虚拟化（大量消息时）
   - 防抖处理（输入框）

---

## 🎯 下一步计划

1. 集成图片选择器
2. 实现图片上传功能
3. 对接后端 API
4. 实现 WebSocket 实时通信
5. 添加消息历史记录
6. 实现认证状态查询
7. 添加单元测试

---

## 📸 参考图片

- **图片一**: 客服聊天界面设计
- **图片二**: 达人认证页面设计

---

**更新时间**: 2025-11-09
**版本**: v1.0.0
**状态**: ✅ 基础功能已完成

