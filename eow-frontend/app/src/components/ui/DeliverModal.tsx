import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Check, MapPin, Clock, Package } from 'phosphor-react-native';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import Button from './Button';

interface DeliverModalProps {
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

const { height } = Dimensions.get('window');

export default function DeliverModal({
  visible,
  service = {
    title: 'Premium Delivery',
    location: 'Downtown',
    price: 5,
  },
  onClose,
  onConfirm,
}: DeliverModalProps) {
  const insets = useSafeAreaInsets();
  const [selectedTime, setSelectedTime] = useState<'now' | 'scheduled'>('now');

  const deliveryTimes = [
    { label: '10-15 min', value: 'now', icon: '⚡' },
    { label: '30-45 min', value: 'standard', icon: '📦' },
    { label: 'Tomorrow', value: 'tomorrow', icon: '📅' },
  ];

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
          <Text style={styles.headerTitle}>Delivery Details</Text>
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
                <Package size={20} color={colors.primary} weight="fill" />
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
              <Text style={styles.priceText}>${service.price}</Text>
            </View>
          </View>

          {/* Delivery Options Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>When do you need it?</Text>
            <View style={styles.timesGrid}>
              {deliveryTimes.map((time) => (
                <TouchableOpacity
                  key={time.value}
                  style={[
                    styles.timeOption,
                    selectedTime === time.value && styles.timeOptionSelected,
                  ]}
                  onPress={() => setSelectedTime(time.value as 'now' | 'scheduled')}
                >
                  <Text style={styles.timeIcon}>{time.icon}</Text>
                  <Text
                    style={[
                      styles.timeLabel,
                      selectedTime === time.value && styles.timeLabelSelected,
                    ]}
                  >
                    {time.label}
                  </Text>
                  {selectedTime === time.value && (
                    <View style={styles.checkmark}>
                      <Check size={16} color={colors.primary} weight="bold" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Delivery Address Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.addressCard}>
              <MapPin size={20} color={colors.primary} weight="bold" />
              <View style={styles.addressText}>
                <Text style={styles.addressTitle}>Current Location</Text>
                <Text style={styles.addressSubtitle}>San Francisco, CA 94103</Text>
              </View>
            </View>
          </View>

          {/* Delivery Fee Breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Breakdown</Text>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Delivery Fee</Text>
              <Text style={styles.breakdownValue}>${service.price}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Estimated Time</Text>
              <Text style={styles.breakdownValue}>15-20 min</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabelBold}>Total</Text>
              <Text style={styles.breakdownValueBold}>${service.price}</Text>
            </View>
          </View>

          {/* Voucher/Coupon Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Apply Promo Code</Text>
            <TouchableOpacity style={styles.voucherButton}>
              <Text style={styles.voucherText}>+ Add voucher, coupon or discount</Text>
              <Text style={styles.voucherArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Info Cards */}
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Clock size={18} color={colors.primary} weight="bold" />
              </View>
              <Text style={styles.infoText}>Real-time tracking available</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Package size={18} color={colors.primary} weight="bold" />
              </View>
              <Text style={styles.infoText}>Contact-free delivery option</Text>
            </View>
          </View>

          <View style={{ height: spacing.xl }} />
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
            title="Confirm Delivery"
            onPress={() => onConfirm({ time: selectedTime })}
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
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.dark,
    lineHeight: 32,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.xl,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  serviceBadge: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    ...typography.bodyBold,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  serviceLocation: {
    ...typography.small,
    color: colors.gray,
  },
  priceTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  priceText: {
    ...typography.bodyBold,
    color: colors.background,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.dark,
    marginBottom: spacing.lg,
    lineHeight: 28,
  },
  timesGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  timeOption: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.lightGray,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.background,
    position: 'relative',
  },
  timeOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },
  timeIcon: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  timeLabel: {
    ...typography.small,
    color: colors.gray,
    textAlign: 'center',
  },
  timeLabelSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  addressText: {
    flex: 1,
  },
  addressTitle: {
    ...typography.bodyBold,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  addressSubtitle: {
    ...typography.small,
    color: colors.gray,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  breakdownLabel: {
    ...typography.body,
    color: colors.gray,
  },
  breakdownLabelBold: {
    ...typography.bodyBold,
    color: colors.dark,
  },
  breakdownValue: {
    ...typography.body,
    color: colors.dark,
  },
  breakdownValueBold: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: spacing.md,
  },
  infoSection: {
    gap: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    ...typography.body,
    color: colors.dark,
    flex: 1,
    lineHeight: 24,
  },
  voucherButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  voucherText: {
    ...typography.bodyMedium,
    color: colors.dark,
  },
  voucherArrow: {
    fontSize: 24,
    color: colors.gray,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    backgroundColor: colors.background,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
});
