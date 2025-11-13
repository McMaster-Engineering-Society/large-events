import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { InstanceCard, TeamCard } from '@large-event/mobile-components';
import { TEAMS } from '../constants/teams';

export function HomeScreen({ navigation }: any) {
  const { user, instances, refreshInstances } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshInstances();
    setRefreshing(false);
  }, [refreshInstances]);

  const handleTeamPress = (teamId: string, teamName: string) => {
    // Navigate to team screen if available
    if (teamId === 'teamD') {
      navigation.navigate('TeamD');
    } else {
      // For other teams, show alert
      Alert.alert(
        teamName,
        'Team portal integration coming soon!\n\nTeams will build native components in their src/mobile/ folders.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Large Event Platform</Text>
        {user && (
          <Text style={styles.userEmail}>Hello, {user.email}!</Text>
        )}
        <Text style={styles.subtitle}>Choose a team to get started</Text>
      </View>

      {instances.length > 0 && (
        <View style={styles.instancesSection}>
          <Text style={styles.sectionTitle}>Your Instances</Text>
          {instances.map((instance) => (
            <InstanceCard key={instance.id} instance={instance} />
          ))}
          <Text style={styles.instanceCount}>
            Total instances: {instances.length}
          </Text>
        </View>
      )}

      <View style={styles.teamsSection}>
        <Text style={styles.sectionTitle}>Teams</Text>
        <View style={styles.teamsGrid}>
          {TEAMS.map((team) => (
            <View key={team.id} style={styles.teamCardWrapper}>
              <TeamCard
                name={team.name}
                icon={team.icon}
                color={team.color}
                onPress={() => handleTeamPress(team.id, team.name)}
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  instancesSection: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  instanceCount: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  teamsSection: {
    padding: 16,
  },
  teamsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  teamCardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
});
