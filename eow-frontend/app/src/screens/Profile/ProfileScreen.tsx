import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom }}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={48} color={colors.background} weight="bold" />
            </View>
            <TouchableOpacity style={styles.editButton}>
              <PencilSimple size={16} color={colors.background} weight="bold" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>Alex Johnson</Text>
          <Text style={styles.email}>alex.johnson@example.com</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ 4.9</Text>
            <Text style={styles.ratingLabel}>Host Rating</Text>
          </View>
        </View>

        <View style={styles.section}>
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
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton}>
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
