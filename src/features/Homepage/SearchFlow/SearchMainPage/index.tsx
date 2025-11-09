// #region 1. File Banner & TOC
/**
 * SearchMainPage - 搜索主页面
 * 
 * 功能描述：智能搜索功能，支持历史记录、建议提示、实时搜索
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Domain Logic
 * [7] UI Components & Rendering
 * [8] Exports
 */
// #endregion

// #region 2. Imports
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Keyboard,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Zustand状态管理
import { useUserStore } from '../../../../../stores';

// 共享组件
import { ErrorBoundary, LoadingOverlay } from '../../../../components';

// 搜索结果页面
import SearchResultsPage from '../SearchResultsPage';

// 类型和常量
import type { HotSearchItem, SearchCategory, SearchHistoryItem, SearchMainPageProps, SearchResults, SearchSuggestion, SearchViewState } from './types';
// #endregion

// #region 3. Types & Schema
interface LocalSearchState {
  query: string;
  viewState: SearchViewState;
  activeCategory: SearchCategory;
  loading: boolean;
  error: string | null;
}
// #endregion

// #region 4. Constants & Config
const COLORS = {
  BACKGROUND: '#FFFFFF',
  PRIMARY: '#6366F1',
  TEXT: '#1F2937',
  TEXT_SECONDARY: '#6B7280',
  TEXT_LIGHT: '#9CA3AF',
  BORDER: '#E5E7EB',
  SURFACE: '#F8FAFC',
};

const DEBOUNCE_DELAY = 300;
const MAX_HISTORY_ITEMS = 10;
// #endregion

// #region 5. Utils & Helpers
/**
 * 防抖函数
 */
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
};
// #endregion

// #region 6. State Management
/**
 * 搜索页面状态管理Hook
 */
const useSearchState = (initialQuery?: string) => {
  const { searchUsers, addSearchHistory, search: searchStore } = useUserStore();
  
  const [localState, setLocalState] = useState<LocalSearchState>({
    query: initialQuery || '',
    viewState: 'empty',
    activeCategory: 'all',
    loading: false,
    error: null,
  });
  
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [hotSearches] = useState<HotSearchItem[]>([
    { id: '1', query: '王者荣耀', rank: 1, trend: 'up', category: 'game' },
    { id: '2', query: '英雄联盟', rank: 2, trend: 'stable', category: 'game' },
    { id: '3', query: '探店', rank: 3, trend: 'up', category: 'lifestyle' },
    { id: '4', query: 'K歌', rank: 4, trend: 'down', category: 'lifestyle' },
  ]);
  
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [results, setResults] = useState<SearchResults>({
    users: { data: [], totalCount: 0, hasMore: false },
    services: { data: [], totalCount: 0, hasMore: false },
    content: { data: [], totalCount: 0, hasMore: false },
    totalResults: 0,
  });
  
  const debouncedQuery = useDebounce(localState.query, DEBOUNCE_DELAY);
  
  return {
    localState,
    setLocalState,
    searchHistory,
    setSearchHistory,
    hotSearches,
    suggestions,
    setSuggestions,
    results,
    setResults,
    debouncedQuery,
    searchStore,
    searchUsers,
    addSearchHistory,
  };
};
// #endregion

// #region 7. Domain Logic
/**
 * 搜索业务逻辑Hook
 */
const useSearchLogic = (initialQuery?: string) => {
  const router = useRouter();
  const state = useSearchState(initialQuery);
  
  /**
   * 执行搜索
   */
  const executeSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    Keyboard.dismiss();
    state.setLocalState(prev => ({ ...prev, loading: true, viewState: 'loading' }));
    
    try {
      await state.searchUsers(query);
      
      // 添加到历史
      state.addSearchHistory(query);
      
      state.setLocalState(prev => ({ ...prev, loading: false, viewState: 'results' }));
    } catch (error) {
      state.setLocalState(prev => ({
        ...prev,
        loading: false,
        viewState: 'error',
        error: error instanceof Error ? error.message : '搜索失败'
      }));
    }
  }, [state]);
  
  /**
   * 搜索输入变化
   */
  const handleQueryChange = useCallback((text: string) => {
    state.setLocalState(prev => ({
      ...prev,
      query: text,
      viewState: text ? 'suggestions' : 'empty'
    }));
  }, [state]);
  
  /**
   * 选择搜索建议
   */
  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
    state.setLocalState(prev => ({ ...prev, query: suggestion.text }));
    executeSearch(suggestion.text);
  }, [state, executeSearch]);
  
  /**
   * 选择历史记录
   */
  const handleHistorySelect = useCallback((query: string) => {
    state.setLocalState(prev => ({ ...prev, query }));
    executeSearch(query);
  }, [state, executeSearch]);
  
  /**
   * 删除历史记录
   */
  const handleHistoryDelete = useCallback((id: string) => {
    state.setSearchHistory(prev => prev.filter(item => item.id !== id));
  }, [state]);
  
  /**
   * 清空所有历史
   */
  const handleClearHistory = useCallback(() => {
    state.setSearchHistory([]);
  }, [state]);
  
  /**
   * 返回
   */
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  
  /**
   * 点击搜索结果
   */
  const handleResultPress = useCallback((resultId: string, resultType: string) => {
    if (resultType === 'user') {
      router.push({ pathname: '/modal/user-detail' as any, params: { userId: resultId } });
    }
  }, [router]);
  
  return {
    ...state,
    executeSearch,
    handleQueryChange,
    handleSuggestionSelect,
    handleHistorySelect,
    handleHistoryDelete,
    handleClearHistory,
    handleBack,
    handleResultPress,
  };
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * 搜索导航区域
 */
