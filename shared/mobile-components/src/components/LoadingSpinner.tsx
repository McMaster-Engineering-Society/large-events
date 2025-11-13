import React from 'react';
import type { ReactNode } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

export interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

/**
 * Loading spinner component with optional message
 *
 * @example
 * ```tsx
 * import { LoadingSpinner } from '@large-event/mobile-components';
 *
 * <LoadingSpinner message="Loading..." />
 * ```
 */
export default function LoadingSpinner({
  message,
  size = 'large',
  color = '#3b82f6'
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});
