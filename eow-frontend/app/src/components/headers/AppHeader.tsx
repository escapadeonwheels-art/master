import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { UserIcon, BellIcon } from 'phosphor-react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';


interface AppHeaderProps {
  notificationCount?: number;
  onNotificationPress?: () => void;
}

export default function AppHeader({ notificationCount = 3, onNotificationPress }: AppHeaderProps) {
  return (
    <View style={styles.container}>

        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/logo/eow.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.appName}>Escapade on Wheels</Text>
        </View>

        <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress} activeOpacity={0.7}>
            <View style={styles.iconWrapper}>
              <BellIcon size={24} color={colors.dark} weight="bold" />
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{notificationCount > 9 ? '9+' : notificationCount}</Text>
                </View>
              )}
            </View>
        </TouchableOpacity>
      
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGray,
    elevation: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16, // Half of 32
    overflow: 'hidden', // Essential for some platforms to clip the image

  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -0.3,
  },
  notificationButton: {
    padding: spacing.sm,
    borderRadius: 12,
  },
  iconWrapper: {
    position: 'relative',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: colors.background,
  },
  badgeText: {
    color: colors.background,
    fontSize: 11,
    fontWeight: '700',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 15,
    marginTop: 'auto'
  },
});
