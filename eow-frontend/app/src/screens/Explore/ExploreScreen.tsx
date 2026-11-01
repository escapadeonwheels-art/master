import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Platform, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Animated 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import Slider from '@react-native-community/slider';

import SearchBar from '../../components/ui/SearchBar';
import ServiceCard from '../../components/cards/ServiceCard';
import FadeInView from '../../components/animations/FadeInView';
import AppHeader from '../../components/headers/AppHeader';

import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

import { Service, fetchArticles } from '../../mock/data';

interface CachedUser {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  username?: string;
}

const DESTINATION_TYPES = [
  { id: 'beaches', label: 'Beaches' },
  { id: 'cruises', label: 'Cruises' },
  { id: 'mountains', label: 'Mountains' },
  { id: 'trekking', label: 'Trekking' },
  { id: 'wildlife', label: 'Wildlife' },
  { id: 'culture', label: 'Culture' },
  { id: 'nature', label: 'Nature' }
];

const BUDGET_PRESETS = [
  { label: 'Any Price', value: 2000000 },
  { label: 'Under ₹25K', value: 25000 },
  { label: 'Under ₹50K', value: 50000 },
  { label: 'Under ₹1L', value: 100000 },
  { label: 'Under ₹2.5L', value: 250000 },
  { label: 'Under ₹5L', value: 500000 },
];

