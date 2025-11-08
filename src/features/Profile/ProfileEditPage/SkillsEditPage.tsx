// #region 1. File Banner & TOC
/**
 * SkillsEditPage - 添加技能页面
 * 
 * 功能：
 * - 技能图标选择
 * - 技能标题输入
 * - 技能正文输入
 * - 段位选择
 * - 定价输入
 */
// #endregion

// #region 2. Imports
import { useProfileStore } from '@/stores/profileStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
// #endregion

// #region 3-7. Types, Constants, Utils, State & Logic
interface SkillIcon {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

type SkillType = 'online' | 'offline';

const COLORS = {
  WHITE: '#FFFFFF',
  BG_GRAY: '#F5F5F5',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#999999',
  TEXT_PLACEHOLDER: '#CCCCCC',
  BORDER: '#E5E5E5',
  PRIMARY: '#9C27B0',
  CANCEL: '#666666',
  TAB_ACTIVE: '#9C27B0',
  TAB_INACTIVE: '#999999',
} as const;

// 技能图标配置（基于图片）
const SKILL_ICONS: SkillIcon[] = [
  { id: 'king', name: '王者荣耀', emoji: '👑', color: '#FFD700' },
  { id: 'pubg', name: '高端局陪', emoji: '🎮', color: '#FF6B00' },
  { id: 'csgo', name: 'Ⅲ守境陪', emoji: '🎯', color: '#FFB800' },
  { id: 'lol', name: '联盟乱斗', emoji: '⚔️', color: '#FFA500' },
  { id: 'party', name: '拓店', emoji: '🎪', color: '#FF69B4' },
  { id: 'privacy', name: '私野', emoji: '🎨', color: '#FF4500' },
  { id: 'voice', name: '台球', emoji: '🎱', color: '#9C27B0' },
  { id: 'kge', name: 'K歌', emoji: '🎤', color: '#E91E63' },
  { id: 'garden', name: '逛园', emoji: '🌸', color: '#4CAF50' },
  { id: 'massage', name: '按摩', emoji: '💆', color: '#00BCD4' },
];

interface SkillsEditPageProps {
  skillId?: string;  // 编辑模式传入
}

const useSkillsEditLogic = (props: SkillsEditPageProps) => {
  const router = useRouter();
  const currentProfile = useProfileStore(state => state.currentProfile);
  const updateUserProfile = useProfileStore(state => state.updateUserProfile);
  
  // 技能类型状态
  const [skillType, setSkillType] = useState<SkillType>('online');
  
  // 表单状态
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [level, setLevel] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };
  
  const handleCancel = () => {
    handleBack();
  };
  
  const handleIconSelect = (iconId: string) => {
    setSelectedIcon(iconId);
  };
  
  const handleComplete = () => {
    // 验证必填项
    if (!selectedIcon) {
      Alert.alert('提示', '请选择技能图标');
      return;
    }
    
    if (!title.trim()) {
      Alert.alert('提示', '请输入技能标题');
      return;
    }
    
    // 构建技能数据
    const newSkill = {
      id: props.skillId || `skill_${Date.now()}`,
      type: skillType,
      iconId: selectedIcon,
      name: title,
      description: content,
      level: level || undefined,  // 线上和线下都有段位
      price: price ? Number(price) : undefined,
      location: skillType === 'offline' ? location : undefined,  // 仅线下有地点
    };
    
    console.log('💾 保存技能（假数据模式）', newSkill);
    
    // TODO: 保存到Store或发送到后端
    const typeText = skillType === 'online' ? '线上' : '线下';
    const detailsText = [
      content ? `描述：${content}` : '',
      level ? `段位：${level}` : '',
      skillType === 'offline' && location ? `地点：${location}` : '',
      price ? `定价：${price}金币/局` : '',
    ].filter(Boolean).join('\n');
    
    Alert.alert(
      '保存成功',
      `技能类型：${typeText}\n技能：${title}\n${detailsText}`,
      [
        {
          text: '确定',
          onPress: handleBack,
        },
      ]
    );
  };
  
  return {
    skillType,
    setSkillType,
    selectedIcon,
    title,
    content,
    level,
    price,
    location,
    handleBack,
    handleCancel,
    handleComplete,
    handleIconSelect,
    setTitle,
    setContent,
    setLevel,
    setPrice,
    setLocation,
  };
};
// #endregion

