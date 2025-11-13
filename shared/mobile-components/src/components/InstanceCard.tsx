import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { InstanceResponse } from '@large-event/api-types';

export interface InstanceCardProps {
  instance: InstanceResponse;
}

/**
 * Card component displaying instance information
 *
 * @example
 * ```tsx
 * import { InstanceCard } from '@large-event/mobile-components';
 *
 * <InstanceCard instance={instanceData} />
 * ```
 */
export default function InstanceCard({ instance }: InstanceCardProps) {
  const getAccessLevelColor = (accessLevel: string) => {
    switch (accessLevel) {
      case 'web_admin':
        return '#ef4444'; // red-500
      case 'web_user':
        return '#3b82f6'; // blue-500
      case 'both':
        return '#10b981'; // green-500
      default:
        return '#6b7280'; // gray-500
    }
  };

  const formatAccessLevel = (accessLevel: string) => {
    switch (accessLevel) {
      case 'web_admin':
        return 'Admin';
      case 'web_user':
        return 'User';
      case 'both':
        return 'Admin & User';
      default:
        return accessLevel;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={2}>
          {instance.name}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.organizationLabel}>Organization</Text>
        <Text style={styles.organizationName}>
          {instance.ownerOrganization.acronym || instance.ownerOrganization.name}
        </Text>
      </View>

      <View style={styles.footer}>
        <View
          style={[
            styles.accessBadge,
            { backgroundColor: getAccessLevelColor(instance.accessLevel) },
          ]}
        >
          <Text style={styles.accessText}>
            {formatAccessLevel(instance.accessLevel)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    marginBottom: 12,
  },
  organizationLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  organizationName: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  accessBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  accessText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
});
