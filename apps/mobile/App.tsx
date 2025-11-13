import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from './src/contexts/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          ...Ionicons.font,
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        // Continue anyway - icons might not work but app should still function
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <RootNavigator />
    </AuthProvider>
  );
}
