import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Calculator,
  Plane,
  Hotel,
  UtensilsCrossed,
  MapPin,
  ShoppingBag,
  FileText,
  Shield,
  Syringe,
  Phone,
  Info,
  ChevronDown,
  ChevronUp,
  DollarSign,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { destinations } from '@/data/destinations';

interface VisaInfo {
  required: boolean;
  type: string;
  cost: string;
  processingTime: string;
  documents: string[];
}

interface HealthInfo {
  vaccinations: { name: string; required: boolean }[];
  insurance: string;
  emergencyNumbers: { service: string; number: string }[];
}

export default function BudgetAdminScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDestination, setSelectedDestination] = useState(destinations[0]);
  const [travelers, setTravelers] = useState('1');
  const [days, setDays] = useState('7');
  const [budgetLevel, setBudgetLevel] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [showDestinations, setShowDestinations] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    budget: true,
    visa: false,
    health: false,
    practical: false,
  });



  const calculateEstimatedBudget = () => {
    const dailyBudget = selectedDestination.averageBudget[budgetLevel];
    const numDays = parseInt(days) || 7;
    const numTravelers = parseInt(travelers) || 1;
    const totalDaily = dailyBudget * numDays * numTravelers;

    const transportCost = budgetLevel === 'budget' ? 300 : budgetLevel === 'moderate' ? 600 : 1200;

    return {
      transport: transportCost * numTravelers,
      accommodation: dailyBudget * 0.4 * numDays * numTravelers,
      food: dailyBudget * 0.3 * numDays * numTravelers,
      activities: dailyBudget * 0.2 * numDays * numTravelers,
      shopping: dailyBudget * 0.1 * numDays * numTravelers,
      total: transportCost * numTravelers + totalDaily,
    };
  };

  const estimatedBudget = calculateEstimatedBudget();

  const getVisaInfo = (): VisaInfo => {
    const visaRequired = !['France', 'Espagne', 'Italie', 'Portugal', 'Grèce', 'Pays-Bas', 'République Tchèque', 'Royaume-Uni'].includes(selectedDestination.country);
    
    return {
      required: visaRequired,
      type: visaRequired ? 'Visa touristique' : 'Pas de visa requis (espace Schengen/EU)',
      cost: visaRequired ? '50-100 €' : '0 €',
      processingTime: visaRequired ? '2-4 semaines' : 'N/A',
      documents: visaRequired 
        ? ['Passeport valide (6 mois min)', 'Photo d\'identité récente', 'Justificatif de réservation', 'Assurance voyage', 'Relevé bancaire']
        : ['Carte d\'identité ou passeport valide'],
    };
  };

  const getHealthInfo = (): HealthInfo => {
    const requiresVaccines = ['Indonésie', 'Brésil', 'Égypte', 'Maroc', 'Sénégal'].includes(selectedDestination.country);
    
    return {
      vaccinations: requiresVaccines 
        ? [
            { name: 'Hépatite A et B', required: true },
            { name: 'Typhoïde', required: true },
            { name: 'Fièvre jaune', required: selectedDestination.country === 'Brésil' || selectedDestination.country === 'Sénégal' },
            { name: 'Rage', required: false },
          ]
        : [
            { name: 'Vaccins universels à jour', required: true },
          ],
      insurance: 'Assurance voyage obligatoire recommandée',
      emergencyNumbers: [
        { service: 'Police', number: '112' },
        { service: 'Ambulance', number: '112' },
        { service: 'Ambassade de France', number: '+' + Math.floor(Math.random() * 1000000000) },
      ],
    };
  };

  const visaInfo = getVisaInfo();
  const healthInfo = getHealthInfo();

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };



  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Budget & Infos Administratives',
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.primary,
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Calculator color={theme.colors.primary} size={32} />
          <Text style={styles.headerTitle}>Planificateur de Budget</Text>
          <Text style={styles.headerSubtitle}>
            Calculez votre budget et découvrez les formalités administratives
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🌍 Destination</Text>
          <TouchableOpacity
            style={styles.destinationPicker}
            onPress={() => setShowDestinations(!showDestinations)}
          >
            <Text style={styles.destinationText}>{selectedDestination.name}, {selectedDestination.country}</Text>
            {showDestinations ? (
              <ChevronUp color={theme.colors.text} size={20} />
            ) : (
              <ChevronDown color={theme.colors.text} size={20} />
            )}
          </TouchableOpacity>

          {showDestinations && (
            <View style={styles.destinationList}>
              {destinations.slice(0, 10).map((dest) => (
                <TouchableOpacity
                  key={dest.id}
                  style={styles.destinationItem}
                  onPress={() => {
                    setSelectedDestination(dest);
                    setShowDestinations(false);
                  }}
                >
                  <Text style={styles.destinationItemText}>
                    {dest.name}, {dest.country}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Voyageurs</Text>
              <TextInput
                style={styles.input}
                value={travelers}
                onChangeText={setTravelers}
                keyboardType="number-pad"
                placeholder="1"
                placeholderTextColor={theme.colors.textLight}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Jours</Text>
              <TextInput
                style={styles.input}
                value={days}
                onChangeText={setDays}
                keyboardType="number-pad"
                placeholder="7"
                placeholderTextColor={theme.colors.textLight}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>Niveau de confort</Text>
          <View style={styles.budgetLevelContainer}>
            {(['budget', 'moderate', 'luxury'] as const).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.budgetLevelButton,
                  budgetLevel === level && styles.budgetLevelButtonActive,
                ]}
                onPress={() => setBudgetLevel(level)}
              >
                <Text
                  style={[
                    styles.budgetLevelText,
                    budgetLevel === level && styles.budgetLevelTextActive,
                  ]}
                >
                  {level === 'budget' ? 'Économique' : level === 'moderate' ? 'Modéré' : 'Luxe'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('budget')}
        >
          <View style={styles.sectionHeaderLeft}>
            <DollarSign color={theme.colors.primary} size={24} />
            <Text style={styles.sectionHeaderTitle}>Budget Estimé</Text>
          </View>
          {expandedSections.budget ? (
            <ChevronUp color={theme.colors.text} size={20} />
          ) : (
            <ChevronDown color={theme.colors.text} size={20} />
          )}
        </TouchableOpacity>

        {expandedSections.budget && (
          <View style={styles.card}>
            <View style={styles.budgetRow}>
              <View style={styles.budgetIconContainer}>
                <Plane color={theme.colors.primary} size={20} />
              </View>
              <Text style={styles.budgetLabel}>Transport</Text>
              <Text style={styles.budgetAmount}>{estimatedBudget.transport.toFixed(0)} {selectedDestination.currency}</Text>
            </View>

            <View style={styles.budgetRow}>
              <View style={styles.budgetIconContainer}>
                <Hotel color={theme.colors.primary} size={20} />
              </View>
              <Text style={styles.budgetLabel}>Hébergement</Text>
              <Text style={styles.budgetAmount}>{estimatedBudget.accommodation.toFixed(0)} {selectedDestination.currency}</Text>
            </View>

            <View style={styles.budgetRow}>
              <View style={styles.budgetIconContainer}>
                <UtensilsCrossed color={theme.colors.primary} size={20} />
              </View>
              <Text style={styles.budgetLabel}>Restauration</Text>
              <Text style={styles.budgetAmount}>{estimatedBudget.food.toFixed(0)} {selectedDestination.currency}</Text>
            </View>

            <View style={styles.budgetRow}>
              <View style={styles.budgetIconContainer}>
                <MapPin color={theme.colors.primary} size={20} />
              </View>
              <Text style={styles.budgetLabel}>Activités</Text>
              <Text style={styles.budgetAmount}>{estimatedBudget.activities.toFixed(0)} {selectedDestination.currency}</Text>
            </View>

            <View style={styles.budgetRow}>
              <View style={styles.budgetIconContainer}>
                <ShoppingBag color={theme.colors.primary} size={20} />
              </View>
              <Text style={styles.budgetLabel}>Shopping & Divers</Text>
              <Text style={styles.budgetAmount}>{estimatedBudget.shopping.toFixed(0)} {selectedDestination.currency}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Estimé</Text>
              <Text style={styles.totalAmount}>{estimatedBudget.total.toFixed(0)} {selectedDestination.currency}</Text>
            </View>

            <Text style={styles.budgetNote}>
              💡 Budget estimé pour {travelers} voyageur(s) pendant {days} jour(s)
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('visa')}
        >
          <View style={styles.sectionHeaderLeft}>
            <FileText color={theme.colors.primary} size={24} />
            <Text style={styles.sectionHeaderTitle}>Visa & Documents</Text>
          </View>
          {expandedSections.visa ? (
            <ChevronUp color={theme.colors.text} size={20} />
          ) : (
            <ChevronDown color={theme.colors.text} size={20} />
          )}
        </TouchableOpacity>

        {expandedSections.visa && (
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Visa requis</Text>
              <View style={[styles.badge, visaInfo.required ? styles.badgeWarning : styles.badgeSuccess]}>
                <Text style={styles.badgeText}>{visaInfo.required ? 'Oui' : 'Non'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={styles.infoValue}>{visaInfo.type}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Coût</Text>
              <Text style={styles.infoValue}>{visaInfo.cost}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Délai</Text>
              <Text style={styles.infoValue}>{visaInfo.processingTime}</Text>
            </View>

            <Text style={styles.subSectionTitle}>Documents requis</Text>
            {visaInfo.documents.map((doc, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listItemText}>{doc}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('health')}
        >
          <View style={styles.sectionHeaderLeft}>
            <Syringe color={theme.colors.primary} size={24} />
            <Text style={styles.sectionHeaderTitle}>Santé & Vaccinations</Text>
          </View>
          {expandedSections.health ? (
            <ChevronUp color={theme.colors.text} size={20} />
          ) : (
            <ChevronDown color={theme.colors.text} size={20} />
          )}
        </TouchableOpacity>

        {expandedSections.health && (
          <View style={styles.card}>
            <Text style={styles.subSectionTitle}>Vaccinations</Text>
            {healthInfo.vaccinations.map((vaccine, index) => (
              <View key={index} style={styles.vaccineRow}>
                <View style={styles.vaccineLeft}>
                  <View style={[styles.vaccineBadge, vaccine.required ? styles.badgeWarning : styles.badgeInfo]}>
                    <Text style={styles.badgeText}>{vaccine.required ? 'Requis' : 'Recommandé'}</Text>
                  </View>
                  <Text style={styles.vaccineText}>{vaccine.name}</Text>
                </View>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Shield color={theme.colors.primary} size={20} />
              <Text style={styles.insuranceText}>{healthInfo.insurance}</Text>
            </View>

            <Text style={styles.subSectionTitle}>Numéros d&apos;urgence</Text>
            {healthInfo.emergencyNumbers.map((emergency, index) => (
              <View key={index} style={styles.emergencyRow}>
                <Phone color={theme.colors.primary} size={18} />
                <Text style={styles.emergencyService}>{emergency.service}</Text>
                <Text style={styles.emergencyNumber}>{emergency.number}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('practical')}
        >
          <View style={styles.sectionHeaderLeft}>
            <Info color={theme.colors.primary} size={24} />
            <Text style={styles.sectionHeaderTitle}>Infos Pratiques</Text>
          </View>
          {expandedSections.practical ? (
            <ChevronUp color={theme.colors.text} size={20} />
          ) : (
            <ChevronDown color={theme.colors.text} size={20} />
          )}
        </TouchableOpacity>

        {expandedSections.practical && (
          <View style={styles.card}>
            <View style={styles.practicalRow}>
              <Text style={styles.practicalLabel}>💱 Devise</Text>
              <Text style={styles.practicalValue}>{selectedDestination.currency}</Text>
            </View>

            <View style={styles.practicalRow}>
              <Text style={styles.practicalLabel}>🗣️ Langue(s)</Text>
              <Text style={styles.practicalValue}>{selectedDestination.languages.join(', ')}</Text>
            </View>

            <View style={styles.practicalRow}>
              <Text style={styles.practicalLabel}>🕐 Fuseau horaire</Text>
              <Text style={styles.practicalValue}>{selectedDestination.timezone}</Text>
            </View>

            <View style={styles.practicalRow}>
              <Text style={styles.practicalLabel}>📅 Meilleure période</Text>
              <Text style={styles.practicalValue}>{selectedDestination.bestTimeToVisit}</Text>
            </View>

            <View style={styles.practicalRow}>
              <Text style={styles.practicalLabel}>⏱️ Durée recommandée</Text>
              <Text style={styles.practicalValue}>{selectedDestination.recommendedDuration}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.lg,
    alignItems: 'center' as const,
    gap: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold as any,
    color: theme.colors.text,
    textAlign: 'center' as const,
  },
  headerSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center' as const,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  destinationPicker: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  destinationText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium as any,
  },
  destinationList: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    maxHeight: 300,
  },
  destinationItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  destinationItemText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  inputRow: {
    flexDirection: 'row' as const,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.fontWeight.medium as any,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  budgetLevelContainer: {
    flexDirection: 'row' as const,
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  budgetLevelButton: {
    flex: 1,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  budgetLevelButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  budgetLevelText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium as any,
  },
  budgetLevelTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  sectionHeaderLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: theme.spacing.sm,
  },
  sectionHeaderTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold as any,
    color: theme.colors.text,
  },
  budgetRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  budgetIconContainer: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    backgroundColor: `${theme.colors.primary}20`,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  budgetLabel: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  budgetAmount: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold as any,
    color: theme.colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  totalRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: theme.spacing.sm,
  },
  totalLabel: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold as any,
    color: theme.colors.text,
  },
  totalAmount: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold as any,
    color: theme.colors.primary,
  },
  budgetNote: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center' as const,
    marginTop: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: theme.spacing.sm,
  },
  infoLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
  },
  infoValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium as any,
    color: theme.colors.text,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  badgeSuccess: {
    backgroundColor: '#10B981',
  },
  badgeWarning: {
    backgroundColor: '#F59E0B',
  },
  badgeInfo: {
    backgroundColor: '#3B82F6',
  },
  badgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold as any,
    color: '#FFFFFF',
  },
  subSectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold as any,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  listItem: {
    flexDirection: 'row' as const,
    paddingVertical: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  bullet: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold as any,
  },
  listItemText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  vaccineRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: theme.spacing.sm,
  },
  vaccineLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: theme.spacing.sm,
    flex: 1,
  },
  vaccineBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  vaccineText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    flex: 1,
  },
  insuranceText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  emergencyRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  emergencyService: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  emergencyNumber: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold as any,
    color: theme.colors.primary,
  },
  practicalRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: theme.spacing.sm,
  },
  practicalLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    flex: 1,
  },
  practicalValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium as any,
    color: theme.colors.text,
    flex: 1,
    textAlign: 'right' as const,
  },
});
