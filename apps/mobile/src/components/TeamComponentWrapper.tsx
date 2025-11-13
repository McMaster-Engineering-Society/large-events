import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { TeamComponentProps } from '../types';

interface Props extends TeamComponentProps {
  children: ReactNode;
  teamName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary wrapper for team components
 * Catches errors from team components and displays a fallback UI
 */
class TeamComponentWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in ${this.props.teamName} component:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorMessage}>
            Something went wrong with the {this.props.teamName} component.
          </Text>
          {__DEV__ && this.state.error && (
            <Text style={styles.errorDetails}>
              {this.state.error.toString()}
            </Text>
          )}
        </View>
      );
    }

    return <View style={styles.container}>{this.props.children}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fef2f2',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 16,
    color: '#991b1b',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorDetails: {
    fontSize: 12,
    color: '#7f1d1d',
    fontFamily: 'monospace',
    marginTop: 12,
  },
});

export { TeamComponentWrapper };
