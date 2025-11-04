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
import { useTheme } from '@/store/ThemeContext';
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
  const { colors } = useTheme();
  
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Destination non trouvée</Text>
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
            <DollarSign color={colors.primary} size={24} />
            <Text style={[styles.resultTitle, { color: colors.text }]}>Budget estimé</Text>
          </View>
          <View style={[styles.budgetCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <LinearGradient
              colors={colors.primaryGradient as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.budgetTotal}
            >
              <Text style={[styles.budgetTotalLabel, { color: colors.textInverse }]}>Budget total</Text>
              <Text style={[styles.budgetTotalValue, { color: colors.textInverse }]}>{budget.total}€</Text>
              <Text style={[styles.budgetTotalSubtext, { color: colors.textInverse }]}>
                Pour {travelData.travelers} {travelData.travelers > 1 ? 'personnes' : 'personne'}
              </Text>
            </LinearGradient>
            <View style={styles.budgetBreakdown}>
              <View style={styles.budgetItem}>
                <Plane color={colors.textSecondary} size={18} />
                <Text style={[styles.budgetItemLabel, { color: colors.textSecondary }]}>Transport</Text>
                <Text style={[styles.budgetItemValue, { color: colors.text }]}>{budget.transport}€</Text>
              </View>
              <View style={styles.budgetItem}>
                <Hotel color={colors.textSecondary} size={18} />
                <Text style={[styles.budgetItemLabel, { color: colors.textSecondary }]}>Hébergement</Text>
                <Text style={[styles.budgetItemValue, { color: colors.text }]}>{budget.accommodation}€</Text>
              </View>
              <View style={styles.budgetItem}>
                <Text style={styles.budgetIcon}>🍽️</Text>
                <Text style={[styles.budgetItemLabel, { color: colors.textSecondary }]}>Nourriture</Text>
                <Text style={[styles.budgetItemValue, { color: colors.text }]}>{budget.food}€</Text>
              </View>
              <View style={styles.budgetItem}>
                <Text style={styles.budgetIcon}>🎭</Text>
                <Text style={[styles.budgetItemLabel, { color: colors.textSecondary }]}>Activités</Text>
                <Text style={[styles.budgetItemValue, { color: colors.text }]}>{budget.activities}€</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.resultSection}>
          <View style={styles.resultHeader}>
            <FileText color={colors.secondary} size={24} />
            <Text style={[styles.resultTitle, { color: colors.text }]}>Exigences administratives</Text>
          </View>
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.infoRow}>
              {visaInfo.required ? (
                <AlertCircle color={colors.warning} size={20} />
              ) : (
                <CheckCircle2 color={colors.success} size={20} />
              )}
              <Text style={[styles.infoLabel, { color: colors.text }]}>
                {visaInfo.required ? 'Visa requis' : 'Pas de visa requis'}
              </Text>
            </View>
            {visaInfo.type && (
              <Text style={[styles.infoDetail, { color: colors.textSecondary }]}>Type: {visaInfo.type}</Text>
            )}
            {visaInfo.duration && (
              <Text style={[styles.infoDetail, { color: colors.textSecondary }]}>Durée: {visaInfo.duration}</Text>
            )}
            {visaInfo.cost && (
              <Text style={[styles.infoDetail, { color: colors.textSecondary }]}>Coût: {visaInfo.cost}€</Text>
            )}
            {visaInfo.processingTime && (
              <Text style={[styles.infoDetail, { color: colors.textSecondary }]}>Délai: {visaInfo.processingTime}</Text>
            )}
            <View style={styles.requirementsList}>
              <Text style={[styles.requirementsTitle, { color: colors.text }]}>Documents requis:</Text>
              {visaInfo.requirements.map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  <View style={[styles.requirementDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.requirementText, { color: colors.textSecondary }]}>{req}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.resultSection}>
          <View style={styles.resultHeader}>
            <Heart color={colors.error} size={24} />
            <Text style={[styles.resultTitle, { color: colors.text }]}>Informations sanitaires</Text>
          </View>
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.subsectionTitle, { color: colors.text }]}>Vaccinations</Text>
            {healthInfo.vaccinations.map((vac, index) => (
              <View key={index} style={styles.vaccinationItem}>
                <View style={styles.vaccinationHeader}>
                  {vac.required ? (
                    <AlertCircle color={colors.error} size={18} />
                  ) : (
                    <Info color={colors.info} size={18} />
                  )}
                  <Text style={[
                    styles.vaccinationName,
                    { color: colors.text },
                    vac.required && { color: colors.error }
                  ]}>
                    {vac.name}
                  </Text>
                </View>
                <Text style={[styles.vaccinationDesc, { color: colors.textSecondary }]}>{vac.description}</Text>
              </View>
            ))}
            
            {healthInfo.healthRisks.length > 0 && (
              <>
                <Text style={[styles.subsectionTitle, { color: colors.text }]}>Risques sanitaires</Text>
                {healthInfo.healthRisks.map((risk, index) => (
                  <View key={index} style={styles.riskItem}>
                    <View style={[styles.riskDot, { backgroundColor: colors.warning }]} />
                    <Text style={[styles.riskText, { color: colors.textSecondary }]}>{risk}</Text>
                  </View>
                ))}
              </>
            )}

            {healthInfo.medicalInsurance && (
              <View style={[styles.insuranceAlert, { backgroundColor: `${colors.primary}10` }]}>
                <Shield color={colors.primary} size={20} />
                <Text style={[styles.insuranceText, { color: colors.text }]}>
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
            colors={colors.primaryGradient as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.createTripGradient}
          >
            <Text style={[styles.createTripText, { color: colors.textInverse }]}>Créer mon voyage</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.backgroundTertiary, colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          testID="btn-back"
          style={[styles.backButton, { backgroundColor: colors.surface }]}
          onPress={handleBack}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
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
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  headerSpacer: {
    width: 40,
  },
  errorText: {
    fontSize: 17,
    textAlign: 'center' as const,
    marginTop: 64,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    padding: 24,
  },
  resultSection: {
    marginBottom: 32,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  budgetCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  budgetTotal: {
    padding: 32,
    alignItems: 'center',
  },
  budgetTotalLabel: {
    fontSize: 13,
    opacity: 0.9,
    marginBottom: 4,
  },
  budgetTotalValue: {
    fontSize: 40,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  budgetTotalSubtext: {
    fontSize: 13,
    opacity: 0.8,
  },
  budgetBreakdown: {
    padding: 24,
    gap: 16,
  },
  budgetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  budgetIcon: {
    fontSize: 18,
  },
  budgetItemLabel: {
    flex: 1,
    fontSize: 15,
  },
  budgetItemValue: {
    fontSize: 15,
    fontWeight: '700' as const,
  },
  infoCard: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 17,
    fontWeight: '700' as const,
  },
  infoDetail: {
    fontSize: 15,
    marginBottom: 4,
  },
  requirementsList: {
    marginTop: 16,
  },
  requirementsTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  requirementDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  requirementText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  subsectionTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    marginTop: 16,
    marginBottom: 8,
  },
  vaccinationItem: {
    marginBottom: 16,
  },
  vaccinationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  vaccinationName: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  vaccinationDesc: {
    fontSize: 13,
    marginLeft: 26,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  riskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  riskText: {
    flex: 1,
    fontSize: 13,
  },
  insuranceAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  insuranceText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500' as const,
  },
  createTripButton: {
    marginTop: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  createTripGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  createTripText: {
    fontSize: 17,
    fontWeight: '700' as const,
  },
});
