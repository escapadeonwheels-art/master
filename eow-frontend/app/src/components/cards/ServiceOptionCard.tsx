import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Card from '../ui/Card';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface ServiceOptionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function ServiceOptionCard({ icon, title, description, isSelected, onPress }: ServiceOptionCardProps) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.75} 
      style={styles.wrapper}
    >
      <Card style={isSelected ? { ...styles.card, ...styles.cardSelected } : styles.card}>
        <View style={isSelected ? { ...styles.iconContainer, ...styles.iconContainerSelected } : styles.iconContainer}>
          {icon}
        </View>
        <Text style={isSelected ? { ...styles.title, ...styles.titleSelected } : styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {isSelected && <View style={styles.activeIndicator} />}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: 180,
  },
  card: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconContainerSelected: {
    backgroundColor: colors.primary,
  },
  title: {
    ...typography.h4,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  titleSelected: {
    color: colors.primary,
  },
  description: {
    ...typography.small,
    color: colors.gray,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: spacing.md,
  },
});
