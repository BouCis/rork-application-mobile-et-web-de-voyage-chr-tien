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
  const { colors } = useTheme();

  if (!user) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.backgroundDark, colors.background]}
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
        colors={[colors.backgroundDark, colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24.lg,
    paddingBottom: 24.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: {borderRadius: 16}.md,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: {fontSize: 15}.xl,
    fontWeight: {fontWeight: '700'}.bold,
    color: colors.text,
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24.lg,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24.xl,
  },
  avatarGradient: {
    width: 96,
    height: 96,
    borderRadius: {borderRadius: 16}.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24.md,
  },
  userName: {
    fontSize: {fontSize: 15}.xxl,
    fontWeight: {fontWeight: '700'}.bold,
    color: colors.text,
  },
  userEmail: {
    fontSize: {fontSize: 15}.md,
    color: colors.textSecondary,
    marginTop: 24.xs,
  },
  userBio: {
    fontSize: {fontSize: 15}.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 24.md,
    paddingHorizontal: 24.lg,
    lineHeight: 20,
  },
  editButton: {
    marginTop: 24.lg,
    paddingVertical: 24.sm,
    paddingHorizontal: 24.xl,
    borderRadius: {borderRadius: 16}.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24.sm,
  },
  editButtonText: {
    fontSize: {fontSize: 15}.sm,
    fontWeight: {fontWeight: '700'}.semibold,
    color: colors.text,
  },

  statsContainer: {
    flexDirection: 'row',
    gap: 24.md,
    marginBottom: 24.xl,
  },
  statCard: {
    flex: 1,
  },
  statGradient: {
    alignItems: 'center',
    paddingVertical: 24.lg,
    borderRadius: {borderRadius: 16}.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: {fontSize: 15}.xxl,
    fontWeight: {fontWeight: '700'}.bold,
    color: colors.text,
    marginTop: 24.sm,
  },
  statLabel: {
    fontSize: {fontSize: 15}.xs,
    color: colors.textSecondary,
    marginTop: 24.xs,
  },
  menuSection: {
    marginBottom: 24.xl,
  },
  sectionTitle: {
    fontSize: {fontSize: 15}.sm,
    fontWeight: {fontWeight: '700'}.bold,
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 24.md,
  },
  menuContainer: {
    backgroundColor: colors.surface,
    borderRadius: {borderRadius: 16}.lg,
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
    padding: 24.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: {borderRadius: 16}.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: {fontSize: 15}.md,
    fontWeight: {fontWeight: '700'}.medium,
    color: colors.text,
  },
  logoutButton: {
    marginTop: 24.md,
    borderRadius: {borderRadius: 16}.lg,
    overflow: 'hidden',
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24.sm,
    padding: 24.md,
    borderWidth: 1,
    borderColor: `${colors.error}30`,
  },
  logoutText: {
    fontSize: {fontSize: 15}.md,
    fontWeight: {fontWeight: '700'}.semibold,
    color: colors.error,
  },
  deleteButton: {
    marginTop: 24.md,
    borderRadius: {borderRadius: 16}.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: `${colors.error}40`,
  },
  deleteGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24.sm,
    padding: 24.md,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  deleteText: {
    fontSize: {fontSize: 15}.md,
    fontWeight: {fontWeight: '700'}.semibold,
    color: colors.error,
  },
  version: {
    fontSize: {fontSize: 15}.sm,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 24.xl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24.xl,
  },
  emptyStateTitle: {
    fontSize: {fontSize: 15}.xxl,
    fontWeight: {fontWeight: '700'}.bold,
    color: colors.text,
    marginTop: 24.lg,
  },
  emptyStateText: {
    fontSize: {fontSize: 15}.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 24.sm,
  },
  createProfileButton: {
    marginTop: 24.xl,
    borderRadius: {borderRadius: 16}.md,
    overflow: 'hidden',
  },
  createProfileGradient: {
    paddingVertical: 24.md,
    paddingHorizontal: 24.xl,
  },
  createProfileText: {
    fontSize: {fontSize: 15}.md,
    fontWeight: {fontWeight: '700'}.bold,
    color: colors.white,
  },
});
