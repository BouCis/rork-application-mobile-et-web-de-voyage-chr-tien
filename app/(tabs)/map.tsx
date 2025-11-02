import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Map as MapIcon, Navigation, Compass, MapPin, Globe } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ dest?: string }>();

  const onFeaturePress = useCallback((feature: string) => {
    console.log('[Map] Feature pressed', feature);
    Alert.alert(feature, 'Fonctionnalité à venir');
  }, []);

  const selectedDest = params?.dest ?? undefined;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.backgroundDark, theme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Carte Interactive</Text>
        <Text style={styles.subtitle}>Explorez le monde{selectedDest ? ` • ${selectedDest}` : ''}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mapPlaceholder}>
          <LinearGradient
            colors={['rgba(99, 102, 241, 0.1)', 'rgba(236, 72, 153, 0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mapGradient}
          >
            <Globe color={theme.colors.primary} size={64} strokeWidth={1} />
            <Text style={styles.placeholderTitle}>Carte Interactive</Text>
            <Text style={styles.placeholderText}>
              Visualisez tous vos voyages et découvrez de nouvelles destinations
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.featuresGrid}>
          <TouchableOpacity testID="feature-card" style={styles.featureCard} onPress={() => onFeaturePress('Fonctionnalité')} accessible accessibilityRole="button" accessibilityLabel="Ouvrir fonctionnalité">
            <LinearGradient
              colors={[`${theme.colors.primary}20`, `${theme.colors.primary}10`]}
              style={styles.featureGradient}
            >
              <Navigation color={theme.colors.primary} size={32} />
              <Text style={styles.featureTitle}>Navigation GPS</Text>
              <Text style={styles.featureDescription}>
                Suivez vos trajets en temps réel
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity testID="feature-card" style={styles.featureCard} onPress={() => onFeaturePress('Fonctionnalité')} accessible accessibilityRole="button" accessibilityLabel="Ouvrir fonctionnalité">
            <LinearGradient
              colors={[`${theme.colors.secondary}20`, `${theme.colors.secondary}10`]}
              style={styles.featureGradient}
            >
              <MapPin color={theme.colors.secondary} size={32} />
              <Text style={styles.featureTitle}>Points d&apos;intérêt</Text>
              <Text style={styles.featureDescription}>
                Découvrez des lieux uniques
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity testID="feature-card" style={styles.featureCard} onPress={() => onFeaturePress('Fonctionnalité')} accessible accessibilityRole="button" accessibilityLabel="Ouvrir fonctionnalité">
            <LinearGradient
              colors={[`${theme.colors.accent}20`, `${theme.colors.accent}10`]}
              style={styles.featureGradient}
            >
              <Compass color={theme.colors.accent} size={32} />
              <Text style={styles.featureTitle}>Exploration</Text>
              <Text style={styles.featureDescription}>
                Partez à l&apos;aventure
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity testID="feature-card" style={styles.featureCard} onPress={() => onFeaturePress('Fonctionnalité')} accessible accessibilityRole="button" accessibilityLabel="Ouvrir fonctionnalité">
            <LinearGradient
              colors={[`${theme.colors.warning}20`, `${theme.colors.warning}10`]}
              style={styles.featureGradient}
            >
              <MapIcon color={theme.colors.warning} size={32} />
              <Text style={styles.featureTitle}>Itinéraires</Text>
              <Text style={styles.featureDescription}>
                Planifiez vos parcours
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.hero,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  mapPlaceholder: {
    height: 300,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
  },
  mapGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  placeholderTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    lineHeight: 22,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  featureCard: {
    width: '48%',
  },
  featureGradient: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  featureTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
});
