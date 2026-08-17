import React, { useEffect, useRef, useState } from 'react';
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
  
  // Track whether the logo entrance animation has fully finished
  const [isEntranceAnimationDone, setIsEntranceAnimationDone] = useState(false);
  const exitStarted = useRef(false);

  const screenFadeAnim = useRef(new Animated.Value(1)).current; 
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // STAGE 1: Kick off entrance animation IMMEDIATELY on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false, // Changed to false to prevent the missing native module warning
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: false, // Changed to false to prevent the missing native module warning
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false, // Changed to false to prevent the missing native module warning
      }),
    ]).start(() => {
      // Mark entrance as done. The screen will stay active here if data is still loading
      setIsEntranceAnimationDone(true);
    });
  }, []);

  // STAGE 2: Watch both conditions, exit only when both are true
  useEffect(() => {
    if (isDataReady && isEntranceAnimationDone && !exitStarted.current) {
      exitStarted.current = true;

      // Rest beautifully for 1000ms before fading out to the main screen
      setTimeout(() => {
        Animated.timing(screenFadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false, // Changed to false to prevent the missing native module warning
        }).start(() => {
          onAnimationComplete();
        });
      }, 1000);
    }
  }, [isDataReady, isEntranceAnimationDone]);

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
