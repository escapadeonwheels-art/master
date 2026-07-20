import { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Star, MapPin, ArrowLeft, Heart } from 'phosphor-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import Button from '../../components/ui/Button';
//import BookingModal from '../../components/ui/BookingModal';

const { width, height } = Dimensions.get('window');

interface BookingDetailsScreenProps {
  route?: any;
  navigation?: any;
}

export default function BookingDetailsScreen({ route, navigation }: BookingDetailsScreenProps) {
  const insets = useSafeAreaInsets();
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any>(null);

  const service = route?.params?.service || {
    title: 'Default Title',
    location: 'Default Location',
    price: 0,
    rating: 0,
    reviews: 0,
    image: '',
    host: 'Default',
    description: 'Default',
    type: 'travel',
    content: [],
  };

  const handleBookNow = () => {
    // Show booking form - does nothing, form is already visible
  };

  const handleConfirmBooking = () => {
    setBookingModalVisible(true);
  };

  const handleBookingConfirm = (data: any) => {
    setBookingModalVisible(false);
    setConfirmationData({
      confirmationNumber: `AIRBNB-${Date.now().toString().slice(-6)}`,
      checkInDate: data?.checkInDate || '2024-01-15',
      checkOutDate: data?.checkOutDate || '2024-01-20',
      guests: data?.guests || 2,
      totalPrice: data?.totalPrice || 1320,
      ...data,
    });
    setConfirmationVisible(true);
  };

  const handleCloseBookingModal = () => {
    setBookingModalVisible(false);
  };

  const handleRetryBooking = () => {
    handleConfirmBooking();
  };

  const handleViewBooking = () => {
    handleCloseBookingModal();
    navigation?.navigate('Bookings' as never);
  };

  //The Parser Function (Converts your specific JSON AST to clean HTML strings)
  const renderJsonToNative = (nodes: any[]) => {
  if (!Array.isArray(nodes)) return null;

  // Helper function to safely render inline text styling (Bold, Italic, Underline)
  const renderInlineText = (children: any[]) => {
    if (!Array.isArray(children)) return null;
    
    return children.map((child, idx) => {
      // Create a dynamic style object based on text attributes from Strapi
      const inlineStyle = [
        child.bold && { fontWeight: 'bold' as const },
        child.italic && { fontStyle: 'italic' as const },
        child.underline && { textDecorationLine: 'underline' as const }
      ].filter(Boolean); // Filter out false/undefined styles

      return (
        <Text key={idx} style={inlineStyle}>
          {child.text}
        </Text>
      );
    });
  };

  return nodes.map((node, index) => {
    // 1. Process Headings & Paragraphs with inline styling preserved
    if (node.type === 'heading' || node.type === 'paragraph') {
      const hasContent = node.children?.some((c: any) => c.text?.trim());
      if (!hasContent) return null; // Skip truly empty lines

      return node.type === 'heading' ? (
        <Text key={index} style={styles.nativeH3}>
          {renderInlineText(node.children)}
        </Text>
      ) : (
        <Text key={index} style={styles.nativeParagraph}>
          {renderInlineText(node.children)}
        </Text>
      );
    }

    // 2. Process Unordered / Ordered Lists
    if (node.type === 'list') {
      return (
        <View key={index} style={styles.listContainer}>
          {node.children?.map((listItem: any, itemIdx: number) => {
            return (
              <View key={itemIdx} style={styles.listItemRow}>
                {/* Dynamic prefix: uses bullet for unordered, numbers for ordered lists */}
                <Text style={styles.bulletPoint}>
                  {node.format === 'ordered' ? `${itemIdx + 1}. ` : '• '}
                </Text>
                <Text style={styles.listItemText}>
                  {renderInlineText(listItem.children)}
                </Text>
              </View>
            );
          })}
        </View>
      );
    }

    return null;
  });
};




  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <ArrowLeft size={24} color={colors.dark} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      >
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: service.image }} style={styles.image} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.4)']}
            style={styles.gradient}
          />
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{service.title}</Text>
          <View style={styles.locationRow}>
            <MapPin size={16} color={colors.gray} weight="bold" />
            <Text style={styles.location}>{service.location}</Text>
          </View>
        </View>

        {/* Rating Section */}
        {/*<View style={styles.ratingSection}>
          <View style={styles.ratingBadge}>
            <Star size={18} weight="fill" color={colors.primary} />
            <Text style={styles.ratingText}>{service.rating}</Text>
          </View>
          <Text style={styles.reviewsText}>({service.reviews} reviews)</Text>
        </View>
        */}

        {/* Description Section */}
        <View style={styles.descriptionSection}>
          {renderJsonToNative(service.content)}
        </View>

        {/* Host Section */}
        {/*<View style={styles.hostSection}>
          <View style={styles.hostAvatar}>
            <Text style={styles.hostInitial}>{service.host[0]}</Text>
          </View>
          <View>
            <Text style={styles.hostLabel}>Hosted by</Text>
            <Text style={styles.hostName}>{service.host}</Text>
          </View>
        </View>*/}

        {/* Description */}
        {/*
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionTitle}>About this place</Text>
          <Text style={styles.description}>{service.description}</Text>
        </View>
        */}
        
        {/* Amenities */}
        {/*
        <View style={styles.amenitiesSection}>
          <Text style={styles.descriptionTitle}>What this place offers</Text>
          <View style={styles.amenityItem}>
            <Text style={styles.amenityText}>• Ocean view</Text>
          </View>
          <View style={styles.amenityItem}>
            <Text style={styles.amenityText}>• Private pool</Text>
          </View>
          <View style={styles.amenityItem}>
            <Text style={styles.amenityText}>• Free WiFi</Text>
          </View>
          <View style={styles.amenityItem}>
            <Text style={styles.amenityText}>• Air conditioning</Text>
          </View>
          <View style={styles.amenityItem}>
            <Text style={styles.amenityText}>• Fully equipped kitchen</Text>
          </View>
        </View>
        */}

        <View style={{ height: 100 }} />
      </ScrollView>
      

      
      {/* Sticky Footer */}
      {/*
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceAmount}>{service.price}</Text>
          <Text style={styles.priceLabel}></Text>
        </View>
        <Button
          title="Confirm Booking"
          onPress={handleConfirmBooking}
          variant="primary"
          size="medium"
          style={styles.bookButton}
        />
      </View>
      */}
      
      {/* Booking Modal */}
      {/*
      <BookingModal
        visible={bookingModalVisible}
        service={{
          title: service.title,
          location: service.location,
          price: service.price,
          image: service.image,
        }}
        onClose={() => setBookingModalVisible(false)}
        onConfirm={handleBookingConfirm}
      />
      */}
      {/* Booking Confirmation Dialog */}
      
      {confirmationVisible && confirmationData && (
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationDialog}>
            <Text style={styles.confirmationTitle}>Booking Confirmed!</Text>
            <View style={styles.confirmationContent}>
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Confirmation:</Text>
                <Text style={styles.confirmationValue}>{confirmationData.confirmationNumber}</Text>
              </View>
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Check-in:</Text>
                <Text style={styles.confirmationValue}>{confirmationData.checkInDate}</Text>
              </View>
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Check-out:</Text>
                <Text style={styles.confirmationValue}>{confirmationData.checkOutDate}</Text>
              </View>
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Guests:</Text>
                <Text style={styles.confirmationValue}>{confirmationData.guests}</Text>
              </View>
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Total:</Text>
                <Text style={styles.confirmationValue}>${confirmationData.totalPrice}</Text>
              </View>
            </View>
            <Button
              title="Go to Bookings"
              onPress={() => {
                setConfirmationVisible(false);
                navigation?.navigate('Bookings' as never);
              }}
              variant="primary"
              size="medium"
              style={{ marginTop: spacing.lg }}
            />
          </View>
        </View>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.dark,
    flex: 1,
    textAlign: 'center',
    lineHeight: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    width: 40,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.lightGray,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  content: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.dark,
    marginBottom: spacing.sm,
    lineHeight: 32,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  location: {
    ...typography.body,
    color: colors.gray,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.backgroundGray,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  ratingText: {
    ...typography.bodyBold,
    color: colors.dark,
  },
  reviewsText: {
    ...typography.body,
    color: colors.gray,
  },
  hostSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  hostAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hostInitial: {
    ...typography.h3,
    color: colors.background,
  },
  hostLabel: {
    ...typography.small,
    color: colors.gray,
  },
  hostName: {
    ...typography.bodyBold,
    color: colors.dark,
  },
  descriptionSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  descriptionTitle: {
    ...typography.h3,
    color: colors.dark,
    marginBottom: spacing.md,
    lineHeight: 28,
  },
  description: {
    ...typography.body,
    color: colors.gray,
    lineHeight: 26,
  },
  amenitiesSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  amenityItem: {
    paddingVertical: spacing.sm,
  },
  amenityText: {
    ...typography.body,
    color: colors.dark,
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    backgroundColor: colors.background,
    boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 10,
  },
  priceContainer: {
    flex: 1,
  },
  priceAmount: {
    ...typography.h2,
    color: colors.dark,
  },
  priceLabel: {
    ...typography.small,
    color: colors.gray,
  },
  bookButton: {
    flex: 1,
    marginLeft: spacing.md,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  confirmationDialog: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '85%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  confirmationTitle: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  confirmationContent: {
    marginBottom: spacing.lg,
  },
  confirmationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  confirmationLabel: {
    ...typography.bodyMedium,
    color: colors.gray,
    flex: 1,
  },
  confirmationValue: {
    ...typography.bodyBold,
    color: colors.dark,
    flex: 1,
    textAlign: 'right',
  },
    // 1. Add your Heading Style
  nativeH3: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.dark || '#111111',
    marginTop: 20,
    marginBottom: 8,
  },

  // 2. Add your Body Text Style
  nativeParagraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    marginBottom: 12,
  },

  // 3. Add your Bullet Wrapper Layout
  listContainer: {
    marginVertical: 12,
    paddingLeft: 4,
  },

  // 4. Add your Bullet Alignments
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    marginRight: 6,
  },
  listItemText: {
    flex: 1, // Crucial: forces long list text to wrap to the next line instead of going off screen
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
  },
});
