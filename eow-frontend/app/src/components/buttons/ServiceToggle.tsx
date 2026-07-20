import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';

interface ServiceToggleProps {
  selected: 'delivery' | 'travel';
  onSelect: (type: 'delivery' | 'travel') => void;
}

export default function ServiceToggle({ selected, onSelect }: ServiceToggleProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, selected === 'delivery' && styles.buttonActive]}
        onPress={() => onSelect('delivery')}
      >
        <Text style={[styles.text, selected === 'delivery' && styles.textActive]}>
          Delivery
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, selected === 'travel' && styles.buttonActive]}
        onPress={() => onSelect('travel')}
      >
        <Text style={[styles.text, selected === 'travel' && styles.textActive]}>
          Travel
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.lg,
    padding: 4,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  buttonActive: {
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray,
  },
  textActive: {
    color: colors.dark,
  },
});
