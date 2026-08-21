import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // ✅ Added: useFocusEffect
import * as SecureStore from 'expo-secure-store'; 
import { User } from 'phosphor-react-native'; 
import SearchBar from '../../components/ui/SearchBar';
import FilterChip from '../../components/ui/FilterChip';
import ServiceCard from '../../components/cards/ServiceCard';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import FadeInView from '../../components/animations/FadeInView';
import { typography } from '../../constants/typography';
import AppHeader from '../../components/headers/AppHeader';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { fetchArticles, Service } from '../../mock/data';

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
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<CachedUser | null>(null);

  // ✅ THE FIX: Fires every single time the user navigates onto the Explore Tab
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
          
          if (isMounted) {
            if (rawCache) {
              setUserData(JSON.parse(rawCache));
            } else {
              setUserData(null); // Explicitly handles guest reset on logout
            }
          }
        } catch (e) {
          console.error('Failed parsing profile storage indicators within feed:', e);
        }
      };

      loadSessionProfile();
      return () => { isMounted = false; };
    }, [])
  );

  // Keep articles data loading separate as a standard one-time mount event
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

  const userInitials = useMemo(() => {
    if (!userData) return '';
    if (userData.firstName || userData.lastName) {
      const f = userData.firstName?.charAt(0) || '';
      const l = userData.lastName?.charAt(0) || '';
      return `${f}${l}`.toUpperCase();
    }
    return userData.username?.substring(0, 2).toUpperCase() || '';
  }, [userData]);

  const filteredServices = useMemo(() => {
      const query = searchQuery.trim().toLowerCase();
      
      return services.filter(service => {
        return query === '' || 
          service.title?.toLowerCase().includes(query) || 
          service.location?.toLowerCase().includes(query);
      });
  }, [services, searchQuery]);

  const renderItem = useCallback(({ item }: { item: Service }) => (
    <ServiceCard 
      service={item} 
      // ✅ FIX: Keep it wrapped inside a function execution block () =>
      onPress={() => (navigation.navigate as any)('BookingDetails', { service: item })} 
    />
  ), [navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <AppHeader notificationCount={0} />

      <View style={styles.header}>
        <View style={styles.titleRow}>
          <FadeInView delay={100} duration={700}>
            <View style={styles.heroSection}>
              <Text style={styles.heroHeading}>
                Hi, {userData?.firstName || 'Guest'}
              </Text>
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
  container: { flex: 1, backgroundColor: colors.backgroundGray },
  header: { padding: spacing.md, gap: spacing.md, backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.lightGray },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: spacing.md },
  title: { fontSize: 28, fontWeight: '700', color: colors.dark },
  subtitle: { fontSize: 14, color: colors.gray, marginTop: 2 },
  heroSection: { paddingLeft: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.lg, backgroundColor: colors.background },
  heroHeading: { ...typography.h1, color: colors.dark, letterSpacing: -0.5, lineHeight: 44 },
  topRightBadge: { width: 42, height: 42, borderRadius: 21, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.lightGray },
  avatarBadgeImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  initialsContainer: { width: '100%', height: '100%', backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  initialsText: { color: colors.background, fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
  fallbackIconContainer: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.lightGray },
  filterSection: { paddingVertical: spacing.md, backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.lightGray },
  filterList: { paddingHorizontal: spacing.md, gap: spacing.sm },
  content: { flex: 1 },
  listContent: { padding: spacing.md },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.xl },
  emptyIcon: { fontSize: 64, marginBottom: spacing.md },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.dark, marginBottom: spacing.sm },
  emptyText: { fontSize: 16, color: colors.gray, textAlign: 'center' },
});
