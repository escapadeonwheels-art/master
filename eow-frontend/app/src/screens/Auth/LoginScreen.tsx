import { useEffect, useState, useMemo } from 'react'; // ✅ Added useMemo
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store'; 
import { jwtDecode } from 'jwt-decode'; 
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { GoogleLogoIcon } from 'phosphor-react-native';
import { STRAPI_URL } from '../../mock/data';

WebBrowser.maybeCompleteAuthSession();

interface GoogleIdTokenPayload {
  email: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

interface LoginScreenProps {
  onLogin: () => void;
  onNavigateToRegister?: () => void; // Made optional to match navigator signatures
  onNavigateToForgotPassword?: () => void; // Made optional to match navigator signatures
}

export default function LoginScreen({ onLogin, onNavigateToRegister, onNavigateToForgotPassword }: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const [googleLoading, setGoogleLoading] = useState(false);

  const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  };

  // ✅ FIX: Calculate the nonce exactly ONCE. This stops the infinite rerender/freeze condition entirely.
  const staticNonce = useMemo(() => Math.random().toString(36).substring(2, 15), []);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: '1005820341677-13j9pp847b3r5dohafollde1fm0q7e4g.apps.googleusercontent.com',
      scopes: ['openid', 'profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'eodui',
      }), 
      responseType: 'id_token token',
      usePKCE: false,    
      extraParams: {
        prompt: 'select_account',
        access_type: 'online',
        nonce: staticNonce, // ✅ Bound to stable reference
      }
    },
    discovery
  );

  const handleGoogleLoginPress = async () => {
    setGoogleLoading(true);
    try {
      const result = await promptAsync({ 
        openAuthSessionInPopup: false 
      });

      if (result?.type === 'success' && result.authentication) {
        const { accessToken, idToken } = result.authentication;
        if (accessToken && idToken) {
          await processGoogleAuthentication(accessToken, idToken);
        } else {
          console.error('Authentication succeeded but required tokens are missing.');
          setGoogleLoading(false);
        }
      } else {
        setGoogleLoading(false);
      }
    } catch (error) {
      console.error('Authentication redirect failed:', error);
      setGoogleLoading(false);
    }
  };

  const processGoogleAuthentication = async (accessToken: string, idToken: string) => {
    try {
      // 1. Decode token profile metadata locally on mobile client
      const decodedProfile = jwtDecode<GoogleIdTokenPayload>(idToken);
      console.log('Decoded Google profile fields:', decodedProfile);

      // 2. Validate token structure with your Strapi user collection core
      const res = await fetch(
        `${STRAPI_URL}/api/auth/google/callback?access_token=${accessToken}`
      );
      const strapiAuthData = await res.json();

      if (!strapiAuthData.jwt || !strapiAuthData.user) {
        throw new Error(strapiAuthData.error?.message || 'Strapi validation rejected.');
      }

      console.log('Strapi authenticated completely. Syncing profile custom schema columns...');

      // 3. Sync metadata back up to custom user collection paths via standard update route
      const updateResponse = await fetch(`${STRAPI_URL}/api/users/${strapiAuthData.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${strapiAuthData.jwt}`,
        },
        body: JSON.stringify({
          firstName: decodedProfile.given_name || '',
          lastName: decodedProfile.family_name || '',
          avatarUrl: decodedProfile.picture || '',
        }),
      });

      const updatedUserData = await updateResponse.json();
      console.log('Database transaction complete:', updatedUserData);

      // 4. Backfill local app state objects and cache locally
      const completeSession = { ...strapiAuthData.user, ...updatedUserData };

      if (Platform.OS === 'web') {
        window.localStorage.setItem('userToken', strapiAuthData.jwt);
        window.localStorage.setItem('userData', JSON.stringify(completeSession));
      } else {
        await SecureStore.setItemAsync('userToken', strapiAuthData.jwt);
        await SecureStore.setItemAsync('userData', JSON.stringify(completeSession));
      }
      
      setTimeout(() => {
        onLogin(); // This triggers the state change in RootNavigator perfectly
      }, 100);

    } catch (err) {
      console.error('Failed to sync authentication parameters:', err);
      setGoogleLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>🏠</Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to save your travel favorites</Text>
          </View>

          {/* Action Interface Container */}
          <View style={styles.form}>
            {googleLoading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Synchronizing user metadata profile...</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.googleButton, !request && { opacity: 0.6 }]}
                disabled={!request}
                onPress={handleGoogleLoginPress}
              >
                <GoogleLogoIcon size={28} color={colors.primary} weight="bold" />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  keyboardAvoid: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingVertical: spacing.xl, justifyContent: 'center' },
  header: { marginBottom: spacing.xxl },
  logo: { fontSize: 48, textAlign: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.dark, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.gray, textAlign: 'center' },
  form: { paddingHorizontal: spacing.sm },
  googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md, backgroundColor: '#ffffff', borderWidth: 1, borderColor: colors.dark, borderRadius: borderRadius.md, paddingVertical: spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  googleButtonText: { ...typography.bodyMedium, color: colors.dark, fontWeight: '600' },
  loaderContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md, gap: spacing.sm },
  loadingText: { ...typography.bodyMedium, color: colors.gray, fontWeight: '500', marginTop: spacing.xs },
});
