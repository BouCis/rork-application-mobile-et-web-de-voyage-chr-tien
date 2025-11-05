import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { LogIn, Mail, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/store/ThemeContext';
import { useApp } from '@/store/AppContext';
import { trpc } from '@/lib/trpc';
import { router } from 'expo-router';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { saveUser } = useApp();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { alignItems: 'center', marginBottom: 24 },
    title: { fontSize: 28, fontWeight: '800' as const, color: colors.text },
    subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 6 },
    form: { gap: 16 },
    inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14 },
    input: { flex: 1, paddingVertical: 14, color: colors.text },
    btn: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
    btnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
    btnText: { color: colors.white, fontWeight: '700' as const, fontSize: 16 },
    backBtn: { position: 'absolute', left: 16, top: 0 },
    backInner: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 10 },
    backText: { color: colors.text, fontWeight: '600' as const },
  }), [colors]);

  const getByEmail = trpc.users.getByEmail.useQuery(
    { email },
    { enabled: false }
  );

  const onSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Email requis', "Veuillez entrer votre email.");
      return;
    }
    setLoading(true);
    try {
      const found = await getByEmail.refetch();
      const user = found.data;
      if (user) {
        await saveUser({
          id: user.id,
          firstName: user.firstName ?? undefined,
          lastName: user.lastName ?? undefined,
          email: user.email,
          emailVerified: !!user.emailVerified,
          verificationCode: user.verificationCode ?? undefined,
          verificationCodeExpiresAt: user.verificationCodeExpiresAt ?? undefined,
          phone: user.phone ?? undefined,
          dateOfBirth: user.dateOfBirth ?? undefined,
          gender: user.gender ?? undefined,
          nationality: user.nationality ?? undefined,
          departureCity: user.departureCity ?? undefined,
          avatar: user.avatar ?? undefined,
          bio: user.bio ?? undefined,
          preferences: {
            travelStyle: (user as any).travelStyle ?? 'mixed',
            budgetRange: (user as any).budgetRange ?? 'moderate',
            notifications: !!(user as any).notifications,
            inspirations: !!(user as any).inspirations,
          },
          joinedDate: user.joinedDate ?? new Date().toISOString(),
        });
        router.replace('/(tabs)/profile');
      } else {
        Alert.alert(
          'Compte introuvable',
          "Aucun compte n'est associé à cet email.",
          [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Créer un compte', onPress: () => router.replace('/auth/signup') },
          ]
        );
      }
    } catch (e) {
      console.log('[Login] error', e);
      Alert.alert('Erreur', "Impossible de se connecter. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.backgroundSecondary, colors.background]} style={StyleSheet.absoluteFillObject} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 24, paddingTop: insets.top + 16 }}>
          <TouchableOpacity style={styles.backBtn} onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/profile'))}>
            <View style={styles.backInner}>
              <ChevronLeft color={colors.text} size={20} />
              <Text style={styles.backText}>Retour</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Se connecter</Text>
            <Text style={styles.subtitle}>Accédez à votre espace</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrap}>
              <Mail color={colors.textSecondary} size={20} />
              <TextInput
                testID="login-email-input"
                value={email}
                onChangeText={setEmail}
                placeholder="email@exemple.com"
                placeholderTextColor={colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <TouchableOpacity testID="login-submit" disabled={loading} onPress={onSubmit} style={styles.btn} activeOpacity={0.85}>
              <LinearGradient colors={colors.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.btnInner}>
                {loading ? <ActivityIndicator color={colors.white} /> : <LogIn color={colors.textInverse} size={18} />}
                <Text style={styles.btnText}>{loading ? 'Connexion…' : 'Se connecter'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
