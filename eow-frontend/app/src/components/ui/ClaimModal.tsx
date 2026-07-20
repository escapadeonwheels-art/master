import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { X, CheckCircle } from 'phosphor-react-native';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import Confetti from 'react-native-confetti-cannon';

interface ClaimModalProps {
  visible: boolean;
  onClose: () => void;
  onUseNow?: () => void;
  code?: string;
  title?: string;
  subtitle?: string;
}

const { width } = Dimensions.get('window');

export default function ClaimModal({
  visible,
  onClose,
  onUseNow,
  code = 'AIRBNB20',
  title = 'Voucher Claimed!',
  subtitle = 'Your discount is ready to use',
}: ClaimModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<any>(null);

  const handleClaimSuccess = () => {
    setShowConfetti(true);
    setTimeout(() => {
      confettiRef.current?.start();
    }, 100);
  };

  useEffect(() => {
    if (visible && !showConfetti) {
      handleClaimSuccess();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Confetti Effect */}
          {showConfetti && (
            <Confetti
              ref={confettiRef}
              count={200}
              origin={{ x: width / 2, y: -10 }}
              fadeOut
            />
          )}

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setShowConfetti(false);
              onClose();
            }}
          >
            <X size={24} color={colors.dark} weight="bold" />
          </TouchableOpacity>

          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <CheckCircle size={64} color={colors.success} weight="fill" />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>{subtitle}</Text>

          {/* Code Display */}
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Use this code:</Text>
            <View style={styles.codeBadge}>
              <Text style={styles.code}>{code}</Text>
            </View>
            <Text style={styles.codeNote}>Save or copy this code for your next purchase</Text>
          </View>

          {/* Voucher/Coupon Info */}
          <View style={styles.voucherInfo}>
            <Text style={styles.voucherLabel}>Add voucher, coupon or discount</Text>
            <Text style={styles.voucherInfoText}>You can also apply additional discounts at checkout</Text>
          </View>

          {/* Use Now Button */}
          <TouchableOpacity
            style={styles.useNowButton}
            onPress={() => {
              onUseNow?.();
              setShowConfetti(false);
              onClose();
            }}
          >
            <Text style={styles.useNowText}>Use Now</Text>
          </TouchableOpacity>

          {/* Maybe Later Button */}
          <TouchableOpacity
            style={styles.laterButton}
            onPress={() => {
              setShowConfetti(false);
              onClose();
            }}
          >
            <Text style={styles.laterText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width - spacing.xl * 2,
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  codeContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  codeLabel: {
    ...typography.bodyMedium,
    color: colors.dark,
  },
  codeBadge: {
    backgroundColor: '#fff3cd',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  code: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 2,
  },
  codeNote: {
    ...typography.caption,
    color: colors.gray,
    textAlign: 'center',
  },
  voucherInfo: {
    width: '100%',
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  voucherLabel: {
    ...typography.bodyBold,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  voucherInfoText: {
    ...typography.caption,
    color: colors.gray,
    textAlign: 'center',
  },
  useNowButton: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  useNowText: {
    ...typography.bodyBold,
    color: colors.background,
    fontSize: 16,
  },
  laterButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  laterText: {
    ...typography.bodyMedium,
    color: colors.gray,
  },
});
