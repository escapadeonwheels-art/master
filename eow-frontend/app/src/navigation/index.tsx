import { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
// Fixed Phosphor imports to match usages below (User instead of UserIcon)
import { House, MagnifyingGlass, Heart, User, Envelope } from 'phosphor-react-native';
import SplashScreen from '../screens/Auth/SplashScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import ExploreScreen from '../screens/Explore/ExploreScreen';
import DetailsScreen from '../screens/Details/DetailsScreen';
import DeliveryDetailsScreen from '../screens/Details/DeliveryDetailsScreen';
import BookingDetailsScreen from '../screens/Details/BookingDetailsScreen';
import BookingsScreen from '../screens/Bookings/BookingsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import ContactUsScreen from '../screens/Bookings/ContactUsScreen';
import MapScreen from '../screens/MapScreen/MapScreen';
import CustomTabBar from '../components/navigation/CustomTabBar';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ExploreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ExploreList" component={ExploreScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ title: '' }} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function ContactUsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ContactUsMain" 
        component={ContactUsScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeList" component={HomeScreen} options={{ headerShown: false, title: 'Escapade on Wheels' }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ title: '' }} />
      <Stack.Screen name="DeliveryDetails" component={DeliveryDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// ⭐ FIX: Moved LoginTabStack up here so MainTabs can access it safely
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

function MainTabs({ onAuthenticate }: { onAuthenticate: () => void }) {
  // Check if a user token exists in localStorage (Web environment)
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
  const hasSession = !!token;

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

      {/* DYNAMIC PROFILE TAB */}
      {hasSession ? (
        // 1. If logged in: Show the actual Profile Screen
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      ) : (
        // 2. If logged out: Point the Profile Tab to render your Google Login Stack
        <Tab.Screen
          name="Profile"
          options={{
            tabBarLabel: 'Login',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        >
          {() => <LoginTabStack onAuthenticate={onAuthenticate} />}
        </Tab.Screen>
      )}
    </Tab.Navigator>
  );
}

function AuthStack({ onAuthenticate }: { onAuthenticate: () => void }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
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
            onNavigateToLogin={() => navigation.navigate('Login' as never)}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ForgotPassword">
        {({ navigation }) => (
          <ForgotPasswordScreen
            onBack={() => navigation.goBack()}
            onSubmit={() => navigation.navigate('Login' as never)}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Create an authentication state piece so we can force a layout re-render on login actions
  const [authSessionCounter, setAuthSessionCounter] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={() => setShowOnboarding(false)} />;
  }

  if (!isAuthenticated) {
    return <AuthStack onAuthenticate={() => setIsAuthenticated(true)} />;
  }

  // ⭐ Passed state update callback handler down to MainTabs
  return <MainTabs onAuthenticate={() => setAuthSessionCounter(prev => prev + 1)} />;
}
