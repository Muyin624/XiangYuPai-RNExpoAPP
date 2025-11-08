// #region 1. File Banner & TOC
/**
 * NavigationArea - 导航区域组件
 * 
 * 功能：
 * - 三Tab切换（关注/热门/同城）
 * - 搜索按钮
 * - Tab指示器动画
 * 
 * TOC (快速跳转):
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Schema
 * [4] Constants & Config
 * [5] Utils & Helpers
 * [6] State Management
 * [7] Domain Logic
 * [8] UI Components & Rendering
 * [9] Exports
 */
// #endregion

// #region 2. Imports
import React, { useCallback } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// 类型
import type { TabType } from '../../../types';
import { TABS } from '../../constants';
import type { NavigationAreaProps } from '../../types';
// #endregion

// #region 3. Types & Schema
// (使用NavigationAreaProps from types.ts)
// #endregion

// #region 4. Constants & Config
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  BACKGROUND: '#FFFFFF',
  BORDER: '#F0F0F0',
  TAB_ACTIVE: '#8A2BE2',
  TAB_INACTIVE: '#999999',
  INDICATOR: '#8A2BE2',
  SEARCH_ICON: '#666666',
} as const;

const SIZES = {
  HEIGHT: 48,
  SEARCH_SIZE: 44,
  BORDER_WIDTH: 0.5,
} as const;

const TYPOGRAPHY = {
  TAB: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
} as const;
// #endregion

// #region 5. Utils & Helpers
// (无需辅助函数)
// #endregion

// #region 6. State Management
// (简单组件，无需独立状态管理Hook)
// #endregion

// #region 7. Domain Logic
/**
 * NavigationArea业务逻辑Hook
 */
const useNavigationLogic = (props: NavigationAreaProps) => {
  const { activeTab, onTabChange, onSearchPress } = props;
  
  /**
   * Tab点击处理
   */
  const handleTabPress = useCallback((tab: TabType) => {
    console.log('[NavigationArea] Tab点击:', tab, '当前Tab:', activeTab);
    if (tab !== activeTab) {
      console.log('[NavigationArea] 切换Tab到:', tab);
      onTabChange(tab);
    } else {
      console.log('[NavigationArea] 已经是当前Tab，不切换');
    }
  }, [activeTab, onTabChange]);
  
  /**
   * 搜索按钮点击
   */
  const handleSearchButtonPress = useCallback(() => {
    onSearchPress();
  }, [onSearchPress]);
  
  return {
    activeTab,
    handleTabPress,
    handleSearchButtonPress,
  };
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * NavigationArea主组件
 */
const NavigationArea: React.FC<NavigationAreaProps> = (props) => {
  const {
    activeTab,
    handleTabPress,
    handleSearchButtonPress,
  } = useNavigationLogic(props);
  
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.content}>
        {/* Tab列表 */}
        <View style={styles.tabContainer}>
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.tab}
                onPress={() => handleTabPress(tab.key)}
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
              </TouchableOpacity>
            );
          })}
        </View>
        
        {/* 相机按钮 */}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchButtonPress}
          activeOpacity={0.7}
        >
          <Text style={styles.searchIcon}>📷</Text>
        </TouchableOpacity>
      </View>
      
      {/* 底部边框 */}
      <View style={styles.border} />
    </View>
  );
};
// #endregion

// #region 9. Exports
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    height: SIZES.HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
  },
  tabText: {
    ...TYPOGRAPHY.TAB,
    color: COLORS.TAB_INACTIVE,
  },
  tabTextActive: {
    color: COLORS.TAB_ACTIVE,
  },
  searchButton: {
    width: SIZES.SEARCH_SIZE,
    height: SIZES.SEARCH_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: 20,
  },
  border: {
    height: SIZES.BORDER_WIDTH,
    backgroundColor: COLORS.BORDER,
  },
});

export default NavigationArea;
export type { NavigationAreaProps } from '../../types';
// #endregion
