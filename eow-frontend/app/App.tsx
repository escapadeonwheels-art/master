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
            // 🎯 FIXED: Move param filtering block here so React Navigation strips 'service' from the address bar
            parse: {
              slug: (slug: string) => {
                return slug;
              }
            },
            stringify: {
              slug: (slug: string) => {
                return slug;
              },
              // By omitting or overriding 'service' here, it will not append the text block string data to the URL
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
        await fetchArticles();
      } catch (error) {
        console.error("Initialization pipeline failed:", error);
      } finally {
        setDataLoaded(true);
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
