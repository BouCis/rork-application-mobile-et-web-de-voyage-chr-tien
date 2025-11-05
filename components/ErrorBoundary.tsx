import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type ErrorBoundaryProps = { children: React.ReactNode };
type ErrorBoundaryState = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('[ErrorBoundary] getDerivedStateFromError', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] componentDidCatch', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.fallback} testID="global-error-fallback">
          <Text style={styles.title}>Oups, un problème est survenu</Text>
          <Text style={styles.message}>Une erreur inattendue est apparue. Vous pouvez réessayer.</Text>
          <Pressable style={styles.button} onPress={this.handleRetry} testID="global-error-retry">
            <Text style={styles.buttonText}>Réessayer</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

const styles = StyleSheet.create({
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#0B0F14' },
  title: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' as const, marginBottom: 8 },
  message: { color: '#9FB1C3', fontSize: 14, textAlign: 'center', marginBottom: 16 },
  button: { backgroundColor: '#3BA3FF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  buttonText: { color: '#0B0F14', fontSize: 14, fontWeight: '700' as const },
});
