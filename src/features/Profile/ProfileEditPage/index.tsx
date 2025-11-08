// #region 1. File Banner & TOC
/**
 * ProfileEditPage - 个人资料编辑页
 * 
 * 功能：
 * - 所有字段编辑入口
 * - 头像管理
 * - 表单验证
 * - 使用假数据（前端模式）
 */
// #endregion

// #region 2. Imports
import { useProfileStore } from '@/stores/profileStore';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import AvatarPicker from './AvatarPicker';
import BottomPickerModal, { type PickerOption } from './BottomPickerModal';
// #endregion

// #region 3-7. Types, Constants, Utils, State & Logic
interface ProfileEditPageProps {
  userId?: string;
}

const COLORS = {
  WHITE: '#FFFFFF',
  BG_GRAY: '#F5F5F5',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#999999',
  BORDER: '#E5E5E5',
  PRIMARY: '#9C27B0',
} as const;

interface EditItem {
  id: string;
  label: string;
  value: string;
  type?: 'text' | 'select' | 'date';
  placeholder?: string;
}

// 选项配置
const GENDER_OPTIONS: PickerOption[] = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
];

const HEIGHT_OPTIONS: PickerOption[] = Array.from({ length: 71 }, (_, i) => {
  const height = 150 + i;
  return { label: `${height}cm`, value: height };
});

const WEIGHT_OPTIONS: PickerOption[] = Array.from({ length: 91 }, (_, i) => {
  const weight = 40 + i;
  return { label: `${weight}kg`, value: weight };
});

const useProfileEditLogic = () => {
  const router = useRouter();
  const currentProfile = useProfileStore(state => state.currentProfile);
  const updateUserProfile = useProfileStore(state => state.updateUserProfile);
  
  // 当前头像URI
  const [avatarUri, setAvatarUri] = useState(currentProfile?.avatar || 'https://via.placeholder.com/80');
  
  // 底部弹窗状态
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTitle, setPickerTitle] = useState('');
  const [pickerOptions, setPickerOptions] = useState<PickerOption[]>([]);
  const [pickerField, setPickerField] = useState('');
  const [pickerValue, setPickerValue] = useState<string | number>();
  
  // 编辑项列表（使用假数据）- 初始化
  const getEditItems = useCallback((): EditItem[] => {
    // 职业显示：如果有多个，显示为"职业1, 职业2"
    const occupationValue = currentProfile?.occupations && currentProfile.occupations.length > 0
      ? currentProfile.occupations.join(', ')
      : (currentProfile?.occupation || '暂未填写');
    
    // 性别显示
    const genderValue = currentProfile?.gender === 'male' ? '男' : 
                       currentProfile?.gender === 'female' ? '女' : '暂未填写';
    
    // 身高显示
    const heightValue = currentProfile?.height ? `${currentProfile.height}cm` : '暂未填写';
    
    // 体重显示
    const weightValue = currentProfile?.weight ? `${currentProfile.weight}kg` : '暂未填写';
    
    return [
      { id: 'nickname', label: '昵称', value: currentProfile?.nickname || '门前对联一副', type: 'text' },
      { id: 'gender', label: '性别', value: genderValue, type: 'select' },
      { id: 'intro', label: '个人介绍', value: currentProfile?.intro || '这个人很懒惰，还没有个人简介', type: 'text' },
      { id: 'birthday', label: '生日', value: '1999-09-23', type: 'date' },
      { id: 'height', label: '身高', value: heightValue, type: 'select' },
      { id: 'weight', label: '体重', value: weightValue, type: 'select' },
      { id: 'occupation', label: '职业', value: occupationValue, type: 'text' },
      { id: 'skills', label: '技能', value: '点击添加', type: 'text' },
      { id: 'wechat', label: '微信', value: currentProfile?.wechat || '213438647932', type: 'text' },
      { id: 'phone', label: '手机号', value: '暂未填写', type: 'text' },
    ];
  }, [currentProfile]);
  
  const [editItems, setEditItems] = useState<EditItem[]>(getEditItems());
  
  // 页面获得焦点时更新数据
  useFocusEffect(
    useCallback(() => {
      setEditItems(getEditItems());
      setAvatarUri(currentProfile?.avatar || 'https://via.placeholder.com/80');
    }, [currentProfile, getEditItems])
  );
  
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };
  
  const handleEditItem = (id: string) => {
    const item = editItems.find(i => i.id === id);
    if (!item) return;
    
    // 职业选择页
    if (id === 'occupation') {
      router.push({
        pathname: '/profile/select-occupation',
        params: {
          currentOccupations: JSON.stringify(currentProfile?.occupations || []),
        },
      });
      return;
    }
    
    // 微信编辑页
    if (id === 'wechat') {
      router.push({
        pathname: '/profile/edit-wechat',
        params: {
          currentWechat: currentProfile?.wechat || '',
          wechatLocked: String(currentProfile?.wechatLocked || false),
        },
      });
      return;
    }
    
    // 技能编辑页
    if (id === 'skills') {
      router.push('/profile/skills-edit');
      return;
    }
    
    // 性别选择（底部弹窗）
    if (id === 'gender') {
      setPickerField('gender');
      setPickerTitle('性别');
      setPickerOptions(GENDER_OPTIONS);
      setPickerValue(currentProfile?.gender);
      setPickerVisible(true);
      return;
    }
    
    // 身高选择（底部弹窗）
    if (id === 'height') {
      setPickerField('height');
      setPickerTitle('身高');
      setPickerOptions(HEIGHT_OPTIONS);
      setPickerValue(currentProfile?.height);
      setPickerVisible(true);
      return;
    }
    
    // 体重选择（底部弹窗）
    if (id === 'weight') {
      setPickerField('weight');
      setPickerTitle('体重');
      setPickerOptions(WEIGHT_OPTIONS);
      setPickerValue(currentProfile?.weight);
      setPickerVisible(true);
      return;
    }
    
    // 可以跳转到文本编辑页的字段
    const textEditableFields = ['nickname', 'intro'];
    
    if (textEditableFields.includes(id)) {
      // 跳转到文本编辑页
      router.push({
        pathname: '/profile/edit-field',
        params: {
          fieldKey: item.id,
          fieldLabel: item.label,
          fieldValue: item.value,
        },
      });
    } else {
      // 其他类型暂时显示提示
      Alert.alert(
        `编辑${item.label}`,
        `当前值：${item.value}\n\n💡 开发提示：${item.label}编辑功能待实现`,
        [{ text: '确定' }]
      );
    }
  };
  
  // 处理头像变更
  const handleAvatarChange = (uri: string) => {
    console.log('💾 更新头像到Store');
    setAvatarUri(uri);
    // 更新到ProfileStore（假数据模式）
    updateUserProfile({ avatar: uri });
  };
  
  // 处理底部弹窗选择
  const handlePickerSelect = (value: string | number) => {
    console.log(`💾 更新${pickerField}（假数据模式）`, value);
    
    // 更新到Store
    updateUserProfile({ [pickerField]: value });
    
    // 刷新列表
    setEditItems(getEditItems());
  };
  
  const handlePickerCancel = () => {
    setPickerVisible(false);
  };
  
  return {
    editItems,
    currentProfile,
    avatarUri,
    handleBack,
    handleEditItem,
    handleAvatarChange,
    // 底部弹窗相关
    pickerVisible,
    pickerTitle,
    pickerOptions,
    pickerValue,
    handlePickerSelect,
    handlePickerCancel,
  };
};
// #endregion

