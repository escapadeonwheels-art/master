import { View, Text, StyleSheet, Image, Platform, TouchableOpacity } from 'react-native'; // ✅ Added: TouchableOpacity
import { useFocusEffect, useNavigation } from '@react-navigation/native'; // ✅ Added: useNavigation hook
import * as SecureStore from 'expo-secure-store'; 
import { User } from 'phosphor-react-native'; 
import { useState, useCallback, useMemo } from 'react';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

interface CachedUser {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  username?: string;
}

interface AppHeaderProps {
  notificationCount?: number;
  onNotificationPress?: () => void;
}

export default function AppHeader({ notificationCount = 3, onNotificationPress }: AppHeaderProps) {
  const navigation = useNavigation(); // ✅ Initialize navigation utility hook instance
  const [userData, setUserData] = useState<CachedUser | null>(null);

  // Sync user state instantly every time any parent view gains active focus
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      
      const loadHeaderProfile = async () => {
        try {
          let rawCache = null;
          if (Platform.OS === 'web') {
            rawCache = window.localStorage.getItem('userData');
          } else {
            rawCache = await SecureStore.getItemAsync('userData');
          }
          
          if (isMounted) {
            if (rawCache) {
              setUserData(JSON.parse(rawCache));
            } else {
              setUserData(null);
            }
          }
        } catch (e) {
          console.error('Failed parsing profile storage indicators within header:', e);
        }
      };

      loadHeaderProfile();
      return () => { isMounted = false; };
    }, [])
  );

  // Compute text initials if image link is missing or broken
  const userInitials = useMemo(() => {
    if (!userData) return '';
    if (userData.firstName || userData.lastName) {
      const f = userData.firstName?.charAt(0) || '';
      const l = userData.lastName?.charAt(0) || '';
      return `${f}${l}`.toUpperCase();
    }
    return userData.username?.substring(0, 2).toUpperCase() || '';
  }, [userData]);

  // ✅ NEW HANDLER: Forces bottom tab manager layout shell to shift index over onto Profile 
  const handleAvatarPress = () => {
    // Navigates directly to the 'Profile' tab screen at the root level tree context
    navigation.navigate('Profile' as never);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/logo/eow.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.appName}>Escapade on Wheels</Text>
      </View>

      {/* PERSISTENT AVATAR / INITIALS TOP RIGHT ROW CONTAINER */}
      {userData && (
        // ✅ FIX: Wrapped in TouchableOpacity to intercept press events cleanly
        <TouchableOpacity 
          style={styles.topRightBadge} 
          onPress={handleAvatarPress}
          activeOpacity={0.7}
        >
          {userData.avatarUrl ? (
            <Image 
              source={{ uri: userData.avatarUrl }} 
              style={styles.avatarBadgeImage} 
              onError={() => setUserData(prev => prev ? { ...prev, avatarUrl: undefined } : null)}
            />
          ) : userInitials ? (
            <View style={styles.initialsContainer}>
              <Text style={styles.initialsText}>{userInitials}</Text>
            </View>
          ) : (
            <View style={styles.fallbackIconContainer}>
              <User size={20} color={colors.gray} weight="bold" />
            </View>
          )}
        </TouchableOpacity>
      )}
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
    borderRadius: 16, 
    overflow: 'hidden', 
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -0.3,
  },
  topRightBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
  },
  avatarBadgeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  initialsContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  fallbackIconContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGray,
  },
});
