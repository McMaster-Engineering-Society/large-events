import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface TeamCardProps {
  name: string;
  icon?: string;
  color: string;
  onPress: () => void;
}

/**
 * Card component for team selection
 *
 * @example
 * ```tsx
 * import { TeamCard } from '@large-event/mobile-components';
 *
 * <TeamCard
 *   name="Team A"
 *   icon="🎯"
 *   color="#ef4444"
 *   onPress={() => navigateToTeam('teamA')}
 * />
 * ```
 */
export default function TeamCard({ name, icon, color, onPress }: TeamCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={styles.name}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 24,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
});
