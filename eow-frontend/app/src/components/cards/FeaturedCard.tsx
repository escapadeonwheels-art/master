import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Star, MapPin } from 'phosphor-react-native';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { Service } from '../../mock/data';

interface FeaturedCardProps {
  service: Service;
  onPress?: () => void;
  onBookNow?: () => void;
  showBookButton?: boolean;
  ctaLabel?: string;
}

export default function FeaturedCard({ service, onPress, onBookNow, showBookButton = false, ctaLabel = 'Book Now' }: FeaturedCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.95}>
      <Card style={styles.card}>
        <Image source={{ uri: service.image }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{service.title}</Text>
          <View style={styles.locationRow}>
            <MapPin size={14} color={colors.gray} weight="fill" />
            <Text style={styles.location} numberOfLines={1}>{service.location}</Text>
          </View>
          <View style={styles.footer}>
            {/* This section is for the ratings on the places on the home screen
            <View style={styles.rating}>
              <Star size={16} weight="fill" color={colors.primary} />
              <Text style={styles.ratingText}>{service.rating}</Text>
            </View>
            */}
            <View>
              <Text style={styles.price}>{service.price}</Text>
              <Text style={styles.priceLabel}></Text>
            </View>
          </View>
          
          {/* --this section is for the book now button on the homeScreen
          {showBookButton && (
            <TouchableOpacity
              style={styles.bookButton}
              onPress={(e) => {
                e.stopPropagation();
                onBookNow?.();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.bookButtonText}>{ctaLabel}</Text>
            </TouchableOpacity>
          )}
          */}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    marginRight: spacing.lg,
    padding: 0,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: colors.lightGray,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.sm,
    lineHeight: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  location: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.gray,
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    lineHeight: 20,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    textAlign: 'right',
    lineHeight: 28,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.gray,
    textAlign: 'right',
    lineHeight: 16,
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  bookButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
});
