/**
 * ProfileContent - 资料Tab内容
 * 
 * 功能：
 * - 两列网格布局显示个人资料
 * - 圆形图标技能展示
 * - 支持添加技能（本人）
 * 
 * UI参考：截图 - 资料Tab
 */

import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import type { SkillItem, UserProfile } from '../../types';

// #region Types
interface ProfileContentProps {
  userInfo: UserProfile;
  skills?: SkillItem[];
  isOwnProfile: boolean;
  onSkillPress?: (skillId: string) => void;
  onAddSkillPress?: () => void;
  onEditInfoPress?: () => void;
}

interface InfoFieldProps {
  label: string;
  value: string;
}
// #endregion

// #region Constants
const MOCK_SKILLS = [
  { id: '1', name: '王者荣耀', icon: '👑', iconId: 'king', type: 'game' as const, level: '王者', price: 50 },
  { id: '2', name: '荒野乱斗', icon: '⚔️', iconId: 'lol', type: 'game' as const, level: '钻石', price: 60 },
  { id: '3', name: '探店', icon: '🎪', iconId: 'party', type: 'lifestyle' as const, price: 80 },
  { id: '4', name: '按摩', icon: '💆', iconId: 'massage', type: 'lifestyle' as const, price: 100 },
];

// 技能图标颜色映射（与SkillsEditPage保持一致）
const SKILL_ICON_COLORS: Record<string, string> = {
  king: '#FFD700',
  pubg: '#FF6B00',
  csgo: '#FFB800',
  lol: '#FFA500',
  party: '#FF69B4',
  privacy: '#FF4500',
  voice: '#9C27B0',
  kge: '#E91E63',
  garden: '#4CAF50',
  massage: '#00BCD4',
};
// #endregion

/**
 * 信息字段组件
 */
const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => (
  <View style={styles.fieldItem}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldValue}>{value}</Text>
  </View>
);

/**
 * 技能图标组件
 */
const SkillIcon: React.FC<{ skill: SkillItem; onPress?: () => void }> = ({ skill, onPress }) => {
  // 获取图标颜色（如果有iconId）
  const iconColor = skill.iconId ? SKILL_ICON_COLORS[skill.iconId] : '#E0E0E0';
  
  // 判断icon是emoji还是URL
  const isEmoji = skill.icon && !skill.icon.startsWith('http');
  
  return (
    <TouchableOpacity style={styles.skillItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.skillIconWrapper, { backgroundColor: iconColor }]}>
        {isEmoji ? (
          <Text style={styles.skillIconEmoji}>{skill.icon}</Text>
        ) : (
          <Image
            source={{ uri: skill.icon }}
            style={styles.skillIcon}
          />
        )}
      </View>
      <Text style={styles.skillName} numberOfLines={1}>
        {skill.name}
      </Text>
      {skill.price && (
        <Text style={styles.skillPrice}>{skill.price}金币/局</Text>
      )}
    </TouchableOpacity>
  );
};

const ProfileContent: React.FC<ProfileContentProps> = ({
  userInfo,
  skills = MOCK_SKILLS,
  isOwnProfile,
  onSkillPress,
  onAddSkillPress,
}) => {
  // 使用模拟数据
  const displaySkills = skills.length > 0 ? skills : MOCK_SKILLS;

  return (
    <View style={styles.container}>
      {/* 个人资料卡片 */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>个人资料</Text>
        
        <View style={styles.fieldsGrid}>
          {/* 第一行 */}
          <View style={styles.fieldRow}>
            <InfoField label="常居地" value={userInfo.region || '广东 深圳'} />
            <InfoField label="IP" value="广东 深圳" />
          </View>
          
          {/* 第二行 */}
          <View style={styles.fieldRow}>
            <InfoField label="身高" value={userInfo.height ? `${userInfo.height}cm` : '162cm'} />
            <InfoField label="ID" value={userInfo.id || '21566842'} />
          </View>
          
          {/* 第三行 */}
          <View style={styles.fieldRow}>
            <InfoField label="体重" value={userInfo.weight ? `${userInfo.weight}kg` : '44kg'} />
            <InfoField label="职业" value={userInfo.occupation || '模特'} />
          </View>
          
          {/* 第四行 */}
          <View style={styles.fieldRow}>
            <InfoField label="微信" value={userInfo.wechat || 'sunny0301'} />
            <InfoField label="生日" value={userInfo.birthday || '09-29'} />
          </View>
        </View>
      </View>

      {/* 技能卡片 */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>技能</Text>
        
        <View style={styles.skillsGrid}>
          {displaySkills.map((skill) => (
            <SkillIcon
              key={skill.id}
              skill={skill}
              onPress={() => onSkillPress?.(skill.id)}
            />
          ))}
          
          {/* 添加技能按钮 */}
          {isOwnProfile && (
            <TouchableOpacity
              style={styles.addSkillItem}
              onPress={onAddSkillPress}
              activeOpacity={0.7}
            >
              <View style={styles.addSkillIcon}>
                <Text style={styles.addIconText}>+</Text>
              </View>
              <Text style={styles.addSkillText}>添加技能</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 底部间距 */}
      <View style={styles.bottomSpace} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
  },
  
  // 个人资料网格
  fieldsGrid: {
    gap: 0,
  },
  fieldRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  fieldItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#999999',
    width: 60,
  },
  fieldValue: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },
  
  // 技能网格
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  skillItem: {
    alignItems: 'center',
    width: 70,
  },
  skillIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillIcon: {
    width: '100%',
    height: '100%',
  },
  skillIconEmoji: {
    fontSize: 28,
  },
  skillName: {
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 2,
  },
  skillPrice: {
    fontSize: 10,
    color: '#999999',
    textAlign: 'center',
  },
  
  // 添加技能按钮
  addSkillItem: {
    alignItems: 'center',
    width: 70,
  },
  addSkillIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  addIconText: {
    fontSize: 32,
    color: '#999999',
    fontWeight: '300',
  },
  addSkillText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
  
  bottomSpace: {
    height: 24,
  },
});

export default ProfileContent;

