import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/store/ThemeContext';

export default function IndexGate() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/auth/signup');
    }, 100);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
