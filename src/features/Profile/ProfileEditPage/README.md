# Profile Edit Module - 个人资料编辑模块

## 📋 功能概述

个人资料编辑模块，包含完整的用户信息编辑功能和技能管理。

## 📁 文件结构

```
ProfileEditPage/
├── index.tsx                  # 主编辑页面 - 所有字段的编辑入口
├── AvatarPicker.tsx          # 头像选择组件
├── BottomPickerModal.tsx     # 底部选择器（性别、身高、体重）
├── OccupationSelectPage.tsx  # 职业选择页面
├── TextFieldEditPage.tsx     # 文本字段编辑页面
├── WechatEditPage.tsx        # 微信号编辑页面
├── SkillsEditPage.tsx        # ⭐ 技能添加/编辑页面
└── README.md                 # 本文档
```

## 🎯 SkillsEditPage - 技能编辑页面

### 功能特性

1. **技能类型选择** ⭐ NEW
   - 线上技能：段位 + 定价
   - 线下技能：段位 + 地点 + 定价
   - 切换式Tab设计（iOS风格）

2. **技能图标选择**
   - 10个预设彩色图标
   - 包括游戏类和生活类技能
   - 支持点击选择，带选中状态

3. **信息输入**
   - 技能标题（必填，最多50字）
   - 技能描述（选填，最多200字）
   - 图片上传占位符（待实现）
   - 字数统计显示

4. **条件字段** ⭐ NEW
   - **线上技能**：段位 + 定价
   - **线下技能**：段位 + 地点 + 定价
   - **段位字段**：两种类型都显示
   - **地点字段**：仅线下显示

5. **数据验证**
   - 必须选择图标
   - 必须输入标题
   - 完成时显示确认信息（包含类型）

### 预设技能图标

| 图标 | 名称 | ID | 颜色 |
|------|------|-----|------|
| 👑 | 王者荣耀 | king | 金色 #FFD700 |
| 🎮 | 高端局陪 | pubg | 橙色 #FF6B00 |
| 🎯 | Ⅲ守境陪 | csgo | 黄色 #FFB800 |
| ⚔️ | 联盟乱斗 | lol | 橙黄 #FFA500 |
| 🎪 | 拓店 | party | 粉色 #FF69B4 |
| 🎨 | 私野 | privacy | 红色 #FF4500 |
| 🎱 | 台球 | voice | 紫色 #9C27B0 |
| 🎤 | K歌 | kge | 玫红 #E91E63 |
| 🌸 | 逛园 | garden | 绿色 #4CAF50 |
| 💆 | 按摩 | massage | 青色 #00BCD4 |

### 使用方式

#### 从编辑个人资料页面进入
```typescript
// 在 ProfileEditPage 中点击"技能"
router.push('/profile/skills-edit');
```

#### 从个人资料展示页面进入
```typescript
// 在 ProfileContent 中点击"添加技能"按钮
router.push('/profile/skills-edit');
```

### 数据结构

```typescript
interface SkillItem {
  id: string;           // 技能ID
  name: string;         // 技能名称
  icon?: string;        // 图标（emoji或URL）
  iconId?: string;      // 图标ID（用于颜色映射）
  type?: 'game' | 'lifestyle';  // 类型
  skillType?: 'online' | 'offline';  // ⭐ 技能类型：线上/线下
  description?: string; // 技能描述
  level?: string;       // 段位/等级（线上和线下都有）
  location?: string;    // ⭐ 地点（仅线下）
  price?: number;       // 定价（金币/局）
  rating?: number;      // 评分
}
```

### 保存逻辑（当前状态）

**前端模式（假数据）**：
- ✅ 表单验证
- ✅ 数据构建
- ✅ 控制台日志
- ⏳ 待实现：保存到 ProfileStore
- ⏳ 待实现：后端API对接

```typescript
// 当前保存逻辑
const newSkill = {
  id: props.skillId || `skill_${Date.now()}`,
  type: skillType,                    // 'online' | 'offline'
  iconId: selectedIcon,
  name: title,
  description: content,
  level: level || undefined,          // 线上和线下都有
  price: price ? Number(price) : undefined,
  location: skillType === 'offline' ? location : undefined,  // 仅线下
};

console.log('💾 保存技能（假数据模式）', newSkill);
// TODO: 调用 API 或更新 Store
```

## 🔗 导航路由

### 路由配置

在 `app/profile/_layout.tsx` 中配置：

```typescript
<Stack.Screen 
  name="skills-edit" 
  options={{ 
    headerShown: false,
    animation: 'slide_from_right',
  }} 
/>
```

### 路由适配器

`app/profile/skills-edit.tsx`：
```typescript
export default function SkillsEditScreen() {
  const params = useLocalSearchParams<{ skillId?: string }>();
  return <SkillsEditPage skillId={params.skillId} />;
}
```

## 🎨 个人资料展示 - ProfileContent

技能在个人资料Tab中的展示：

### 显示特性

1. **图标展示**
   - 圆形彩色背景
   - 支持emoji或图片
   - 自动根据iconId匹配颜色

2. **信息展示**
   - 技能名称
   - 价格（金币/局）

3. **交互功能**
   - 点击技能查看详情（待实现）
   - 点击"+"添加新技能
   - 只有本人能看到添加按钮

### 组件使用

```typescript
<ProfileContent
  userInfo={currentProfile}
  skills={skills}  // 技能列表
  isOwnProfile={isOwnProfile}
  onSkillPress={(skillId) => {
    // 查看技能详情
  }}
  onAddSkillPress={() => {
    // 跳转到技能添加页
    router.push('/profile/skills-edit');
  }}
/>
```

## 📝 待办事项

### 近期任务

- [ ] 实现图片上传功能
- [ ] 将保存的技能存储到 ProfileStore
- [ ] 从 Store 读取并展示用户的技能列表
- [ ] 实现技能编辑功能（传入 skillId）
- [ ] 实现技能删除功能
- [ ] 添加段位/等级选择的picker组件

### 后端对接

- [ ] 对接技能保存API
- [ ] 对接技能列表API
- [ ] 对接技能更新API
- [ ] 对接技能删除API
- [ ] 对接图片上传API

### 增强功能

- [ ] 技能详情页面
- [ ] 技能评价系统
- [ ] 技能搜索和筛选
- [ ] 自定义技能图标上传

## 🔍 调试提示

查看控制台日志：
```
💾 保存技能（假数据模式）
添加技能
```

## 📱 使用流程

1. 用户进入个人主页
2. 切换到"资料"Tab
3. 看到技能区域，点击"添加技能"（+按钮）
4. 进入技能编辑页面
5. 选择图标、输入信息
6. 点击"完成"保存
7. 返回资料页面查看新增的技能

## 🎯 UI参考

技能编辑页面UI参考了提供的截图：
- 顶部：取消 | 添加技能 | 完成
- 图标网格：5列布局，彩色圆形背景
- 表单区域：灰色背景，圆角卡片
- 文本域：带图片上传和字数统计
