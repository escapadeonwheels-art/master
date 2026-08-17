import { useEffect, useState } from 'react';
// ⭐ FIX 1: Explicitly added Image to your core react-native imports array list
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, CreditCard, Bell, Globe, Moon, SignOut, PencilSimple, House, Question } from 'phosphor-react-native';
import QuickActionCard from '../../components/cards/QuickActionCard';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';

interface ProfileOptionProps {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
}

interface UserData {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

function ProfileOption({ icon, title, onPress }: ProfileOptionProps) {
  return (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      {icon}
      <Text style={styles.optionText}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<UserData | null>(null);

  // Load the authentic user data saved from the Google authentication handshake
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('userData');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Error parsing userData from localStorage:', e);
        }
      }
    }
  }, []);

  // Remove the credentials and reload the web application to switch views instantly
  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      window.location.reload();
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
                // ⭐ FIX 2: Added styles.profileImage to ensure the image scales perfectly within the border
                <Image source={{ uri: user.avatarUrl }} style={styles.profileImage} />
              ) : (
                // Fallback icon if no picture is found
                <User size={48} color={colors.background} weight="bold" />
              )}
            </View>
            <TouchableOpacity style={styles.editButton}>
              <PencilSimple size={16} color={colors.background} weight="bold" />
            </TouchableOpacity>
          </View>

          {/* ⭐ FIX 3: Cleaned up the layout by removing the duplicate username text block */}
          <Text style={styles.name}>
            {user?.firstName && user?.lastName 
              ? `${user.firstName} ${user.lastName}` 
              : user?.username || 'Traveler'}
          </Text>
          
          <Text style={styles.email}>{user?.email || 'Sign in to access your profile'}</Text>
          
          {/* <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ 5.0</Text>
            <Text style={styles.ratingLabel}>Member Rating</Text>
          </View> */}
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <QuickActionCard
            icon={<PencilSimple size={24} color={colors.primary} weight="bold" />}
            title="Edit Profile"
            subtitle="Update your information"
          />
          <QuickActionCard
            icon={<CreditCard size={24} color={colors.primary} weight="bold" />}
            title="Payment Methods"
            subtitle="Manage your cards"
          />
          <QuickActionCard
            icon={<House size={24} color={colors.primary} weight="bold" />}
            title="Become a Host"
            subtitle="Start earning today"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <ProfileOption
            icon={<Bell size={24} color={colors.dark} />}
            title="Notifications"
          />
          <ProfileOption
            icon={<Globe size={24} color={colors.dark} />}
            title="Language"
          />
          <ProfileOption
            icon={<Moon size={24} color={colors.dark} />}
            title="Dark Mode"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <ProfileOption
            icon={<Question size={24} color={colors.dark} />}
            title="Help Center"
          />
        </View> */}

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
    overflow: 'hidden', // ⭐ FIX 4: Ensures the Google avatar clips into a clean circle
  },
  // ⭐ FIX 5: Added profileImage styling properties to ensure web display compliance
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.lg,
  },
  rating: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
  },
  ratingLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  optionText: {
    fontSize: 16,
    color: colors.dark,
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
