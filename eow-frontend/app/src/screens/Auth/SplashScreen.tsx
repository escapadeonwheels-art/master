import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

interface SplashScreenProps {
  isDataReady: boolean;
  onAnimationComplete: () => void; 
}

export default function SplashScreen({ isDataReady, onAnimationComplete }: SplashScreenProps) {
  const insets = useSafeAreaInsets();
  
  // Persistent refs to stop strict-mode remount resets
  const animationStarted = useRef(false);
  const screenFadeAnim = useRef(new Animated.Value(1)).current; // Controls overall screen fade out

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Only kick off the entrance animation once the data has finished loading in App.tsx
    if (!isDataReady || animationStarted.current) return;
    animationStarted.current = true;

    // 1. Play the logo entrance animations smoothly (takes 800ms)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // 2. FIXED: Increased delay to 1500ms so it rests beautifully on screen before disappearing
      setTimeout(() => {
        Animated.timing(screenFadeAnim, {
          toValue: 0,
          duration: 400, // Smooth 400ms fade transition out
          useNativeDriver: false,
        }).start(() => {
          onAnimationComplete();
        });
      }, 1500); 
    });
  }, [isDataReady]);

  return (
    <Animated.View style={[styles.container, { opacity: screenFadeAnim, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🏠</Text>
        </View>
        
        <Text style={styles.title}>Escapade On Wheels</Text>
        <Text style={styles.tagline}>Follow your passion</Text>
      </Animated.View>

      <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
        <View style={styles.loadingDots}>
          {[0, 1, 2].map((index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { marginLeft: index > 0 ? spacing.sm : 0 },
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { 
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: colors.background,
    zIndex: 9999, 
  },
  content: { justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xl },
  logoContainer: { marginBottom: spacing.lg },
  logo: { fontSize: 80, textAlign: 'center' },
  title: { ...typography.h1, color: colors.dark, textAlign: 'center' },
  tagline: { ...typography.body, color: colors.gray, textAlign: 'center', marginTop: spacing.sm, fontWeight: '600' },
  loadingContainer: { position: 'absolute', bottom: spacing.xl },
  loadingDots: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
});
