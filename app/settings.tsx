import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Globe, 
  Bell, 
  Shield, 
  HelpCircle, 
  ChevronRight,
  Settings as SettingsIcon,
  Heart,
  DollarSign,
  Languages,
  Lock,
  Smartphone,
  FileText,
  Mail,
  LogOut,
  Trash2
} from 'lucide-react-native';
import { useTheme } from '@/store/ThemeContext';
import { useApp } from '@/store/AppContext';
import { router, Stack } from 'expo-router';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useApp();
  const { colors, spacing, borderRadius, fontSize, fontWeight, } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.lg,
    },
    profileCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.xl,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    avatarGradient: {
      width: 64,
      height: 64,
      borderRadius: borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarImage: {
      width: 64,
      height: 64,
      borderRadius: borderRadius.full,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text,
    },
    profileEmail: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    editProfileButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primary,
    },
    editProfileText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: colors.white,
    },
    menuSection: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text,
      marginBottom: spacing.md,
    },
    menuContainer: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    menuItem: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
    menuItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.md,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flex: 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuItemTextContainer: {
      flex: 1,
    },
    menuItemText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text,
    },
    menuItemDescription: {
      fontSize: fontSize.xs,
      color: colors.textLight,
      marginTop: 2,
    },
    logoutButton: {
      marginTop: spacing.md,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
    },
    logoutGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: `${colors.error}30`,
    },
    logoutText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.error,
    },
    version: {
      fontSize: fontSize.sm,
      color: colors.textLight,
      textAlign: 'center',
      marginTop: spacing.xl,
    },
  });

  const menuSections = [
    {
      title: '🎨 Apparence',
      items: [
        { 
          icon: SettingsIcon, 
          label: 'Thème visuel', 
          description: 'Personnaliser l\'interface',
          onPress: () => router.push('/settings/theme') 
        },
      ],
    },
    {
      title: '👤 Compte & profil',
      items: [
        { 
          icon: User, 
          label: 'Modifier mon profil', 
          description: 'Prénom, nom, email, photo',
          onPress: () => router.push('/settings/account') 
        },
        { 
          icon: Lock, 
          label: 'Changer le mot de passe', 
          description: 'Sécurité du compte',
          onPress: () => Alert.alert('Changer le mot de passe', 'Fonctionnalité à venir') 
        },
        { 
          icon: Smartphone, 
          label: 'Comptes liés', 
          description: 'Google, Apple',
          onPress: () => Alert.alert('Comptes liés', 'Fonctionnalité à venir') 
        },
        { 
          icon: Trash2, 
          label: 'Supprimer le compte', 
          description: 'Action irréversible',
          onPress: () => {
            Alert.alert(
              'Supprimer le compte',
              'Cette action est irréversible. Toutes vos données seront supprimées définitivement.',
              [
                { text: 'Annuler', style: 'cancel' },
                { 
                  text: 'Supprimer', 
                  style: 'destructive', 
                  onPress: () => console.log('Delete account') 
                }
              ]
            );
          },
          danger: true
        },
      ],
    },
    {
      title: '🌍 Préférences de voyage',
      items: [
        { 
          icon: Heart, 
          label: 'Style de voyage', 
          description: 'Culturel, aventure, détente...',
          onPress: () => Alert.alert('Style de voyage', 'Fonctionnalité à venir') 
        },
        { 
          icon: DollarSign, 
          label: 'Budget habituel', 
          description: 'Économique, modéré, luxe',
          onPress: () => Alert.alert('Budget habituel', 'Fonctionnalité à venir') 
        },
        { 
          icon: Globe, 
          label: 'Destinations favorites', 
          description: 'Vos lieux préférés',
          onPress: () => Alert.alert('Destinations favorites', 'Fonctionnalité à venir') 
        },
      ],
    },
    {
      title: '🔔 Notifications & communications',
      items: [
        { 
          icon: Bell, 
          label: 'Notifications push', 
          description: 'Gérer les alertes',
          onPress: () => Alert.alert('Notifications', 'Fonctionnalité à venir') 
        },
        { 
          icon: Mail, 
          label: 'Newsletter', 
          description: 'Recevoir nos actualités',
          onPress: () => Alert.alert('Newsletter', 'Fonctionnalité à venir') 
        },
      ],
    },
    {
      title: '🛡️ Sécurité & confidentialité',
      items: [
        { 
          icon: Shield, 
          label: 'Confidentialité', 
          description: 'Gérer vos données',
          onPress: () => Alert.alert('Confidentialité', 'Fonctionnalité à venir') 
        },
        { 
          icon: Lock, 
          label: 'Double authentification', 
          description: 'Sécurité renforcée',
          onPress: () => Alert.alert('Double authentification', 'Fonctionnalité à venir') 
        },
        { 
          icon: Smartphone, 
          label: 'Appareils connectés', 
          description: 'Gérer les sessions',
          onPress: () => Alert.alert('Appareils connectés', 'Fonctionnalité à venir') 
        },
      ],
    },
    {
      title: '🌐 Langue & région',
      items: [
        { 
          icon: Languages, 
          label: 'Langue de l\'application', 
          description: 'Français',
          onPress: () => Alert.alert('Langue', 'Fonctionnalité à venir') 
        },
        { 
          icon: DollarSign, 
          label: 'Devise préférée', 
          description: 'EUR (€)',
          onPress: () => Alert.alert('Devise', 'Fonctionnalité à venir') 
        },
        { 
          icon: Globe, 
          label: 'Fuseau horaire', 
          description: 'Europe/Paris',
          onPress: () => Alert.alert('Fuseau horaire', 'Fonctionnalité à venir') 
        },
      ],
    },
    {
      title: '🧾 À propos / Aide',
      items: [
        { 
          icon: HelpCircle, 
          label: 'Centre d\'aide & FAQ', 
          description: 'Besoin d\'assistance ?',
          onPress: () => Alert.alert('Centre d\'aide', 'Fonctionnalité à venir') 
        },
        { 
          icon: Mail, 
          label: 'Contacter le support', 
          description: 'Nous sommes là pour vous',
          onPress: () => Alert.alert('Contacter le support', 'Envoyez-nous un email à support@voyagechretien.com') 
        },
        { 
          icon: FileText, 
          label: 'Politique de confidentialité', 
          description: 'Vos données sont protégées',
          onPress: () => Alert.alert('Politique de confidentialité', 'Fonctionnalité à venir') 
        },
        { 
          icon: FileText, 
          label: 'Conditions d\'utilisation', 
          description: 'Nos conditions',
          onPress: () => Alert.alert('Conditions d\'utilisation', 'Fonctionnalité à venir') 
        },
        { 
          icon: SettingsIcon, 
          label: 'À propos de l\'application', 
          description: 'Version 1.0.0',
          onPress: () => Alert.alert('À propos', 'Version 1.0.0\n\nVoyage Chrétien - Votre compagnon de voyage spirituel') 
        },
      ],
    },
  ];

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Paramètres',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerShown: true,
        }} 
      />
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.backgroundDark, colors.background]}
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
          <View style={styles.profileCard}>
            {user?.avatar ? (
              <Image 
                source={{ uri: user.avatar }} 
                style={styles.avatarImage}
              />
            ) : (
              <LinearGradient
                colors={colors.primaryGradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarGradient}
              >
                <User color={colors.textInverse} size={32} strokeWidth={2} />
              </LinearGradient>
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : 'Voyageur'}
              </Text>
              <Text style={styles.profileEmail}>{user?.email || 'email@example.com'}</Text>
            </View>
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Text style={styles.editProfileText}>Voir le profil</Text>
            </TouchableOpacity>
          </View>

          {menuSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.menuSection}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.menuContainer}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity 
                    key={itemIndex} 
                    onPress={item.onPress}
                    style={[
                      styles.menuItem,
                      itemIndex === section.items.length - 1 && styles.menuItemLast
                    ]}
                  >
                    <View style={styles.menuItemContent}>
                      <View style={styles.menuItemLeft}>
                        <View style={[
                          styles.iconContainer, 
                          { backgroundColor: item.danger ? `${colors.error}15` : `${colors.primary}15` }
                        ]}>
                          <item.icon 
                            color={item.danger ? colors.error : colors.primary} 
                            size={20} 
                          />
                        </View>
                        <View style={styles.menuItemTextContainer}>
                          <Text style={[
                            styles.menuItemText,
                            item.danger && { color: colors.error }
                          ]}>
                            {item.label}
                          </Text>
                          {item.description && (
                            <Text style={styles.menuItemDescription}>{item.description}</Text>
                          )}
                        </View>
                      </View>
                      <ChevronRight color={colors.textLight} size={20} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => {
              Alert.alert(
                'Déconnexion',
                'Êtes-vous sûr de vouloir vous déconnecter ?',
                [
                  { text: 'Annuler', style: 'cancel' },
                  { 
                    text: 'Déconnexion', 
                    style: 'destructive', 
                    onPress: () => {
                      console.log('Logout');
                      router.replace('/auth/signup');
                    }
                  }
                ]
              );
            }}
          >
            <LinearGradient
              colors={['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.05)']}
              style={styles.logoutGradient}
            >
              <LogOut color={colors.error} size={20} />
              <Text style={styles.logoutText}>Se déconnecter</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.version}>Version 1.0.0</Text>
        </ScrollView>
      </View>
    </>
  );
}


