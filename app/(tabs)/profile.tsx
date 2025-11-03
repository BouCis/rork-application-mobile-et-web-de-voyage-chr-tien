import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User as UserIcon, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  MapPin,
  Camera,
  Heart,
  ChevronRight,
  Edit3,
  Trash2,
  ArrowLeft,
} from 'lucide-react-native';
import { useTheme } from '@/store/ThemeContext';
import { useApp } from '@/store/AppContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, deleteAccount } = useApp();
  const { colors, spacing, borderRadius, fontSize, fontWeight } = useTheme();

  const styles = React.useMemo(() => StyleSheet.create({
    container: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.md,
      backgroundColor: colors.surface,
    },
    headerTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text,
    },
    headerPlaceholder: { width: 40 },
    scrollView: { flex: 1 },
    scrollContent: { padding: spacing.lg },
    profileHeader: { alignItems: 'center', marginBottom: spacing.xl },
    avatarGradient: {
      width: 96,
      height: 96,
      borderRadius: borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    userName: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
      color: colors.text,
    },
    userEmail: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    userBio: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.md,
      paddingHorizontal: spacing.lg,
      lineHeight: 20,
    },
    editButton: {
      marginTop: spacing.lg,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xl,
      borderRadius: borderRadius.full,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    editButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: colors.text,
    },
    statsContainer: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.xl,
    },
    statCard: { flex: 1 },
    statGradient: {
      alignItems: 'center',
      paddingVertical: spacing.lg,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statValue: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
      color: colors.text,
      marginTop: spacing.sm,
    },
    statLabel: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    menuSection: { marginBottom: spacing.xl },
    sectionTitle: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.textLight,
      textTransform: 'uppercase',
      letterSpacing: 1,
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
    menuItemLast: { borderBottomWidth: 0 },
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
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuItemText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text,
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
    deleteButton: {
      marginTop: spacing.md,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: `${colors.error}40`,
    },
    deleteGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      padding: spacing.md,
      backgroundColor: 'rgba(239, 68, 68, 0.05)',
    },
    deleteText: {
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
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
    },
    emptyStateTitle: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
      color: colors.text,
      marginTop: spacing.lg,
    },
    emptyStateText: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
    createProfileButton: {
      marginTop: spacing.xl,
      borderRadius: borderRadius.md,
      overflow: 'hidden',
    },
    createProfileGradient: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
    },
    createProfileText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.white,
    },
  }), [colors, spacing, borderRadius, fontSize, fontWeight]);

  if (!user) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.backgroundSecondary, colors.background]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.emptyState}>
          <UserIcon color={colors.textLight} size={64} />
          <Text style={styles.emptyStateTitle}>Aucun profil</Text>
          <Text style={styles.emptyStateText}>Créez votre profil pour commencer</Text>
          <TouchableOpacity
            style={styles.createProfileButton}
            onPress={() => router.push('/auth/signup')}
          >
            <LinearGradient
              colors={colors.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.createProfileGradient}
            >
              <Text style={styles.createProfileText}>Créer mon profil</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const menuSections = [
    {
      title: 'Compte',
      items: [
        { icon: Settings, label: 'Paramètres', onPress: () => router.push('/settings') },
        { icon: Bell, label: 'Notifications', onPress: () => Alert.alert('Notifications', 'Fonctionnalité à venir') },
        { icon: Shield, label: 'Confidentialité', onPress: () => Alert.alert('Confidentialité', 'Fonctionnalité à venir') },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Aide & Support', onPress: () => Alert.alert('Aide & Support', 'Contactez-nous à support@voyagechretien.com') },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.backgroundSecondary, colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 }
        ]}
        showsVerticalScrollIndicator={false}
        testID="profile-scroll"
      >
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={colors.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
          >
            <UserIcon color={colors.textInverse} size={48} strokeWidth={2} />
          </LinearGradient>
          <Text style={styles.userName}>
            {user?.firstName && user?.lastName 
              ? `${user.firstName} ${user.lastName}` 
              : 'Voyageur'}
          </Text>
          <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
          {user?.bio && <Text style={styles.userBio}>{user.bio}</Text>}
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push('/settings/account')}
          >
            <Edit3 color={colors.primary} size={18} />
            <Text style={styles.editButtonText}>Modifier le profil</Text>
          </TouchableOpacity>
        </View>

        <>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={[`${colors.primary}20`, `${colors.primary}10`]}
                  style={styles.statGradient}
                >
                  <MapPin color={colors.primary} size={24} />
                  <Text style={styles.statValue}>0</Text>
                  <Text style={styles.statLabel}>Voyages</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={[`${colors.secondary}20`, `${colors.secondary}10`]}
                  style={styles.statGradient}
                >
                  <Camera color={colors.secondary} size={24} />
                  <Text style={styles.statValue}>0</Text>
                  <Text style={styles.statLabel}>Photos</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={[`${colors.accent}20`, `${colors.accent}10`]}
                  style={styles.statGradient}
                >
                  <Heart color={colors.accent} size={24} />
                  <Text style={styles.statValue}>0</Text>
                  <Text style={styles.statLabel}>Favoris</Text>
                </LinearGradient>
              </View>
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
                          <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                            <item.icon color={colors.primary} size={20} />
                          </View>
                          <Text style={styles.menuItemText}>{item.label}</Text>
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
              onPress={() => Alert.alert(
                'Déconnexion', 
                'Êtes-vous sûr de vouloir vous déconnecter ?', 
                [
                  { text: 'Annuler', style: 'cancel' },
                  { 
                    text: 'Déconnexion', 
                    style: 'destructive', 
                    onPress: async () => {
                      try {
                        await logout();
                        Alert.alert('Succès', 'Vous êtes déconnecté');
                      } catch (error) {
                        Alert.alert('Erreur', 'Impossible de se déconnecter');
                      }
                    }
                  }
                ]
              )}
            >
              <LinearGradient
                colors={['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.05)']}
                style={styles.logoutGradient}
              >
                <LogOut color={colors.error} size={20} />
                <Text style={styles.logoutText}>Déconnexion</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => Alert.alert(
                'Supprimer le compte', 
                'Cette action est irréversible. Toutes vos données seront supprimées définitivement.', 
                [
                  { text: 'Annuler', style: 'cancel' },
                  { 
                    text: 'Supprimer', 
                    style: 'destructive', 
                    onPress: () => {
                      Alert.alert(
                        'Confirmation', 
                        'Êtes-vous vraiment sûr ? Cette action ne peut pas être annulée.', 
                        [
                          { text: 'Annuler', style: 'cancel' },
                          { 
                            text: 'Supprimer définitivement', 
                            style: 'destructive',
                            onPress: async () => {
                              try {
                                await deleteAccount();
                                Alert.alert('Compte supprimé', 'Votre compte a été supprimé avec succès');
                              } catch (error) {
                                Alert.alert('Erreur', 'Impossible de supprimer le compte');
                              }
                            }
                          }
                        ]
                      );
                    }
                  }
                ]
              )}
            >
              <View style={styles.deleteGradient}>
                <Trash2 color={colors.error} size={20} />
                <Text style={styles.deleteText}>Supprimer mon compte</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.version}>Version 1.0.0</Text>
          </>
      </ScrollView>
    </View>
  );
}
