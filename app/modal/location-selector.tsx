/**
 * LocationSelectorModal - 地点选择器Modal
 * 
 * 功能：
 * - 搜索地点
 * - 筛选地点（最近、热门、A-Z）
 * - 选择地点
 */
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// 颜色常量
const COLORS = {
  PRIMARY: '#8A2BE2',
  BACKGROUND: '#FFFFFF',
  SEARCH_BACKGROUND: '#F5F5F5',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  TEXT_PLACEHOLDER: '#999999',
  BORDER: '#E5E5E5',
} as const;

// 位置类型
export interface LocationData {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number; // 距离（米?'
}

interface LocationSelectorModalProps {
  visible: boolean;
  onSelect: (location: LocationData) => void;
  onClose: () => void;
}

// 热门城市数据
const HOT_CITIES: LocationData[] = [
  {
    id: 'beijing',
    name: '北京',
    address: '北京市',
    latitude: 39.9042,
    longitude: 116.4074,
  },
  {
    id: 'shanghai',
    name: '上海',
    address: '上海市',
    latitude: 31.2304,
    longitude: 121.4737,
  },
  {
    id: 'guangzhou',
    name: '广州',
    address: '广东省广州市',
    latitude: 23.1291,
    longitude: 113.2644,
  },
  {
    id: 'shenzhen',
    name: '深圳',
    address: '广东省深圳市',
    latitude: 22.5429,
    longitude: 114.0579,
  },
  {
    id: 'hangzhou',
    name: '杭州',
    address: '浙江省杭州市',
    latitude: 30.2741,
    longitude: 120.1551,
  },
  {
    id: 'chengdu',
    name: '成都',
    address: '四川省成都市',
    latitude: 30.5728,
    longitude: 104.0668,
  },
  {
    id: 'wuhan',
    name: '武汉',
    address: '湖北省武汉市',
    latitude: 30.5928,
    longitude: 114.3055,
  },
  {
    id: 'xian',
    name: '西安',
    address: '陕西省西安市',
    latitude: 34.3416,
    longitude: 108.9398,
  },
  {
    id: 'nanjing',
    name: '南京',
    address: '江苏省南京市',
    latitude: 32.0603,
    longitude: 118.7969,
  },
  {
    id: 'tianjin',
    name: '天津',
    address: '天津市',
    latitude: 39.3434,
    longitude: 117.3616,
  },
  {
    id: 'chongqing',
    name: '重庆',
    address: '重庆市',
    latitude: 29.5630,
    longitude: 106.5516,
  },
  {
    id: 'suzhou',
    name: '苏州',
    address: '江苏省苏州市',
    latitude: 31.2989,
    longitude: 120.5853,
  },
];

type FilterType = 'recent' | 'hot' | 'az';

