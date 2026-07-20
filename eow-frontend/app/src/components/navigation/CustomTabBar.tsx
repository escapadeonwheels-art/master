import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, MagnifyingGlass, Heart, User, MapPin } from 'phosphor-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { UserIcon, HeartIcon, MapPinIcon, MagnifyingGlassIcon, HouseIcon } from 'phosphor-react-native';

const { width } = Dimensions.get('window');

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  const iconMap: { [key: string]: (color: string, size: number) => React.ReactNode } = {
    Home: (color, size) => <HouseIcon size={size} color={color} weight="bold" />,
    Explore: (color, size) => <MagnifyingGlassIcon size={size} color={color} weight="bold" />,
    Map: (color, size) => <MapPinIcon size={size} color={color} weight="bold" />,
    Bookings: (color, size) => <HeartIcon size={size} color={color} weight="bold" />,
    Profile: (color, size) => <UserIcon size={size} color={color} weight="bold" />,
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
          const isFocused = state.index === index;
          const isMapTab = route.name === 'Map';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              preventDefault: false,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          if (isMapTab) {
            // Map tab with gradient background
            return (
              <LinearGradient
                key={route.key}
                colors={['#FF385C', '#FF8C42']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mapTabGradient}
              >
                <TouchableOpacity
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={styles.mapTabButton}
                  activeOpacity={0.8}
                >
                  {iconMap['Map'](colors.background, 24)}
                </TouchableOpacity>
              </LinearGradient>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
              activeOpacity={0.6}
            >
              {iconMap[route.name] ? (
                iconMap[route.name](
                  isFocused ? colors.primary : colors.gray,
                  24
                )
              ) : null}
              {isFocused && (
                <Text style={[ styles.tabLabel,{ color: isFocused ? colors.primary : colors.gray },]}>
                  {label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  mapTabGradient: {
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginHorizontal: spacing.sm,
    marginVertical: spacing.xs,
  },
  mapTabButton: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
