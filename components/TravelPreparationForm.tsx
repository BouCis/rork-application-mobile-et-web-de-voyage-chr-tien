import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Calendar, 
  Users, 
  Wallet, 
  MapPin,
  ChevronRight,
  Check,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import type { Destination } from '@/data/destinations';

interface TravelPreparationFormProps {
  destination: Destination;
  onSubmit: (data: TravelFormData) => void;
  userNationality?: string;
}

export interface TravelFormData {
  destination: Destination;
  startDate: string;
  endDate: string;
  travelers: number;
  budgetLevel: 'budget' | 'moderate' | 'luxury';
  departureCity: string;
  nationality: string;
}

const budgetLevels = [
  { id: 'budget' as const, label: 'Économique', icon: '💰' },
  { id: 'moderate' as const, label: 'Modéré', icon: '💳' },
  { id: 'luxury' as const, label: 'Luxe', icon: '💎' },
];

export default function TravelPreparationForm({
  destination,
  onSubmit,
  userNationality = 'France',
}: TravelPreparationFormProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [travelers, setTravelers] = useState<string>('2');
  const [budgetLevel, setBudgetLevel] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [departureCity, setDepartureCity] = useState<string>('');
  const [nationality, setNationality] = useState<string>(userNationality);

  const handleSubmit = useCallback(() => {
    console.log('[TravelPreparationForm] Submitting form');
    
    const formData: TravelFormData = {
      destination,
      startDate,
      endDate,
      travelers: parseInt(travelers) || 1,
      budgetLevel,
      departureCity,
      nationality,
    };

    onSubmit(formData);
  }, [destination, startDate, endDate, travelers, budgetLevel, departureCity, nationality, onSubmit]);

  const isFormValid = startDate && endDate && travelers && departureCity && nationality;

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MapPin color={theme.colors.primary} size={20} />
          <Text style={styles.sectionTitle}>Destination</Text>
        </View>
        <View style={styles.destinationCard}>
          <Text style={styles.destinationName}>{destination.name}</Text>
          <Text style={styles.destinationCountry}>{destination.country}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Calendar color={theme.colors.primary} size={20} />
          <Text style={styles.sectionTitle}>Dates du voyage</Text>
        </View>
        <View style={styles.dateInputs}>
          <View style={styles.dateInputContainer}>
            <Text style={styles.inputLabel}>Date de départ</Text>
            <TextInput
              testID="input-start-date"
              style={styles.input}
              placeholder="JJ/MM/AAAA"
              placeholderTextColor={theme.colors.textLight}
              value={startDate}
              onChangeText={setStartDate}
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
            />
          </View>
          <View style={styles.dateInputContainer}>
            <Text style={styles.inputLabel}>Date de retour</Text>
            <TextInput
              testID="input-end-date"
              style={styles.input}
              placeholder="JJ/MM/AAAA"
              placeholderTextColor={theme.colors.textLight}
              value={endDate}
              onChangeText={setEndDate}
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
            />
          </View>
        </View>
        <Text style={styles.helperText}>
          Meilleure période : {destination.bestTimeToVisit}
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Users color={theme.colors.primary} size={20} />
          <Text style={styles.sectionTitle}>Nombre de voyageurs</Text>
        </View>
        <TextInput
          testID="input-travelers"
          style={styles.input}
          placeholder="Nombre de personnes"
          placeholderTextColor={theme.colors.textLight}
          value={travelers}
          onChangeText={setTravelers}
          keyboardType="number-pad"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Wallet color={theme.colors.primary} size={20} />
          <Text style={styles.sectionTitle}>Niveau de budget</Text>
        </View>
        <View style={styles.budgetLevels}>
          {budgetLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              testID={`budget-level-${level.id}`}
              style={[
                styles.budgetLevel,
                budgetLevel === level.id && styles.budgetLevelActive,
              ]}
              onPress={() => setBudgetLevel(level.id)}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Sélectionner budget ${level.label}`}
            >
              <LinearGradient
                colors={
                  budgetLevel === level.id
                    ? theme.colors.primaryGradient
                    : ['rgba(99, 102, 241, 0.05)', 'rgba(236, 72, 153, 0.05)']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.budgetLevelGradient}
              >
                {budgetLevel === level.id && (
                  <View style={styles.checkIcon}>
                    <Check color={theme.colors.textInverse} size={16} strokeWidth={3} />
                  </View>
                )}
                <Text style={styles.budgetIcon}>{level.icon}</Text>
                <Text
                  style={[
                    styles.budgetLabel,
                    budgetLevel === level.id && styles.budgetLabelActive,
                  ]}
                >
                  {level.label}
                </Text>
                <Text
                  style={[
                    styles.budgetPrice,
                    budgetLevel === level.id && styles.budgetPriceActive,
                  ]}
                >
                  {destination.averageBudget[level.id]}€/jour
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MapPin color={theme.colors.primary} size={20} />
          <Text style={styles.sectionTitle}>Ville de départ</Text>
        </View>
        <TextInput
          testID="input-departure-city"
          style={styles.input}
          placeholder="Ex: Paris, Lyon, Marseille..."
          placeholderTextColor={theme.colors.textLight}
          value={departureCity}
          onChangeText={setDepartureCity}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MapPin color={theme.colors.primary} size={20} />
          <Text style={styles.sectionTitle}>Nationalité</Text>
        </View>
        <TextInput
          testID="input-nationality"
          style={styles.input}
          placeholder="Votre nationalité"
          placeholderTextColor={theme.colors.textLight}
          value={nationality}
          onChangeText={setNationality}
        />
        <Text style={styles.helperText}>
          Nécessaire pour les informations visa et santé
        </Text>
      </View>

      <TouchableOpacity
        testID="btn-submit-form"
        style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={!isFormValid}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Obtenir les informations de voyage"
      >
        <LinearGradient
          colors={isFormValid ? theme.colors.primaryGradient : ['#4B5563', '#374151']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.submitGradient}
        >
          <Text style={styles.submitText}>Obtenir les informations</Text>
          <ChevronRight color={theme.colors.textInverse} size={20} />
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  destinationCard: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  destinationName: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  destinationCountry: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  dateInputs: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  dateInputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  helperText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic' as const,
  },
  budgetLevels: {
    gap: theme.spacing.md,
  },
  budgetLevel: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  budgetLevelActive: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  budgetLevelGradient: {
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    position: 'relative',
  },
  checkIcon: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetIcon: {
    fontSize: 24,
  },
  budgetLabel: {
    flex: 1,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  budgetLabelActive: {
    color: theme.colors.textInverse,
  },
  budgetPrice: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  budgetPriceActive: {
    color: theme.colors.textInverse,
  },
  submitButton: {
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  submitText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textInverse,
  },
});
