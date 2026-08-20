import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../../components/ui/SearchBar';
import FilterChip from '../../components/ui/FilterChip';
import ServiceCard from '../../components/cards/ServiceCard';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import FadeInView from '../../components/animations/FadeInView';
import { typography } from '../../constants/typography';
import AppHeader from '../../components/headers/AppHeader';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { fetchArticles, Service, categories } from '../../mock/data';

const userName = 'Guest';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // OPTIMIZATION 1: Use standard useEffect instead of useFocusEffect
  // This fetches data exactly ONCE when app mounts, preventing API spam on back-navigation
  useEffect(() => {
    let isMounted = true;
    
    const loadInitialData = async () => {
      setIsLoading(true);
      const freshData = await fetchArticles();
      if (isMounted && freshData) {
        setServices(freshData);
      }
      setIsLoading(false);
    };

    loadInitialData();
    return () => { isMounted = false; };
  }, []);

  // OPTIMIZATION 2: Cache calculations with useMemo
  // Prevents calculations from running on unrelated UI changes (like typing in inputs)
  const filteredServices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    
    return services.filter(service => {
      const matchesSearch = query === '' || 
        service.title?.toLowerCase().includes(query) || 
        service.location?.toLowerCase().includes(query);
        
      if (!matchesSearch) return false;
      if (selectedCategory === '1') return true;

      const sub = service.subtype?.toLowerCase() || '';
      const isTravel = service.type === 'travel';

      return isTravel && (
        (selectedCategory === '2' && sub.includes('beaches')) ||
        (selectedCategory === '3' && sub.includes('mountains')) ||
        (selectedCategory === '4' && sub.includes('cruises')) ||
        (selectedCategory === '5' && sub.includes('trekking')) ||
        (selectedCategory === '6' && sub.includes('wildlife'))
      );
    });
  }, [services, searchQuery, selectedCategory]);

  // OPTIMIZATION 3: Memoize list items for FlashList stability
  const renderItem = useCallback(({ item }: { item: Service }) => (
    <ServiceCard 
      service={item} 
      onPress={() => navigation.navigate('BookingDetails' as never, { service: item } as never)} 
    />
  ), [navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <AppHeader notificationCount={0} />

      <View style={styles.header}>
        <View style={styles.titleRow}>
          <FadeInView delay={100} duration={700}>
            <View style={styles.heroSection}>
              <Text style={styles.heroHeading}>Hi, {userName}</Text>
            </View>
          </FadeInView>
        </View>
        <SearchBar 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
          placeholder="Where do you want to go ?" 
          onClear={() => setSearchQuery('')} 
        />
      </View>

      {/* OPTIMIZATION 4: Restored missing Filter Section */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
          {categories.map(category => (
            <FilterChip 
              key={category.id} 
              label={category.name} 
              isSelected={selectedCategory === category.id} 
              onPress={() => setSelectedCategory(category.id)} 
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        {isLoading && services.length === 0 ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.emptyText, { marginTop: spacing.md }]}>Syncing latest locations...</Text>
          </View>
        ) : filteredServices.length > 0 ? (
          <FlashList 
            data={filteredServices} 
            renderItem={renderItem} 
            estimatedItemSize={280} 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom }]} 
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptyText}>Try adjusting your search or filters</Text>
          </View>
        )}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  header: {
    padding: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.dark,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 2,
  },
  heroSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
  },
  heroHeading: {
    ...typography.h1,
    color: colors.dark,
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
    lineHeight: 44,
  },
  heroSubtext: {
    ...typography.body,
    color: colors.gray,
    lineHeight: 26,
    marginBottom: 0,
  },
  filterSection: {
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  filterList: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundGray,
  },
  mapIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  mapText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  mapSubtext: {
    fontSize: 14,
    color: colors.gray,
  },
});
