import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store'; 
import SearchBar from '../../components/ui/SearchBar';
import ServiceCard from '../../components/cards/ServiceCard';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import FadeInView from '../../components/animations/FadeInView';
import { typography } from '../../constants/typography';
import AppHeader from '../../components/headers/AppHeader';

import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchArticles, Service, STRAPI_URL, PAGINATION_LIMIT } from '../../mock/data';

interface CachedUser {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  username?: string;
}

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<CachedUser | null>(null);

  // INFINITE SCROLL STATE TRACKERS
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);

  // A mutable reference to store the timer id for debouncing keystrokes
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fires every single time the user navigates onto the Explore Tab
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const loadSessionProfile = async () => {
        try {
          let rawCache = null;
          if (Platform.OS === 'web') {
            rawCache = window.localStorage.getItem('userData');
          } else {
            rawCache = await SecureStore.getItemAsync('userData');
          }
          if (isMounted && rawCache) setUserData(JSON.parse(rawCache));
        } catch (e) {
          console.error('Failed parsing profile storage indicators within feed:', e);
        }
      };
      loadSessionProfile();
      return () => { isMounted = false; };
    }, [])
  );

  // ⚡ CORE FUNCTION: Loads data based on both page state and query parameters
  const loadData = useCallback(async (targetPage: number, currentQuery: string, shouldAppend: boolean) => {
    if (targetPage === 1) setIsLoading(true);
    else setIsMoreLoading(true);

    let url = `${STRAPI_URL}/api/articles?pagination[page]=${targetPage}&pagination[pageSize]=${PAGINATION_LIMIT}&populate[image][fields]=url`;
    
    // Add Strapi future-proofed field array logic dynamically
    const requestedFields = ['documentId', 'type', 'subtype', 'title', 'location', 'price', 'rating', 'reviews', 'description', 'featured'];
    const fieldsQuery = requestedFields.map((f, i) => `fields[${i}]=${f}`).join('&');
    url += `&${fieldsQuery}`;

    // ⚡ SERVER-SIDE SEARCH QUERY INJECTION: 
    // Looks across titles or locations using case-insensitive partial match ($containsi)
    if (currentQuery.trim() !== '') {
      const cleanQuery = encodeURIComponent(currentQuery.trim());
      url += `&filters[$or][0][title][$containsi]=${cleanQuery}&filters[$or][1][location][$containsi]=${cleanQuery}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network error');
      
      const json = await response.json();
      const rawData = json?.data || [];

      // Re-use your dynamic mapper loop
      const mappedData: Service[] = rawData.map((item: any) => {
        // ✅ FIX: Reliable object and array checks for Strapi v5 image structures
        let imageUrl = 'https://picsum.photos'; 
        
        if (item.image) {
          if (Array.isArray(item.image) && item.image[0]?.url) {
            imageUrl = item.image[0].url;
          } else if (item.image.url) {
            imageUrl = item.image.url;
          }
        }

        return {
          id: String(item.documentId || item.id),
          type: item.type,
          subtype: item.subtype || '',
          title: item.title,
          location: item.location,
          price: item.price,
          rating: Number(item.rating) || 0,
          reviews: Number(item.reviews) || 0,
          image: imageUrl, 
          host: 'x',
          description: item.description,
          featured: item.featured,
          content: [],
        };
      });

      setServices(prev => shouldAppend ? [...prev, ...mappedData] : mappedData);
      setPage(targetPage);
      setHasMorePages(mappedData.length === PAGINATION_LIMIT);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setIsMoreLoading(false);
    }
  }, []);

  // ✅ INITIAL PAGE MOUNT MOUNT LAYER
  useEffect(() => {
    loadData(1, '', false);
  }, [loadData]);

  // ✅ DEBOUNCED TRIGGER FOR LIVE TEXT TYPING
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);

    // Clear previous timer when user keeps typing fast
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    // Wait exactly 500ms after the user stops typing before making the network request
    debounceTimerRef.current = setTimeout(() => {
      loadData(1, text, false); // Reset feed layout back to page 1 for the new search parameter
    }, 500);
  };

  // ✅ CLEAN ACTION RESET FOR EXPLICIT BUTTON CLEARS
  const handleClearSearch = () => {
    setSearchQuery('');
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    loadData(1, '', false);
  };

  // ✅ INFINITE SCROLL TRIGGERS SEQUENTIALLY REGARDLESS OF GLOBAL FILTERS
  const handleLoadMore = useCallback(() => {
    if (isMoreLoading || !hasMorePages) return;
    loadData(page + 1, searchQuery, true); // Notice shouldAppend is true
  }, [page, hasMorePages, isMoreLoading, searchQuery, loadData]);

  const renderItem = useCallback(({ item }: { item: Service }) => (
    <ServiceCard 
      service={item} 
      onPress={() => (navigation.navigate as any)('BookingDetails', { service: item })} 
    />
  ), [navigation]);

  const renderFooter = useCallback(() => {
    if (!isMoreLoading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }, [isMoreLoading]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <AppHeader notificationCount={0} />

      <View style={styles.header}>
        <View style={styles.titleRow}>
          <FadeInView delay={100} duration={700}>
            <View style={styles.heroSection}>
              <Text style={styles.heroHeading}>Hi, {userData?.firstName || 'Guest'}</Text>
            </View>
          </FadeInView>
        </View>
        
        <SearchBar 
          value={searchQuery} 
          onChangeText={handleSearchChange} // Uses debounced hook layout
          placeholder="Where do you want to go ?" 
          onClear={handleClearSearch} 
        />
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.emptyText, { marginTop: spacing.md }]}>Searching databases...</Text>
          </View>
        ) : services.length > 0 ? (
          <FlashList 
            data={services} // Displays mapped data array directly
            renderItem={renderItem} 
            estimatedItemSize={280} 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom }]} 
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.8}
            drawDistance={300}
            ListFooterComponent={renderFooter}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptyText}>Try adjusting your search criteria</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundGray },
  header: { padding: spacing.md, gap: spacing.md, backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.lightGray },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: spacing.md },
  heroSection: { paddingLeft: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.lg, backgroundColor: colors.background },
  heroHeading: { ...typography.h1, color: colors.dark, letterSpacing: -0.5, lineHeight: 44 },
  
  // ✅ CRITICAL STYLE STRATEGY: Forces the wrapper to lock dimensions to the device screen bounds
  content: { flex: 1, minHeight: 1 }, 
  
  listContent: { padding: spacing.md },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.xl },
  emptyIcon: { fontSize: 64, marginBottom: spacing.md },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.dark, marginBottom: spacing.sm },
  emptyText: { fontSize: 16, color: colors.gray, textAlign: 'center' },
  footerLoader: { paddingVertical: spacing.md, alignItems: 'center', justifyContent: 'center' }

});
