import React, { ReactNode, useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/store/ThemeContext';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  testID?: string;
}

export function Card({ children, style, elevated = true, testID }: CardProps) {
  const { colors, borderRadius, spacing, shadows } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
    },
    elevatedShadow: {
      ...shadows.md,
    },
  }), [colors, borderRadius, spacing, shadows]);

  return (
    <View
      style={[
        styles.card,
        elevated && styles.elevatedShadow,
        style,
      ]}
      testID={testID}
    >
      {children}
    </View>
  );
}
