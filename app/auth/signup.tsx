import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Globe,
  Camera,
  Heart,
  Bell,
  FileText,
  ChevronLeft,
  ChevronRight,
  Check,

} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useApp } from '@/store/AppContext';
import { router } from 'expo-router';
import type { User } from '@/types';

type Step = 1 | 2 | 3 | 4;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  nationality: string;
  departureCity: string;
  avatar?: string;
  travelStyle: 'cultural' | 'adventure' | 'relaxation' | 'spiritual' | 'mixed';
  budgetRange: 'budget' | 'moderate' | 'luxury';
  notifications: boolean;
  inspirations: boolean;
  bio: string;
}

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const { saveUser } = useApp();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState<boolean>(false);


  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female',
    nationality: '',
    departureCity: '',
    travelStyle: 'mixed',
    budgetRange: 'moderate',
    notifications: true,
    inspirations: true,
    bio: '',
  });

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s+()-]{10,}$/;
    return phoneRegex.test(phone);
  };

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      updateField('dateOfBirth', formatDate(date));
    }
  };

  const validateStep = (step: Step): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis';
      if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis';
      if (!formData.email.trim()) {
        newErrors.email = 'Email requis';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Email invalide';
      }
      if (formData.phone && !validatePhone(formData.phone)) {
        newErrors.phone = 'Téléphone invalide';
      }
      if (!formData.gender) newErrors.gender = 'Genre requis';
    }

    if (step === 2) {
      if (!formData.nationality.trim()) newErrors.nationality = 'Nationalité requise';
      if (!formData.departureCity.trim()) newErrors.departureCity = 'Ville de départ requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((currentStep + 1) as Step);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const sendConfirmationEmail = async (email: string, firstName: string): Promise<boolean> => {
    try {
      console.log(`Envoi d'email de confirmation à ${email}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      setLoading(true);

      const newUser: User = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender,
        nationality: formData.nationality,
        departureCity: formData.departureCity,
        avatar: formData.avatar,
        bio: formData.bio || undefined,
        preferences: {
          travelStyle: formData.travelStyle,
          budgetRange: formData.budgetRange,
          notifications: formData.notifications,
          inspirations: formData.inspirations,
        },
        joinedDate: new Date().toISOString(),
      };

      await saveUser(newUser);

      const emailSuccess = await sendConfirmationEmail(formData.email, formData.firstName);

      if (emailSuccess) {
        Alert.alert(
          'Compte créé ! 🎉',
          `Un email de confirmation a été envoyé à ${formData.email}. Veuillez vérifier votre boîte de réception.`,
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)/planner'),
            },
          ]
        );
      } else {
        Alert.alert(
          'Compte créé !',
          'Votre compte a été créé avec succès.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)/planner'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
      Alert.alert('Erreur', 'Impossible de créer le compte. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = (provider: 'google' | 'apple') => {
    Alert.alert(
      'Connexion rapide',
      `La connexion avec ${provider === 'google' ? 'Google' : 'Apple'} sera bientôt disponible.`
    );
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3, 4].map((step) => (
        <View
          key={step}
          style={[
            styles.progressStep,
            step <= currentStep && styles.progressStepActive,
            step < currentStep && styles.progressStepCompleted,
          ]}
        >
          {step < currentStep ? (
            <Check color={theme.colors.white} size={16} strokeWidth={3} />
          ) : (
            <Text style={[
              styles.progressStepText,
              step <= currentStep && styles.progressStepTextActive
            ]}>
              {step}
            </Text>
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <UserIcon color={theme.colors.primary} size={32} />
        <Text style={styles.stepTitle}>Informations personnelles</Text>
        <Text style={styles.stepSubtitle}>Commençons par les bases</Text>
      </View>

      <View style={styles.formRow}>
        <View style={styles.formFieldHalf}>
          <Text style={styles.formLabel}>Prénom *</Text>
          <TextInput
            style={[styles.formInput, errors.firstName && styles.formInputError]}
            placeholder="Jean"
            placeholderTextColor={theme.colors.textLight}
            value={formData.firstName}
            onChangeText={(text) => updateField('firstName', text)}
            autoCapitalize="words"
          />
          {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
        </View>
        <View style={styles.formFieldHalf}>
          <Text style={styles.formLabel}>Nom *</Text>
          <TextInput
            style={[styles.formInput, errors.lastName && styles.formInputError]}
            placeholder="Dupont"
            placeholderTextColor={theme.colors.textLight}
            value={formData.lastName}
            onChangeText={(text) => updateField('lastName', text)}
            autoCapitalize="words"
          />
          {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
        </View>
      </View>

      <View style={styles.formField}>
        <Text style={styles.formLabel}>Email *</Text>
        <View style={styles.inputWithIcon}>
          <Mail color={theme.colors.textLight} size={20} />
          <TextInput
            style={[styles.formInputWithIcon, errors.email && styles.formInputError]}
            placeholder="jean.dupont@example.com"
            placeholderTextColor={theme.colors.textLight}
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.formField}>
        <Text style={styles.formLabel}>Téléphone</Text>
        <View style={styles.inputWithIcon}>
          <Phone color={theme.colors.textLight} size={20} />
          <TextInput
            style={[styles.formInputWithIcon, errors.phone && styles.formInputError]}
            placeholder="+33 6 12 34 56 78"
            placeholderTextColor={theme.colors.textLight}
            value={formData.phone}
            onChangeText={(text) => {
              const cleanedPhone = text.replace(/[^0-9+\s()-]/g, '');
              updateField('phone', cleanedPhone);
            }}
            keyboardType="phone-pad"
          />
        </View>
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>

      <View style={styles.formField}>
        <Text style={styles.formLabel}>Date de naissance</Text>
        <TouchableOpacity 
          style={styles.inputWithIcon}
          onPress={() => setShowDatePicker(true)}
        >
          <Calendar color={theme.colors.textLight} size={20} />
          <Text style={[
            styles.datePickerText,
            !formData.dateOfBirth && styles.datePickerPlaceholder
          ]}>
            {formData.dateOfBirth || 'JJ/MM/AAAA'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
          />
        )}
      </View>

      <View style={styles.formField}>
        <Text style={styles.formLabel}>Genre *</Text>
        <View style={styles.genderRow}>
          {(['male', 'female'] as const).map((gender) => (
            <TouchableOpacity
              key={gender}
              style={[
                styles.genderChip,
                formData.gender === gender && styles.genderChipActive,
                errors.gender && !formData.gender && styles.genderChipError
              ]}
              onPress={() => updateField('gender', gender)}
            >
              <Text style={[
                styles.genderChipText,
                formData.gender === gender && styles.genderChipTextActive
              ]}>
                {gender === 'male' ? 'Homme' : 'Femme'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Globe color={theme.colors.secondary} size={32} />
        <Text style={styles.stepTitle}>Profil voyageur</Text>
        <Text style={styles.stepSubtitle}>D&apos;où venez-vous ?</Text>
      </View>

      <View style={styles.formField}>
        <Text style={styles.formLabel}>Nationalité *</Text>
        <View style={styles.inputWithIcon}>
          <Globe color={theme.colors.textLight} size={20} />
          <TextInput
            style={[styles.formInputWithIcon, errors.nationality && styles.formInputError]}
            placeholder="Française"
            placeholderTextColor={theme.colors.textLight}
            value={formData.nationality}
            onChangeText={(text) => updateField('nationality', text)}
            autoCapitalize="words"
          />
        </View>
        {errors.nationality && <Text style={styles.errorText}>{errors.nationality}</Text>}
      </View>

      <View style={styles.formField}>
        <Text style={styles.formLabel}>Ville de départ *</Text>
        <View style={styles.inputWithIcon}>
          <MapPin color={theme.colors.textLight} size={20} />
          <TextInput
            style={[styles.formInputWithIcon, errors.departureCity && styles.formInputError]}
            placeholder="Paris"
            placeholderTextColor={theme.colors.textLight}
            value={formData.departureCity}
            onChangeText={(text) => updateField('departureCity', text)}
            autoCapitalize="words"
          />
        </View>
        {errors.departureCity && <Text style={styles.errorText}>{errors.departureCity}</Text>}
      </View>

      <View style={styles.formField}>
        <Text style={styles.formLabel}>Photo de profil (optionnel)</Text>
        <TouchableOpacity 
          style={styles.photoUploadButton}
          onPress={() => Alert.alert('Photo', 'Fonctionnalité à venir')}
        >
          <Camera color={theme.colors.primary} size={24} />
          <Text style={styles.photoUploadText}>Ajouter une photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Heart color={theme.colors.accent} size={32} />
        <Text style={styles.stepTitle}>Préférences de voyage</Text>
        <Text style={styles.stepSubtitle}>Personnalisez votre expérience</Text>
      </View>

      <View style={styles.formField}>
        <Text style={styles.formLabel}>Style de voyage</Text>
        <View style={styles.preferenceGrid}>
          {[
            { value: 'cultural', label: 'Culturel', icon: '🏛️' },
            { value: 'adventure', label: 'Aventure', icon: '🏔️' },
            { value: 'relaxation', label: 'Détente', icon: '🏖️' },
            { value: 'spiritual', label: 'Spirituel', icon: '🙏' },
            { value: 'mixed', label: 'Mixte', icon: '🌍' },
          ].map((style) => (
            <TouchableOpacity
              key={style.value}
              style={[
                styles.preferenceCard,
                formData.travelStyle === style.value && styles.preferenceCardActive
              ]}
              onPress={() => updateField('travelStyle', style.value as any)}
            >
              <Text style={styles.preferenceIcon}>{style.icon}</Text>
              <Text style={[
                styles.preferenceLabel,
                formData.travelStyle === style.value && styles.preferenceLabelActive
              ]}>
                {style.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formField}>
        <Text style={styles.formLabel}>Gamme de budget</Text>
        <View style={styles.budgetRow}>
          {[
            { value: 'budget', label: 'Économique', icon: '💰' },
            { value: 'moderate', label: 'Modéré', icon: '💳' },
            { value: 'luxury', label: 'Luxe', icon: '💎' },
          ].map((range) => (
            <TouchableOpacity
              key={range.value}
              style={[
                styles.budgetChip,
                formData.budgetRange === range.value && styles.budgetChipActive
              ]}
              onPress={() => updateField('budgetRange', range.value as any)}
            >
              <Text style={styles.budgetIcon}>{range.icon}</Text>
              <Text style={[
                styles.budgetLabel,
                formData.budgetRange === range.value && styles.budgetLabelActive
              ]}>
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.toggleSection}>
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => updateField('notifications', !formData.notifications)}
        >
          <View style={styles.toggleLeft}>
            <Bell color={theme.colors.primary} size={20} />
            <View style={styles.toggleTextContainer}>
              <Text style={styles.toggleLabel}>Notifications</Text>
              <Text style={styles.toggleDescription}>Recevez des alertes importantes</Text>
            </View>
          </View>
          <View style={[
            styles.toggle,
            formData.notifications && styles.toggleActive
          ]}>
            <View style={[
              styles.toggleThumb,
              formData.notifications && styles.toggleThumbActive
            ]} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => updateField('inspirations', !formData.inspirations)}
        >
          <View style={styles.toggleLeft}>
            <Heart color={theme.colors.secondary} size={20} />
            <View style={styles.toggleTextContainer}>
              <Text style={styles.toggleLabel}>Inspirations</Text>
              <Text style={styles.toggleDescription}>Découvrez de nouvelles destinations</Text>
            </View>
          </View>
          <View style={[
            styles.toggle,
            formData.inspirations && styles.toggleActive
          ]}>
            <View style={[
              styles.toggleThumb,
              formData.inspirations && styles.toggleThumbActive
            ]} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <FileText color={theme.colors.warning} size={32} />
        <Text style={styles.stepTitle}>Bio (optionnel)</Text>
        <Text style={styles.stepSubtitle}>Parlez-nous de vous</Text>
      </View>

      <View style={styles.formField}>
        <TextInput
          style={[styles.formInput, styles.formTextArea]}
          placeholder="Partagez vos passions, vos rêves de voyage, ce qui vous inspire..."
          placeholderTextColor={theme.colors.textLight}
          value={formData.bio}
          onChangeText={(text) => updateField('bio', text)}
          multiline
          numberOfLines={6}
          maxLength={500}
        />
        <Text style={styles.charCount}>{formData.bio.length}/500</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Récapitulatif</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Nom complet</Text>
          <Text style={styles.summaryValue}>{formData.firstName} {formData.lastName}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Email</Text>
          <Text style={styles.summaryValue}>{formData.email}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Nationalité</Text>
          <Text style={styles.summaryValue}>{formData.nationality}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Ville de départ</Text>
          <Text style={styles.summaryValue}>{formData.departureCity}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.backgroundDark, theme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez notre communauté de voyageurs</Text>
          </View>

          {renderProgressBar()}

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          <View style={styles.navigationButtons}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                disabled={loading}
              >
                <ChevronLeft color={theme.colors.text} size={20} />
                <Text style={styles.backButtonText}>Retour</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.nextButton,
                currentStep === 1 && styles.nextButtonFull,
                loading && styles.nextButtonDisabled
              ]}
              onPress={currentStep === 4 ? handleSubmit : handleNext}
              disabled={loading}
            >
              <LinearGradient
                colors={theme.colors.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.nextButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator color={theme.colors.white} />
                ) : (
                  <>
                    <Text style={styles.nextButtonText}>
                      {currentStep === 4 ? 'Créer mon compte' : 'Suivant'}
                    </Text>
                    {currentStep < 4 && <ChevronRight color={theme.colors.white} size={20} />}
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {currentStep === 1 && (
            <>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtons}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialSignUp('google')}
                >
                  <Text style={styles.socialButtonText}>🔍 Continuer avec Google</Text>
                </TouchableOpacity>

                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleSocialSignUp('apple')}
                  >
                    <Text style={styles.socialButtonText}>🍎 Continuer avec Apple</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => router.back()}
              >
                <Text style={styles.loginLinkText}>
                  Vous avez déjà un compte ? <Text style={styles.loginLinkBold}>Se connecter</Text>
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  progressStep: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStepActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  progressStepCompleted: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  progressStepText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
  },
  progressStepTextActive: {
    color: theme.colors.white,
  },
  stepContainer: {
    marginBottom: theme.spacing.xl,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  stepTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  stepSubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  formField: {
    marginBottom: theme.spacing.lg,
  },
  formRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  formFieldHalf: {
    flex: 1,
  },
  formLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  formInput: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  formInputError: {
    borderColor: theme.colors.error,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  formInputWithIcon: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  datePickerText: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  datePickerPlaceholder: {
    color: theme.colors.textLight,
  },
  formTextArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
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
  genderChipError: {
    borderColor: theme.colors.error,
  },
  genderChipText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  genderChipTextActive: {
    color: theme.colors.white,
  },
  photoUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    borderStyle: 'dashed',
  },
  photoUploadText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  preferenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  preferenceCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
  },
  preferenceCardActive: {
    backgroundColor: `${theme.colors.primary}20`,
    borderColor: theme.colors.primary,
  },
  preferenceIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  preferenceLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    textAlign: 'center',
  },
  preferenceLabelActive: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
  },
  budgetRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  budgetChip: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  budgetChipActive: {
    backgroundColor: `${theme.colors.secondary}20`,
    borderColor: theme.colors.secondary,
  },
  budgetIcon: {
    fontSize: 24,
  },
  budgetLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  budgetLabelActive: {
    color: theme.colors.secondary,
    fontWeight: theme.fontWeight.bold,
  },
  toggleSection: {
    gap: theme.spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  toggleDescription: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: theme.colors.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.white,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  charCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  summaryTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  summaryLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  backButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  nextButton: {
    flex: 2,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
  },
  nextButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginHorizontal: theme.spacing.md,
  },
  socialButtons: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  socialButton: {
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  socialButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  loginLinkBold: {
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
});
