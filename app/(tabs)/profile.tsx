import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { Mail, Edit3 } from 'lucide-react-native';
import { useTheme } from '@/store/ThemeContext';
import { useApp } from '@/store/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { colors, spacing, borderRadius, fontSize, fontWeight } = useTheme();
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
    editBtn: {
      marginTop: spacing.lg,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
    },
    editBtnInner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: 12,
      paddingHorizontal: spacing.lg,
    },
    editText: { color: colors.white, fontWeight: fontWeight.semibold },
  });

  return (
    <View style={styles.container} testID="profile-screen">
      <Stack.Screen options={{ title: 'Mon profil', headerShown: false }} />
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
                  {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Voyageur'}
                </Text>
                <View style={styles.metaRow}>
                  <Mail size={16} color={colors.textSecondary} />
                  <Text style={styles.email} numberOfLines={1}>{user?.email ?? 'email@example.com'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Préférences</Text>
              <View style={styles.row}>
                <View style={styles.pill}><Text style={styles.pillText}>Voyageur moderne</Text></View>
                <View style={styles.pill}><Text style={styles.pillText}>EUR (€)</Text></View>
              </View>
            </View>

            <TouchableOpacity
              accessibilityRole="button"
              testID="edit-profile-btn"
              activeOpacity={0.85}
              onPress={() => router.push('/settings/account')}
              style={styles.editBtn}
            >
              <LinearGradient colors={colors.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.editBtnInner}>
                <Edit3 color={colors.textInverse} size={18} />
                <Text style={styles.editText}>Modifier mon profil</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
