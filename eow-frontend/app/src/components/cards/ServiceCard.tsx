import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Star, MapPin } from 'phosphor-react-native';
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
        <Image source={{ uri: service.image }} style={styles.image} />
        <View style={styles.badgeContainer}>
          <Badge text={service.type === 'delivery' ? '🚚 Delivery' : '✈️ Travel'} variant="primary" />
        </View>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{service.title}</Text>
          <View style={styles.locationRow}>
            <MapPin size={14} color={colors.gray} weight="bold" />
            <Text style={styles.location} numberOfLines={1}>{service.location}</Text>
          </View>
          <View style={styles.footer}>
            <View style={styles.rating}>
              <Star size={16} weight="fill" color={colors.primary} />
              <Text style={styles.ratingText}>{service.rating}</Text>
              <Text style={styles.reviews}>({service.reviews})</Text>
            </View>
            <View>
              <Text style={styles.price}>{service.price}</Text>
              <Text style={styles.priceLabel}>{service.type === 'delivery' ? 'delivery' : ''}</Text>
            </View>
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
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.lightGray,
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
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    textAlign: 'right',
  },
  priceLabel: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'right',
  },
});
