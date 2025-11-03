import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BookOpen, Heart, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui/Card';
import { SpiritualContent } from '@/types';
import { useTheme } from '@/store/ThemeContext';

interface SpiritualCardProps {
  content: SpiritualContent;
}

export function SpiritualCard({ content }: SpiritualCardProps) {
  const { colors, spacing, fontSize } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    card: {
      padding: 0,
      overflow: 'hidden',
    },
    gradient: {
      padding: spacing.lg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    title: {
      fontSize: fontSize.lg,
      fontWeight: '700' as const,
      color: colors.white,
    },
    content: {
      fontSize: fontSize.md,
      color: colors.white,
      lineHeight: 24,
      marginBottom: spacing.md,
    },
    reference: {
      fontSize: fontSize.sm,
      color: colors.white,
      fontStyle: 'italic',
      opacity: 0.9,
      textAlign: 'right' as const,
    },
  }), [colors, spacing, fontSize]);

  const getIcon = () => {
    switch (content.type) {
      case 'verse':
        return <BookOpen size={24} color={colors.white} />;
      case 'meditation':
        return <Heart size={24} color={colors.white} />;
      case 'prayer':
        return <Sparkles size={24} color={colors.white} />;
      default:
        return <BookOpen size={24} color={colors.white} />;
    }
  };

  return (
    <Card style={styles.card}>
      <LinearGradient
        colors={colors.primaryGradient as any}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          {getIcon()}
          <Text style={styles.title}>{content.title}</Text>
        </View>
        <Text style={styles.content}>{content.content}</Text>
        {content.reference && (
          <Text style={styles.reference}>— {content.reference}</Text>
        )}
      </LinearGradient>
    </Card>
  );
}
