import React, { useMemo } from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/store/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  testID,
}: ButtonProps) {
  const { colors, spacing, borderRadius, fontSize, fontWeight, shadows } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    button: {
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    primary: {
      backgroundColor: colors.primary,
      ...shadows.md,
    },
    secondary: {
      backgroundColor: colors.accent,
      ...shadows.md,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    small: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    medium: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    large: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.lg,
    },
    disabled: {
      opacity: 0.5,
    },
    text: {
      fontWeight: fontWeight.semibold,
    },
    primaryText: {
      color: colors.textInverse,
      fontSize: fontSize.md,
    },
    secondaryText: {
      color: colors.text,
      fontSize: fontSize.md,
    },
    outlineText: {
      color: colors.primary,
      fontSize: fontSize.md,
    },
    ghostText: {
      color: colors.primary,
      fontSize: fontSize.md,
    },
    smallText: {
      fontSize: fontSize.sm,
    },
    mediumText: {
      fontSize: fontSize.md,
    },
    largeText: {
      fontSize: fontSize.lg,
    },
  }), [colors, spacing, borderRadius, fontSize, fontWeight, shadows]);

  const buttonStyles: (ViewStyle | false | undefined)[] = [
    styles.button,
    styles[variant as 'primary' | 'secondary' | 'outline' | 'ghost'],
    styles[size as 'small' | 'medium' | 'large'],
    disabled && styles.disabled,
    style,
  ];

  const textStyles: (TextStyle | false | undefined)[] = [
    styles.text,
    styles[`${variant}Text` as 'primaryText' | 'secondaryText' | 'outlineText' | 'ghostText'],
    styles[`${size}Text` as 'smallText' | 'mediumText' | 'largeText'],
    textStyle,
  ];

  return (
    <Pressable
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.textInverse : colors.primary} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </Pressable>
  );
}
