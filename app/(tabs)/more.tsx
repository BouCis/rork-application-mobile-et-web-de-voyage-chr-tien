import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  User,
  Plane,
  Car,
  MessageSquare,
  MapPin,
  Bookmark,
  Settings,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Globe,
  Camera,
  Calendar,
  CreditCard,
  BookOpen,
  Heart,
  Music,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useApp } from '@/store/AppContext';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  description?: string;
  onPress: () => void;
  color?: string;
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

  const handleSavedPress = useCallback(() => {
    console.log('[More] Saved pressed');
    Alert.alert(
      '🔖 Favoris',
      'Vos destinations et établissements sauvegardés.\n\nFonctionnalité à venir.',
      [{ text: 'OK' }]
    );
  }, []);

  const handleTripsPress = useCallback(() => {
    console.log('[More] Trips pressed');
    router.push('/trip/create');
  }, []);

  const handleBudgetPress = useCallback(() => {
    console.log('[More] Budget & Admin pressed');
    router.push('/trip/budget-admin');
  }, []);

  const handleProfilePress = useCallback(() => {
    console.log('[More] Profile pressed');
    router.push('/(tabs)/profile');
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

  const mainServices: MenuItem[] = [
    {
      icon: Plane,
      label: 'Vols',
      description: 'Rechercher et réserver des vols',
      onPress: handleFlightsPress,
      color: theme.colors.primary,
    },
    {
      icon: Car,
      label: 'Locations de voiture',
      description: 'Louer une voiture pour votre voyage',
      onPress: handleRentalsPress,
      color: theme.colors.secondary,
    },
    {
      icon: MessageSquare,
      label: 'Forum',
      description: 'Partagez avec la communauté',
      onPress: handleForumPress,
      color: theme.colors.accent,
    },
    {
      icon: MapPin,
      label: 'Carte interactive',
      description: 'Explorer les destinations',
      onPress: () => router.push('/(tabs)/map'),
      color: theme.colors.warning,
    },
    {
      icon: Heart,
      label: 'Spiritualité',
      description: 'Musique & inspiration',
      onPress: () => router.push('/(tabs)/spiritual'),
      color: theme.colors.accent,
    },
    {
      icon: Music,
      label: 'Musique',
      description: 'Lecteur et playlists',
      onPress: () => router.push('/music/player'),
      color: theme.colors.primary,
    },
    {
      icon: BookOpen,
      label: 'Bible',
      description: 'Lire et rechercher',
      onPress: () => router.push('/bible/reader'),
      color: theme.colors.secondary,
    },
  ];

  const personalItems: MenuItem[] = [
    {
      icon: User,
      label: 'Mon profil',
      onPress: handleProfilePress,
    },
    {
      icon: Calendar,
      label: 'Mes voyages',
      onPress: handleTripsPress,
    },
    {
      icon: CreditCard,
      label: 'Budget & Infos Admin',
      onPress: handleBudgetPress,
    },
    {
      icon: Bookmark,
      label: 'Favoris',
      onPress: handleSavedPress,
    },
    {
      icon: Camera,
      label: 'Mes moments',
      onPress: () => router.push('/(tabs)/gallery'),
    },
  ];

  const settingsItems: MenuItem[] = [
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
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Plus</Text>
          <Text style={styles.subtitle}>Services et options</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services principaux</Text>
          <View style={styles.gridContainer}>
            {mainServices.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.serviceCard}
                onPress={item.onPress}
              >
                <LinearGradient
                  colors={[`${item.color}20`, `${item.color}10`]}
                  style={styles.serviceGradient}
                >
                  <View style={[styles.serviceIconContainer, { backgroundColor: `${item.color}30` }]}>
                    <item.icon color={item.color} size={24} />
                  </View>
                  <Text style={styles.serviceLabel}>{item.label}</Text>
                  {item.description && (
                    <Text style={styles.serviceDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personnel</Text>
          <View style={styles.menuContainer}>
            {personalItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index === personalItems.length - 1 && styles.menuItemLast,
                ]}
                onPress={item.onPress}
              >
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
                      <item.icon color={theme.colors.primary} size={20} />
                    </View>
                    <Text style={styles.menuItemText}>{item.label}</Text>
                  </View>
                  <ChevronRight color={theme.colors.textLight} size={20} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          <View style={styles.menuContainer}>
            {settingsItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index === settingsItems.length - 1 && styles.menuItemLast,
                ]}
                onPress={item.onPress}
              >
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
                      <item.icon color={theme.colors.primary} size={20} />
                    </View>
                    <Text style={styles.menuItemText}>{item.label}</Text>
                  </View>
                  <ChevronRight color={theme.colors.textLight} size={20} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {user && (
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogoutPress}
          >
            <LinearGradient
              colors={['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.05)']}
              style={styles.logoutGradient}
            >
              <LogOut color={theme.colors.error} size={20} />
              <Text style={styles.logoutText}>Déconnexion</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <Text style={styles.version}>Version 1.0.0</Text>
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
    padding: theme.spacing.lg,
  },
  headerContainer: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.hero,
    fontWeight: theme.fontWeight.bold as '700',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold as '700',
    color: theme.colors.textLight,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  serviceCard: {
    width: '48%',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  serviceGradient: {
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 140,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  serviceLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold as '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  serviceDescription: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  menuContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium as '500',
    color: theme.colors.text,
  },
  logoutButton: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: `${theme.colors.error}30`,
  },
  logoutText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold as '600',
    color: theme.colors.error,
  },
  version: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center' as const,
    marginTop: theme.spacing.xl,
  },
});