export default function LocationSelectorModal({
  visible,
  onSelect,
  onClose,
}: LocationSelectorModalProps) {
  const [searchText, setSearchText] = useState('');
  const [locations, setLocations] = useState<LocationData[]>(HOT_CITIES);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('hot');
  const [recentCities, setRecentCities] = useState<LocationData[]>([]);

  // 初始化时加载最近使用的城市
  useEffect(() => {
    if (visible) {
      // TODO: 从 AsyncStorage 或 Store 加载最近使用的城市
      setRecentCities([]);
      // 根据当前筛选器更新列表
      updateLocationList(activeFilter);
    }
  }, [visible]);

  // 更新位置列表根据筛选器
  const updateLocationList = (filter: FilterType) => {
    setLoading(true);
    setTimeout(() => {
      switch (filter) {
        case 'recent':
          setLocations(recentCities.length > 0 ? recentCities : HOT_CITIES);
          break;
        case 'hot':
          setLocations(HOT_CITIES);
          break;
        case 'az':
          const sortedCities = [...HOT_CITIES].sort((a, b) => 
            a.name.localeCompare(b.name, 'zh-CN')
          );
          setLocations(sortedCities);
          break;
        default:
          setLocations(HOT_CITIES);
      }
      setLoading(false);
    }, 150);
  };

  // 切换筛选器
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    if (!searchText) {
      updateLocationList(filter);
    }
  };

  // 搜索地点
  const handleSearch = async (text: string) => {
    setSearchText(text);
    
    if (!text.trim()) {
      // 清空搜索时，根据当前筛选器显示内容
      updateLocationList(activeFilter);
      return;
    }

    setLoading(true);
    try {
      // TODO: 调用地点搜索API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const filtered = HOT_CITIES.filter(loc => 
        loc.name.toLowerCase().includes(text.toLowerCase()) ||
        loc.address.toLowerCase().includes(text.toLowerCase())
      );
      setLocations(filtered);
    } catch (error) {
      console.error('搜索地点失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 选择地点
  const handleSelectLocation = (location: LocationData) => {
    // TODO: 保存到最近使用
    const updatedRecent = [location, ...recentCities.filter(c => c.id !== location.id)].slice(0, 10);
    setRecentCities(updatedRecent);
    // TODO: 持久化到 AsyncStorage
    
    onSelect(location);
  };

  // 格式化距?'
  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    if (distance < 1000) {
      return `${distance}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  // 渲染地点?'
  const renderLocationItem = ({ item }: { item: LocationData }) => {
    return (
      <TouchableOpacity
        style={styles.locationItem}
        onPress={() => handleSelectLocation(item)}
        activeOpacity={0.7}
      >
        <View style={styles.locationIcon}>
          <Text style={styles.locationIconText}>📍</Text>
        </View>
        
        <View style={styles.locationContent}>
          <Text style={styles.locationName}>{item.name}</Text>
          <Text style={styles.locationAddress} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
        
        {item.distance !== undefined && (
          <Text style={styles.locationDistance}>
            {formatDistance(item.distance)}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* 顶部导航 */}
        {/* Header hidden */}

        {/* 搜索?'*/}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="搜索地点"
              placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
              value={searchText}
              onChangeText={handleSearch}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Text style={styles.clearIcon}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>


        {/* 筛选标签 */}
        {!searchText.trim() && (
          <View style={styles.filterSection}>
            <TouchableOpacity
              style={[styles.filterTab, activeFilter === 'recent' && styles.filterTabActive]}
              onPress={() => handleFilterChange('recent')}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterTabText, activeFilter === 'recent' && styles.filterTabTextActive]}>
                最近
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, activeFilter === 'hot' && styles.filterTabActive]}
              onPress={() => handleFilterChange('hot')}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterTabText, activeFilter === 'hot' && styles.filterTabTextActive]}>
                热门
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, activeFilter === 'az' && styles.filterTabActive]}
              onPress={() => handleFilterChange('az')}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterTabText, activeFilter === 'az' && styles.filterTabTextActive]}>
                A-Z
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 地点列表 */}
        <View style={styles.listContainer}>
          {!searchText.trim() && locations.length === 0 && activeFilter === 'recent' && (
            <View style={styles.emptyRecentContainer}>
              <Text style={styles.emptyRecentText}>暂无最近使用的城市</Text>
              <Text style={styles.emptyRecentHint}>选择城市后会显示在这里</Text>
            </View>
          )}
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.PRIMARY} />
            </View>
          ) : (
            <FlatList
              data={locations}
              renderItem={renderLocationItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>暂无相关地点</Text>
                </View>
              }
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.BORDER,
  },
  cancelButton: {
    padding: 4,
  },
  cancelButtonText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  placeholder: {
    width: 48,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SEARCH_BACKGROUND,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    padding: 0,
  },
  clearIcon: {
    fontSize: 20,
    color: COLORS.TEXT_SECONDARY,
    paddingHorizontal: 4,
  },
  filterSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.BORDER,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.SEARCH_BACKGROUND,
  },
  filterTabActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  filterTabText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: COLORS.BACKGROUND,
  },
  emptyRecentContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyRecentText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  emptyRecentHint: {
    fontSize: 13,
    color: COLORS.TEXT_PLACEHOLDER,
  },
  listContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.BORDER,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.SEARCH_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationIconText: {
    fontSize: 20,
  },
  locationContent: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
  },
  locationDistance: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: 8,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
  },
  hotCitiesSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  hotCitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  hotCityItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.SEARCH_BACKGROUND,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    minWidth: 70,
    alignItems: 'center',
  },
  hotCityText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: '500',
  },
});

