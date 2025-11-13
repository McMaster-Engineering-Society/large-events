import React, { Component } from 'react';
import type { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary wrapper component
 * Catches errors from child components and displays a fallback UI
 *
 * @example
 * ```tsx
 * import { ErrorBoundary } from '@large-event/mobile-components';
 *
 * <ErrorBoundary componentName="Team D">
 *   <TeamDComponent />
 * </ErrorBoundary>
 * ```
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const componentName = this.props.componentName || 'Component';
    console.error(`Error in ${componentName}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      const componentName = this.props.componentName || 'this component';
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorMessage}>
            Something went wrong with {componentName}.
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
