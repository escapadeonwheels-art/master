import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { MapPin } from 'phosphor-react-native';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { mockServices } from '../../mock/data';

const { width } = Dimensions.get('window');

interface MapScreenProps {
  onSelectLocation?: (service: any) => void;
}

// Web fallback - simple list view instead of map
export default function MapScreen({ onSelectLocation }: MapScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapIcon}>🗺️</Text>
        <Text style={styles.mapText}>Map View</Text>
        <Text style={styles.mapSubtext}>Available on Mobile Platforms (iOS/Android)</Text>
        <View style={styles.serviceList}>
          <Text style={styles.listTitle}>Locations Available:</Text>
          {mockServices.slice(0, 5).map((service, index) => (
            <View key={service.id} style={styles.serviceItem}>
              <MapPin size={16} color={colors.primary} weight="bold" />
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.title}</Text>
                <Text style={styles.serviceLocation}>{service.location}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundGray,
    paddingHorizontal: spacing.lg,
  },
  mapIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  mapText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  mapSubtext: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: spacing.xl,
  },
  serviceList: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    maxHeight: 300,
  },
  listTitle: {
    ...typography.bodyBold,
    color: colors.dark,
    marginBottom: spacing.md,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    ...typography.bodyBold,
    color: colors.dark,
  },
  serviceLocation: {
    ...typography.caption,
    color: colors.gray,
  },
});
