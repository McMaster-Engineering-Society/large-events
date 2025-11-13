import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function VenuesScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="location" size={64} color="#a855f7" />
      <Text style={styles.title}>Venues</Text>
      <Text style={styles.description}>
        This screen will integrate team venue components
      </Text>
      <Text style={styles.note}>
        Teams will build their venue management features in their src/mobile/ folders
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  note: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
