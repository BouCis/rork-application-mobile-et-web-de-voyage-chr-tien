import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Music, BookOpen, Play, Heart, Volume2, Headphones } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';

const musicCategories = [
  { id: '1', name: 'Louange', icon: Music, color: theme.colors.primary },
  { id: '2', name: 'Méditation', icon: Headphones, color: theme.colors.secondary },
  { id: '3', name: 'Gospel', icon: Volume2, color: theme.colors.accent },
];

export default function SpiritualScreen() {
  const insets = useSafeAreaInsets();
const router = useRouter();

const onPlayNow = React.useCallback(() => {
  console.log('[Spiritual] Play now');
  router.push('/music/player');
}, [router]);

const onCategoryPress = React.useCallback((name: string) => {
  console.log('[Spiritual] Category', name);
  router.push('/music/player');
}, [router]);

const onOpenBible = React.useCallback(() => {
  console.log('[Spiritual] Open Bible');
  router.push('/bible/reader');
}, [router]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.backgroundDark, theme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={styles.title}>Inspiration</Text>
          <Text style={styles.subtitle}>Musique & Spiritualité</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.featuredCard}>
          <LinearGradient
            colors={theme.colors.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featuredGradient}
          >
            <Heart color={theme.colors.textInverse} size={48} strokeWidth={1.5} />
            <Text style={styles.featuredTitle}>Musique Chrétienne</Text>
            <Text style={styles.featuredText}>
              Écoutez des chants de louange et de méditation
            </Text>
            <TouchableOpacity testID="btn-play-now" style={styles.playButton} onPress={onPlayNow} accessible accessibilityRole="button" accessibilityLabel="Écouter maintenant">
              <Play color={theme.colors.primary} size={20} fill={theme.colors.primary} />
              <Text style={styles.playButtonText}>Écouter maintenant</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Catégories</Text>
          <View style={styles.categoriesGrid}>
            {musicCategories.map((category) => (
              <TouchableOpacity key={category.id} testID={`category-${category.id}`} style={styles.categoryCard} onPress={() => onCategoryPress(category.name)} accessible accessibilityRole="button" accessibilityLabel={`Ouvrir catégorie ${category.name}`}>
                <LinearGradient
                  colors={[`${category.color}20`, `${category.color}10`]}
                  style={styles.categoryGradient}
                >
                  <category.icon color={category.color} size={32} />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen color={theme.colors.accent} size={24} />
            <Text style={styles.sectionTitle}>Bible Numérique</Text>
          </View>
          <TouchableOpacity testID="card-bible" style={styles.bibleCard} onPress={onOpenBible} accessible accessibilityRole="button" accessibilityLabel="Ouvrir la Bible">
            <LinearGradient
              colors={['rgba(20, 184, 166, 0.1)', 'rgba(99, 102, 241, 0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bibleGradient}
            >
              <BookOpen color={theme.colors.accent} size={48} strokeWidth={1.5} />
              <Text style={styles.bibleTitle}>Lire la Bible</Text>
              <Text style={styles.bibleText}>
                Accédez à la Bible numérique avec recherche par verset
              </Text>
              <View style={styles.bibleButton}>
                <Text style={styles.bibleButtonText}>Ouvrir</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fonctionnalités</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <LinearGradient
                colors={[`${theme.colors.primary}20`, `${theme.colors.primary}10`]}
                style={styles.featureGradient}
              >
                <Music color={theme.colors.primary} size={24} />
                <Text style={styles.featureTitle}>Streaming</Text>
                <Text style={styles.featureDescription}>
                  Musique en ligne et hors ligne
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.featureCard}>
              <LinearGradient
                colors={[`${theme.colors.secondary}20`, `${theme.colors.secondary}10`]}
                style={styles.featureGradient}
              >
                <Heart color={theme.colors.secondary} size={24} />
                <Text style={styles.featureTitle}>Favoris</Text>
                <Text style={styles.featureDescription}>
                  Sauvegardez vos chants préférés
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.featureCard}>
              <LinearGradient
                colors={[`${theme.colors.accent}20`, `${theme.colors.accent}10`]}
                style={styles.featureGradient}
              >
                <BookOpen color={theme.colors.accent} size={24} />
                <Text style={styles.featureTitle}>Lecture</Text>
                <Text style={styles.featureDescription}>
                  Bible audio disponible
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.featureCard}>
              <LinearGradient
                colors={[`${theme.colors.warning}20`, `${theme.colors.warning}10`]}
                style={styles.featureGradient}
              >
                <Volume2 color={theme.colors.warning} size={24} />
                <Text style={styles.featureTitle}>Playlists</Text>
                <Text style={styles.featureDescription}>
                  Créez vos propres listes
                </Text>
              </LinearGradient>
            </View>
          </View>
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
  featuredCard: {
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  featuredGradient: {
    padding: theme.spacing.xxxl,
    alignItems: 'center',
  },
  featuredTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textInverse,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  featuredText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textInverse,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    opacity: 0.9,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.textInverse,
  },
  playButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  categoriesGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  categoryCard: {
    flex: 1,
  },
  categoryGradient: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryName: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  bibleCard: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  bibleGradient: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  bibleTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  bibleText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    lineHeight: 22,
  },
  bibleButton: {
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.accent,
  },
  bibleButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textInverse,
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
