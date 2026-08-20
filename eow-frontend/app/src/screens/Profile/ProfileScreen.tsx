import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; // ✅ Added: Navigation hook import
import * as SecureStore from 'expo-secure-store'; 
import { User, PencilSimple, SignOut } from 'phosphor-react-native';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';

interface UserData {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

interface ProfileScreenProps {
  onAuthenticate?: () => void; 
}

export default function ProfileScreen({ onAuthenticate }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation(); // ✅ Initialize the navigation instance
  const [user, setUser] = useState<UserData | null>(null);

  // Load the authentic user data natively with clean platform splitting
  useEffect(() => {
    const loadUserData = async () => {
      try {
        let savedUser = null;
        if (Platform.OS === 'web') {
          savedUser = localStorage.getItem('userData');
        } else {
          savedUser = await SecureStore.getItemAsync('userData');
        }

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error('Error fetching/parsing userData session cache:', e);
      }
    };

    loadUserData();
  }, []);

  // ✅ SAFE SYNCED CROSS-PLATFORM SIGN-OUT FLOW
  const handleSignOut = async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
      } else {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userData');
      }

      // 1. Flip authentication state condition in the MainTabs container layout
      if (onAuthenticate) {
        onAuthenticate();
      }

      // 2. ✅ REDIRECTION EMBED: Bounce the guest traveler back to the interactive Explore list feed instantly
      navigation.navigate('Explore' as never);

    } catch (err) {
      console.error('Secure data cache elimination transaction failed:', err);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom }}>
        
        {/* Dynamic Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {user?.avatarUrl ? (
                <Image 
                  source={{ uri: user.avatarUrl }} 
                  style={styles.profileImage} 
                  onError={() => {
                    if (user) setUser({ ...user, avatarUrl: undefined });
                  }}
                />
              ) : (
                <User size={48} color={colors.background} weight="bold" />
              )}
            </View>
            <TouchableOpacity style={styles.editButton}>
              <PencilSimple size={16} color={colors.background} weight="bold" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>
            {user?.firstName && user?.lastName 
              ? `${user.firstName} ${user.lastName}` 
              : user?.username || 'Traveler'}
          </Text>
          
          <Text style={styles.email}>{user?.email || 'Sign in to access your profile'}</Text>
        </View>

        {/* Functional Logout Row */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <SignOut size={20} color={colors.error} weight="bold" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: spacing.md,
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
});
