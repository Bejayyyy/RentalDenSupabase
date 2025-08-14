import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import screens
import BookingsScreen from './screens/BookingsScreen';
import VehiclesScreen from './screens/VehiclesScreen';
import AddVehicleScreen from './screens/AddVehicleScreen';
import ReportsScreen from './screens/ReportsScreen';
import CalendarScreen from './screens/CalendarScreen';
import CashFlowScreen from './screens/CashFlowScreen';
import DashboardScreen from './screens/DashboardScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function VehiclesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontFamily: 'Roboto' },
      }}
    >
      <Stack.Screen
        name="VehiclesList"
        component={VehiclesScreen}
        options={{ title: 'Vehicle Management' }}
      />
      <Stack.Screen
        name="AddVehicle"
        component={AddVehicleScreen}
        options={{ title: 'Add New Vehicle' }}
      />
    </Stack.Navigator>
  );
}

function ReportsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontFamily: 'Roboto' },
      }}
    >
      <Stack.Screen
        name="ReportsList"
        component={ReportsScreen}
        options={{ title: 'Performance Reports' }}
      />
      <Stack.Screen
        name="CashFlow"
        component={CashFlowScreen}
        options={{ title: 'Cash Flow Management' }}
      />
    </Stack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#000" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#000' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontFamily: 'Roboto' },
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ title: 'Create Account' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function MainNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* ⚠️ StatusBar note: backgroundColor doesn't work on Android edge-to-edge, so we use headerStyle */}
        <StatusBar style="light" backgroundColor="#000" />
        
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Dashboard') iconName = focused ? 'grid' : 'grid-outline';
              else if (route.name === 'Bookings') iconName = focused ? 'calendar' : 'calendar-outline';
              else if (route.name === 'Vehicles') iconName = focused ? 'car' : 'car-outline';
              else if (route.name === 'Reports') iconName = focused ? 'analytics' : 'analytics-outline';
              else if (route.name === 'Calendar') iconName = focused ? 'today' : 'today-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#FF6B35',
            tabBarInactiveTintColor: '#666',
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopColor: '#eee',
              paddingBottom: insets.bottom, // ✅ pushes above nav bar
              paddingTop: 8,
              height: 60 + insets.bottom, // ✅ adjust height dynamically
            },

            /* ✅ Make header (black bar) smaller */
            headerStyle: { 
              backgroundColor: '#000', 
              height: 50 // <-- You can change this value to make the header taller/shorter
            },

            headerTintColor: '#fff',
            headerTitleStyle: { fontFamily: 'Roboto' },
          })}
        >
          {/* Removed titles so only the black header bar remains without text */}
          <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: '' }} />
          <Tab.Screen name="Bookings" component={BookingsScreen} options={{ title: '' }} />
          <Tab.Screen name="Vehicles" component={VehiclesStack} options={{ headerShown: false, title: '' }} />
          <Tab.Screen name="Reports" component={ReportsStack} options={{ headerShown: false, title: '' }} />
          <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: '' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}



export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </SafeAreaProvider>
  );

}
