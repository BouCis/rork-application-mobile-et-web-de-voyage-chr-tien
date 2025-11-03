import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Sun, Moon, Smartphone, Check, Sparkles } from 'lucide-react-native';
import { Stack } from 'expo-router';
import { useTheme } from '@/store/ThemeContext';
import { ColorSchemeType } from '@/constants/themes';
import { BlurView } from 'expo-blur';

const colorSchemes: { id: ColorSchemeType; name: string; description: string; icon: any }[] = [
  { id: 'light', name: 'Clair', description: 'Mode lumineux pour la journée', icon: Sun },
  { id: 'dark', name: 'Sombre', description: 'Mode sombre pour la nuit', icon: Moon },
  { id: 'system', name: 'Automatique', description: 'Synchronise avec le système', icon: Smartphone },
];

export default function ThemeSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { selectedColorScheme, changeColorScheme, colors, spacing, borderRadius, fontSize, fontWeight, shadows } = useTheme();

  const handleSchemeSelect = (schemeId: ColorSchemeType) => {
    changeColorScheme(schemeId);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Apparence',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerShown: true,
        }} 
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={colors.glassGradient as any}
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
            <LinearGradient
              colors={colors.neonGradient as any}
              style={[styles.headerIcon, shadows.neon]}
            >
              <Sparkles color={colors.white} size={28} strokeWidth={2.5} />
            </LinearGradient>
            <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSize.xxxl, fontWeight: fontWeight.bold }]}>
              NEON LUX
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.gold, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }]}>
              Gold Whisper
            </Text>
            <Text style={[styles.headerDescription, { color: colors.textSecondary, fontSize: fontSize.md, marginTop: spacing.sm }]}>
              Inspiré d&apos;iOS 26 & Vision Pro
            </Text>
          </View>

          <View style={[styles.schemesContainer, { gap: spacing.md }]}>
            {colorSchemes.map((scheme) => {
              const Icon = scheme.icon;
              const isSelected = selectedColorScheme === scheme.id;

              return (
                <TouchableOpacity
                  key={scheme.id}
                  onPress={() => handleSchemeSelect(scheme.id)}
                  activeOpacity={0.7}
                  style={styles.schemeCard}
                >
                  <BlurView
                    intensity={colors.glassEffect ? 30 : 0}
                    tint={colors.glassEffect ? (colors.text === '#FFFFFF' ? 'dark' : 'light') : 'default'}
                    style={[
                      styles.schemeCardBlur,
                      { 
                        backgroundColor: colors.glassEffect ? 'transparent' : colors.surface,
                        borderRadius: borderRadius.xl,
                        borderWidth: isSelected ? 2 : 1,
                        borderColor: isSelected ? colors.secondary : colors.border,
                      },
                      isSelected && shadows.neon,
                    ]}
                  >
                    <View style={styles.schemeCardContent}>
                      <View style={[
                        styles.schemeIconContainer, 
                        { 
                          backgroundColor: isSelected ? `${colors.secondary}20` : `${colors.textMuted}`,
                        }
                      ]}>
                        <Icon 
                          color={isSelected ? colors.secondary : colors.textSecondary} 
                          size={24} 
                          strokeWidth={2.5}
                        />
                      </View>
                      
                      <View style={styles.schemeInfo}>
                        <Text style={[
                          styles.schemeName, 
                          { 
                            color: colors.text, 
                            fontSize: fontSize.lg, 
                            fontWeight: fontWeight.semibold 
                          }
                        ]}>
                          {scheme.name}
                        </Text>
                        <Text style={[
                          styles.schemeDescription, 
                          { 
                            color: colors.textSecondary, 
                            fontSize: fontSize.sm 
                          }
                        ]}>
                          {scheme.description}
                        </Text>
                      </View>

                      {isSelected && (
                        <View style={[
                          styles.selectedBadge, 
                          { backgroundColor: colors.secondary },
                          shadows.glow(colors.secondary),
                        ]}>
                          <Check color={colors.white} size={18} strokeWidth={3} />
                        </View>
                      )}
                    </View>
                  </BlurView>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[styles.previewSection, { marginTop: spacing.xxl, gap: spacing.md }]}>
            <Text style={[
              styles.previewTitle, 
              { 
                color: colors.text, 
                fontSize: fontSize.xl, 
                fontWeight: fontWeight.semibold 
              }
            ]}>
              Aperçu des couleurs
            </Text>

            <View style={[styles.colorGrid, { gap: spacing.sm }]}>
              <View style={styles.colorRow}>
                <View style={[styles.colorSwatch, { backgroundColor: colors.primary }, shadows.md]}>
                  <Text style={[styles.colorLabel, { color: colors.white, fontSize: fontSize.xs }]}>Primary</Text>
                </View>
                <View style={[styles.colorSwatch, { backgroundColor: colors.secondary }, shadows.neon]}>
                  <Text style={[styles.colorLabel, { color: colors.white, fontSize: fontSize.xs }]}>Neon</Text>
                </View>
              </View>
              
              <View style={styles.colorRow}>
                <View style={[styles.colorSwatch, { backgroundColor: colors.gold }, shadows.gold]}>
                  <Text style={[styles.colorLabel, { color: colors.textInverse, fontSize: fontSize.xs, fontWeight: fontWeight.semibold }]}>Gold</Text>
                </View>
                <View style={[styles.colorSwatch, { backgroundColor: colors.accent }, shadows.md]}>
                  <Text style={[styles.colorLabel, { color: colors.white, fontSize: fontSize.xs }]}>Accent</Text>
                </View>
              </View>
            </View>

            <LinearGradient
              colors={colors.goldGradient as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.gradientPreview, { borderRadius: borderRadius.lg }, shadows.gold]}
            >
              <Text style={[
                styles.gradientLabel, 
                { 
                  color: colors.textInverse, 
                  fontSize: fontSize.md, 
                  fontWeight: fontWeight.bold 
                }
              ]}>
                Gold Gradient
              </Text>
            </LinearGradient>
          </View>

          <BlurView
            intensity={20}
            tint={colors.text === '#FFFFFF' ? 'dark' : 'light'}
            style={[
              styles.infoCard, 
              { 
                backgroundColor: colors.glassEffect ? 'transparent' : colors.surface,
                borderColor: colors.borderLight,
                borderRadius: borderRadius.lg, 
                padding: spacing.lg,
                marginTop: spacing.xl,
              }
            ]}
          >
            <View style={[styles.infoIconContainer, { backgroundColor: `${colors.gold}20` }]}>
              <Sparkles color={colors.gold} size={20} strokeWidth={2.5} />
            </View>
            <Text style={[
              styles.infoTitle, 
              { 
                color: colors.text, 
                fontSize: fontSize.lg, 
                fontWeight: fontWeight.semibold,
                marginTop: spacing.sm,
              }
            ]}>
              Design Liquid Glass
            </Text>
            <Text style={[
              styles.infoText, 
              { 
                color: colors.textSecondary, 
                fontSize: fontSize.sm, 
                marginTop: spacing.xs,
                lineHeight: 20,
              }
            ]}>
              Un thème unique inspiré des interfaces iOS 26 et Vision Pro, avec des reflets &ldquo;liquid glass&rdquo; et des touches d&apos;or pâle subtilement placées pour une expérience premium.
            </Text>
          </BlurView>
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
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    textAlign: 'center',
    letterSpacing: 2,
  },
  headerSubtitle: {
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: 4,
  },
  headerDescription: {
    textAlign: 'center',
  },
  schemesContainer: {
  },
  schemeCard: {
  },
  schemeCardBlur: {
    padding: 20,
    overflow: 'hidden',
  },
  schemeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  schemeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  schemeInfo: {
    flex: 1,
  },
  schemeName: {
    marginBottom: 2,
  },
  schemeDescription: {
  },
  selectedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewSection: {
  },
  previewTitle: {
  },
  colorGrid: {
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorSwatch: {
    flex: 1,
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorLabel: {
  },
  gradientPreview: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientLabel: {
  },
  infoCard: {
    borderWidth: 1,
    alignItems: 'center',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: {
    textAlign: 'center',
  },
  infoText: {
    textAlign: 'center',
  },
});
