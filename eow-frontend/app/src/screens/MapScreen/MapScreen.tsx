import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { MapPin } from 'phosphor-react-native';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { mockServices } from '../../mock/data';

// Conditionally import react-native-maps only for native platforms
let MapView: any;
let Marker: any;

if (Platform.OS !== 'web') {
  const maps = require('react-native-maps');
  MapView = maps.default || maps.MapView;
  Marker = maps.Marker;
}

const { width, height } = Dimensions.get('window');

interface MapScreenProps {
  onSelectLocation?: (service: any) => void;
}

export default function MapScreen({ onSelectLocation }: MapScreenProps) {
  // Return web fallback for web platform
  if (Platform.OS === 'web') {
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
                <Text style={styles.serviceName}>{service.title}</Text>
                <Text style={styles.serviceLocation}>{service.location}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  // Native map implementation
  // Generate random coordinates for demo (centered around SF Bay Area)
  const getCoordinates = (index: number) => {
    const baseLat = 37.7749;
    const baseLng = -122.4194;
    const offset = (index * 0.02) - (mockServices.length * 0.01);
    return {
      latitude: baseLat + offset,
      longitude: baseLng + offset * 0.8,
    };
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.7749,
          longitude: -122.4194,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
      >
        {mockServices.map((service, index) => {
          const coords = getCoordinates(index);
          return (
            <Marker
              key={service.id}
              coordinate={coords}
              title={service.title}
              description={service.location}
              onPress={() => onSelectLocation?.(service)}
            >
              <View style={[
                styles.marker,
                service.type === 'delivery' ? styles.deliveryMarker : styles.travelMarker,
              ]}>
                <MapPin size={16} color={colors.background} weight="fill" />
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.deliveryMarker]} />
          <Text style={styles.legendText}>Delivery</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.travelMarker]} />
          <Text style={styles.legendText}>Travel</Text>
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
  map: {
    width,
    height: height - 200,
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  deliveryMarker: {
    backgroundColor: '#FF6B6B',
  },
  travelMarker: {
    backgroundColor: '#4ECDC4',
  },
  legend: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.lg,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.background,
  },
  legendText: {
    ...typography.bodyMedium,
    color: colors.dark,
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
  },
  listTitle: {
    ...typography.bodyBold,
    color: colors.dark,
    marginBottom: spacing.md,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  serviceName: {
    ...typography.bodyBold,
    color: colors.dark,
    flex: 1,
  },
  serviceLocation: {
    ...typography.caption,
    color: colors.gray,
  },
});
