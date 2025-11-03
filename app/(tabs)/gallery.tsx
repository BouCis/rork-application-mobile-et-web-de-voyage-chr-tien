import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Video, Image as ImageIcon, Plus, Grid, List } from 'lucide-react-native';
import { useTheme } from '@/store/ThemeContext';
import { useApp } from '@/store/AppContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function GalleryScreen() {
  const insets = useSafeAreaInsets();
  const { media } = useApp();
  const router = useRouter();
  const { colors } = useTheme();

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
        colors={[colors.background, colors.backgroundSecondary]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Mes Moments</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Capturez vos souvenirs</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity testID="btn-toggle-grid" style={[styles.iconButton, { backgroundColor: colors.surface }]} onPress={onGridToggle} accessible accessibilityRole="button" accessibilityLabel="Basculer l'affichage">
            <Grid color={colors.textSecondary} size={20} />
          </TouchableOpacity>
          <TouchableOpacity testID="btn-add-media" style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={onAddPress} accessible accessibilityRole="button" accessibilityLabel="Ajouter un média">
            <Plus color={colors.textInverse} size={24} strokeWidth={2.5} />
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
                style={[styles.emptyGradient, { borderColor: colors.border }]}
              >
                <Camera color={colors.primary} size={64} strokeWidth={1.5} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>Aucun souvenir pour le moment</Text>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Commencez à capturer vos moments de voyage
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.featuresContainer}>
              <Text style={[styles.featuresTitle, { color: colors.text }]}>Fonctionnalités</Text>
              <View style={styles.featuresGrid}>
                <TouchableOpacity style={styles.featureCard}>
                  <LinearGradient
                    colors={[`${colors.primary}20`, `${colors.primary}10`]}
                    style={[styles.featureGradient, { borderColor: colors.border }]}
                  >
                    <Camera color={colors.primary} size={32} />
                    <Text style={[styles.featureTitle, { color: colors.text }]}>Photos</Text>
                    <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                      Capturez vos meilleurs moments
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                  <LinearGradient
                    colors={[`${colors.secondary}20`, `${colors.secondary}10`]}
                    style={[styles.featureGradient, { borderColor: colors.border }]}
                  >
                    <Video color={colors.secondary} size={32} />
                    <Text style={[styles.featureTitle, { color: colors.text }]}>Vidéos</Text>
                    <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                      Enregistrez vos aventures
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                  <LinearGradient
                    colors={[`${colors.accent}20`, `${colors.accent}10`]}
                    style={[styles.featureGradient, { borderColor: colors.border }]}
                  >
                    <ImageIcon color={colors.accent} size={32} />
                    <Text style={[styles.featureTitle, { color: colors.text }]}>Albums</Text>
                    <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                      Organisez vos souvenirs
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                  <LinearGradient
                    colors={[`${colors.warning}20`, `${colors.warning}10`]}
                    style={[styles.featureGradient, { borderColor: colors.border }]}
                  >
                    <List color={colors.warning} size={32} />
                    <Text style={[styles.featureTitle, { color: colors.text }]}>Collections</Text>
                    <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
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
                  style={[styles.mediaGradient, { borderColor: colors.border }]}
                >
                  <ImageIcon color={colors.textSecondary} size={32} />
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  emptyContainer: {
    marginBottom: 32,
  },
  emptyGradient: {
    padding: 64,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginTop: 24,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  featuresContainer: {
    marginTop: 24,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    width: '48%',
  },
  featureGradient: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
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
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mediaCard: {
    width: (width - 24 * 2 - 8 * 2) / 3,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mediaGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
