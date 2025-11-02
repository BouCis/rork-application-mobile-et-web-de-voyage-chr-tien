import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Sparkles } from 'lucide-react-native';
import { Stack } from 'expo-router';
import { useTheme } from '@/store/ThemeContext';
import { themesList, ThemeType } from '@/constants/themes';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

export default function ThemeSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { selectedTheme, changeTheme, colors, spacing, borderRadius, fontSize, fontWeight } = useTheme();

  const handleThemeSelect = (themeId: ThemeType) => {
    changeTheme(themeId);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Thème visuel',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerShown: true,
        }} 
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={colors.darkGradient as any}
          style={StyleSheet.absoluteFillObject}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.header, { paddingTop: spacing.lg }]}>
            <View style={[styles.headerIcon, { backgroundColor: `${colors.primary}15` }]}>
              <Sparkles color={colors.primary} size={28} />
            </View>
            <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSize.xxl, fontWeight: fontWeight.bold }]}>
              Personnalisez votre expérience
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontSize: fontSize.md }]}>
              Choisissez le thème qui correspond à votre style de voyage
            </Text>
          </View>

          <View style={styles.themesContainer}>
            <TouchableOpacity
              onPress={() => handleThemeSelect('system')}
              style={[styles.themeCard, { width: CARD_WIDTH }]}
            >
              <LinearGradient
                colors={['rgba(100, 100, 150, 0.15)', 'rgba(50, 50, 100, 0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.themeCardGradient,
                  { 
                    borderRadius: borderRadius.xl,
                    borderWidth: selectedTheme === 'system' ? 3 : 1,
                    borderColor: selectedTheme === 'system' ? colors.primary : colors.border,
                  }
                ]}
              >
                {selectedTheme === 'system' && (
                  <View style={[styles.selectedBadge, { backgroundColor: colors.primary }]}>
                    <Check color={colors.white} size={16} strokeWidth={3} />
                  </View>
                )}
                <View style={styles.themeCardContent}>
                  <Text style={[styles.themeIcon, { fontSize: fontSize.hero }]}>🔄</Text>
                  <View style={styles.themeInfo}>
                    <Text style={[styles.themeName, { color: colors.text, fontSize: fontSize.xl, fontWeight: fontWeight.bold }]}>
                      Automatique
                    </Text>
                    <Text style={[styles.themeDescription, { color: colors.textSecondary, fontSize: fontSize.sm }]}>
                      Synchroniser avec le système
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {themesList.map((theme) => (
              <TouchableOpacity
                key={theme.id}
                onPress={() => handleThemeSelect(theme.id)}
                style={[styles.themeCard, { width: CARD_WIDTH }]}
              >
                <LinearGradient
                  colors={theme.colors.primaryGradient as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.themeCardGradient,
                    { 
                      borderRadius: borderRadius.xl,
                      borderWidth: selectedTheme === theme.id ? 3 : 0,
                      borderColor: selectedTheme === theme.id ? colors.white : 'transparent',
                    }
                  ]}
                >
                  {selectedTheme === theme.id && (
                    <View style={[styles.selectedBadge, { backgroundColor: colors.white }]}>
                      <Check color={theme.colors.primary} size={16} strokeWidth={3} />
                    </View>
                  )}
                  
                  <View style={styles.themePreview}>
                    {theme.colors.glassEffect ? (
                      <BlurView
                        intensity={30}
                        tint={theme.isDark ? 'dark' : 'light'}
                        style={[styles.previewSurface, { borderRadius: borderRadius.md }]}
                      >
                        <View style={[styles.previewBar, { backgroundColor: theme.colors.text }]} />
                        <View style={[styles.previewBar, { backgroundColor: theme.colors.textSecondary, width: '70%' }]} />
                        <View style={[styles.previewBar, { backgroundColor: theme.colors.textLight, width: '50%' }]} />
                      </BlurView>
                    ) : (
                      <View style={[styles.previewSurface, { backgroundColor: theme.colors.surface, borderRadius: borderRadius.md }]}>
                        <View style={[styles.previewBar, { backgroundColor: theme.colors.text }]} />
                        <View style={[styles.previewBar, { backgroundColor: theme.colors.textSecondary, width: '70%' }]} />
                        <View style={[styles.previewBar, { backgroundColor: theme.colors.textLight, width: '50%' }]} />
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.themeCardContent}>
                    <Text style={[styles.themeIcon, { fontSize: fontSize.hero }]}>{theme.icon}</Text>
                    <View style={styles.themeInfo}>
                      <Text style={[styles.themeName, { color: colors.white, fontSize: fontSize.xl, fontWeight: fontWeight.bold }]}>
                        {theme.name}
                      </Text>
                      <Text style={[styles.themeDescription, { color: 'rgba(255, 255, 255, 0.8)', fontSize: fontSize.sm }]}>
                        {theme.description}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: borderRadius.lg, padding: spacing.lg }]}>
            <Text style={[styles.infoTitle, { color: colors.text, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }]}>
              💡 Le saviez-vous ?
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.sm }]}>
              Chaque thème a été soigneusement conçu pour offrir une expérience optimale selon votre moment de la journée et votre style personnel.
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    textAlign: 'center',
    maxWidth: 300,
  },
  themesContainer: {
    gap: 20,
  },
  themeCard: {
    marginBottom: 4,
  },
  themeCardGradient: {
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  themePreview: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  previewSurface: {
    padding: 12,
    gap: 8,
    overflow: 'hidden',
  },
  previewBar: {
    height: 8,
    borderRadius: 4,
  },
  themeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  themeIcon: {
    lineHeight: 48,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    marginBottom: 4,
  },
  themeDescription: {
  },
  infoCard: {
    marginTop: 32,
    borderWidth: 1,
  },
  infoTitle: {
  },
  infoText: {
    lineHeight: 20,
  },
});
