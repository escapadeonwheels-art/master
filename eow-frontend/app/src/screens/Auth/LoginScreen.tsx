import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { GoogleLogoIcon } from 'phosphor-react-native';
import { STRAPI_URL } from '../../mock/data';

// Ensures pop-up windows handle OAuth redirects accurately on web environments
WebBrowser.maybeCompleteAuthSession();

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const [googleLoading, setGoogleLoading] = useState(false);

  const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: '1005820341677-13j9pp847b3r5dohafollde1fm0q7e4g.apps.googleusercontent.com',
      scopes: ['openid', 'profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({ isRedirect: true }), 
      responseType: 'token', 
      usePKCE: false,        
      extraParams: {
        prompt: 'select_account', 
        access_type: 'online',
      }
    },
    discovery
  );
  useEffect(() => {
    if (response) {
      if (response.type === 'success' && response.authentication?.accessToken) {
        // Keep the main page spinner active during the backend query
        setGoogleLoading(true);
        exchangeTokenWithStrapi(response.authentication.accessToken);
      } else {
        setGoogleLoading(false);
      }
    }
  }, [response]);

  // ⭐ REMOVED the old useEffect listener on [response] because it causes asynchronous timing lag.
  // Instead, everything is now handled sequentially inside the button press below.

const handleGoogleLoginPress = async () => {
  setGoogleLoading(true);
  try {
    // ⭐ THE DEFINITIVE FIX: Force the auth flow to happen in the exact same tab
    // This completely prevents the white window from opening in the first place
    const result = await promptAsync({ 
      openAuthSessionInPopup: false 
    });

    if (result?.type === 'success' && result.authentication?.accessToken) {
      await exchangeTokenWithStrapi(result.authentication.accessToken);
    } else {
      setGoogleLoading(false);
    }
  } catch (error) {
    console.error('Authentication redirect failed:', error);
    setGoogleLoading(false);
  }
};

  const exchangeTokenWithStrapi = async (googleToken: string) => {
    try {
      const res = await fetch(
        `${STRAPI_URL}/api/auth/google/callback?access_token=${googleToken}`
      );
      const data = await res.json();

      if (data.jwt) {
        localStorage.setItem('userToken', data.jwt);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        // Let the spinner sit for an extra 100ms to allow browser threads to stabilize
        setTimeout(() => {
          onLogin(); // Transition to the profile page seamlessly
        }, 100);
      } else {
        console.error('Strapi auth validation failed:', data);
        setGoogleLoading(false);
      }
    } catch (err) {
      console.error('Failed communicating with Strapi container:', err);
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
                <Text style={styles.loadingText}>Verifying credentials with Strapi...</Text>
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xxl,
  },
  logo: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray,
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: spacing.sm,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.dark,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleButtonText: {
    ...typography.bodyMedium,
    color: colors.dark,
    fontWeight: '600',
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  loadingText: {
    ...typography.bodyMedium,
    color: colors.gray,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
});