// #region 8. UI Components & Rendering
const ProfileEditPage: React.FC<ProfileEditPageProps> = ({ userId }) => {
  const { 
    editItems, 
    currentProfile, 
    avatarUri, 
    handleBack, 
    handleEditItem, 
    handleAvatarChange,
    pickerVisible,
    pickerTitle,
    pickerOptions,
    pickerValue,
    handlePickerSelect,
    handlePickerCancel,
  } = useProfileEditLogic();
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />
      
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>个人资料</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* 编辑列表 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 头像编辑项（特殊处理） */}
        <View style={[styles.editItem, styles.firstItem]}>
          <View style={styles.editItemLeft}>
            <Text style={styles.editLabel}>头像</Text>
            <AvatarPicker
              currentAvatar={avatarUri}
              onAvatarChange={handleAvatarChange}
            />
          </View>
        </View>
        
        {/* 其他编辑项 */}
        {editItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.editItem,
              index === editItems.length - 1 && styles.lastItem,
            ]}
            onPress={() => handleEditItem(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.editItemLeft}>
              <Text style={styles.editLabel}>{item.label}</Text>
              <Text 
                style={[
                  styles.editValue,
                  item.value === '暂未填写' && styles.placeholderText
                ]}
                numberOfLines={1}
              >
                {item.value}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT_SECONDARY} />
          </TouchableOpacity>
        ))}
        
        {/* 底部提示 */}
        <View style={styles.tipContainer}>
          <Text style={styles.tipText}>💡 当前为前端假数据模式</Text>
          <Text style={styles.tipSubtext}>点击编辑项查看说明</Text>
        </View>
      </ScrollView>
      
      {/* 底部选择弹窗 */}
      <BottomPickerModal
        visible={pickerVisible}
        title={pickerTitle}
        options={pickerOptions}
        selectedValue={pickerValue}
        onSelect={handlePickerSelect}
        onCancel={handlePickerCancel}
      />
    </SafeAreaView>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_GRAY,
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  editItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  firstItem: {
    marginTop: 12,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  editItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 12,
  },
  editLabel: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    minWidth: 80,
  },
  editValue: {
    flex: 1,
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'right',
    marginRight: 8,
  },
  placeholderText: {
    color: COLORS.TEXT_SECONDARY,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.BORDER,
  },
  tipContainer: {
    padding: 24,
    alignItems: 'center',
  },
  tipText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  tipSubtext: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default ProfileEditPage;
// #endregion

