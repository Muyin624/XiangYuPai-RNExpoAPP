// #region 1. File Banner & TOC
/**
 * TabNavigationArea - 他人信息页Tab标签栏
 * 
 * 功能：
 * - 三Tab切换（动态/资料/技能）
 * - Tab指示器动画
 * - 吸顶固定效果（滚动时）
 */
// #endregion

// #region 2. Imports
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS } from '../MainPage/constants';
import type { TabType } from './types';
// #endregion

// #region 3. Types
interface TabNavigationAreaProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  style?: any;
}

interface TabItem {
  key: TabType;
  label: string;
}
// #endregion

// #region 4. Constants
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_WIDTH = SCREEN_WIDTH / 3; // 三个Tab

/**
 * 他人信息页Tab配置（动态/资料/技能）
 */
const OTHER_USER_TABS: TabItem[] = [
  { key: 'dynamics', label: '动态' },
  { key: 'profile', label: '资料' },
  { key: 'skills', label: '技能' },
];
// #endregion

// #region 5. UI Components & Rendering
const TabNavigationArea: React.FC<TabNavigationAreaProps> = ({
  activeTab,
  onTabChange,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {OTHER_USER_TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                isActive && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
            {isActive && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
// #endregion

// #region 6. Exports & Styles
const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    color: '#999999',
  },
  tabTextActive: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 3,
    backgroundColor: '#8A2BE2',
    borderRadius: 1.5,
  },
});

export default TabNavigationArea;
// #endregion

