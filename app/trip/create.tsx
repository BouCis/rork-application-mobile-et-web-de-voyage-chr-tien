import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X, MapPin, Calendar, Users, DollarSign, FileText } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useApp } from '@/store/AppContext';
import type { Trip } from '@/types';

export default function CreateTripScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addTrip } = useApp();
  
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  const [budget, setBudget] = useState<string>('');
  const [travelers, setTravelers] = useState<string>('1');
  const [notes, setNotes] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  const handleClose = () => {
    router.back();
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleStartDateChange = (_event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
      if (selectedDate > endDate) {
        setEndDate(new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000));
      }
    }
  };

  const handleEndDateChange = (_event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      if (selectedDate >= startDate) {
        setEndDate(selectedDate);
      } else {
        Alert.alert('Date invalide', 'La date de fin doit être après la date de début.');
      }
    }
  };

  const handleSave = async () => {
    if (!title || !destination || !country) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (endDate < startDate) {
      Alert.alert('Dates invalides', 'La date de fin doit être après la date de début.');
      return;
    }

    const travelerCount = parseInt(travelers);
    if (isNaN(travelerCount) || travelerCount < 1) {
      Alert.alert('Nombre de voyageurs', 'Veuillez entrer un nombre valide de voyageurs.');
      return;
    }

    try {
      setSaving(true);
      
      const newTrip: Trip = {
        id: Date.now().toString(),
        title,
        description,
        destination,
        country,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        locations: [],
        budget: {
          total: parseFloat(budget) || 0,
          spent: 0,
          currency: 'EUR',
          breakdown: {
            transport: 0,
            accommodation: 0,
            food: 0,
            activities: 0,
            other: 0,
          },
        },
        status: 'planning',
        isPublic: false,
        travelers: travelerCount,
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addTrip(newTrip);
      Alert.alert('Succès', 'Voyage créé avec succès !', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error creating trip:', error);
      Alert.alert('Erreur', 'Impossible de créer le voyage.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.backgroundDark, theme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Nouveau Voyage</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Fermer"
          >
            <X color={theme.colors.text} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <View style={styles.formField}>
            <Text style={styles.label}>Titre du voyage *</Text>
            <View style={styles.inputContainer}>
              <MapPin color={theme.colors.textLight} size={20} />
              <TextInput
                style={styles.input}
                placeholder="Ex: Voyage à Paris"
                placeholderTextColor={theme.colors.textLight}
                value={title}
                onChangeText={setTitle}
              />
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Description</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Décrivez votre voyage..."
                placeholderTextColor={theme.colors.textLight}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formFieldHalf}>
              <Text style={styles.label}>Destination *</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Ville"
                  placeholderTextColor={theme.colors.textLight}
                  value={destination}
                  onChangeText={setDestination}
                />
              </View>
            </View>

            <View style={styles.formFieldHalf}>
              <Text style={styles.label}>Pays *</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Pays"
                  placeholderTextColor={theme.colors.textLight}
                  value={country}
                  onChangeText={setCountry}
                />
              </View>
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formFieldHalf}>
              <Text style={styles.label}>Date de début *</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Calendar color={theme.colors.textLight} size={20} />
                <Text style={styles.dateText}>{formatDate(startDate)}</Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleStartDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.formFieldHalf}>
              <Text style={styles.label}>Date de fin *</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Calendar color={theme.colors.textLight} size={20} />
                <Text style={styles.dateText}>{formatDate(endDate)}</Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleEndDateChange}
                  minimumDate={startDate}
                />
              )}
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formFieldHalf}>
              <Text style={styles.label}>Budget (€)</Text>
              <View style={styles.inputContainer}>
                <DollarSign color={theme.colors.textLight} size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="1000"
                  placeholderTextColor={theme.colors.textLight}
                  value={budget}
                  onChangeText={setBudget}
                  keyboardType={Platform.select({ ios: 'number-pad', android: 'numeric', default: 'numeric' }) as any}
                />
              </View>
            </View>

            <View style={styles.formFieldHalf}>
              <Text style={styles.label}>Voyageurs</Text>
              <View style={styles.inputContainer}>
                <Users color={theme.colors.textLight} size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="1"
                  placeholderTextColor={theme.colors.textLight}
                  value={travelers}
                  onChangeText={setTravelers}
                  keyboardType={Platform.select({ ios: 'number-pad', android: 'numeric', default: 'numeric' }) as any}
                />
              </View>
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Notes</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <FileText color={theme.colors.textLight} size={20} style={styles.textAreaIcon} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ajoutez des notes personnelles..."
                placeholderTextColor={theme.colors.textLight}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
              />
            </View>
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
            end={{ x: 1, y: 1 }}
            style={styles.saveGradient}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Création...' : 'Créer le voyage'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.fontSize.hero,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  form: {
    gap: theme.spacing.lg,
  },
  formField: {
    gap: theme.spacing.sm,
  },
  formRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  formFieldHalf: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingTop: theme.spacing.sm,
  },
  textAreaIcon: {
    marginTop: 4,
  },
  input: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  dateText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  saveGradient: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textInverse,
  },
});
