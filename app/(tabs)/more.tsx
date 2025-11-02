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
  LogOut,
  ChevronRight,
  BookOpen,
  Heart,
  Music,
  Sparkles,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useApp } from '@/store/AppContext';

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
  const { user } = useApp();

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

  const handleLogoutPress = useCallback(() => {
    console.log('[More] Logout pressed');
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: () => console.log('User logged out')
        }
      ]
    );
  }, []);

  const spiritualItems: MenuItem[] = [
    {
      icon: Heart,
      label: 'Spiritualité',
      description: 'Méditation & prières',
      onPress: () => router.push('/(tabs)/spiritual'),
      color: '#FF6B9D',
    },
    {
      icon: Music,
      label: 'Musique',
      description: 'Playlists & sons',
      onPress: () => router.push('/music/player'),
      color: '#8B5CF6',
    },
    {
      icon: BookOpen,
      label: 'Bible',
      description: 'Lire & découvrir',
      onPress: () => router.push('/bible/reader'),
      color: '#F59E0B',
    },
  ];

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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.backgroundDark, theme.colors.background]}
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
            <Text style={styles.title}>Plus</Text>
            <View style={styles.sparkleContainer}>
              <Sparkles color={theme.colors.primary} size={24} />
            </View>
          </View>
          <Text style={styles.subtitle}>Explorez tous nos services</Text>
        </View>

        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Heart color="#FF6B9D" size={20} />
            <Text style={styles.sectionTitleLarge}>Spiritualité</Text>
          </View>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
            style={styles.horizontalScrollView}
          >
            {spiritualItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.featuredCard}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[item.color, `${item.color}CC`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.featuredGradient}
                >
                  <View style={styles.featuredIcon}>
                    <item.icon color="#FFFFFF" size={28} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.featuredLabel}>{item.label}</Text>
                  <Text style={styles.featuredDescription}>{item.description}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Plane color={theme.colors.primary} size={18} />
            <Text style={styles.sectionTitle}>Services Voyage</Text>
          </View>
          <View style={styles.compactGrid}>
            {travelServices.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.compactCard}
                onPress={item.onPress}
                activeOpacity={0.8}
              >
                <View style={[styles.compactIcon, { backgroundColor: `${item.color}20` }]}>
                  <item.icon color={item.color} size={22} />
                </View>
                <View style={styles.compactContent}>
                  <Text style={styles.compactLabel}>{item.label}</Text>
                  <Text style={styles.compactDescription}>{item.description}</Text>
                </View>
                <ChevronRight color={theme.colors.textLight} size={18} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Général</Text>
          <View style={styles.listContainer}>
            {settingsItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.listItem,
                  index === settingsItems.length - 1 && styles.listItemLast,
                ]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.listItemLeft}>
                  <View style={styles.listIcon}>
                    <item.icon color={theme.colors.text} size={20} />
                  </View>
                  <Text style={styles.listItemText}>{item.label}</Text>
                </View>
                <ChevronRight color={theme.colors.textLight} size={18} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {user && (
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogoutPress}
            activeOpacity={0.8}
          >
            <View style={styles.logoutContent}>
              <LogOut color={theme.colors.error} size={20} />
              <Text style={styles.logoutText}>Déconnexion</Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.copyright}>© 2025 VoyageApp</Text>
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
    paddingHorizontal: theme.spacing.lg,
  },
  headerContainer: {
    marginBottom: theme.spacing.xl,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 40,
    fontWeight: '800' as const,
    color: theme.colors.text,
    letterSpacing: -1,
  },
  sparkleContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
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
    color: theme.colors.text,
  },
  horizontalScrollView: {
    marginHorizontal: -theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
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
    color: theme.colors.textLight,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  compactGrid: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
    color: theme.colors.text,
    marginBottom: 2,
  },
  compactDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  listContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
    backgroundColor: `${theme.colors.text}08`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: theme.colors.text,
  },
  logoutButton: {
    marginTop: 12,
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: `${theme.colors.error}10`,
    borderWidth: 1.5,
    borderColor: `${theme.colors.error}30`,
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
    color: theme.colors.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 4,
  },
  version: {
    fontSize: 13,
    color: theme.colors.textLight,
    fontWeight: '500' as const,
  },
  copyright: {
    fontSize: 12,
    color: theme.colors.textLight,
    opacity: 0.6,
  },
});
