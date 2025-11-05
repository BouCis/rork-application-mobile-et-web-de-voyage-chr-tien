import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { Mail, UserPlus, User, Bookmark, Wallet, MapPin, ImageIcon, Settings } from 'lucide-react-native';
import { useTheme } from '@/store/ThemeContext';
import { useApp } from '@/store/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { colors, spacing, borderRadius, fontSize, fontWeight, shadows } = useTheme();
  const { user } = useApp();
  const insets = useSafeAreaInsets();

  const initials = useMemo(() => {
    const f = user?.firstName?.[0] ?? '';
    const l = user?.lastName?.[0] ?? '';
    const fallback = (user?.email ?? 'V').slice(0, 1).toUpperCase();
    const result = `${f}${l}`.trim().toUpperCase();
    return result.length > 0 ? result : fallback;
  }, [user?.firstName, user?.lastName, user?.email]);

  const styles = StyleSheet.create({
    container: { flex: 1 },
    headerBg: { ...StyleSheet.absoluteFillObject },
    content: { flex: 1, padding: spacing.lg, paddingTop: spacing.lg + insets.top },
    hero: {
      backgroundColor: colors.glassEffect ? 'rgba(255,255,255,0.06)' : colors.surface,
      borderRadius: borderRadius.xxl,
      borderWidth: 1,
      borderColor: colors.borderSubtle ?? colors.border,
      padding: spacing.lg,
      overflow: 'hidden',
      ...shadows.lg,
    },
    heroRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
    avatarWrap: { width: 100, height: 100, borderRadius: 100, overflow: 'hidden' },
    avatar: { width: 100, height: 100, borderRadius: 100 },
    avatarGradient: { width: 100, height: 100, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
    initials: { color: colors.textInverse, fontSize: 34, fontWeight: '800' as const, letterSpacing: 1 },
    name: { fontSize: fontSize.xxl, fontWeight: fontWeight.extrabold, color: colors.text },
    emailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.xs },
    email: { fontSize: fontSize.sm, color: colors.textSecondary },

    quickRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
    quickCard: {
      flex: 1,
      backgroundColor: colors.glassEffect ? 'rgba(255,255,255,0.06)' : colors.surface,
      borderWidth: 1,
      borderColor: colors.borderSubtle ?? colors.border,
      borderRadius: borderRadius.xl,
      paddingVertical: spacing.md,
      alignItems: 'center',
      gap: 8,
      ...shadows.md,
    },
    ring: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${colors.primary}15`,
    },
    quickLabel: { fontSize: fontSize.sm, color: colors.text, fontWeight: fontWeight.semibold },

    sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text, marginTop: spacing.xl, marginBottom: spacing.sm },

    grid: { gap: spacing.md },
    tile: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...shadows.sm,
    },
    left: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
    iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: `${colors.primary}15` },
    label: { color: colors.text, fontWeight: fontWeight.semibold },
    hint: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 2 },

    cta: { borderRadius: borderRadius.lg, overflow: 'hidden', marginTop: spacing.lg },
    ctaInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: 12 },
    ctaText: { color: colors.white, fontWeight: fontWeight.bold },
  });

  return (
    <View style={styles.container} testID="profile-screen">
      <Stack.Screen options={{ title: 'Mon espace', headerShown: false }} />
      <LinearGradient colors={[colors.background, colors.backgroundSecondary]} style={styles.headerBg} />
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.hero} testID="profile-hero">
            <View style={styles.heroRow}>
              <View style={styles.avatarWrap}>
                {user?.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                ) : (
                  <LinearGradient colors={colors.neonGradient ?? colors.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatarGradient}>
                    <Text style={styles.initials}>{initials}</Text>
                  </LinearGradient>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name} numberOfLines={1}>{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Invité'}</Text>
                <View style={styles.emailRow}>
                  <Mail size={16} color={colors.textSecondary} />
                  <Text style={styles.email} numberOfLines={1}>{user?.email ?? 'Non connecté'}</Text>
                </View>
              </View>
            </View>
            <View style={styles.quickRow}>
              <TouchableOpacity testID="quick-profile" style={styles.quickCard} activeOpacity={0.85} onPress={() => router.push('/settings/account')}>
                <View style={styles.ring}><User color={colors.primary} size={20} /></View>
                <Text style={styles.quickLabel}>Mon profil</Text>
              </TouchableOpacity>
              <TouchableOpacity testID="quick-trips" style={styles.quickCard} activeOpacity={0.85} onPress={() => router.push('/(tabs)/planner')}>
                <View style={styles.ring}><MapPin color={colors.primary} size={20} /></View>
                <Text style={styles.quickLabel}>Mes voyages</Text>
              </TouchableOpacity>
              <TouchableOpacity testID="quick-budget" style={styles.quickCard} activeOpacity={0.85} onPress={() => router.push('/trip/budget-admin')}>
                <View style={styles.ring}><Wallet color={colors.primary} size={20} /></View>
                <Text style={styles.quickLabel}>Budget</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Mes raccourcis</Text>
          <View style={styles.grid}>
            <TouchableOpacity style={styles.tile} activeOpacity={0.85} onPress={() => Alert.alert('Favoris', 'Fonctionnalité à venir')}>
              <View style={styles.left}>
                <View style={styles.iconWrap}><Bookmark color={colors.primary} size={20} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Favoris</Text>
                  <Text style={styles.hint}>Lieux, hôtels, activités enregistrés</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tile} activeOpacity={0.85} onPress={() => Alert.alert('Ma galerie', 'Fonctionnalité à venir')}>
              <View style={styles.left}>
                <View style={styles.iconWrap}><ImageIcon color={colors.primary} size={20} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Ma galerie</Text>
                  <Text style={styles.hint}>Souvenirs de voyage</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tile} activeOpacity={0.85} onPress={() => router.push('/settings')}>
              <View style={styles.left}>
                <View style={styles.iconWrap}><Settings color={colors.primary} size={20} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Préférences</Text>
                  <Text style={styles.hint}>Style, budget habituel, destinations favorites</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {!user ? (
            <TouchableOpacity accessibilityRole="button" testID="cta-auth" activeOpacity={0.9} onPress={() => router.push('/auth/signup')} style={styles.cta}>
              <LinearGradient colors={colors.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaInner}>
                <UserPlus color={colors.textInverse} size={18} />
                <Text style={styles.ctaText}>Créer un compte</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity accessibilityRole="button" testID="cta-manage" activeOpacity={0.9} onPress={() => router.push('/settings')} style={styles.cta}>
              <LinearGradient colors={colors.secondaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaInner}>
                <Settings color={colors.textInverse} size={18} />
                <Text style={styles.ctaText}>Gérer mon espace</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
