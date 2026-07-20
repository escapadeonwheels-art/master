import { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, ArrowLeft, Heart } from 'phosphor-react-native';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import Button from '../../components/ui/Button';
import DeliverModal from '../../components/ui/DeliverModal';

interface DeliveryDetailsScreenProps {
  route?: any;
  navigation?: any;
}

export default function DeliveryDetailsScreen({ route, navigation }: DeliveryDetailsScreenProps) {
  const insets = useSafeAreaInsets();
  const [deliverModalVisible, setDeliverModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any>(null);

  const service = route?.params?.service || {
    title: 'Fresh Groceries Delivery',
    location: 'Downtown, 2.5 km',
    price: 15,
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
    host: 'QuickMart',
    description: 'Fast grocery delivery within 30 minutes. Premium quality fresh produce, dairy, and pantry essentials delivered right to your door. Same-day delivery available for orders placed before 6 PM.',
    type: 'delivery',
  };

  const handleDeliverNow = () => {
    setDeliverModalVisible(true);
  };

  const handleDeliverConfirm = (data: any) => {
    setDeliverModalVisible(false);
    setConfirmationData({
      title: service.title,
      location: service.location,
      price: service.price,
      time: data?.time || '30-45 min',
      address: data?.address || 'Your delivery address',
      ...data,
    });
    setConfirmationVisible(true);
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
        <Text style={styles.headerTitle}>Delivery Details</Text>
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
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{service.title}</Text>
          <View style={styles.locationRow}>
            <MapPin size={16} color={colors.gray} weight="bold" />
            <Text style={styles.location}>{service.location}</Text>
          </View>
        </View>

        {/* Host Info */}
        <View style={styles.hostSection}>
          <View style={styles.hostAvatar}>
            <Text style={styles.hostInitial}>{service.host[0]}</Text>
          </View>
          <View>
            <Text style={styles.hostLabel}>Provided by</Text>
            <Text style={styles.hostName}>{service.host}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionTitle}>About this delivery</Text>
          <Text style={styles.description}>{service.description}</Text>
        </View>

        {/* Delivery Info */}
        <View style={styles.infoSection}>
          <Text style={styles.descriptionTitle}>Delivery Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoCardLeft}>
              <Text style={styles.infoLabel}>Estimated Time</Text>
              <Text style={styles.infoValue}>15-30 min</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoCardRight}>
              <Text style={styles.infoLabel}>Delivery Fee</Text>
              <Text style={styles.infoValue}>${service.price}</Text>
            </View>
          </View>

          <View style={styles.features}>
            <View style={styles.featureItem}>
              <View style={styles.featureBullet} />
              <Text style={styles.featureText}>Real-time tracking</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureBullet} />
              <Text style={styles.featureText}>Contact-free delivery</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureBullet} />
              <Text style={styles.featureText}>Fresh & quality guaranteed</Text>
            </View>
          </View>
        </View>

        {/* Rating Info */}
        <View style={styles.ratingSection}>
          <Text style={styles.descriptionTitle}>Customer Reviews</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingValue}>⭐ {service.rating}</Text>
            <Text style={styles.ratingCount}>({service.reviews} reviews)</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceAmount}>${service.price}</Text>
          <Text style={styles.priceLabel}>delivery fee</Text>
        </View>
        <Button
          title="Deliver Now"
          onPress={handleDeliverNow}
          variant="primary"
          size="medium"
          style={styles.deliverButton}
        />
      </View>

      {/* Deliver Modal */}
      <DeliverModal
        visible={deliverModalVisible}
        service={{
          title: service.title,
          location: service.location,
          price: service.price,
          image: service.image,
        }}
        onClose={() => setDeliverModalVisible(false)}
        onConfirm={handleDeliverConfirm}
      />

      {/* Delivery Confirmation Dialog */}
      {confirmationVisible && confirmationData && (
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationDialog}>
            <Text style={styles.confirmationTitle}>Delivery Confirmed!</Text>
            <View style={styles.confirmationContent}>
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Order:</Text>
                <Text style={styles.confirmationValue}>{confirmationData.title}</Text>
              </View>
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Delivery to:</Text>
                <Text style={styles.confirmationValue}>{confirmationData.location}</Text>
              </View>
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Estimated time:</Text>
                <Text style={styles.confirmationValue}>{confirmationData.time}</Text>
              </View>
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Delivery fee:</Text>
                <Text style={styles.confirmationValue}>${confirmationData.price}</Text>
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
    height: 240,
    backgroundColor: colors.lightGray,
  },
  image: {
    width: '100%',
    height: '100%',
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
  infoSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  infoCardLeft: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  infoCardRight: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  infoDivider: {
    width: 1,
    backgroundColor: colors.lightGray,
  },
  infoLabel: {
    ...typography.small,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  infoValue: {
    ...typography.h4,
    color: colors.dark,
    lineHeight: 28,
  },
  features: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  featureText: {
    ...typography.body,
    color: colors.dark,
    flex: 1,
    lineHeight: 24,
  },
  ratingSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  ratingBadge: {
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  ratingValue: {
    ...typography.h3,
    color: colors.dark,
    lineHeight: 32,
  },
  ratingCount: {
    ...typography.body,
    color: colors.gray,
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
  deliverButton: {
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
});
