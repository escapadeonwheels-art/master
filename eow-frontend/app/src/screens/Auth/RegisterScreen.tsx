import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, Envelope, Lock, Eye, EyeSlash, CheckCircle, ArrowRight } from 'phosphor-react-native';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import Button from '../../components/ui/Button';

interface RegisterScreenProps {
  onRegister: () => void;
  onNavigateToLogin: () => void;
}

export default function RegisterScreen({ onRegister, onNavigateToLogin }: RegisterScreenProps) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleRegister = () => {
    let newErrors = { name: '', email: '', password: '', confirmPassword: '' };
    
    if (!name) newErrors.name = 'Full name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (password && password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    
    if (!Object.values(newErrors).some(err => err !== '')) {
      onRegister();
    }
  };

  const passwordStrength = password ? (password.length >= 12 ? 'strong' : password.length >= 8 ? 'medium' : 'weak') : 'none';

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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Airbnb and start exploring</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Full Name</Text>
              <View style={[
                styles.inputContainer,
                errors.name && styles.inputContainerError
              ]}>
                <User size={20} color={colors.gray} weight="bold" />
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor={colors.lightGray}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setErrors({ ...errors, name: '' });
                  }}
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[
                styles.inputContainer,
                errors.email && styles.inputContainerError
              ]}>
                <Envelope size={20} color={colors.gray} weight="bold" />
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor={colors.lightGray}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setErrors({ ...errors, email: '' });
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password</Text>
              <View style={[
                styles.inputContainer,
                errors.password && styles.inputContainerError
              ]}>
                <Lock size={20} color={colors.gray} weight="bold" />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={colors.lightGray}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrors({ ...errors, password: '' });
                  }}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <Eye size={20} color={colors.gray} weight="bold" />
                  ) : (
                    <EyeSlash size={20} color={colors.gray} weight="bold" />
                  )}
                </TouchableOpacity>
              </View>
              {password && (
                <View style={styles.passwordStrength}>
                  <View style={[
                    styles.strengthBar,
                    passwordStrength === 'weak' && styles.strengthWeak,
                    passwordStrength === 'medium' && styles.strengthMedium,
                    passwordStrength === 'strong' && styles.strengthStrong,
                  ]} />
                  <Text style={[
                    styles.strengthText,
                    passwordStrength === 'weak' && { color: colors.error },
                    passwordStrength === 'medium' && { color: colors.warning },
                    passwordStrength === 'strong' && { color: colors.success },
                  ]}>
                    {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)} password
                  </Text>
                </View>
              )}
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={[
                styles.inputContainer,
                errors.confirmPassword && styles.inputContainerError
              ]}>
                <Lock size={20} color={colors.gray} weight="bold" />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={colors.lightGray}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setErrors({ ...errors, confirmPassword: '' });
                  }}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <Eye size={20} color={colors.gray} weight="bold" />
                  ) : (
                    <EyeSlash size={20} color={colors.gray} weight="bold" />
                  )}
                </TouchableOpacity>
              </View>
              {confirmPassword && password === confirmPassword && (
                <View style={styles.matchIndicator}>
                  <CheckCircle size={16} color={colors.success} weight="fill" />
                  <Text style={styles.matchText}>Passwords match</Text>
                </View>
              )}
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            {/* Sign Up Button */}
            <Button
              title="Create Account"
              onPress={handleRegister}
              variant="primary"
              size="large"
              style={styles.signUpButton}
            />
          </View>

          {/* Sign In Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
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
  },
  form: {
    gap: spacing.lg,
    marginBottom: spacing.lg,
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
  passwordStrength: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
    flex: 1,
  },
  strengthWeak: {
    backgroundColor: colors.error,
  },
  strengthMedium: {
    backgroundColor: colors.warning,
  },
  strengthStrong: {
    backgroundColor: colors.success,
  },
  strengthText: {
    ...typography.caption,
    fontWeight: '600',
  },
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  matchText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '600',
  },
  signUpButton: {
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  footerText: {
    ...typography.body,
    color: colors.gray,
  },
  signInLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
  },
});
