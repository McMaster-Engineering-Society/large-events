import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import EventsScreen from '../screens/EventsScreen';
import VendorsScreen from '../screens/VendorsScreen';
import VenuesScreen from '../screens/VenuesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TeamDHomeScreen from '../screens/team-examples/TeamDHomeScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Events') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Vendors') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'Venues') {
            iconName = focused ? 'location' : 'location-outline';
          } else if (route.name === 'TeamD') {
            iconName = focused ? 'apps' : 'apps-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Vendors" component={VendorsScreen} />
      <Tab.Screen name="Venues" component={VenuesScreen} />
      <Tab.Screen
        name="TeamD"
        component={TeamDHomeScreen}
        options={{ title: 'Team D' }}
      />
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      screenOptions={{
        drawerActiveTintColor: '#3b82f6',
        drawerInactiveTintColor: 'gray',
      }}
    >
      <Drawer.Screen
        name="Main"
        component={TabNavigator}
        options={{
          title: 'Large Event Platform',
          drawerLabel: 'Home',
          headerStyle: {
            backgroundColor: '#3b82f6',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'My Profile',
          headerStyle: {
            backgroundColor: '#3b82f6',
          },
          headerTintColor: '#fff',
        }}
      />
    </Drawer.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Not authenticated - show login screen
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          // Authenticated - show app screens
          <Stack.Screen name="App" component={DrawerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
