import { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // ✅ Added: Required to trigger tab switches programmatically
import * as SecureStore from 'expo-secure-store'; 
import { MagnifyingGlass, User, Envelope } from 'phosphor-react-native';
import SplashScreen from '../screens/Auth/SplashScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import ExploreScreen from '../screens/Explore/ExploreScreen';
import DetailsScreen from '../screens/Details/DetailsScreen';
import BookingDetailsScreen from '../screens/Details/BookingDetailsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import ContactUsScreen from '../screens/Bookings/ContactUsScreen';
import CustomTabBar from '../components/navigation/CustomTabBar';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ExploreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ExploreList" component={ExploreScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ title: '' }} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function ContactUsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ContactUsMain" component={ContactUsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// Nested Stack containing login, registration and password recovery panels
function LoginTabStack({ onAuthenticate }: { onAuthenticate: () => void }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginMain">
        {({ navigation }) => (
          <LoginScreen
            onLogin={onAuthenticate}
            onNavigateToRegister={() => navigation.navigate('Register' as never)}
            onNavigateToForgotPassword={() => navigation.navigate('ForgotPassword' as never)}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {({ navigation }) => (
          <RegisterScreen
            onRegister={onAuthenticate}
            onNavigateToLogin={() => navigation.navigate('LoginMain' as never)}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ForgotPassword">
        {({ navigation }) => (
          <ForgotPasswordScreen
            onBack={() => navigation.goBack()}
            onSubmit={() => navigation.navigate('LoginMain' as never)}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

interface MainTabsProps {
  onAuthenticate: (status: boolean) => void;
  isAuthenticated: boolean; 
}

function MainTabs({ onAuthenticate, isAuthenticated }: MainTabsProps) {
  const navigation = useNavigation(); // ✅ Initialize the root navigation listener instance

  // ✅ THE REDIRECTION FIX: Listens to authentication updates and forces a clean root tab view transition
  useEffect(() => {
    if (isAuthenticated) {
      // Safely move the client active view back to the Explore listing feed at the parent level
      navigation.navigate('Explore' as never);
    }
  }, [isAuthenticated, navigation]);

  return (
    <Tab.Navigator
      initialRouteName="Explore"
      screenOptions={{
        tabBarActiveTintColor: '#FF385C',
        tabBarInactiveTintColor: '#717171',
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreStack}
        options={{
          tabBarIcon: ({ color, size }) => <MagnifyingGlass size={size} color={color} />,
        }}
      />
      
      <Tab.Screen
        name="Contact Us"
        component={ContactUsStack}
        options={{
          tabBarIcon: ({ color, size }) => <Envelope size={size} color={color} />,
        }}
      />

      {/* DYNAMIC PROFILE TAB CONTAINER */}
      {isAuthenticated ? (
        // 1. Active Login Session: Show standard profile parameters with bottom tab bar preserved
        <Tab.Screen
          name="Profile"
          options={{
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        >
          {() => <ProfileScreen onAuthenticate={() => onAuthenticate(false)} />}
        </Tab.Screen>
      ) : (
        // 2. Clear Guest View State: Embeds the Login Stack cleanly INSIDE the tab shell parameters
        <Tab.Screen
          name="Profile"
          options={{
            tabBarLabel: 'Login',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        >
          {() => <LoginTabStack onAuthenticate={() => onAuthenticate(true)} />}
        </Tab.Screen>
      )}
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  // Check storage arrays on application startup to handle active sessions
  useEffect(() => {
    const runStartupSessionVerification = async () => {
      try {
        let activeToken = null;
        if (Platform.OS === 'web') {
          activeToken = window.localStorage.getItem('userToken');
        } else {
          activeToken = await SecureStore.getItemAsync('userToken');
        }

        if (activeToken) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Failed to verify session status on startup:', err);
      } finally {
        setIsLoading(false);
      }
    };

    runStartupSessionVerification();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <MainTabs 
      isAuthenticated={isAuthenticated}
      onAuthenticate={(status: boolean) => setIsAuthenticated(status)} 
    />
  );
}
