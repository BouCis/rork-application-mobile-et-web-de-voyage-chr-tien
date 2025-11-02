import React, { useState, useCallback } from 'react';
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
import { 
  ArrowLeft,
  FileText,
  Heart,
  Shield,
  Plane,
  Hotel,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import TravelPreparationForm, { type TravelFormData } from '@/components/TravelPreparationForm';
import { getDestinationById, type Destination } from '@/data/destinations';

interface VisaInfo {
  required: boolean;
  type?: string;
  duration?: string;
  cost?: number;
  processingTime?: string;
  requirements: string[];
}

interface HealthInfo {
  vaccinations: {
    name: string;
    required: boolean;
    description: string;
  }[];
  healthRisks: string[];
  medicalInsurance: boolean;
}

interface BudgetBreakdown {
  transport: number;
  accommodation: number;
  food: number;
  activities: number;
  total: number;
}

export default function DestinationPrepareScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ destinationId: string }>();
  
  const [showResults, setShowResults] = useState<boolean>(false);
  const [travelData, setTravelData] = useState<TravelFormData | null>(null);

  const destination = getDestinationById(params.destinationId);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleFormSubmit = useCallback((data: TravelFormData) => {
    console.log('[DestinationPrepare] Form submitted:', data);
    setTravelData(data);
    setShowResults(true);
  }, []);

  const calculateBudget = useCallback((data: TravelFormData, dest: Destination): BudgetBreakdown => {
    const days = 7;
    const dailyBudget = dest.averageBudget[data.budgetLevel];
    const perPersonTotal = dailyBudget * days;
    const total = perPersonTotal * data.travelers;

    return {
      transport: Math.round(total * 0.3),
      accommodation: Math.round(total * 0.35),
      food: Math.round(total * 0.20),
      activities: Math.round(total * 0.15),
      total,
    };
  }, []);

  const getVisaInfo = useCallback((nationality: string, dest: Destination): VisaInfo => {
    const euCountries = ['France', 'Allemagne', 'Italie', 'Espagne', 'Belgique'];
    const isEU = euCountries.includes(nationality);
    const destCountry = dest.country;

    if (isEU && euCountries.includes(destCountry)) {
      return {
        required: false,
        requirements: [
          'Carte d\'identité ou passeport valide',
          'Aucun visa requis pour les citoyens de l\'UE',
        ],
      };
    }

    if (destCountry === 'États-Unis') {
      return {
        required: true,
        type: 'ESTA',
        duration: '90 jours',
        cost: 21,
        processingTime: '72 heures',
        requirements: [
          'Passeport valide au moins 6 mois',
          'Demande ESTA en ligne',
          'Billet de retour',
          'Preuve de ressources financières',
        ],
      };
    }

    return {
      required: false,
      duration: '90 jours',
      requirements: [
        'Passeport valide au moins 6 mois après la date de retour',
        'Billet de retour ou de continuation',
        'Preuve de ressources financières suffisantes',
      ],
    };
  }, []);

  const getHealthInfo = useCallback((dest: Destination): HealthInfo => {
    const tropical = ['Indonésie', 'Thaïlande', 'Brésil', 'Sénégal'];
    const isTropical = tropical.includes(dest.country);

    const vaccinations = [
      {
        name: 'Hépatite A et B',
        required: false,
        description: 'Recommandé pour tous les voyageurs',
      },
    ];

    if (isTropical) {
      vaccinations.push(
        {
          name: 'Fièvre jaune',
          required: true,
          description: 'Obligatoire pour entrer dans le pays',
        },
        {
          name: 'Paludisme',
          required: false,
          description: 'Traitement antipaludique recommandé',
        }
      );
    }

    return {
      vaccinations,
      healthRisks: isTropical 
        ? ['Paludisme', 'Dengue', 'Maladies transmises par l\'eau']
        : ['Protection solaire recommandée'],
      medicalInsurance: true,
    };
  }, []);

  if (!destination) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Destination non trouvée</Text>
      </View>
    );
  }

  const renderResults = () => {
    if (!travelData || !destination) return null;

    const budget = calculateBudget(travelData, destination);
    const visaInfo = getVisaInfo(travelData.nationality, destination);
    const healthInfo = getHealthInfo(destination);

    return (
      <ScrollView
        style={styles.resultsContainer}
        contentContainerStyle={[
          styles.resultsContent,
          { paddingBottom: insets.bottom + 24 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultSection}>
          <View style={styles.resultHeader}>
            <DollarSign color={theme.colors.primary} size={24} />
            <Text style={styles.resultTitle}>Budget estimé</Text>
          </View>
          <View style={styles.budgetCard}>
            <LinearGradient
              colors={theme.colors.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.budgetTotal}
            >
              <Text style={styles.budgetTotalLabel}>Budget total</Text>
              <Text style={styles.budgetTotalValue}>{budget.total}€</Text>
              <Text style={styles.budgetTotalSubtext}>
                Pour {travelData.travelers} {travelData.travelers > 1 ? 'personnes' : 'personne'}
              </Text>
            </LinearGradient>
            <View style={styles.budgetBreakdown}>
              <View style={styles.budgetItem}>
                <Plane color={theme.colors.textSecondary} size={18} />
                <Text style={styles.budgetItemLabel}>Transport</Text>
                <Text style={styles.budgetItemValue}>{budget.transport}€</Text>
              </View>
              <View style={styles.budgetItem}>
                <Hotel color={theme.colors.textSecondary} size={18} />
                <Text style={styles.budgetItemLabel}>Hébergement</Text>
                <Text style={styles.budgetItemValue}>{budget.accommodation}€</Text>
              </View>
              <View style={styles.budgetItem}>
                <Text style={styles.budgetIcon}>🍽️</Text>
                <Text style={styles.budgetItemLabel}>Nourriture</Text>
                <Text style={styles.budgetItemValue}>{budget.food}€</Text>
              </View>
              <View style={styles.budgetItem}>
                <Text style={styles.budgetIcon}>🎭</Text>
                <Text style={styles.budgetItemLabel}>Activités</Text>
                <Text style={styles.budgetItemValue}>{budget.activities}€</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.resultSection}>
          <View style={styles.resultHeader}>
            <FileText color={theme.colors.secondary} size={24} />
            <Text style={styles.resultTitle}>Exigences administratives</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              {visaInfo.required ? (
                <AlertCircle color={theme.colors.warning} size={20} />
              ) : (
                <CheckCircle2 color={theme.colors.success} size={20} />
              )}
              <Text style={styles.infoLabel}>
                {visaInfo.required ? 'Visa requis' : 'Pas de visa requis'}
              </Text>
            </View>
            {visaInfo.type && (
              <Text style={styles.infoDetail}>Type: {visaInfo.type}</Text>
            )}
            {visaInfo.duration && (
              <Text style={styles.infoDetail}>Durée: {visaInfo.duration}</Text>
            )}
            {visaInfo.cost && (
              <Text style={styles.infoDetail}>Coût: {visaInfo.cost}€</Text>
            )}
            {visaInfo.processingTime && (
              <Text style={styles.infoDetail}>Délai: {visaInfo.processingTime}</Text>
            )}
            <View style={styles.requirementsList}>
              <Text style={styles.requirementsTitle}>Documents requis:</Text>
              {visaInfo.requirements.map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  <View style={styles.requirementDot} />
                  <Text style={styles.requirementText}>{req}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.resultSection}>
          <View style={styles.resultHeader}>
            <Heart color={theme.colors.error} size={24} />
            <Text style={styles.resultTitle}>Informations sanitaires</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.subsectionTitle}>Vaccinations</Text>
            {healthInfo.vaccinations.map((vac, index) => (
              <View key={index} style={styles.vaccinationItem}>
                <View style={styles.vaccinationHeader}>
                  {vac.required ? (
                    <AlertCircle color={theme.colors.error} size={18} />
                  ) : (
                    <Info color={theme.colors.info} size={18} />
                  )}
                  <Text style={[
                    styles.vaccinationName,
                    vac.required && styles.vaccinationRequired
                  ]}>
                    {vac.name}
                  </Text>
                </View>
                <Text style={styles.vaccinationDesc}>{vac.description}</Text>
              </View>
            ))}
            
            {healthInfo.healthRisks.length > 0 && (
              <>
                <Text style={styles.subsectionTitle}>Risques sanitaires</Text>
                {healthInfo.healthRisks.map((risk, index) => (
                  <View key={index} style={styles.riskItem}>
                    <View style={styles.riskDot} />
                    <Text style={styles.riskText}>{risk}</Text>
                  </View>
                ))}
              </>
            )}

            {healthInfo.medicalInsurance && (
              <View style={styles.insuranceAlert}>
                <Shield color={theme.colors.primary} size={20} />
                <Text style={styles.insuranceText}>
                  Assurance voyage et rapatriement fortement recommandée
                </Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          testID="btn-create-trip"
          style={styles.createTripButton}
          onPress={() => {
            Alert.alert('Voyage', 'Création du voyage en cours...');
            router.push('/trip/create');
          }}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Créer mon voyage"
        >
          <LinearGradient
            colors={theme.colors.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.createTripGradient}
          >
            <Text style={styles.createTripText}>Créer mon voyage</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.backgroundDark, theme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          testID="btn-back"
          style={styles.backButton}
          onPress={handleBack}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <ArrowLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {showResults ? 'Informations de voyage' : 'Préparer mon voyage'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {!showResults ? (
        <TravelPreparationForm
          destination={destination}
          onSubmit={handleFormSubmit}
        />
      ) : (
        renderResults()
      )}
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
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  errorText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.xxxl,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    padding: theme.spacing.lg,
  },
  resultSection: {
    marginBottom: theme.spacing.xl,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  resultTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  budgetCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  budgetTotal: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  budgetTotalLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textInverse,
    opacity: 0.9,
    marginBottom: theme.spacing.xs,
  },
  budgetTotalValue: {
    fontSize: theme.fontSize.hero,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textInverse,
    marginBottom: theme.spacing.xs,
  },
  budgetTotalSubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textInverse,
    opacity: 0.8,
  },
  budgetBreakdown: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  budgetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  budgetIcon: {
    fontSize: 18,
  },
  budgetItemLabel: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  budgetItemValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  infoLabel: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  infoDetail: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  requirementsList: {
    marginTop: theme.spacing.md,
  },
  requirementsTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  requirementDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginTop: 8,
  },
  requirementText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  subsectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  vaccinationItem: {
    marginBottom: theme.spacing.md,
  },
  vaccinationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  vaccinationName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  vaccinationRequired: {
    color: theme.colors.error,
  },
  vaccinationDesc: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: 26,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  riskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.warning,
    marginTop: 8,
  },
  riskText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  insuranceAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: `${theme.colors.primary}10`,
    borderRadius: theme.borderRadius.md,
  },
  insuranceText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  createTripButton: {
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  createTripGradient: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  createTripText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textInverse,
  },
});
