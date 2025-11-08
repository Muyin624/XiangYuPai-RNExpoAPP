/**
 * LocationSelectorModal - 地点选择器Modal
 * 
 * 功能：
 * - 地图显示
 * - 搜索地点
 * - 附近地点列表
 * - 选择地点
 */

import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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
  MAP_BACKGROUND: '#E8E8E8',
} as const;

// 位置类型
export interface LocationData {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number; // 距离（米）
}

interface LocationSelectorModalProps {
  visible: boolean;
  onSelect: (location: LocationData) => void;
  onClose: () => void;
}

// 模拟附近地点数据
const MOCK_LOCATIONS: LocationData[] = [
  {
    id: '1',
    name: '深圳市南山区',
    address: '广东省深圳市南山区',
    latitude: 22.5329,
    longitude: 113.9344,
    distance: 100,
  },
  {
    id: '2',
    name: '科技园',
    address: '深圳市南山区科技园',
    latitude: 22.5428,
    longitude: 113.9501,
    distance: 500,
  },
  {
    id: '3',
    name: '深圳湾公园',
    address: '深圳市南山区滨海大道',
    latitude: 22.5186,
    longitude: 113.9397,
    distance: 1200,
  },
  {
    id: '4',
    name: '海岸城',
    address: '深圳市南山区文心五路',
    latitude: 22.5189,
    longitude: 113.9324,
    distance: 1500,
  },
  {
    id: '5',
    name: '欢乐海岸',
    address: '深圳市南山区白石路东',
    latitude: 22.5234,
    longitude: 113.9456,
    distance: 2000,
  },
];

export default function LocationSelectorModal({
  visible,
  onSelect,
  onClose,
}: LocationSelectorModalProps) {
  const [searchText, setSearchText] = useState('');
  const [locations, setLocations] = useState<LocationData[]>(MOCK_LOCATIONS);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  // 请求位置权限
  useEffect(() => {
    if (visible) {
      requestLocationPermission();
    }
  }, [visible]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        getCurrentLocation();
      }
    } catch (error) {
      console.error('请求位置权限失败:', error);
    }
  };

  // 获取当前位置
  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      // TODO: 调用逆地理编码API获取地址信息
      const current: LocationData = {
        id: 'current',
        name: '当前位置',
        address: '正在获取地址...',
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setCurrentLocation(current);
      
      // TODO: 调用附近地点API
      // 这里使用模拟数据
      setLocations(MOCK_LOCATIONS);
    } catch (error) {
      console.error('获取位置失败:', error);
      Alert.alert('提示', '获取位置失败，请检查定位权限');
    } finally {
      setLoading(false);
    }
  };

  // 搜索地点
  const handleSearch = async (text: string) => {
    setSearchText(text);
    
    if (!text.trim()) {
      setLocations(MOCK_LOCATIONS);
      return;
    }

    setLoading(true);
    try {
      // TODO: 调用地点搜索API
      await new Promise(resolve => setTimeout(resolve, 300));
      const filtered = MOCK_LOCATIONS.filter(loc => 
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
    onSelect(location);
  };

  // 格式化距离
  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    if (distance < 1000) {
      return `${distance}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  // 渲染地点项
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
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>取消</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>选择地点</Text>
          <View style={styles.placeholder} />
        </View>

        {/* 搜索框 */}
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

        {/* 地图预览区域 */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>🗺️</Text>
            <Text style={styles.mapPlaceholderSubtext}>地图加载中...</Text>
          </View>
          
          {/* 重新定位按钮 */}
          <TouchableOpacity
            style={styles.relocateButton}
            onPress={getCurrentLocation}
          >
            <Text style={styles.relocateIcon}>⊕</Text>
          </TouchableOpacity>
        </View>

        {/* 当前位置 */}
        {currentLocation && (
          <View style={styles.currentLocationSection}>
            <TouchableOpacity
              style={styles.currentLocationItem}
              onPress={() => handleSelectLocation(currentLocation)}
            >
              <View style={styles.currentLocationIcon}>
                <Text style={styles.currentLocationIconText}>📍</Text>
              </View>
              <View style={styles.currentLocationContent}>
                <Text style={styles.currentLocationName}>
                  {currentLocation.name}
                </Text>
                <Text style={styles.currentLocationAddress}>
                  {currentLocation.address}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* 附近地点列表 */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>附近地点</Text>
          
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
  mapContainer: {
    height: 200,
    backgroundColor: COLORS.MAP_BACKGROUND,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 48,
    marginBottom: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  relocateButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  relocateIcon: {
    fontSize: 24,
    color: COLORS.TEXT_PRIMARY,
  },
  currentLocationSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.BORDER,
  },
  currentLocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLocationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  currentLocationIconText: {
    fontSize: 20,
  },
  currentLocationContent: {
    flex: 1,
  },
  currentLocationName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  currentLocationAddress: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
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
});