// #region 8. UI Components & Rendering
const SkillsEditPage: React.FC<SkillsEditPageProps> = (props) => {
  const {
    skillType,
    setSkillType,
    selectedIcon,
    title,
    content,
    level,
    price,
    location,
    handleBack,
    handleCancel,
    handleComplete,
    handleIconSelect,
    setTitle,
    setContent,
    setLevel,
    setPrice,
    setLocation,
  } = useSkillsEditLogic(props);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />
      
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <Text style={styles.cancelText}>取消</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>添加技能</Text>
        <TouchableOpacity onPress={handleComplete} style={styles.headerButton}>
          <Text style={styles.completeText}>完成</Text>
        </TouchableOpacity>
      </View>
      
      {/* 内容区域 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 技能类型选择 */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeTab, skillType === 'online' && styles.typeTabActive]}
            onPress={() => setSkillType('online')}
            activeOpacity={0.7}
          >
            <Text style={[styles.typeTabText, skillType === 'online' && styles.typeTabTextActive]}>
              线上
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeTab, skillType === 'offline' && styles.typeTabActive]}
            onPress={() => setSkillType('offline')}
            activeOpacity={0.7}
          >
            <Text style={[styles.typeTabText, skillType === 'offline' && styles.typeTabTextActive]}>
              线下
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* 技能图标网格 */}
        <View style={styles.iconGrid}>
          {SKILL_ICONS.map((icon) => (
            <TouchableOpacity
              key={icon.id}
              style={[
                styles.iconItem,
                selectedIcon === icon.id && styles.iconItemSelected,
              ]}
              onPress={() => handleIconSelect(icon.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconCircle, { backgroundColor: icon.color }]}>
                <Text style={styles.iconEmoji}>{icon.emoji}</Text>
              </View>
              <Text style={styles.iconLabel} numberOfLines={1}>
                {icon.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* 添加标题 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>添加标题</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="请输入标题"
              placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
              maxLength={50}
            />
          </View>
        </View>
        
        {/* 添加正文 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>添加正文</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <View style={styles.imageUploadPlaceholder}>
              <Ionicons name="add" size={40} color={COLORS.TEXT_PLACEHOLDER} />
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={content}
              onChangeText={setContent}
              placeholder=""
              placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
              multiline
              textAlignVertical="top"
              maxLength={200}
            />
            <Text style={styles.charCount}>{content.length}/200</Text>
          </View>
        </View>
        
        {/* 段位 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>段位</Text>
          <TouchableOpacity style={styles.selectContainer} activeOpacity={0.7}>
            <TextInput
              style={styles.selectInput}
              value={level}
              onChangeText={setLevel}
              placeholder="选择"
              placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
            />
            <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT_SECONDARY} />
          </TouchableOpacity>
        </View>
        
        {/* 地点（仅线下） */}
        {skillType === 'offline' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>地点</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="请输入地点"
                placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
                maxLength={100}
              />
            </View>
          </View>
        )}
        
        {/* 定价 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>定价</Text>
          <TouchableOpacity style={styles.selectContainer} activeOpacity={0.7}>
            <TextInput
              style={styles.selectInput}
              value={price}
              onChangeText={setPrice}
              placeholder="0金币/局"
              placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
              keyboardType="numeric"
            />
            <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT_SECONDARY} />
          </TouchableOpacity>
        </View>
        
        {/* 底部间距 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  headerButton: {
    padding: 4,
    minWidth: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  cancelText: {
    fontSize: 16,
    color: COLORS.CANCEL,
  },
  completeText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    textAlign: 'right',
  },
  content: {
    flex: 1,
  },
  
  // 类型选择器
  typeSelector: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: COLORS.BG_GRAY,
    borderRadius: 8,
    padding: 4,
  },
  typeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeTabActive: {
    backgroundColor: COLORS.WHITE,
  },
  typeTabText: {
    fontSize: 15,
    color: COLORS.TAB_INACTIVE,
    fontWeight: '500',
  },
  typeTabTextActive: {
    color: COLORS.TAB_ACTIVE,
    fontWeight: '600',
  },
  
  // 图标网格
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    paddingTop: 20,
  },
  iconItem: {
    width: '20%',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconItemSelected: {
    opacity: 1,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  iconEmoji: {
    fontSize: 28,
  },
  iconLabel: {
    fontSize: 12,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    width: '90%',
  },
  
  // 表单区域
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: COLORS.BG_GRAY,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    padding: 0,
    minHeight: 24,
  },
  
  // 文本域
  textAreaContainer: {
    minHeight: 120,
    position: 'relative',
    paddingBottom: 30,
  },
  textArea: {
    minHeight: 60,
    marginTop: 8,
  },
  imageUploadPlaceholder: {
    width: 72,
    height: 72,
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  charCount: {
    position: 'absolute',
    right: 12,
    bottom: 8,
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  
  // 选择器
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.BG_GRAY,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  selectInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    padding: 0,
  },
  
  bottomSpacer: {
    height: 40,
  },
});

export default SkillsEditPage;
// #endregion

