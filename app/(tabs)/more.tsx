import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Plane,
  Car,
  MessageSquare,
  Settings,
  HelpCircle,
  Info,
  ChevronRight,
  Sparkles,
  DollarSign,
  Phone,
  Globe,
  Calculator,
  BookOpen,
} from 'lucide-react-native';

import { useTheme } from '@/store/ThemeContext';

const { width } = Dimensions.get('window');

interface MenuItem {
  icon: React.ElementType;
  label: string;
  description?: string;
  onPress: () => void;
  color: string;
}

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const handleFlightsPress = useCallback(() => {
    console.log('[More] Flights pressed');
    Alert.alert(
      '✈️ Vols',
      'Recherche et réservation de vols.\n\nFonctionnalité à venir.',
      [{ text: 'OK' }]
    );
  }, []);

  const handleRentalsPress = useCallback(() => {
    console.log('[More] Rentals pressed');
    Alert.alert(
      '🚗 Locations de voiture',
      'Comparez et réservez des voitures de location.\n\nFonctionnalité à venir.',
      [{ text: 'OK' }]
    );
  }, []);

  const handleForumPress = useCallback(() => {
    console.log('[More] Forum pressed');
    Alert.alert(
      '💬 Forum de voyage',
      'Partagez vos expériences et conseils.\n\nFonctionnalité à venir.',
      [{ text: 'OK' }]
    );
  }, []);

  const handleCurrencyPress = useCallback(() => {
    console.log('[More] Currency converter pressed');
    router.push('/tools/currency-converter');
  }, []);

  const handleEmergencyPress = useCallback(() => {
    console.log('[More] Emergency numbers pressed');
    router.push('/tools/emergency-numbers');
  }, []);

  const handlePhraseGuidePress = useCallback(() => {
    console.log('[More] Phrase guide pressed');
    router.push('/tools/phrase-guide');
  }, []);

  const handleBudgetPress = useCallback(() => {
    console.log('[More] Budget calculator pressed');
    Alert.alert(
      '💰 Calculateur de budget',
      'Planifiez et gérez votre budget de voyage.\n\nFonctionnalité à venir.',
      [{ text: 'OK' }]
    );
  }, []);

  const handleJournalPress = useCallback(() => {
    console.log('[More] Travel journal pressed');
    Alert.alert(
      '📖 Carnet de voyage',
      'Documentez vos aventures et souvenirs.\n\nFonctionnalité à venir.',
      [{ text: 'OK' }]
    );
  }, []);



  const handleSettingsPress = useCallback(() => {
    console.log('[More] Settings pressed');
    router.push('/settings');
  }, []);

  const handleHelpPress = useCallback(() => {
    console.log('[More] Help pressed');
    Alert.alert(
      'Aide & Support',
      'Besoin d\'aide ?\n\nContactez-nous à support@voyageapp.com',
      [{ text: 'OK' }]
    );
  }, []);

  const handleAboutPress = useCallback(() => {
    console.log('[More] About pressed');
    Alert.alert(
      'À propos',
      'Version 1.0.0\n\nVotre compagnon de voyage idéal.',
      [{ text: 'OK' }]
    );
  }, []);

  const travelServices: MenuItem[] = [
    {
      icon: Plane,
      label: 'Vols',
      description: 'Rechercher et réserver',
      onPress: handleFlightsPress,
      color: '#3B82F6',
    },
    {
      icon: Car,
      label: 'Locations',
      description: 'Louer une voiture',
      onPress: handleRentalsPress,
      color: '#10B981',
    },
    {
      icon: MessageSquare,
      label: 'Forum',
      description: 'Communauté voyage',
      onPress: handleForumPress,
      color: '#06B6D4',
    },
  ];

  const travelTools: MenuItem[] = [
    {
      icon: DollarSign,
      label: 'Devises',
      description: 'Convertisseur de monnaie',
      onPress: handleCurrencyPress,
      color: '#F59E0B',
    },
    {
      icon: Phone,
      label: 'Urgences',
      description: 'Numéros d\'urgence',
      onPress: handleEmergencyPress,
      color: '#EF4444',
    },
    {
      icon: Globe,
      label: 'Phrases',
      description: 'Guide de conversation',
      onPress: handlePhraseGuidePress,
      color: '#8B5CF6',
    },
    {
      icon: Calculator,
      label: 'Budget',
      description: 'Calculateur de budget',
      onPress: handleBudgetPress,
      color: '#EC4899',
    },
    {
      icon: BookOpen,
      label: 'Carnet',
      description: 'Journal de voyage',
      onPress: handleJournalPress,
      color: '#14B8A6',
    },
  ];



  const settingsItems = [
    {
      icon: Settings,
      label: 'Paramètres',
      onPress: handleSettingsPress,
    },
    {
      icon: HelpCircle,
      label: 'Aide & Support',
      onPress: handleHelpPress,
    },
    {
      icon: Info,
      label: 'À propos',
      onPress: handleAboutPress,
    },
  ];

  const dynamicStyles = StyleSheet.create({
    title: {
      color: colors.text,
    },
    subtitle: {
      color: colors.textSecondary,
    },
    sparkleContainer: {
      backgroundColor: `${colors.primary}15`,
    },
    sectionTitle: {
      color: colors.textSecondary,
    },
    sectionTitleLarge: {
      color: colors.text,
    },
    compactGrid: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    compactCard: {
      borderBottomColor: colors.border,
    },
    compactLabel: {
      color: colors.text,
    },
    compactDescription: {
      color: colors.textSecondary,
    },
    listContainer: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    listItem: {
      borderBottomColor: colors.border,
    },
    listIcon: {
      backgroundColor: `${colors.text}08`,
    },
    listItemText: {
      color: colors.text,
    },
    logoutButton: {
      backgroundColor: `${colors.error}10`,
      borderColor: `${colors.error}30`,
    },
    logoutText: {
      color: colors.error,
    },
    version: {
      color: colors.textSecondary,
    },
    copyright: {
      color: colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.backgroundSecondary, colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, dynamicStyles.title]}>Plus</Text>
            <View style={[styles.sparkleContainer, dynamicStyles.sparkleContainer]}>
              <Sparkles color={colors.primary} size={24} />
            </View>
          </View>
          <Text style={[styles.subtitle, dynamicStyles.subtitle]}>Explorez tous nos services</Text>
        </View>



        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Plane color={colors.primary} size={18} />
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Services Voyage</Text>
          </View>
          <View style={[styles.compactGrid, dynamicStyles.compactGrid]}>
            {travelServices.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.compactCard, dynamicStyles.compactCard]}
                onPress={item.onPress}
                activeOpacity={0.8}
              >
                <View style={[styles.compactIcon, { backgroundColor: `${item.color}20` }]}>
                  <item.icon color={item.color} size={22} />
                </View>
                <View style={styles.compactContent}>
                  <Text style={[styles.compactLabel, dynamicStyles.compactLabel]}>{item.label}</Text>
                  <Text style={[styles.compactDescription, dynamicStyles.compactDescription]}>{item.description}</Text>
                </View>
                <ChevronRight color={colors.textSecondary} size={18} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Sparkles color={colors.accent} size={18} />
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Outils Voyage</Text>
          </View>
          <View style={[styles.compactGrid, dynamicStyles.compactGrid]}>
            {travelTools.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.compactCard, dynamicStyles.compactCard, index === travelTools.length - 1 && styles.compactCardLast]}
                onPress={item.onPress}
                activeOpacity={0.8}
              >
                <View style={[styles.compactIcon, { backgroundColor: `${item.color}20` }]}>
                  <item.icon color={item.color} size={22} />
                </View>
                <View style={styles.compactContent}>
                  <Text style={[styles.compactLabel, dynamicStyles.compactLabel]}>{item.label}</Text>
                  <Text style={[styles.compactDescription, dynamicStyles.compactDescription]}>{item.description}</Text>
                </View>
                <ChevronRight color={colors.textSecondary} size={18} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Général</Text>
          <View style={[styles.listContainer, dynamicStyles.listContainer]}>
            {settingsItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.listItem,
                  dynamicStyles.listItem,
                  index === settingsItems.length - 1 && styles.listItemLast,
                ]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.listItemLeft}>
                  <View style={[styles.listIcon, dynamicStyles.listIcon]}>
                    <item.icon color={colors.text} size={20} />
                  </View>
                  <Text style={[styles.listItemText, dynamicStyles.listItemText]}>{item.label}</Text>
                </View>
                <ChevronRight color={colors.textSecondary} size={18} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.version, dynamicStyles.version]}>Version 1.0.0</Text>
          <Text style={[styles.copyright, dynamicStyles.copyright]}>© 2025 VoyageApp</Text>
        </View>
      </ScrollView>
    </View>
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
    paddingHorizontal: 24,
  },
  headerContainer: {
    marginBottom: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 40,
    fontWeight: '800' as const,
    letterSpacing: -1,
  },
  sparkleContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 15,
    marginTop: 4,
    fontWeight: '400' as const,
  },
  featuredSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitleLarge: {
    fontSize: 22,
    fontWeight: '700' as const,
  },
  horizontalScrollView: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  horizontalScroll: {
    flexDirection: 'row',
    gap: 12,
  },
  featuredCard: {
    width: width * 0.4,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  featuredGradient: {
    padding: 20,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  featuredIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featuredLabel: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500' as const,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  compactGrid: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderBottomWidth: 1,
  },
  compactCardLast: {
    borderBottomWidth: 0,
  },
  compactIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactContent: {
    flex: 1,
  },
  compactLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  compactDescription: {
    fontSize: 13,
  },
  listContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  listItemLast: {
    borderBottomWidth: 0,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  listIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  logoutButton: {
    marginTop: 12,
    marginBottom: 24,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 4,
  },
  version: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  copyright: {
    fontSize: 12,
    opacity: 0.6,
  },
});