const SearchNavigationArea: React.FC<{
  query: string;
  onQueryChange: (text: string) => void;
  onSearchSubmit: () => void;
  onBack: () => void;
}> = ({ query, onQueryChange, onSearchSubmit, onBack }) => (
  <View style={styles.navigationArea}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Text style={styles.backButtonText}>←</Text>
    </TouchableOpacity>
    
    <View style={styles.searchInputContainer}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInput}
        value={query}
        onChangeText={onQueryChange}
        onSubmitEditing={onSearchSubmit}
        placeholder="搜索用户、服务或内容"
        placeholderTextColor={COLORS.TEXT_LIGHT}
        autoFocus
        returnKeyType="search"
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={() => onQueryChange('')}>
          <Text style={styles.clearButton}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

/**
 * 搜索历史区域
 */
const SearchHistoryArea: React.FC<{
  historyItems: SearchHistoryItem[];
  onHistorySelect: (query: string) => void;
  onHistoryDelete: (id: string) => void;
  onClearAll: () => void;
}> = ({ historyItems, onHistorySelect, onHistoryDelete, onClearAll }) => {
  if (historyItems.length === 0) return null;
  
  return (
    <View style={styles.historyArea}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>搜索历史</Text>
        <TouchableOpacity onPress={onClearAll}>
          <Text style={styles.clearAllText}>清空</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.historyTags}>
        {historyItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.historyTag}
            onPress={() => onHistorySelect(item.query)}
            onLongPress={() => onHistoryDelete(item.id)}
          >
            <Text style={styles.historyTagText}>{item.query}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

/**
 * 热门搜索区域
 */
const HotSearchArea: React.FC<{
  hotSearches: HotSearchItem[];
  onHotSearchSelect: (query: string) => void;
}> = ({ hotSearches, onHotSearchSelect }) => (
  <View style={styles.hotSearchArea}>
    <Text style={styles.hotSearchTitle}>热门搜索</Text>
    <View style={styles.hotSearchTags}>
      {hotSearches.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.hotSearchTag}
          onPress={() => onHotSearchSelect(item.query)}
        >
          <Text style={styles.hotSearchText}>{item.query}</Text>
          {item.trend === 'up' && <Text style={styles.trendIcon}>🔥</Text>}
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

/**
 * SearchMainPage 主组件
 */
const SearchMainPage: React.FC<SearchMainPageProps> = (props) => {
  const logic = useSearchLogic(props.initialQuery);
  
  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.BACKGROUND} />
        {/* 结果状态 - 使用新的搜索结果页面（包含自己的搜索栏） */}
        {logic.localState.viewState === 'results' ? (
          <SearchResultsPage 
            query={logic.localState.query}
            onBack={logic.handleBack}
            onQueryChange={logic.handleQueryChange}
            onSearchSubmit={() => logic.executeSearch(logic.localState.query)}
          />
        ) : (
          <>
            {/* 搜索导航 - 仅在非结果状态显示 */}
            <SearchNavigationArea
              query={logic.localState.query}
              onQueryChange={logic.handleQueryChange}
              onSearchSubmit={() => logic.executeSearch(logic.localState.query)}
              onBack={logic.handleBack}
            />
            
            {/* 空状态 - 显示历史和热门 */}
            {logic.localState.viewState === 'empty' && (
              <View style={styles.emptyStateContent}>
                <SearchHistoryArea
                  historyItems={logic.searchHistory}
                  onHistorySelect={logic.handleHistorySelect}
                  onHistoryDelete={logic.handleHistoryDelete}
                  onClearAll={logic.handleClearHistory}
                />
                
                <HotSearchArea
                  hotSearches={logic.hotSearches}
                  onHotSearchSelect={logic.handleHistorySelect}
                />
              </View>
            )}
            
            {/* 建议状态 */}
            {logic.localState.viewState === 'suggestions' && (
              <View style={styles.suggestionsContent}>
                <Text style={styles.placeholderText}>
                  搜索建议功能开发中...
                </Text>
              </View>
            )}
          </>
        )}
        
        {/* 加载状态 */}
        {logic.localState.loading && (
          <LoadingOverlay loading={logic.localState.loading} text="搜索中..." />
        )}
      </SafeAreaView>
    </ErrorBoundary>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  
  // 导航区域
  navigationArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.TEXT,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.TEXT,
    padding: 0,
  },
  clearButton: {
    fontSize: 16,
    color: COLORS.TEXT_LIGHT,
    padding: 4,
  },
  
  // 空状态内容
  emptyStateContent: {
    flex: 1,
    padding: 16,
  },
  
  // 历史区域
  historyArea: {
    marginBottom: 24,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  clearAllText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  historyTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  historyTag: {
    backgroundColor: COLORS.SURFACE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  historyTagText: {
    fontSize: 14,
    color: COLORS.TEXT,
  },
  
  // 热门搜索区域
  hotSearchArea: {
    marginBottom: 24,
  },
  hotSearchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 12,
  },
  hotSearchTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hotSearchTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  hotSearchText: {
    fontSize: 14,
    color: COLORS.TEXT,
  },
  trendIcon: {
    fontSize: 12,
    marginLeft: 4,
  },
  
  // 建议内容
  suggestionsContent: {
    flex: 1,
    padding: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    paddingTop: 40,
  },
});

export default SearchMainPage;
export type { SearchMainPageProps };
// #endregion
