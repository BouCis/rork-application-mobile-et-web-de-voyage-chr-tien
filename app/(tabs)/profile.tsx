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
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useApp } from '@/store/AppContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, deleteAccount } = useApp();

  if (!user) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[theme.colors.backgroundDark, theme.colors.background]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.emptyState}>
          <UserIcon color={theme.colors.textLight} size={64} />
          <Text style={styles.emptyStateTitle}>Aucun profil</Text>
          <Text style={styles.emptyStateText}>Créez votre profil pour commencer</Text>
          <TouchableOpacity
            style={styles.createProfileButton}
            onPress={() => router.push('/auth/signup')}
          >
            <LinearGradient
              colors={theme.colors.primaryGradient}
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
        colors={[theme.colors.backgroundDark, theme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 90 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={theme.colors.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
          >
            <UserIcon color={theme.colors.textInverse} size={48} strokeWidth={2} />
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
            <Edit3 color={theme.colors.primary} size={18} />
            <Text style={styles.editButtonText}>Modifier le profil</Text>
          </TouchableOpacity>
        </View>

        <>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={[`${theme.colors.primary}20`, `${theme.colors.primary}10`]}
                  style={styles.statGradient}
                >
                  <MapPin color={theme.colors.primary} size={24} />
                  <Text style={styles.statValue}>0</Text>
                  <Text style={styles.statLabel}>Voyages</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={[`${theme.colors.secondary}20`, `${theme.colors.secondary}10`]}
                  style={styles.statGradient}
                >
                  <Camera color={theme.colors.secondary} size={24} />
                  <Text style={styles.statValue}>0</Text>
                  <Text style={styles.statLabel}>Photos</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={[`${theme.colors.accent}20`, `${theme.colors.accent}10`]}
                  style={styles.statGradient}
                >
                  <Heart color={theme.colors.accent} size={24} />
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
                <LogOut color={theme.colors.error} size={20} />
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
                <Trash2 color={theme.colors.error} size={20} />
                <Text style={styles.deleteText}>Supprimer mon compte</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.version}>Version 1.0.0</Text>
          </>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatarGradient: {
    width: 96,
    height: 96,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  userName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  userEmail: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  userBio: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    lineHeight: 20,
  },
  editButton: {
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  editButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },

  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
  },
  statGradient: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statValue: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  menuSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
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
    fontWeight: theme.fontWeight.medium,
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
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.error,
  },
  deleteButton: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: `${theme.colors.error}40`,
  },
  deleteGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  deleteText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.error,
  },
  version: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyStateTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
  },
  emptyStateText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  createProfileButton: {
    marginTop: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  createProfileGradient: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  createProfileText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },
});
