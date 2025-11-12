import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { TeamConfig } from '../constants/teams';

interface TeamCardProps {
  team: TeamConfig;
  onPress: () => void;
}

export default function TeamCard({ team, onPress }: TeamCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: team.color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{team.icon}</Text>
        <Text style={styles.name}>{team.name}</Text>
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
