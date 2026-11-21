import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { StarIcon, MapPinIcon } from 'phosphor-react-native';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { Service } from '../../mock/data';

interface ServiceCardProps {
  service: Service;
  onPress?: () => void;
}

export default function ServiceCard({ service, onPress }: ServiceCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.95}>
      <Card style={styles.card}>
        {/* 1. Wrapped the image section to provide an absolute positioning coordinate context anchor */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: service.image }} style={styles.image} />
          
          {/* 2. Added the absolute yellow sticker overlay layout component on top right of the image asset */}
          <View style={styles.yellowSticker}>
            <Text style={styles.stickerText} numberOfLines={1}>
              {service.price}
              {service.duration !== undefined && service.duration > 0 && (
                <Text style={styles.stickerLabel}>
                  {' • '}{service.duration} {service.duration === 1 ? 'Day' : 'Days'}
                </Text>
              )}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{service.title}</Text>
          <View style={styles.locationRow}>
            <MapPinIcon size={14} color={colors.gray} weight="bold" />
            <Text style={styles.location} numberOfLines={1}>{service.location}</Text>
          </View>
          
          <View style={styles.footer}>
            {service.reviews > 0 && (
              <View style={styles.rating}>
                <StarIcon size={16} weight="fill" color={colors.primary} />
                <Text style={styles.ratingText}>{service.rating}</Text>
                <Text style={styles.reviews}>({service.reviews})</Text>
              </View>
            )}
            {/* 3. Extracted the old right-aligned price layout group blocks from the footer segment */}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  // 4. Added explicit sizing layout relative position parameters for the image container frame context
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.lightGray,
  },
  // 5. Stylized the sticker pill container according to color, padding, and roundness rules shown in sample mockup images
  yellowSticker: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: '#FFEB3B', // Vibrant high-contrast visual focus yellow shade matching image samples
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20, // Clean smooth capsule pill border geometry curve lines
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3, // Android platform baseline drop shadow properties mapping fallback layers
  },
  stickerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A', // Dark charcoal text tone ensuring rigorous color accessibility contrast values
  },
  stickerLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: '#424242',
  },
  badgeContainer: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.md,
  },
  location: {
    fontSize: 14,
    color: colors.gray,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Added height buffer safety rule to prevent row alignment collapsions if reviews calculation evaluates to zero
    minHeight: 24, 
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
  },
  reviews: {
    fontSize: 14,
    color: colors.gray,
  },
});
