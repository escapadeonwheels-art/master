import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Check, MapPin, Users, Calendar } from 'phosphor-react-native';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import Button from './Button';

interface BookingModalProps {
  visible: boolean;
  service?: {
    title: string;
    location: string;
    price: number;
    image?: string;
  };
  onClose: () => void;
  onConfirm: (data: any) => void;
}

export default function BookingModal({
  visible,
  service = {
    title: 'Premium Accommodation',
    location: 'Bali, Indonesia',
    price: 120,
  },
  onClose,
  onConfirm,
}: BookingModalProps) {
  const insets = useSafeAreaInsets();
  const [checkInDate, setCheckInDate] = useState('2024-01-15');
  const [checkOutDate, setCheckOutDate] = useState('2024-01-20');
  const [guests, setGuests] = useState(2);

  const nights = 5;
  const totalPrice = service.price * nights;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Booking Details</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <X size={24} color={colors.dark} weight="bold" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Service Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View style={styles.serviceBadge}>
                <MapPin size={20} color={colors.primary} weight="fill" />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <View style={styles.locationRow}>
                  <MapPin size={14} color={colors.gray} weight="bold" />
                  <Text style={styles.serviceLocation}>{service.location}</Text>
                </View>
              </View>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>{service.price}</Text>
              <Text style={styles.priceLabel}></Text>
            </View>
          </View>

          {/* Check-in Date Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Check-in Date</Text>
            <View style={styles.dateCard}>
              <Calendar size={20} color={colors.primary} weight="bold" />
              <View style={styles.dateText}>
                <Text style={styles.dateTitle}>Check-in</Text>
                <Text style={styles.dateValue}>{checkInDate}</Text>
              </View>
            </View>
          </View>

          {/* Check-out Date Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Check-out Date</Text>
            <View style={styles.dateCard}>
              <Calendar size={20} color={colors.primary} weight="bold" />
              <View style={styles.dateText}>
                <Text style={styles.dateTitle}>Check-out</Text>
                <Text style={styles.dateValue}>{checkOutDate}</Text>
              </View>
            </View>
          </View>

          {/* Guests Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Number of Guests</Text>
            <View style={styles.guestCard}>
              <Users size={20} color={colors.primary} weight="bold" />
              <View style={styles.guestText}>
                <Text style={styles.guestTitle}>Guests</Text>
                <Text style={styles.guestValue}>{guests} {guests === 1 ? 'Guest' : 'Guests'}</Text>
              </View>
            </View>
          </View>

          {/* Price Breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Breakdown</Text>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>${service.price} x {nights} nights</Text>
              <Text style={styles.breakdownValue}>${totalPrice}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Service Fee</Text>
              <Text style={styles.breakdownValue}>${Math.round(totalPrice * 0.1)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabelBold}>Total</Text>
              <Text style={styles.breakdownValueBold}>${totalPrice + Math.round(totalPrice * 0.1)}</Text>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <Button
            title="Cancel"
            onPress={onClose}
            variant="secondary"
            size="medium"
            style={styles.cancelButton}
          />
          <Button
            title="Confirm Booking"
            onPress={() => onConfirm({ checkInDate, checkOutDate, guests, totalPrice })}
            variant="primary"
            size="medium"
            style={styles.confirmButton}
          />
        </View>
      </View>
    </Modal>
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
  },
  closeButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoHeader: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
  },
  serviceBadge: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
    justifyContent: 'space-around',
  },
  serviceTitle: {
    ...typography.bodyBold,
    color: colors.dark,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  serviceLocation: {
    ...typography.caption,
    color: colors.gray,
  },
  priceTag: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceText: {
    ...typography.h3,
    color: colors.background,
    fontWeight: '700',
  },
  priceLabel: {
    ...typography.caption,
    color: colors.background,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.dark,
    marginBottom: spacing.md,
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  dateText: {
    flex: 1,
  },
  dateTitle: {
    ...typography.caption,
    color: colors.gray,
  },
  dateValue: {
    ...typography.bodyBold,
    color: colors.dark,
    marginTop: spacing.xs,
  },
  guestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  guestText: {
    flex: 1,
  },
  guestTitle: {
    ...typography.caption,
    color: colors.gray,
  },
  guestValue: {
    ...typography.bodyBold,
    color: colors.dark,
    marginTop: spacing.xs,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  breakdownLabel: {
    ...typography.body,
    color: colors.gray,
  },
  breakdownValue: {
    ...typography.body,
    color: colors.dark,
    fontWeight: '600',
  },
  breakdownLabelBold: {
    ...typography.bodyBold,
    color: colors.dark,
  },
  breakdownValueBold: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
});
