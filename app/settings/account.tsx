import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Camera, Save } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useApp } from '@/store/AppContext';
import type { User as UserType } from '@/types';
import { router, Stack } from 'expo-router';

export default function AccountSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, saveUser } = useApp();
  const [saving, setSaving] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<Partial<UserType>>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    nationality: user?.nationality || '',
    departureCity: user?.departureCity || '',
  });

  const updateField = <K extends keyof UserType>(key: K, value: UserType[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        Alert.alert('Champs requis', 'Veuillez remplir au moins le prénom, nom et email.');
        return;
      }

      setSaving(true);
      
      const updatedUser: UserType = {
        ...user!,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality,
        departureCity: formData.departureCity,
      };

      await saveUser(updatedUser);
      Alert.alert('Succès', 'Profil mis à jour avec succès !', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder le profil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Modifier mon profil',
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
        }} 
      />
      <View style={styles.container}>
        <LinearGradient
          colors={[theme.colors.backgroundDark, theme.colors.background]}
          style={StyleSheet.absoluteFillObject}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 90 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarSection}>
            {user?.avatar ? (
              <Image 
                source={{ uri: user.avatar }} 
                style={styles.avatarImage}
              />
            ) : (
              <LinearGradient
                colors={theme.colors.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarGradient}
              >
                <User color={theme.colors.textInverse} size={48} strokeWidth={2} />
              </LinearGradient>
            )}
            <TouchableOpacity style={styles.changePhotoButton}>
              <Camera color={theme.colors.primary} size={20} />
              <Text style={styles.changePhotoText}>Changer la photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formSectionTitle}>Informations personnelles</Text>
            
            <View style={styles.formRow}>
              <View style={styles.formFieldHalf}>
                <Text style={styles.formLabel}>Prénom *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Prénom"
                  placeholderTextColor={theme.colors.textLight}
                  value={formData.firstName}
                  onChangeText={(text) => updateField('firstName', text)}
                />
              </View>
              <View style={styles.formFieldHalf}>
                <Text style={styles.formLabel}>Nom *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Nom"
                  placeholderTextColor={theme.colors.textLight}
                  value={formData.lastName}
                  onChangeText={(text) => updateField('lastName', text)}
                />
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Email *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="email@example.com"
                placeholderTextColor={theme.colors.textLight}
                value={formData.email}
                onChangeText={(text) => updateField('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Téléphone</Text>
              <TextInput
                style={styles.formInput}
                placeholder="+33 6 12 34 56 78"
                placeholderTextColor={theme.colors.textLight}
                value={formData.phone}
                onChangeText={(text) => updateField('phone', text)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Date de naissance</Text>
              <TextInput
                style={styles.formInput}
                placeholder="JJ/MM/AAAA"
                placeholderTextColor={theme.colors.textLight}
                value={formData.dateOfBirth}
                onChangeText={(text) => updateField('dateOfBirth', text)}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Genre</Text>
              <View style={styles.genderRow}>
                {(['male', 'female'] as const).map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.genderChip,
                      user?.gender === gender && styles.genderChipActive
                    ]}
                    onPress={() => {
                      const updatedUser = { ...user!, gender };
                      saveUser(updatedUser);
                    }}
                  >
                    <Text style={[
                      styles.genderChipText,
                      user?.gender === gender && styles.genderChipTextActive
                    ]}>
                      {gender === 'male' ? 'Homme' : 'Femme'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Nationalité</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Française"
                placeholderTextColor={theme.colors.textLight}
                value={formData.nationality}
                onChangeText={(text) => updateField('nationality', text)}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Ville de départ</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Paris"
                placeholderTextColor={theme.colors.textLight}
                value={formData.departureCity}
                onChangeText={(text) => updateField('departureCity', text)}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
            disabled={saving}
          >
            <LinearGradient
              colors={theme.colors.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveGradient}
            >
              <Save color={theme.colors.white} size={20} />
              <Text style={styles.saveButtonText}>
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
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
    padding: theme.spacing.lg,
  },
  avatarSection: {
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
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.md,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  changePhotoText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  formSection: {
    marginBottom: theme.spacing.xl,
  },
  formSectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  formField: {
    marginBottom: theme.spacing.md,
  },
  formRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  formFieldHalf: {
    flex: 1,
  },
  formLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  formInput: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  saveButton: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginTop: theme.spacing.md,
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  saveButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },
  genderRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  genderChip: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  genderChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  genderChipText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  genderChipTextActive: {
    color: theme.colors.white,
  },
});
