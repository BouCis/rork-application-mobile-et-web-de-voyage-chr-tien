import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { Mail, LogIn, UserPlus, LogOut, Trash2 } from 'lucide-react-native';
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
    section: { marginTop: spacing.xl, gap: spacing.md },
    sectionTitle: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
    pill: {
      backgroundColor: `${colors.primary}15`,
      borderRadius: borderRadius.lg,
      paddingVertical: 6,
      paddingHorizontal: spacing.md,
      alignSelf: 'flex-start',
    },
    pillText: { color: colors.primary, fontWeight: fontWeight.semibold },
    actions: { marginTop: spacing.xl, gap: spacing.md },
    btn: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
    },
    btnInner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: 12,
      paddingHorizontal: spacing.lg,
    },
    btnText: { color: colors.white, fontWeight: fontWeight.semibold },
    danger: { backgroundColor: `${colors.error}15`, borderRadius: borderRadius.lg, overflow: 'hidden' },
    dangerInner: { paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
    dangerText: { color: colors.error, fontWeight: fontWeight.semibold },
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
                <TouchableOpacity
                  accessibilityRole="button"
                  testID="signup-btn"
                  activeOpacity={0.9}
                  onPress={() => router.push('/auth/signup')}
                  style={styles.btn}
                >
                  <LinearGradient colors={colors.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.btnInner}>
                    <UserPlus color={colors.textInverse} size={18} />
                    <Text style={styles.btnText}>Créer un compte</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  accessibilityRole="button"
                  testID="login-btn"
                  activeOpacity={0.9}
                  onPress={() => router.push('/auth/login')}
                  style={styles.btn}
                >
                  <LinearGradient colors={colors.secondaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.btnInner}>
                    <LogIn color={colors.textInverse} size={18} />
                    <Text style={styles.btnText}>Se connecter</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.actions}>
                <TouchableOpacity
                  accessibilityRole="button"
                  testID="logout-btn"
                  activeOpacity={0.9}
                  onPress={() => logout().catch(() => Alert.alert('Erreur', 'Impossible de se déconnecter'))}
                  style={styles.btn}
                >
                  <LinearGradient colors={colors.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.btnInner}>
                    <LogOut color={colors.textInverse} size={18} />
                    <Text style={styles.btnText}>Se déconnecter</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  accessibilityRole="button"
                  testID="delete-account-btn"
                  activeOpacity={0.9}
                  onPress={() => {
                    Alert.alert('Supprimer mon compte', 'Cette action est irréversible. Confirmer ?', [
                      { text: 'Annuler', style: 'cancel' },
                      { text: 'Supprimer', style: 'destructive', onPress: () => deleteAccount().catch(() => Alert.alert('Erreur', 'Suppression impossible')) },
                    ]);
                  }}
                  style={styles.danger}
                >
                  <View style={styles.dangerInner}>
                    <Trash2 color={colors.error} size={18} />
                    <Text style={styles.dangerText}>Supprimer mon compte</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
