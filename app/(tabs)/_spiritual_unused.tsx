import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Music, BookOpen, Play, Heart, Volume2, Headphones } from 'lucide-react-native';
import { useTheme } from '@/store/ThemeContext';
import { useRouter } from 'expo-router';

export default function SpiritualScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();

  const musicCategories = [
    { id: '1', name: 'Louange', icon: Music, color: colors.primary },
    { id: '2', name: 'Méditation', icon: Headphones, color: colors.secondary },
    { id: '3', name: 'Gospel', icon: Volume2, color: colors.accent },
  ];

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
        colors={[colors.background, colors.backgroundSecondary]}
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
            colors={colors.primaryGradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featuredGradient}
          >
            <Heart color={colors.textInverse} size={48} strokeWidth={1.5} />
            <Text style={[styles.featuredTitle, { color: colors.textInverse }]}>Musique Chrétienne</Text>
            <Text style={[styles.featuredText, { color: colors.textInverse }]}>
              Écoutez des chants de louange et de méditation
            </Text>
            <TouchableOpacity testID="btn-play-now" style={styles.playButton} onPress={onPlayNow} accessible accessibilityRole="button" accessibilityLabel="Écouter maintenant">
              <Play color={colors.primary} size={20} fill={colors.primary} />
              <Text style={[styles.playButtonText, { color: colors.primary, backgroundColor: colors.textInverse }]}>Écouter maintenant</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Catégories</Text>
          <View style={styles.categoriesGrid}>
            {musicCategories.map((category) => (
              <TouchableOpacity key={category.id} testID={`category-${category.id}`} style={styles.categoryCard} onPress={() => onCategoryPress(category.name)} accessible accessibilityRole="button" accessibilityLabel={`Ouvrir catégorie ${category.name}`}>
                <LinearGradient
                  colors={[`${category.color}20`, `${category.color}10`]}
                  style={styles.categoryGradient}
                >
                  <category.icon color={category.color} size={32} />
                  <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen color={colors.accent} size={24} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Bible Numérique</Text>
          </View>
          <TouchableOpacity testID="card-bible" style={styles.bibleCard} onPress={onOpenBible} accessible accessibilityRole="button" accessibilityLabel="Ouvrir la Bible">
            <LinearGradient
              colors={['rgba(20, 184, 166, 0.1)', 'rgba(99, 102, 241, 0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bibleGradient}
            >
              <BookOpen color={colors.accent} size={48} strokeWidth={1.5} />
              <Text style={[styles.bibleTitle, { color: colors.text }]}>Lire la Bible</Text>
              <Text style={[styles.bibleText, { color: colors.textSecondary }]}>
                Accédez à la Bible numérique avec recherche par verset
              </Text>
              <View style={[styles.bibleButton, { backgroundColor: colors.accent }]}>
                <Text style={[styles.bibleButtonText, { color: colors.textInverse }]}>Ouvrir</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Fonctionnalités</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <LinearGradient
                colors={[`${colors.primary}20`, `${colors.primary}10`]}
                style={styles.featureGradient}
              >
                <Music color={colors.primary} size={24} />
                <Text style={[styles.featureTitle, { color: colors.text }]}>Streaming</Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  Musique en ligne et hors ligne
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.featureCard}>
              <LinearGradient
                colors={[`${colors.secondary}20`, `${colors.secondary}10`]}
                style={styles.featureGradient}
              >
                <Heart color={colors.secondary} size={24} />
                <Text style={[styles.featureTitle, { color: colors.text }]}>Favoris</Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  Sauvegardez vos chants préférés
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.featureCard}>
              <LinearGradient
                colors={[`${colors.accent}20`, `${colors.accent}10`]}
                style={styles.featureGradient}
              >
                <BookOpen color={colors.accent} size={24} />
                <Text style={[styles.featureTitle, { color: colors.text }]}>Lecture</Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  Bible audio disponible
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.featureCard}>
              <LinearGradient
                colors={[`${colors.warning}20`, `${colors.warning}10`]}
                style={styles.featureGradient}
              >
                <Volume2 color={colors.warning} size={24} />
                <Text style={[styles.featureTitle, { color: colors.text }]}>Playlists</Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
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
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  categoryGradient: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
  },
  bibleGradient: {
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
  },
  featureGradient: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  featuredCard: {
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
  },
  featuredGradient: {
    padding: 64,
    alignItems: 'center',
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginTop: 16,
    textAlign: 'center',
  },
  featuredText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999,
  },
  playButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  categoriesGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  categoryCard: {
    flex: 1,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  bibleCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  bibleTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginTop: 16,
    textAlign: 'center',
  },
  bibleText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  bibleButton: {
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999,
  },
  bibleButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    width: '48%',
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    marginTop: 16,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
});
