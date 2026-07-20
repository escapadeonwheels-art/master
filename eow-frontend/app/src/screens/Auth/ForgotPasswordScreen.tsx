import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Envelope, ArrowLeft, CheckCircle } from 'phosphor-react-native';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import Button from '../../components/ui/Button';

interface ForgotPasswordScreenProps {
  onBack: () => void;
  onSubmit: () => void;
}

export default function ForgotPasswordScreen({ onBack, onSubmit }: ForgotPasswordScreenProps) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    setSubmitted(true);
    onSubmit();
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
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft size={24} color={colors.dark} weight="bold" />
          </TouchableOpacity>

          {!submitted ? (
            <>
              {/* Reset Password Form */}
              <View style={styles.header}>
                <Text style={styles.logo}>🔑</Text>
                <Text style={styles.title}>Password Recovery</Text>
                <Text style={styles.subtitle}>
                  Enter your email address and we'll send you a link to reset your password
                </Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={[
                    styles.inputContainer,
                    error && styles.inputContainerError
                  ]}>
                    <Envelope size={20} color={colors.gray} weight="bold" />
                    <TextInput
                      style={styles.input}
                      placeholder="your@email.com"
                      placeholderTextColor={colors.lightGray}
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        setError('');
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!submitted}
                    />
                  </View>
                  {error && <Text style={styles.errorText}>{error}</Text>}
                </View>

                <Button
                  title="Send Reset Link"
                  onPress={handleSubmit}
                  variant="primary"
                  size="large"
                  style={styles.submitButton}
                />

                <Button
                  title="Back to Sign In"
                  onPress={onBack}
                  variant="secondary"
                  size="large"
                  style={styles.backButtonAlt}
                />
              </View>
            </>
          ) : (
            <>
              {/* Success State */}
              <View style={styles.successContainer}>
                <View style={styles.successIconContainer}>
                  <CheckCircle size={64} color={colors.success} weight="fill" />
                </View>
                
                <Text style={styles.successTitle}>Check Your Email</Text>
                <Text style={styles.successSubtitle}>
                  We've sent a password reset link to
                </Text>
                <Text style={styles.emailHighlight}>{email}</Text>
                
                <Text style={styles.successMessage}>
                  Click the link in the email to reset your password. If you don't see it, check your spam folder.
                </Text>

                <Button
                  title="Back to Sign In"
                  onPress={onBack}
                  variant="primary"
                  size="large"
                  style={styles.finalButton}
                />
              </View>
            </>
          )}
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
    paddingVertical: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
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
    lineHeight: 24,
  },
  form: {
    gap: spacing.lg,
  },
  inputWrapper: {
    gap: spacing.sm,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.dark,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  inputContainerError: {
    borderColor: colors.error,
    backgroundColor: 'rgba(193, 53, 21, 0.05)',
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.dark,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  backButtonAlt: {
    marginTop: spacing.sm,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  successIconContainer: {
    marginBottom: spacing.xl,
  },
  successTitle: {
    ...typography.h2,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    ...typography.body,
    color: colors.gray,
    textAlign: 'center',
  },
  emailHighlight: {
    ...typography.bodyBold,
    color: colors.primary,
    textAlign: 'center',
    marginVertical: spacing.sm,
  },
  successMessage: {
    ...typography.body,
    color: colors.gray,
    textAlign: 'center',
    marginVertical: spacing.lg,
    lineHeight: 24,
  },
  finalButton: {
    marginTop: spacing.xl,
    width: '100%',
  },
});
