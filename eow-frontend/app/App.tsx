import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import * as SplashScreenNative from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';

import RootNavigator from './src/navigation';
import SplashScreen from './src/screens/Auth/SplashScreen';
import { fetchArticles } from './src/mock/data';

// Keep the native OS splash screen frozen on boot
SplashScreenNative.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    async function initializeApplicationData() {
      try {
        // Fetch all your Strapi data behind the native splash screen
        await fetchArticles();
      } catch (error) {
        console.error("Initialization pipeline failed:", error);
      } finally {
        setDataLoaded(true);
        // Hide the native screen to reveal the app layout instantly
        await SplashScreenNative.hideAsync();
      }
    }

    initializeApplicationData();
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/* 1. Mount your navigation container instantly so it initializes data ready */}
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>

        {/* 2. Absolute overlay layer: Mounts once and handles its own dismissal smoothly */}
        {!animationDone && (
          <View style={StyleSheet.absoluteFill}>
            <SplashScreen 
              isDataReady={dataLoaded}
              onAnimationComplete={() => setAnimationDone(true)} 
            />
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
