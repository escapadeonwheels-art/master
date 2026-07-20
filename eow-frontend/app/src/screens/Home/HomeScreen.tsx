import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
//import { Package, Airplane } from 'phosphor-react-native';
import AppHeader from '../../components/headers/AppHeader';
import SearchBar from '../../components/ui/SearchBar';
import ServiceOptionCard from '../../components/cards/ServiceOptionCard';
import FeaturedCard from '../../components/cards/FeaturedCard';
import BookingModal from '../../components/ui/BookingModal';
import AdsBanner from '../../components/ui/AdsBanner';
import FadeInView from '../../components/animations/FadeInView';
import { mockServices } from '../../mock/data';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

const { width } = Dimensions.get('window');
const userName = 'Guest';


export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [serviceType, setServiceType] = useState<'delivery' | 'travel'>('travel');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Booking Modal State
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bookingError, setBookingError] = useState('');
  const [bookingDetails, setBookingDetails] = useState({
    confirmationNumber: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 0,
    totalPrice: '',
  });

  const filteredServices = mockServices.filter(s => s.type === serviceType)
    .filter(s => 
      searchQuery === '' || 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  const featuredServices = filteredServices.filter(s => s.featured);

  // Booking Handlers
  const handleBookNow = () => {
    setBookingStatus('loading');
    setBookingModalVisible(true);

    // Simulate API call
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% success rate for demo

      if (isSuccess) {
        setBookingStatus('success');
        setBookingDetails({
          confirmationNumber: `AIRBNB-${Date.now().toString().slice(-6)}`,
          checkInDate: new Date(Date.now() + 86400000).toLocaleDateString(),
          checkOutDate: new Date(Date.now() + 604800000).toLocaleDateString(),
          guests: 2,
          totalPrice: '$450.00',
        });
      } else {
        setBookingStatus('error');
        setBookingError('Payment verification failed. Please try another payment method.');
      }
    }, 2000);
  };

  const handleCloseBookingModal = () => {
    setBookingModalVisible(false);
    setBookingStatus('idle');
    setBookingError('');
  };

  const handleRetryBooking = () => {
    handleBookNow();
  };

  const handleViewBooking = () => {
    handleCloseBookingModal();
    // Navigate to bookings screen
    navigation.navigate('Bookings' as never);
  };

  const handleServiceCardPress = (service: any) => {
    // Navigate to correct details screen based on service type
    if (service.type === 'delivery') {
      (navigation as any).navigate('DeliveryDetails', { service });
    } else {
      (navigation as any).navigate('BookingDetails', { service });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <AppHeader notificationCount={3} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      >
        {/* 2️⃣ Greeting Section (Personal Context) */}
        <FadeInView delay={100} duration={700}>
          <View style={styles.heroSection}>
            <Text style={styles.heroHeading}>Hi, {userName}</Text>
            <Text style={styles.heroSubtext}>Where do you want to go?</Text>
          </View>
        </FadeInView>

        {/* 3️⃣ Primary Action: Search */}
        <FadeInView delay={300} duration={600}>
          <View style={styles.searchSection}>
            <SearchBar 
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search what you want…"
              onClear={() => setSearchQuery('')}
            />
            {searchQuery !== '' && (
              <Text style={styles.searchResultsIndicator}>
                Search Results ({filteredServices.length})
              </Text>
            )}
          </View>
        </FadeInView>

        

        {/* 5️⃣ Ads / Deals Banner (High Visibility, Low Friction) - Hidden during search */}
        {searchQuery === '' && (
          <FadeInView delay={600} duration={600}>
            <AdsBanner onPress={handleBookNow} />
          </FadeInView>
        )}

        {/* Search Results Section - Show when active */}
        {searchQuery !== '' && (
          <FadeInView delay={650} duration={500}>
            <View style={styles.section}>
              <View style={styles.resultHeader}>
                <Text style={styles.sectionTitle}>Search Results</Text>
                <View style={styles.resultBadge}>
                  <Text style={styles.resultCount}>{filteredServices.length} found</Text>
                </View>
              </View>
              {filteredServices.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalScroll}
                  scrollEventThrottle={16}
                >
                  {filteredServices.map((service, index) => (
                    <FadeInView key={service.id} delay={700 + index * 50} duration={400}>
                      <FeaturedCard
                        service={service}
                        onPress={() => handleServiceCardPress(service)}
                        onBookNow={() => handleServiceCardPress(service)}
                        showBookButton={true}
                        ctaLabel={serviceType === 'delivery' ? 'Deliver Now' : 'Book Now'}
                      />
                    </FadeInView>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No results found</Text>
                </View>
              )}
            </View>
          </FadeInView>
        )}

        {/* 6️⃣ Featured Deals (Primary Content) - Hidden during search */}
        {searchQuery === '' && (
          <FadeInView delay={700} duration={600}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Featured {serviceType === 'delivery' ? 'Deals' : 'Destinations'}
                </Text>
                <Text style={styles.seeAllLink}>See all</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
                scrollEventThrottle={16}
              >
                {featuredServices.map((service, index) => (
                  <FadeInView key={service.id} delay={750 + index * 80} duration={500}>
                    <FeaturedCard
                      service={service}
                      onPress={() => handleServiceCardPress(service)}
                      onBookNow={() => handleServiceCardPress(service)}
                      showBookButton={true}
                      ctaLabel={serviceType === 'delivery' ? 'Deliver Now' : 'Book Now'}
                    />
                  </FadeInView>
                ))}
              </ScrollView>
            </View>
          </FadeInView>
        )}
        
        {/* 7️⃣ Popular Near You (Secondary Content) - Hidden during search 
        {searchQuery === '' && (
          <FadeInView delay={850} duration={600}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular near you</Text>
                <Text style={styles.seeAllLink}>See all</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
                scrollEventThrottle={16}
              >
                {filteredServices.slice(0, 10).map((service, index) => (
                  <FadeInView key={service.id} delay={900 + index * 80} duration={500}>
                    <FeaturedCard
                      service={service}
                      onPress={() => handleServiceCardPress(service)}
                      onBookNow={() => handleServiceCardPress(service)}
                      showBookButton={true}
                      ctaLabel={serviceType === 'travel' ? 'Book Now' : ''}
                    />
                  </FadeInView>
                ))}
              </ScrollView>
            </View>
          </FadeInView>
        )}
        */}
        
        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Booking Modal */}
      <BookingModal
        visible={bookingModalVisible}
        status={bookingStatus}
        title={
          bookingStatus === 'success'
            ? 'Booking Confirmed!'
            : bookingStatus === 'error'
            ? 'Booking Failed'
            : 'Processing Booking'
        }
        message={
          bookingStatus === 'loading'
            ? 'Please wait while we confirm your booking...'
            : bookingStatus === 'success'
            ? 'Your booking has been successfully completed.'
            : 'Check your details and try again.'
        }
        errorMessage={bookingError}
        bookingDetails={bookingStatus === 'success' ? bookingDetails : undefined}
        onClose={handleCloseBookingModal}
        onConfirm={handleViewBooking}
        onRetry={handleRetryBooking}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  /* Hero Section - Premium Welcome */
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

  /* Search Section */
  searchSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },

  serviceSelectionSection: {
    paddingHorizontal: 0,
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
  },

  searchResultsIndicator: {
    ...typography.small,
    color: colors.gray,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },

  /* Section Base */
  section: {
    marginBottom: spacing.xxl,
  },
  
  sectionTitleContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },

  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    ...typography.h2,
    color: colors.dark,
    marginBottom: spacing.xs,
    lineHeight: 32,
  },

  sectionDescription: {
    ...typography.small,
    color: colors.gray,
    marginTop: spacing.xs,
    lineHeight: 20,
  },

  sectionSubtitle: {
    ...typography.body,
    color: colors.gray,
    marginTop: spacing.xs,
    lineHeight: 24,
  },

  resultCount: {
    ...typography.smallBold,
    color: colors.primary,
    lineHeight: 20,
  },

  resultBadge: {
    backgroundColor: colors.primary + '15',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.lg,
  },

  seeAllLink: {
    ...typography.bodyBold,
    color: colors.primary,
    lineHeight: 24,
  },

  /* Service Cards */
  serviceCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    justifyContent: 'space-between',
  },

  /* Horizontal Scrolling List */
  horizontalScroll: {
    paddingHorizontal: spacing.lg,
    paddingRight: spacing.lg,
    gap: spacing.md,
  },

  /* Empty State */
  emptyState: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },

  emptyStateText: {
    ...typography.body,
    color: colors.gray,
    lineHeight: 24,
  },
});
