import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { CalendarBlank, Package, Airplane } from 'phosphor-react-native';
import BookingCard from '../../components/cards/BookingCard';
import EmptyState from '../../components/cards/EmptyState';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface Booking {
  id: string;
  title: string;
  location: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'past';
  image: string;
  price: number;
  type: 'delivery' | 'travel';
}

const mockBookings: Booking[] = [
  {
    id: '1',
    title: 'Beachfront Villa',
    location: 'Bali, Indonesia',
    date: 'Dec 20 - Dec 27',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2',
    price: 840,
    type: 'travel',
  },
  {
    id: '2',
    title: 'Fresh Groceries Delivery',
    location: 'Downtown, 2.5 km',
    date: 'Today, 3:00 PM',
    status: 'ongoing',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
    price: 15,
    type: 'delivery',
  },
  {
    id: '3',
    title: 'Mountain Cabin Retreat',
    location: 'Aspen, Colorado',
    date: 'Jan 10 - Jan 17',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    price: 1400,
    type: 'travel',
  },
  {
    id: '4',
    title: 'Restaurant Food Delivery',
    location: 'Midtown, 1.2 km',
    date: 'Yesterday, 7:00 PM',
    status: 'past',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    price: 25,
    type: 'delivery',
  },
  {
    id: '5',
    title: 'City Loft Apartment',
    location: 'New York, USA',
    date: 'Feb 5 - Feb 12',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    price: 1260,
    type: 'travel',
  },
];

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'past'>('upcoming');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'delivery' | 'travel'>('all');

  const filteredBookings = mockBookings.filter(b => {
    const statusMatch = b.status === activeTab;
    const categoryMatch = categoryFilter === 'all' || b.type === categoryFilter;
    return statusMatch && categoryMatch;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>{mockBookings.length} bookings</Text>
      </View>

      {/* Status Tabs */}
      <View style={styles.tabsContainer}>
        {(['upcoming', 'ongoing', 'past'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[styles.categoryButton, categoryFilter === 'all' && styles.categoryButtonActive]}
          onPress={() => setCategoryFilter('all')}
        >
          <Text style={[styles.categoryText, categoryFilter === 'all' && styles.categoryTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryButton, categoryFilter === 'delivery' && styles.categoryButtonActive]}
          onPress={() => setCategoryFilter('delivery')}
        >
          <Package
            size={16}
            color={categoryFilter === 'delivery' ? colors.background : colors.gray}
            weight="bold"
          />
          <Text style={[styles.categoryText, categoryFilter === 'delivery' && styles.categoryTextActive]}>
            Delivery
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryButton, categoryFilter === 'travel' && styles.categoryButtonActive]}
          onPress={() => setCategoryFilter('travel')}
        >
          <Airplane
            size={16}
            color={categoryFilter === 'travel' ? colors.background : colors.gray}
            weight="bold"
          />
          <Text style={[styles.categoryText, categoryFilter === 'travel' && styles.categoryTextActive]}>
            Travel
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {filteredBookings.length > 0 ? (
          <FlashList
            data={filteredBookings}
            renderItem={({ item }) => <BookingCard {...item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom }]}
          />
        ) : (
          <EmptyState
            icon={<CalendarBlank size={80} color={colors.gray} />}
            title={`No ${activeTab} bookings`}
            description={`You don't have any ${activeTab} bookings at the moment. Start exploring to book your next experience!`}
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
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  title: {
    ...typography.h1,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.background,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.backgroundGray,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...typography.small,
    color: colors.gray,
  },
  tabTextActive: {
    color: colors.background,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundGray,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    ...typography.small,
    color: colors.gray,
  },
  categoryTextActive: {
    color: colors.background,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
  },
});
