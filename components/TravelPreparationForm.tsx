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
import { useTheme } from '@/store/ThemeContext';
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
  const { colors } = useTheme();
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
          <MapPin color={colors.primary} size={20} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Destination</Text>
        </View>
        <View style={[styles.destinationCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.destinationName, { color: colors.text }]}>{destination.name}</Text>
          <Text style={[styles.destinationCountry, { color: colors.textSecondary }]}>{destination.country}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Calendar color={colors.primary} size={20} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Dates du voyage</Text>
        </View>
        <View style={styles.dateInputs}>
          <View style={styles.dateInputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Date de départ</Text>
            <TextInput
              testID="input-start-date"
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="JJ/MM/AAAA"
              placeholderTextColor={colors.textLight}
              value={startDate}
              onChangeText={setStartDate}
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
            />
          </View>
          <View style={styles.dateInputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Date de retour</Text>
            <TextInput
              testID="input-end-date"
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="JJ/MM/AAAA"
              placeholderTextColor={colors.textLight}
              value={endDate}
              onChangeText={setEndDate}
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
            />
          </View>
        </View>
        <Text style={[styles.helperText, { color: colors.textLight }]}>
          Meilleure période : {destination.bestTimeToVisit}
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Users color={colors.primary} size={20} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Nombre de voyageurs</Text>
        </View>
        <TextInput
          testID="input-travelers"
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="Nombre de personnes"
          placeholderTextColor={colors.textLight}
          value={travelers}
          onChangeText={setTravelers}
          keyboardType="number-pad"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Wallet color={colors.primary} size={20} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Niveau de budget</Text>
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
                    ? (colors.primaryGradient as [string, string])
                    : [colors.borderSubtle, colors.borderLight]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.budgetLevelGradient}
              >
                {budgetLevel === level.id && (
                  <View style={styles.checkIcon}>
                    <Check color={colors.textInverse} size={16} strokeWidth={3} />
                  </View>
                )}
                <Text style={styles.budgetIcon}>{level.icon}</Text>
                <Text
                  style={[
                    styles.budgetLabel,
                    { color: budgetLevel === level.id ? colors.textInverse : colors.text },
                  ]}
                >
                  {level.label}
                </Text>
                <Text
                  style={[
                    styles.budgetPrice,
                    { color: budgetLevel === level.id ? colors.textInverse : colors.primary },
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
          <MapPin color={colors.primary} size={20} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ville de départ</Text>
        </View>
        <TextInput
          testID="input-departure-city"
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="Ex: Paris, Lyon, Marseille..."
          placeholderTextColor={colors.textLight}
          value={departureCity}
          onChangeText={setDepartureCity}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MapPin color={colors.primary} size={20} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Nationalité</Text>
        </View>
        <TextInput
          testID="input-nationality"
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="Votre nationalité"
          placeholderTextColor={colors.textLight}
          value={nationality}
          onChangeText={setNationality}
        />
        <Text style={[styles.helperText, { color: colors.textLight }]}>
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
          colors={isFormValid ? (colors.primaryGradient as [string, string]) : [colors.textTertiary, colors.textSecondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.submitGradient}
        >
          <Text style={[styles.submitText, { color: colors.textInverse }]}>Obtenir les informations</Text>
          <ChevronRight color={colors.textInverse} size={20} />
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
    padding: 24,
    paddingBottom: 64,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
  },
  destinationCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  destinationName: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  destinationCountry: {
    fontSize: 15,
  },
  dateInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  dateInputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
  },
  helperText: {
    fontSize: 13,
    marginTop: 4,
    fontStyle: 'italic' as const,
  },
  budgetLevels: {
    gap: 16,
  },
  budgetLevel: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  budgetLevelActive: {
    borderWidth: 2,
  },
  budgetLevelGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  checkIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetIcon: {
    fontSize: 24,
  },
  budgetLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600' as const,
  },
  budgetPrice: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  submitText: {
    fontSize: 17,
    fontWeight: '700' as const,
  },
});
