import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BookOpen, Heart, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui/Card';
import { theme } from '@/constants/theme';
import { SpiritualContent } from '@/types';

interface SpiritualCardProps {
  content: SpiritualContent;
}

export function SpiritualCard({ content }: SpiritualCardProps) {
  const getIcon = () => {
    switch (content.type) {
      case 'verse':
        return <BookOpen size={24} color={theme.colors.white} />;
      case 'meditation':
        return <Heart size={24} color={theme.colors.white} />;
      case 'prayer':
        return <Sparkles size={24} color={theme.colors.white} />;
      default:
        return <BookOpen size={24} color={theme.colors.white} />;
    }
  };

  return (
    <Card style={styles.card}>
      <LinearGradient
        colors={theme.colors.primaryGradient}
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

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  gradient: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.white,
  },
  content: {
    fontSize: theme.fontSize.md,
    color: theme.colors.white,
    lineHeight: 24,
    marginBottom: theme.spacing.md,
  },
  reference: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.white,
    fontStyle: 'italic',
    opacity: 0.9,
    textAlign: 'right',
  },
});