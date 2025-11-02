import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Video, Image as ImageIcon, Plus, Grid, List } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useApp } from '@/store/AppContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function GalleryScreen() {
  const insets = useSafeAreaInsets();
  const { media } = useApp();
  const router = useRouter();

  const onAddPress = useCallback(() => {
    console.log('[Gallery] Add pressed');
    Alert.alert('Ajouter', "Chargement de l'import média...");
  }, []);

  const onGridToggle = useCallback(() => {
    console.log('[Gallery] Grid toggle');
    Alert.alert('Affichage', 'Bientôt: basculer grille/liste');
  }, []);

  const onMediaPress = useCallback((id: string) => {
    console.log('[Gallery] Media pressed', id);
    router.push('/modal');
  }, [router]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.backgroundDark, theme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={styles.title}>Mes Moments</Text>
          <Text style={styles.subtitle}>Capturez vos souvenirs</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity testID="btn-toggle-grid" style={styles.iconButton} onPress={onGridToggle} accessible accessibilityRole="button" accessibilityLabel="Basculer l'affichage">
            <Grid color={theme.colors.textSecondary} size={20} />
          </TouchableOpacity>
          <TouchableOpacity testID="btn-add-media" style={styles.addButton} onPress={onAddPress} accessible accessibilityRole="button" accessibilityLabel="Ajouter un média">
            <Plus color={theme.colors.textInverse} size={24} strokeWidth={2.5} />
          </TouchableOpacity>
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
        {media.length === 0 ? (
          <>
            <View style={styles.emptyContainer}>
              <LinearGradient
                colors={['rgba(99, 102, 241, 0.1)', 'rgba(236, 72, 153, 0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.emptyGradient}
              >
                <Camera color={theme.colors.primary} size={64} strokeWidth={1.5} />
                <Text style={styles.emptyTitle}>Aucun souvenir pour le moment</Text>
                <Text style={styles.emptyText}>
                  Commencez à capturer vos moments de voyage
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Fonctionnalités</Text>
              <View style={styles.featuresGrid}>
                <TouchableOpacity style={styles.featureCard}>
                  <LinearGradient
                    colors={[`${theme.colors.primary}20`, `${theme.colors.primary}10`]}
                    style={styles.featureGradient}
                  >
                    <Camera color={theme.colors.primary} size={32} />
                    <Text style={styles.featureTitle}>Photos</Text>
                    <Text style={styles.featureDescription}>
                      Capturez vos meilleurs moments
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                  <LinearGradient
                    colors={[`${theme.colors.secondary}20`, `${theme.colors.secondary}10`]}
                    style={styles.featureGradient}
                  >
                    <Video color={theme.colors.secondary} size={32} />
                    <Text style={styles.featureTitle}>Vidéos</Text>
                    <Text style={styles.featureDescription}>
                      Enregistrez vos aventures
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                  <LinearGradient
                    colors={[`${theme.colors.accent}20`, `${theme.colors.accent}10`]}
                    style={styles.featureGradient}
                  >
                    <ImageIcon color={theme.colors.accent} size={32} />
                    <Text style={styles.featureTitle}>Albums</Text>
                    <Text style={styles.featureDescription}>
                      Organisez vos souvenirs
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                  <LinearGradient
                    colors={[`${theme.colors.warning}20`, `${theme.colors.warning}10`]}
                    style={styles.featureGradient}
                  >
                    <List color={theme.colors.warning} size={32} />
                    <Text style={styles.featureTitle}>Collections</Text>
                    <Text style={styles.featureDescription}>
                      Créez des collections
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.mediaGrid}>
            {media.map((item) => (
              <TouchableOpacity key={item.id} testID={`media-${item.id}`} style={styles.mediaCard} onPress={() => onMediaPress(item.id)} accessible accessibilityRole="button" accessibilityLabel={`Ouvrir média ${item.id}`}>
                <LinearGradient
                  colors={['rgba(99, 102, 241, 0.2)', 'rgba(236, 72, 153, 0.2)']}
                  style={styles.mediaGradient}
                >
                  <ImageIcon color={theme.colors.textLight} size={32} />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  emptyContainer: {
    marginBottom: theme.spacing.xl,
  },
  emptyGradient: {
    padding: theme.spacing.xxxl,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    lineHeight: 22,
  },
  featuresContainer: {
    marginTop: theme.spacing.lg,
  },
  featuresTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
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
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  mediaCard: {
    width: (width - theme.spacing.lg * 2 - theme.spacing.sm * 2) / 3,
    aspectRatio: 1,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  mediaGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
