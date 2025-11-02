import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Check, ArrowLeft } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useApp } from '@/store/AppContext';
import { router, useLocalSearchParams } from 'expo-router';

export default function VerifyEmailScreen() {
  const insets = useSafeAreaInsets();
  const { user, saveUser } = useApp();
  const params = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationEmail = async (email: string, verificationCode: string): Promise<boolean> => {
    try {
      console.log(`📧 Email de vérification envoyé à ${email}`);
      console.log(`📋 Code de vérification: ${verificationCode}`);
      console.log(`⏰ Expiration: 15 minutes`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return false;
    }
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      Alert.alert('Code requis', 'Veuillez entrer le code de vérification.');
      return;
    }

    if (code.length !== 6) {
      Alert.alert('Code invalide', 'Le code de vérification doit contenir 6 chiffres.');
      return;
    }

    if (!user) {
      Alert.alert('Erreur', 'Utilisateur non trouvé.');
      return;
    }

    try {
      setLoading(true);

      if (user.verificationCode !== code) {
        Alert.alert('Code incorrect', 'Le code de vérification est incorrect. Veuillez réessayer.');
        return;
      }

      if (user.verificationCodeExpiresAt) {
        const expiryDate = new Date(user.verificationCodeExpiresAt);
        if (new Date() > expiryDate) {
          Alert.alert(
            'Code expiré',
            'Le code de vérification a expiré. Veuillez demander un nouveau code.'
          );
          return;
        }
      }

      const updatedUser = {
        ...user,
        emailVerified: true,
        verificationCode: undefined,
        verificationCodeExpiresAt: undefined,
      };

      await saveUser(updatedUser);

      Alert.alert(
        'Email vérifié ! ✅',
        'Votre email a été vérifié avec succès. Vous pouvez maintenant profiter de toutes les fonctionnalités.',
        [
          {
            text: 'Continuer',
            onPress: () => router.replace('/(tabs)/planner'),
          },
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      Alert.alert('Erreur', 'Impossible de vérifier le code. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!user || countdown > 0) return;

    try {
      setResending(true);

      const newCode = generateVerificationCode();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);

      const emailSuccess = await sendVerificationEmail(user.email, newCode);

      if (emailSuccess) {
        const updatedUser = {
          ...user,
          verificationCode: newCode,
          verificationCodeExpiresAt: expiresAt.toISOString(),
        };

        await saveUser(updatedUser);

        Alert.alert(
          'Code renvoyé',
          `Un nouveau code de vérification a été envoyé à ${user.email}.`
        );
        setCountdown(60);
      } else {
        Alert.alert('Erreur', 'Impossible d\'envoyer le code. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors du renvoi du code:', error);
      Alert.alert('Erreur', 'Impossible de renvoyer le code. Veuillez réessayer.');
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.backgroundDark, theme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Mail color={theme.colors.primary} size={48} />
          </View>
        </View>

        <Text style={styles.title}>Vérifiez votre email</Text>
        <Text style={styles.subtitle}>
          Nous avons envoyé un code de vérification à
        </Text>
        <Text style={styles.email}>{params.email || user?.email}</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Code de vérification</Text>
          <TextInput
            style={styles.input}
            placeholder="123456"
            placeholderTextColor={theme.colors.textLight}
            value={code}
            onChangeText={(text) => {
              const cleaned = text.replace(/[^0-9]/g, '');
              if (cleaned.length <= 6) {
                setCode(cleaned);
              }
            }}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
          />

          <TouchableOpacity
            style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
            onPress={handleVerify}
            disabled={loading}
          >
            <LinearGradient
              colors={theme.colors.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.verifyButtonGradient}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <>
                  <Check color={theme.colors.white} size={20} />
                  <Text style={styles.verifyButtonText}>Vérifier</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Vous n&apos;avez pas reçu le code ?</Text>
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={countdown > 0 || resending}
          >
            {resending ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Text
                style={[
                  styles.resendButton,
                  countdown > 0 && styles.resendButtonDisabled,
                ]}
              >
                {countdown > 0 ? `Renvoyer (${countdown}s)` : 'Renvoyer le code'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Le code est valide pendant 15 minutes. Vérifiez également vos spams.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${theme.colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  email: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  formContainer: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: theme.spacing.lg,
  },
  verifyButton: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  verifyButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
  },
  resendText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  resendButton: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  resendButtonDisabled: {
    color: theme.colors.textLight,
  },
  infoBox: {
    backgroundColor: `${theme.colors.primary}10`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
});
