import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Linking, Platform, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store'; 
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import AppHeader from '../../components/headers/AppHeader';
import FadeInView from '../../components/animations/FadeInView';

import { STRAPI_URL } from '../../mock/data'; 

// Modern Phosphor Icon Library Imports
import { 
          PhoneIcon, 
          PaperPlaneTiltIcon, 
          WhatsappLogoIcon, 
          InstagramLogoIcon, 
          FacebookLogoIcon, 
          YoutubeLogoIcon 
} from 'phosphor-react-native';

interface CachedUser {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  username?: string;
  email?: string; // Ensured typing layout includes email field
}

export default function ContactScreen() {
  const insets = useSafeAreaInsets();

  // Cache Tracking State Layer matching Explore Tab Pattern
  const [userData, setUserData] = useState<CachedUser | null>(null);
  
  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false); 

  // Fires dynamically every time the user navigates onto the Contact Us Screen
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const loadSessionProfile = async () => {
        try {
          let rawCache = null;
          if (Platform.OS === 'web') {
            rawCache = window.localStorage.getItem('userData');
          } else {
            rawCache = await SecureStore.getItemAsync('userData');
          }
          
          if (isMounted && rawCache) {
            const parsedUser: CachedUser = JSON.parse(rawCache);
            setUserData(parsedUser);
            
            // Auto-populate fields dynamically on mount if present
            if (parsedUser.firstName) setFirstName(parsedUser.firstName);
            if (parsedUser.lastName) setLastName(parsedUser.lastName);
            if (parsedUser.email) setEmail(parsedUser.email);
          }
        } catch (e) {
          console.error('Failed parsing profile storage indicators within contact screen:', e);
        }
      };
      loadSessionProfile();
      return () => { isMounted = false; };
    }, [])
  );


  // Communications Handlers
  const handlePhoneCall = () => Linking.openURL('tel:+918240630431');
  const handleEmail = () => Linking.openURL('mailto: support@escapadeonwheels.com');
  const handleWhatsApp = () => Linking.openURL('https://api.whatsapp.com/send/?phone=919531856644&text&type=phone_number&app_absent=0');

  // Social URLs Linking Handlers (Replace with your usernames)
  const handleInstagram = () => Linking.openURL('https://www.instagram.com/escapadeonwheels/');
  const handleFacebook = () => Linking.openURL('https://www.facebook.com/escapadeonwheels');
  const handleYoutube = () => Linking.openURL('https://www.youtube.com/@escapadeonwheels1618');


  const isFormValid = firstName && lastName && email && message;

  // Updated Live Backend Submit Handler
  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    setIsSubmittedSuccessfully(false);
    
    // Combine names into a single string for your generic endpoint
    const fullName = `${firstName} ${lastName}`.trim();
    
    // Format message string to include optional phone details cleanly
    const formattedMessage = phone 
      ? `Phone: ${phone}\n\nMessage:\n${message}` 
      : message;

    try {
      // Replace with your active Strapi Cloud Run target URL domain string
      const response = await fetch(`${STRAPI_URL}/api/send-email`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email: email,
          message: formattedMessage,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert('Success', 'Your support request has been routed via Strapi successfully!');
        setIsSubmittedSuccessfully(true);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        // Intercepts any bad requests or error objects returned by Strapi controllers
        Alert.alert('Submission Error', data.error?.message || 'Strapi rejected the mail request.');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Failed to connect to the Strapi mail service. Check your internet connectivity.');
      console.error('Strapi Fetch Network Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <AppHeader notificationCount={0} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* Header Block matching Explore UI */}
        <View style={styles.headerBlock}>
          <FadeInView delay={100} duration={700}>
            <Text style={styles.heroHeading}>Contact Us</Text>
            <Text style={styles.heroSubtext}>Reach out to our team anytime. We're here to help.</Text>
          </FadeInView>
        </View>

        {/* 2-Column Side-by-Side Split Dashboard Layout */}
        <View style={styles.mainContentRow}>
          
          {/* LEFT COLUMN: Right-aligned, Vertically Stacked Channels */}
          <View style={styles.leftColumn}>
            <TouchableOpacity style={styles.channelCard} onPress={handleWhatsApp}>
              <View style={[styles.iconWrapper, { backgroundColor: '#E8F8F5' }]}>
                <WhatsappLogoIcon size={22} color="#09A380" weight="bold" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.channelTitle}>WhatsApp</Text>
                <Text style={styles.channelSubtitle}>Instant Chat</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.channelCard} onPress={handlePhoneCall}>
              <View style={[styles.iconWrapper, { backgroundColor: '#E1F5FE' }]}>
                <PhoneIcon size={22} color="#0288D1" weight="bold" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.channelTitle}>Call Us</Text>
                <Text style={styles.channelSubtitle}>Tap to Talk</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.channelCard} onPress={handleEmail}>
              <View style={[styles.iconWrapper, { backgroundColor: '#E8F5E9' }]}>
                <PaperPlaneTiltIcon size={22} color="#388E3C" weight="bold" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.channelTitle}>Email</Text>
                <Text style={styles.channelSubtitle}>Fast Response</Text>
              </View>
            </TouchableOpacity>

            {/* 3. Social Media Block Inserted Below Main Cards */}
            <View style={styles.socialBlock}>
              <Text style={styles.socialSectionTitle}>Connect With Us</Text>
              <View style={styles.socialRow}>
                
                <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#FDF2F8' }]} onPress={handleInstagram}>
                  <InstagramLogoIcon size={20} color="#DB2777" weight="bold" />
                  <Text style={styles.socialButtonText}>Instagram</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#EFF6FF' }]} onPress={handleFacebook}>
                  <FacebookLogoIcon size={20} color="#2563EB" weight="bold" />
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#FEF2F2' }]} onPress={handleYoutube}>
                  <YoutubeLogoIcon size={20} color="#DC2626" weight="bold" />
                  <Text style={styles.socialButtonText}>YouTube</Text>
                </TouchableOpacity>

              </View>
            </View>
          

          </View>



          {/* RIGHT COLUMN: Interactive Input Contact Form Panel */}
          <View style={styles.rightColumn}>
            <View style={styles.formContainer}>
              <Text style={styles.formSectionTitle}>Send us a message</Text>
              <Text style={styles.inputLabel}></Text>
              {/* Two Column Input Row: Name */}
              <View style={styles.formRow}>
                <View style={styles.halfInputGroup}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="John"
                    placeholderTextColor={colors.gray}
                    value={firstName}
                    onChangeText={setFirstName}
                    editable={!isSubmitting}
                  />
                </View>
                <View style={styles.halfInputGroup}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Doe"
                    placeholderTextColor={colors.gray}
                    value={lastName}
                    onChangeText={setLastName}
                    editable={!isSubmitting}
                  />
                </View>
              </View>

              {/* Two Column Input Row: Communications */}
              <View style={styles.formRow}>
                <View style={styles.halfInputGroup}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="john@mail.com"
                    placeholderTextColor={colors.gray}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    editable={!isSubmitting}
                  />
                </View>
                <View style={styles.halfInputGroup}>
                  <Text style={styles.inputLabel}>Phone (Optional)</Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="+91..."
                    placeholderTextColor={colors.gray}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    editable={!isSubmitting}
                  />
                </View>
              </View>

              {/* Full Width Message Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Your Message</Text>
                <TextInput
                  style={[styles.inputField, styles.textAreaField]}
                  placeholder="How can we help you today?"
                  placeholderTextColor={colors.gray}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={message}
                  onChangeText={setMessage}
                  editable={!isSubmitting}
                />
              </View>

              {/* Submit Action Block */}
              <TouchableOpacity 
                style={[styles.submitButton, (!isFormValid || isSubmitting) && styles.disabledButton]} 
                onPress={handleSubmit}
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? 
                  (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : 
                  (
                    <Text style={styles.submitButtonText}>Submit Message</Text>
                  )
                }
              </TouchableOpacity>
              {/* Only displays when the api transaction is verified as successful */}
              {isSubmittedSuccessfully && (
                <Text style={styles.submitNoticeText}>
                  Thanks ! We will get back as quick as we can.
                </Text>
              )}
            </View>
          </View>

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
  scrollContainer: {
    paddingBottom: spacing.xl,
  },
  headerBlock: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    marginBottom: spacing.md,
  },
  heroHeading: {
    ...typography.h1,
    color: colors.dark,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
    lineHeight: 44,
  },
  heroSubtext: {
    ...typography.body,
    color: colors.gray,
    lineHeight: 22,
  },
  mainContentRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm, // Compact layout gap allows form and tiles to stand together comfortably
    alignItems: 'flex-start', // Anchors columns together at the top edge to prevent vertical wrapping drops
  },
  leftColumn: {
    flex: 1, // Balanced layout ratio prevents text overflows on smaller screens
    gap: spacing.sm,
  },
  rightColumn: {
    flex: 1.8, // Allocates a larger screen width to the input field text content
  },
  channelCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.sm,
    flexDirection: 'row', // Aligns icons neatly beside labels along the split grid border
    alignItems: 'center',
    justifyContent: 'flex-end', // Groups the contents neatly along the right side of the track
    borderWidth: 1,
    borderColor: colors.lightGray,
    ...Platform.select({
      ios: {
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  textContainer: {
    flex: 1,
    paddingRight: spacing.xs, // Clear separation gap protects labels from running into icons
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark,
    textAlign: 'right', // Aligns titles flush against the form divider line
  },
  channelSubtitle: {
    fontSize: 10,
    color: colors.gray,
    marginTop: 1,
    textAlign: 'right', // Aligns subtitles flush against the form divider line
  },
  formContainer: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  halfInputGroup: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: spacing.sm,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  inputField: {
    backgroundColor: colors.backgroundGray,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    fontSize: 13,
    color: colors.dark,
  },
  textAreaField: {
    height: 96, // Matches the height of the left card column for layout balance
    paddingTop: 8,
  },
  submitButton: {
    backgroundColor: colors.dark,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  disabledButton: {
    backgroundColor: colors.gray,
    opacity: 0.4,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.background,
  },
  submitNoticeText: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
    marginTop: spacing.sm, // Adds balanced breathing room directly beneath the button edge
    fontWeight: '500',
    fontStyle: 'italic',
  },
  socialBlock: { 
      backgroundColor: colors.background, 
      padding: spacing.sm, 
      borderRadius: 12, 
      borderWidth: 1, 
      borderColor: colors.lightGray, 
      marginTop: spacing.xs 
    },
    socialSectionTitle: { 
      fontSize: 13, 
      fontWeight: '700', 
      color: colors.dark, 
      marginBottom: spacing.xs, 
      textAlign: 'center' 
    },
    socialRow: { 
      flexDirection: 'column', // Stacks buttons vertically so they never clip
      gap: 6, 
    },
    socialButton: { 
      flexDirection: 'row', // Places icon directly beside text label
      height: 38, 
      borderRadius: 8, 
      alignItems: 'center', 
      paddingHorizontal: spacing.sm, 
      borderWidth: 1, 
      borderColor: colors.lightGray,
      width: '100%', // Grows dynamically to match the exact width of your contact cards
    },
    socialButtonText: {
      marginLeft: 8, 
      fontSize: 11, 
      fontWeight: '600',
      color: colors.dark, // Ensures text colors contrast perfectly against light pastels
    }
});

