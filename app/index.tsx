import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useTheme } from '@/store/ThemeContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors, fontSize, fontWeight, spacing, borderRadius, shadows, animation } = useTheme();

  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: animation.normal,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: animation.normal,
          delay: 80,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: animation.normal,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const navTimeout = setTimeout(() => {
      try {
        router.replace('/planner');
      } catch (e) {
        console.log('Navigation error from welcome to planner', e);
      }
    }, 1600);

    return () => clearTimeout(navTimeout);
  }, [router, animation.normal, logoOpacity, logoScale, textOpacity, textTranslateY]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    gradient: {
      ...StyleSheet.absoluteFillObject,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
      gap: spacing.lg,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      width: 200,
      height: 200,
      ...shadows.lg,
    },
    appName: {
      color: colors.text,
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.extrabold,
      letterSpacing: 0.5,
      textAlign: 'center',
    },
    tagline: {
      color: colors.textSecondary,
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      textAlign: 'center',
      marginTop: spacing.xs,
    },
    footer: {
      position: 'absolute',
      bottom: spacing.xl,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    logo: {
      width: 96,
      height: 96,
      borderRadius: borderRadius.lg,
    },
  }), [colors, fontSize, fontWeight, spacing, borderRadius, shadows]);

  return (
    <SafeAreaView style={styles.container} testID="welcome-safearea">
      <LinearGradient
        colors={[colors.background, colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      <View style={styles.content} testID="welcome-content">
        <Animated.View style={[styles.card, { transform: [{ scale: logoScale }], opacity: logoOpacity }]} testID="welcome-logo-card">
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
            contentFit="cover"
            transition={200}
          />
        </Animated.View>

        <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: textTranslateY }] }} testID="welcome-text-wrap">
          <Text style={styles.appName} testID="welcome-title">Voyage Planner</Text>
          <Text style={styles.tagline} testID="welcome-tagline">Planifiez. Réservez. Partez.</Text>
        </Animated.View>
      </View>

      <View style={styles.footer} pointerEvents="none">
        <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>Chargement de l&apos;accueil…</Text>
      </View>
    </SafeAreaView>
  );
}
