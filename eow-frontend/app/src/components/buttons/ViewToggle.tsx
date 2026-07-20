import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { List, MapTrifold } from 'phosphor-react-native';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';

interface ViewToggleProps {
  view: 'list' | 'map';
  onToggle: (view: 'list' | 'map') => void;
}

export default function ViewToggle({ view, onToggle }: ViewToggleProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, view === 'list' && styles.buttonActive]}
        onPress={() => onToggle('list')}
      >
        <List size={20} color={view === 'list' ? colors.background : colors.dark} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, view === 'map' && styles.buttonActive]}
        onPress={() => onToggle('map')}
      >
        <MapTrifold size={20} color={view === 'map' ? colors.background : colors.dark} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.md,
    padding: 4,
  },
  button: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  buttonActive: {
    backgroundColor: colors.dark,
  },
});
