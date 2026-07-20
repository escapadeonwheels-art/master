import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

/**
 * DetailsScreen - A redirect screen that routes to appropriate details page
 * 
 * This screen acts as a router based on service type:
 * - Delivery services → DeliveryDetailsScreen
 * - Travel services → BookingDetailsScreen
 */
export default function DetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const service = (route?.params as any)?.service;

  useEffect(() => {
    // Redirect to appropriate details screen based on service type
    if (service?.type === 'delivery') {
      navigation.navigate('DeliveryDetails', { service });
    } else if (service?.type === 'travel') {
      navigation.navigate('BookingDetails', { service });
    } else {
      // Fallback to BookingDetails for travel as default
      navigation.navigate('BookingDetails', { service });
    }
  }, [navigation, service]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Redirecting...</Text>
    </View>
  );
}
