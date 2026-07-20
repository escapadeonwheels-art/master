import { View, Text, Image, StyleSheet } from 'react-native';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

interface BookingCardProps {
  title: string;
  location: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'past';
  image: string;
  price: number;
}

export default function BookingCard({ title, location, date, status, image, price }: BookingCardProps) {
  const badgeVariant = {
    upcoming: 'warning' as const,
    ongoing: 'success' as const,
    past: 'primary' as const,
  };

  return (
    <Card style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Badge text={status} variant={badgeVariant[status]} />
        </View>
        <Text style={styles.location}>{location}</Text>
        <View style={styles.footer}>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.price}>${price}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: colors.lightGray,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginRight: spacing.sm,
  },
  location: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: colors.dark,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
});
