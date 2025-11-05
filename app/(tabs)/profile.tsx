import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { Mail, LogIn, UserPlus, LogOut, Trash2, User, Bookmark, Wallet, MapPin, ImageIcon, Settings } from 'lucide-react-native';
import { useTheme } from '@/store/ThemeContext';
import { useApp } from '@/store/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { colors, spacing, borderRadius, fontSize, fontWeight } = useTheme();
  const { user, logout, deleteAccount } = useApp();
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
    card: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      gap: spacing.md,
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    avatarWrap: { width: 96, height: 96, borderRadius: 96, overflow: 'hidden' },
    avatar: { width: 96, height: 96, borderRadius: 96 },
    avatarGradient: { width: 96, height: 96, borderRadius: 96, alignItems: 'center', justifyContent: 'center' },
    initials: { color: colors.textInverse, fontSize: 32, fontWeight: '700' as const },
    name: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text },
    email: { fontSize: fontSize.sm, color: colors.textSecondary },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.xs },
    actions: { marginTop: spacing.lg, gap: spacing.md },
    btn: { borderRadius: borderRadius.lg, overflow: 'hidden' },
    btnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: 12, paddingHorizontal: spacing.lg },
    btnText: { color: colors.white, fontWeight: fontWeight.semibold },
    danger: { backgroundColor: `${colors.error}15`, borderRadius: borderRadius.lg, overflow: 'hidden' },
    dangerInner: { paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
    dangerText: { color: colors.error, fontWeight: fontWeight.semibold },
    grid: { marginTop: spacing.xl, backgroundColor: colors.surface, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
    gridRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
    gridItem: { flex: 1, paddingVertical: spacing.lg, paddingHorizontal: spacing.md, alignItems: 'center', gap: 8, borderRightWidth: 1, borderRightColor: colors.border },
    gridItemLast: { borderRightWidth: 0 },
    gridLabel: { fontSize: fontSize.sm, color: colors.text, fontWeight: fontWeight.semibold },
    section: { marginTop: spacing.xl, gap: spacing.sm },
    sectionTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text },
    list: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
    item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
    itemLast: { borderBottomWidth: 0 },
    itemLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    itemIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: `${colors.primary}15` },
    itemLabel: { color: colors.text, fontWeight: fontWeight.medium },
    itemHint: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 2 },
  });

  return (
    <View style={styles.container} testID="profile-screen">
      <Stack.Screen options={{ title: 'Mon espace', headerShown: false }} />
      <LinearGradient colors={[colors.background, colors.backgroundSecondary]} style={styles.headerBg} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} style={{ flex: 1 }}>
        <View style={[styles.content]}>
          <View style={styles.card} testID="profile-card">
            <View style={styles.row}>
              <View style={styles.avatarWrap}>
                {user?.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                ) : (
                  <LinearGradient colors={colors.primaryGradient} style={styles.avatarGradient}>
                    <Text style={styles.initials}>{initials}</Text>
                  </LinearGradient>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name} numberOfLines={1}>
                  {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Invité'}
                </Text>
                <View style={styles.metaRow}>
                  <Mail size={16} color={colors.textSecondary} />
                  <Text style={styles.email} numberOfLines={1}>{user?.email ?? 'Non connecté'}</Text>
                </View>
              </View>
            </View>

            {!user ? (
              <View style={styles.actions}>
                <TouchableOpacity accessibilityRole="button" testID="signup-btn" activeOpacity={0.9} onPress={() => router.push('/auth/signup')} style={styles.btn}>
                  <LinearGradient colors={colors.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.btnInner}>
                    <UserPlus color={colors.textInverse} size={18} />
                    <Text style={styles.btnText}>Créer un compte</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity accessibilityRole="button" testID="login-btn" activeOpacity={0.9} onPress={() => router.push('/auth/login')} style={styles.btn}>
                  <LinearGradient colors={colors.secondaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.btnInner}>
                    <LogIn color={colors.textInverse} size={18} />
                    <Text style={styles.btnText}>Se connecter</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.actions}>
                <TouchableOpacity accessibilityRole="button" testID="logout-btn" activeOpacity={0.9} onPress={() => logout().catch(() => Alert.alert('Erreur', 'Impossible de se déconnecter'))} style={styles.btn}>
                  <LinearGradient colors={colors.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.btnInner}>
                    <LogOut color={colors.textInverse} size={18} />
                    <Text style={styles.btnText}>Se déconnecter</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity accessibilityRole="button" testID="delete-account-btn" activeOpacity={0.9} onPress={() => {
                  Alert.alert('Supprimer mon compte', 'Cette action est irréversible. Confirmer ?', [
                    { text: 'Annuler', style: 'cancel' },
                    { text: 'Supprimer', style: 'destructive', onPress: () => deleteAccount().catch(() => Alert.alert('Erreur', 'Suppression impossible')) },
                  ]);
                }} style={styles.danger}>
                  <View style={styles.dangerInner}>
                    <Trash2 color={colors.error} size={18} />
                    <Text style={styles.dangerText}>Supprimer mon compte</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.grid}>
            <View style={styles.gridRow}>
              <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/settings/account')}>
                <View style={styles.itemIconWrap}><User color={colors.primary} size={20} /></View>
                <Text style={styles.gridLabel}>Mon profil</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/(tabs)/planner')}>
                <View style={styles.itemIconWrap}><MapPin color={colors.primary} size={20} /></View>
                <Text style={styles.gridLabel}>Mes voyages</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.gridItem, styles.gridItemLast]} onPress={() => router.push('/trip/budget-admin')}>
                <View style={styles.itemIconWrap}><Wallet color={colors.primary} size={20} /></View>
                <Text style={styles.gridLabel}>Budget & admin</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.gridRow, { borderBottomWidth: 0 }]}>
              <TouchableOpacity style={styles.gridItem} onPress={() => Alert.alert('Favoris', 'Fonctionnalité à venir')}>
                <View style={styles.itemIconWrap}><Bookmark color={colors.primary} size={20} /></View>
                <Text style={styles.gridLabel}>Favoris</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.gridItem} onPress={() => Alert.alert('Ma galerie', 'Fonctionnalité à venir')}>
                <View style={styles.itemIconWrap}><ImageIcon color={colors.primary} size={20} /></View>
                <Text style={styles.gridLabel}>Ma galerie</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.gridItem, styles.gridItemLast]} onPress={() => Alert.alert('Préférences', 'Style, budget habituel, destinations favorites')}>
                <View style={styles.itemIconWrap}><Settings color={colors.primary} size={20} /></View>
                <Text style={styles.gridLabel}>Préférences</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compte</Text>
            <View style={styles.list}>
              <TouchableOpacity style={styles.item} onPress={() => router.push('/auth/login')}>
                <View style={styles.itemLeft}>
                  <View style={styles.itemIconWrap}><LogIn color={colors.primary} size={18} /></View>
                  <View>
                    <Text style={styles.itemLabel}>{user ? 'Changer de compte' : 'Se connecter'}</Text>
                    <Text style={styles.itemHint}>{user ? user.email : 'Accéder à votre espace'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
