import 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import React, { useState, useEffect } from 'react';
import * as SplashScreenNative from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';

import RootNavigator from './src/navigation';
import SplashScreen from './src/screens/Auth/SplashScreen';
import { fetchArticles } from './src/mock/data';

SplashScreenNative.preventAutoHideAsync().catch(() => {});

const prefix = Linking.createURL('/');
const webDomain = process.env.EXPO_PUBLIC_WEB_DOMAIN || 'https://yourdomain.com';
const customScheme = `${process.env.EXPO_PUBLIC_DEEP_LINK_SCHEME || 'eow'}://`;

const linking = {
  prefixes: [prefix, webDomain, customScheme],
  config: {
    screens: {
      Explore: {
        screens: {
          ExplorePlaces: 'explore',
          BookingDetails: {
            path: 'explore/:slug',
            parse: {
              slug: (slug: string) => slug,
            },
            stringify: {
              slug: (slug: string) => slug,
              service: () => null
            }
          }, 
        },
      },
      'Contact Us': {
        screens: { ContactUsMain: 'contact' }
      },
      Profile: 'profile',
    },
  },
};

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    async function initializeApplicationData() {
      try {
        console.log("[APP INITIALIZATION] Checking Strapi backend availability...");
        
        // 🎯 FIX: Health check ping to verify database availability using pagination size 1
        const healthCheck = await fetchArticles({ page: 1, limit: 1 });
        
        if (healthCheck && healthCheck.length >= 0) {
          console.log("[APP INITIALIZATION] Strapi is online and accessible. Proceeding to Explore screen.");
          setDataLoaded(true);
        } else {
          throw new Error("Strapi backend returned an invalid payload structure.");
        }
      } catch (error) {
        console.error("🚨 Critical Error: Strapi backend is unreachable or down:", error);
        // Fallback: Still set true to prevent blocking user indefinitely if offline modes exist, 
        // or customize error handling states here depending on requirements.
        setDataLoaded(true); 
      } finally {
        await SplashScreenNative.hideAsync();
      }
    }
    initializeApplicationData();
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <NavigationContainer 
          linking={linking}
          onStateChange={(state) => {
            // 📡 ROUTE TREE TELEMETRY ACTION WATCHER
            const route = state?.routes[state.index];
          }}
        >
          <RootNavigator />
        </NavigationContainer>

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

const styles = StyleSheet.create({ container: { flex: 1 } });
