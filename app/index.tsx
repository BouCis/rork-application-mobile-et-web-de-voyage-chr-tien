import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Plane, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/store/ThemeContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const logoScale = useRef(new Animated.Value(0.85)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const planeRotate = useRef(new Animated.Value(0)).current;
  const sparkleScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 7,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(planeRotate, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          delay: 100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(sparkleScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          delay: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const navTimeout = setTimeout(() => {
      try {
        router.replace('/(tabs)/planner');
      } catch (e) {
        console.log('Navigation error from welcome to planner', e);
      }
    }, 1800);

    return () => clearTimeout(navTimeout);
  }, [router, logoOpacity, logoScale, textOpacity, textTranslateY, planeRotate, sparkleScale]);

  const planeRotateValue = planeRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['45deg', '0deg'],
  });

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
      paddingHorizontal: 32,
      gap: 32,
    },
    logoContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoCard: {
      backgroundColor: colors.surface,
      borderRadius: 32,
      padding: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 8,
    },
    logo: {
      width: 96,
      height: 96,
      borderRadius: 20,
    },
    planeIcon: {
      position: 'absolute',
      top: -10,
      right: -10,
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 999,
      borderWidth: 3,
      borderColor: colors.background,
    },
    sparkleIcon: {
      position: 'absolute',
      bottom: -8,
      left: -8,
      backgroundColor: colors.secondary,
      padding: 10,
      borderRadius: 999,
      borderWidth: 3,
      borderColor: colors.background,
    },
    textContainer: {
      alignItems: 'center',
      gap: 8,
    },
    appName: {
      color: colors.text,
      fontSize: 36,
      fontWeight: '800' as const,
      letterSpacing: 1,
      textAlign: 'center',
    },
    tagline: {
      color: colors.textSecondary,
      fontSize: 16,
      fontWeight: '600' as const,
      textAlign: 'center',
      letterSpacing: 0.3,
    },
    footer: {
      position: 'absolute',
      bottom: 48,
      left: 0,
      right: 0,
      alignItems: 'center',
      gap: 12,
    },
    loadingText: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '500' as const,
    },
    dots: {
      flexDirection: 'row',
      gap: 6,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.primary,
      opacity: 0.6,
    },
  }), [colors]);

  return (
    <SafeAreaView style={styles.container} testID="welcome-safearea">
      <LinearGradient
        colors={isDark ? [colors.background, colors.backgroundSecondary, colors.background] : [colors.background, colors.backgroundLight, colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      <View style={styles.content} testID="welcome-content">
        <Animated.View 
          style={[
            styles.logoContainer,
            { transform: [{ scale: logoScale }], opacity: logoOpacity }
          ]} 
          testID="welcome-logo-container"
        >
          <View style={styles.logoCard}>
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.logo}
              contentFit="cover"
              transition={200}
            />
          </View>
          
          <Animated.View 
            style={[
              styles.planeIcon,
              { transform: [{ rotate: planeRotateValue }] }
            ]}
          >
            <Plane color="#FFF" size={20} strokeWidth={2.5} />
          </Animated.View>

          <Animated.View 
            style={[
              styles.sparkleIcon,
              { transform: [{ scale: sparkleScale }] }
            ]}
          >
            <Sparkles color="#FFF" size={16} strokeWidth={2.5} />
          </Animated.View>
        </Animated.View>

        <Animated.View 
          style={[
            styles.textContainer,
            { opacity: textOpacity, transform: [{ translateY: textTranslateY }] }
          ]} 
          testID="welcome-text-wrap"
        >
          <Text style={styles.appName} testID="welcome-title">Sacàdos</Text>
          <Text style={styles.tagline} testID="welcome-tagline">Votre compagnon de voyage ✈️</Text>
        </Animated.View>
      </View>

      <View style={styles.footer} pointerEvents="none">
        <Text style={styles.loadingText}>Préparation de votre aventure…</Text>
        <View style={styles.dots}>
          <View style={[styles.dot, { opacity: 0.9 }]} />
          <View style={[styles.dot, { opacity: 0.6 }]} />
          <View style={[styles.dot, { opacity: 0.3 }]} />
        </View>
      </View>
    </SafeAreaView>
  );
}
