import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../../components/ui/SearchBar';
import FilterChip from '../../components/ui/FilterChip';
import ViewToggle from '../../components/buttons/ViewToggle';
import ServiceCard from '../../components/cards/ServiceCard';
import MapScreen from '../MapScreen/MapScreen';
import { mockServices, categories } from '../../mock/data';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [view, setView] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('1');

  const filteredServices = mockServices.filter(service => {
    const matchesSearch = searchQuery === '' || 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === '1' || 
      (selectedCategory === '2' && service.type === 'travel' && service.subtype.toLowerCase().includes('beaches')) ||
      (selectedCategory === '3' && service.type === 'travel' && service.subtype.toLowerCase().includes('mountains')) ||
      (selectedCategory === '4' && service.type === 'travel' && service.subtype.toLowerCase().includes('cruises')) ||
      (selectedCategory === '5' && service.type === 'travel' && service.subtype.toLowerCase().includes('trekking')) ||
      (selectedCategory === '6' && service.type === 'travel' && service.subtype.toLowerCase().includes('wildlife'));
    
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Explore</Text>
            <Text style={styles.subtitle}>{filteredServices.length} places available</Text>
          </View>
          <ViewToggle view={view} onToggle={setView} />
        </View>
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search destinations..."
          onClear={() => setSearchQuery('')}
        />
      </View>

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
        {view === 'list' ? (
          filteredServices.length > 0 ? (
            <FlashList
              data={filteredServices}
              renderItem={({ item }) => (
                <ServiceCard
                  service={item}
                  onPress={() => navigation.navigate('Details' as never, { service: item } as never)}
                />
              )}
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
          )
        ) : (
          <MapScreen 
            onSelectLocation={(service) => navigation.navigate('Details' as never, { service } as never)}
          />
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