const REGION_TYPES = [
  { id: 'all', label: 'All Regions' },
  { id: 'international', label: 'International' },
  { id: 'domestic', label: 'Domestic' },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<CachedUser | null>(null);

  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(2000000);
  
  const [maxDuration, setMaxDuration] = useState<number>(30);
  
  // Responsive layout measurements
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [sliderWidth, setSliderWidth] = useState<number>(windowWidth - spacing.md * 2);

  // 1. Monitor layout changes dynamically to recalculate width thresholds and grid parameters
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
      setSliderWidth(window.width - spacing.md * 2);
    });
    return () => subscription.remove();
  }, []);

  // Determine active dynamic column properties matching an Instagram-style grid approach
  const isLargeScreen = windowWidth >= 768;
  const numColumns = isLargeScreen ? (windowWidth >= 1200 ? 3 : 2) : 1;

  const filterAnimatedValue = useRef(new Animated.Value(1)).current; 
  const lastScrollY = useRef<number>(0); 
  const isFilterVisible = useRef<boolean>(true); 

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const loadSessionProfile = async () => {
        try {
          let rawCache = Platform.OS === 'web'
            ? window.localStorage.getItem('userData')
            : await SecureStore.getItemAsync('userData');
          if (isMounted && rawCache) setUserData(JSON.parse(rawCache));
        } catch (e) {
          console.error('Failed parsing profile storage indicators within feed:', e);
        }
      };
      loadSessionProfile();
      return () => { isMounted = false; };
    }, [])
  );

  const loadData = useCallback(async (targetPage: number, currentQuery: string, shouldAppend: boolean) => {
    if (targetPage === 1) setIsLoading(true);
    else setIsMoreLoading(true);

    try {
      const mappedData = await fetchArticles({
        page: targetPage,
        searchQuery: currentQuery,
        subtype: selectedType,
        maxPrice: maxPrice,
        region: selectedRegion,
        duration: maxDuration
      });

      setServices(prev => shouldAppend ? [...prev, ...mappedData] : mappedData);
      setPage(targetPage);
      setHasMorePages(mappedData.length > 0);
    } catch (e) {
      console.error("Explore Screen Fetch Error: ", e);
    } finally {
      setIsLoading(false);
      setIsMoreLoading(false);
    }
  }, [selectedType, maxPrice, maxDuration, selectedRegion]);

  useEffect(() => {
    loadData(1, searchQuery, false);
  }, [selectedType, maxPrice, maxDuration, selectedRegion]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => loadData(1, text, false), 500);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedRegion(null);
    setSelectedType(null);
    setMaxPrice(2000000);
    setMaxDuration(30);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    loadData(1, '', false);
  };

  const handleLoadMore = useCallback(() => {
    if (isMoreLoading || !hasMorePages) return;
    loadData(page + 1, searchQuery, true);
  }, [page, hasMorePages, isMoreLoading, searchQuery, loadData]);

  const renderItem = useCallback(({ item }: { item: Service }) => (
    <View style={isLargeScreen ? styles.gridCardWrapper : styles.singleCardWrapper}>
      <ServiceCard 
        service={item} 
        onPress={() => {

          console.log(`[CHECKPOINT 2 - EXPLORE LAYER] 
          🚀 Card Pressed: "${item.title}"
          🚀 Dispatched Slug Parameter: "${item.slug}"
        `);
          
          navigation.navigate('BookingDetails' as never, { 
            slug: item.slug
          } as never);
        }} 
      />
    </View>
  ), [navigation, isLargeScreen]);
  
  const getBubbleLeftPosition = () => {
    const minVal = 1;
    const maxVal = 30;
    const percentage = (maxDuration - minVal) / (maxVal - minVal);
    const thumbRadiusPadding = 12; 
    const bubbleWidthAllocation = 45; 
    
    return percentage * (sliderWidth - thumbRadiusPadding * 2) - bubbleWidthAllocation / 2 + thumbRadiusPadding;
  };

  const handleScroll = (event: any) => {
    const currentY = event.nativeEvent.contentOffset.y; 
    const deltaY = currentY - lastScrollY.current; 
    
    if (currentY <= 10) { 
      if (!isFilterVisible.current) { 
        isFilterVisible.current = true; 
        Animated.timing(filterAnimatedValue, { 
          toValue: 1, 
          duration: 250, 
          useNativeDriver: false, 
        }).start(); 
      }
      lastScrollY.current = currentY; 
      return; 
    }

    if (deltaY > 5 && isFilterVisible.current) { 
      isFilterVisible.current = false; 
      Animated.timing(filterAnimatedValue, { 
        toValue: 0, 
        duration: 200, 
        useNativeDriver: false, 
      }).start(); 
    } 
    else if (deltaY < -5 && !isFilterVisible.current) { 
      isFilterVisible.current = true; 
      Animated.timing(filterAnimatedValue, { 
        toValue: 1, 
        duration: 250, 
        useNativeDriver: false, 
      }).start(); 
    }

    lastScrollY.current = currentY; 
  };

  const filterHeight = filterAnimatedValue.interpolate({ 
    inputRange: [0, 1], 
    outputRange: [0, 310], 
  }); 

  const filterOpacity = filterAnimatedValue.interpolate({ 
    inputRange: [0, 0.5, 1], 
    outputRange: [0, 0, 1], 
  }); 

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <AppHeader notificationCount={0} />

      {/* Main Content Layout limits container expansion width on ultra-wide desktop monitors */}
      <View style={styles.mainLayoutLimiter}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <FadeInView delay={100} duration={700}>
              <Text style={styles.heroHeading}>Hi, {userData?.firstName || 'Guest'}</Text>
            </FadeInView>
          </View>
          
          <View style={styles.searchRowContainer}>
            <View style={{ flex: 1 }}>
              <SearchBar value={searchQuery} onChangeText={handleSearchChange} placeholder="Where to go?" onClear={handleClearSearch} />
            </View>
          </View>

          <Animated.View style={{ height: filterHeight, opacity: filterOpacity, overflow: 'hidden' }}>
            <View style={styles.filterSectionWrapper}>
              <Text style={styles.inlineSectionLabel}>Region</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScrollContainer}>
                <TouchableOpacity 
                  style={[styles.categoryChip, !selectedRegion && styles.activeCategoryChip]} 
                  onPress={() => setSelectedRegion(null)}
                >
                  <Text style={[styles.categoryChipText, !selectedRegion && styles.activeCategoryChipText]}>All Regions</Text>
                </TouchableOpacity>
                {REGION_TYPES.filter(r => r.id !== 'all').map((reg) => (
                  <TouchableOpacity 
                    key={reg.id} 
                    style={[styles.categoryChip, selectedRegion === reg.id && styles.activeCategoryChip]} 
                    onPress={() => setSelectedRegion(reg.id)}
                  >
                    <Text style={[styles.categoryChipText, selectedRegion === reg.id && styles.activeCategoryChipText]}>{reg.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.filterSectionWrapper}>
              <Text style={styles.inlineSectionLabel}>Destination Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScrollContainer}>
                <TouchableOpacity style={[styles.categoryChip, !selectedType && styles.activeCategoryChip]} onPress={() => setSelectedType(null)}>
                  <Text style={[styles.categoryChipText, !selectedType && styles.activeCategoryChipText]}>All Tours</Text>
                </TouchableOpacity>
                {DESTINATION_TYPES.map((cat) => (
                  <TouchableOpacity key={cat.id} style={[styles.categoryChip, selectedType === cat.id && styles.activeCategoryChip]} onPress={() => setSelectedType(cat.id)}>
                    <Text style={[styles.categoryChipText, selectedType === cat.id && styles.activeCategoryChipText]}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.filterSectionWrapper}>
              <Text style={styles.inlineSectionLabel}>Budget (INR/Person)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScrollContainer}>
                {BUDGET_PRESETS.map((preset) => (
                  <TouchableOpacity key={preset.value} style={[styles.presetChip, maxPrice === preset.value && styles.activePresetChip]} onPress={() => setMaxPrice(preset.value)}>
                    <Text style={[styles.presetChipText, maxPrice === preset.value && styles.activePresetChipText]}>{preset.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.filterSectionWrapper}>
              <Text style={styles.inlineSectionLabel}>Max Duration</Text>
              <View 
                style={styles.sliderInteractiveWrapper}
                onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
              >
                <View style={[styles.floatingBubbleContainer, { left: getBubbleLeftPosition() }]}>
                  <Text style={styles.floatingBubbleText} numberOfLines={1}>
                    {maxDuration === 30 ? 'Any' : `${maxDuration}d`}
                  </Text>
                </View>
                <Slider
                  style={styles.sliderElement}
                  minimumValue={1}
                  maximumValue={30}
                  step={1}
                  value={maxDuration}
                  onValueChange={setMaxDuration}
                  onSlidingComplete={(val) => {
                    loadData(1, searchQuery, false);
                  }}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor="#e0e0e0"
                  thumbTintColor={colors.primary}
                />
                <View style={styles.sliderAxisLabels}>
                  <Text style={styles.axisText}>1 Day</Text>
                  <Text style={styles.axisText}>30 Days</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>

        <View style={styles.content}>
          {isLoading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.emptyText, { marginTop: spacing.md }]}>Searching destinations...</Text>
            </View>
          ) : services.length > 0 ? (
            /* 3. Re-render FlashList dynamically mapping columns and keys explicitly to accommodate grid switches */
            <FlashList
              key={`columns-${numColumns}`}
              data={services}
              renderItem={renderItem}
              numColumns={numColumns}
              estimatedItemSize={isLargeScreen ? 340 : 280}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom }]}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.8}
              onScroll={handleScroll} 
              scrollEventThrottle={16}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No destination matches found.</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mainLayoutLimiter: { flex: 1, width: '100%', maxWidth: 1200, alignSelf: 'center' }, // Prevents infinite desktop stretching
  header: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm, backgroundColor: '#fff' },
  titleRow: { marginBottom: spacing.xs },
  heroHeading: { fontSize: 24, fontFamily: typography.bold, color: colors.text },
  searchRowContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  filterSectionWrapper: { marginTop: spacing.xs, marginBottom: 2 },
  inlineSectionLabel: { fontSize: 12, fontFamily: typography.bold, color: colors.gray || '#666', marginBottom: 4 },
  chipsScrollContainer: { paddingVertical: 4, alignItems: 'center' },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f0f0f0', marginRight: 8 },
  activeCategoryChip: { backgroundColor: colors.primary },
  categoryChipText: { fontSize: 13, fontFamily: typography.medium, color: colors.text },
  activeCategoryChipText: { color: '#fff' },
  presetChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f5f5f5', marginRight: 8, borderWidth: 1, borderColor: '#e0e0e0' },
  activePresetChip: { backgroundColor: colors.primary, borderColor: colors.primary },
  presetChipText: { fontSize: 13, color: colors.text },
  activePresetChipText: { color: '#fff', fontFamily: typography.bold },
  sliderInteractiveWrapper: { marginTop: 24, paddingHorizontal: 2, position: 'relative' },
  floatingBubbleContainer: {position: 'absolute',top: -24,width: 45,backgroundColor: colors.primary,borderRadius: 6,paddingVertical: 2,alignItems: 'center',justifyContent: 'center'},
  floatingBubbleText: {fontSize: 11,fontFamily: typography.bold,color: '#fff'},
  sliderElement: { width: '100%', height: 30, ...Platform.select({ web: { cursor: 'pointer' } }) },
  sliderAxisLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4, marginTop: -2 },
  axisText: { fontSize: 10, color: '#999', fontFamily: typography.regular },
  content: { flex: 1 },
  listContent: { paddingHorizontal: spacing.sm },
  singleCardWrapper: { paddingHorizontal: spacing.xs, width: '100%' },
  gridCardWrapper: { padding: spacing.xs, flex: 1 }, // Flex allocation creates neat multi-column layouts
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 14, color: colors.gray, fontFamily: typography.regular }
});
