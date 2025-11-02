import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {
  Plane,
  Train,
  Bus,
  Car,
  Ship,
  MapPin,
  Filter,
  X,
  ChevronDown,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { SearchFilters } from '@/types';

interface TransportFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClose: () => void;
}

const transportIcons = {
  flight: Plane,
  train: Train,
  bus: Bus,
  car: Car,
  boat: Ship,
  walk: MapPin,
};

const transportLabels = {
  flight: 'Avion',
  train: 'Train',
  bus: 'Bus',
  car: 'Voiture',
  boat: 'Bateau',
  walk: 'Marche',
};

export function TransportFilters({ filters, onFiltersChange, onClose }: TransportFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const handleTransportTypeToggle = (type: keyof typeof transportIcons) => {
    const newTypes = localFilters.transportTypes.includes(type)
      ? localFilters.transportTypes.filter(t => t !== type)
      : [...localFilters.transportTypes, type];
    
    console.log('🚗 Type de transport modifié:', type, newTypes.includes(type) ? 'activé' : 'désactivé');
    setLocalFilters({ ...localFilters, transportTypes: newTypes });
  };

  const handleApplyFilters = () => {
    console.log('🔧 Filtres appliqués:', localFilters);
    onFiltersChange(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    console.log('🔄 Réinitialisation des filtres');
    const resetFilters: SearchFilters = {
      transportTypes: ['flight', 'train', 'bus', 'car', 'boat', 'walk'],
      sortBy: 'price',
      sortOrder: 'asc',
    };
    setLocalFilters(resetFilters);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Filter size={20} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Filtres de transport</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Types de transport */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Moyens de transport</Text>
          <View style={styles.transportGrid}>
            {Object.entries(transportIcons).map(([type, IconComponent]) => {
              const isSelected = localFilters.transportTypes.includes(type as any);
              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.transportOption,
                    isSelected && styles.transportOptionSelected,
                  ]}
                  onPress={() => handleTransportTypeToggle(type as keyof typeof transportIcons)}
                >
                  <IconComponent
                    size={24}
                    color={isSelected ? theme.colors.white : theme.colors.primary}
                  />
                  <Text
                    style={[
                      styles.transportLabel,
                      isSelected && styles.transportLabelSelected,
                    ]}
                  >
                    {transportLabels[type as keyof typeof transportLabels]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Tri */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trier par</Text>
          <View style={styles.sortOptions}>
            {[
              { key: 'price', label: 'Prix' },
              { key: 'duration', label: 'Durée' },
              { key: 'comfort', label: 'Confort' },
              { key: 'carbon', label: 'Empreinte carbone' },
              { key: 'departure', label: 'Heure de départ' },
            ].map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.sortOption,
                  localFilters.sortBy === key && styles.sortOptionSelected,
                ]}
                onPress={() => setLocalFilters({ ...localFilters, sortBy: key as any })}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    localFilters.sortBy === key && styles.sortOptionTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sortOrder}>
            <TouchableOpacity
              style={[
                styles.sortOrderOption,
                localFilters.sortOrder === 'asc' && styles.sortOrderOptionSelected,
              ]}
              onPress={() => setLocalFilters({ ...localFilters, sortOrder: 'asc' })}
            >
              <Text
                style={[
                  styles.sortOrderText,
                  localFilters.sortOrder === 'asc' && styles.sortOrderTextSelected,
                ]}
              >
                Croissant
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sortOrderOption,
                localFilters.sortOrder === 'desc' && styles.sortOrderOptionSelected,
              ]}
              onPress={() => setLocalFilters({ ...localFilters, sortOrder: 'desc' })}
            >
              <Text
                style={[
                  styles.sortOrderText,
                  localFilters.sortOrder === 'desc' && styles.sortOrderTextSelected,
                ]}
              >
                Décroissant
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filtres avancés */}
        <TouchableOpacity
          style={styles.advancedToggle}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <Text style={styles.advancedToggleText}>Filtres avancés</Text>
          <ChevronDown
            size={16}
            color={theme.colors.primary}
            style={[styles.chevron, showAdvanced && styles.chevronRotated]}
          />
        </TouchableOpacity>

        {showAdvanced && (
          <View style={styles.advancedSection}>
            {/* Prix maximum */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Prix maximum (€)</Text>
              <TextInput
                style={styles.textInput}
                value={localFilters.maxPrice?.toString() || ''}
                onChangeText={(text) => {
                  const value = text ? parseInt(text, 10) : undefined;
                  setLocalFilters({ ...localFilters, maxPrice: value });
                }}
                placeholder="Aucune limite"
                keyboardType="numeric"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            {/* Durée maximum */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Durée maximum (heures)</Text>
              <TextInput
                style={styles.textInput}
                value={localFilters.maxDuration?.toString() || ''}
                onChangeText={(text) => {
                  const value = text ? parseInt(text, 10) : undefined;
                  setLocalFilters({ ...localFilters, maxDuration: value });
                }}
                placeholder="Aucune limite"
                keyboardType="numeric"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            {/* Confort minimum */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confort minimum (1-5)</Text>
              <View style={styles.comfortOptions}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.comfortOption,
                      (localFilters.minComfort || 0) >= level && styles.comfortOptionSelected,
                    ]}
                    onPress={() => setLocalFilters({ ...localFilters, minComfort: level })}
                  >
                    <Text
                      style={[
                        styles.comfortOptionText,
                        (localFilters.minComfort || 0) >= level && styles.comfortOptionTextSelected,
                      ]}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Escales maximum */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Escales maximum</Text>
              <TextInput
                style={styles.textInput}
                value={localFilters.maxStops?.toString() || ''}
                onChangeText={(text) => {
                  const value = text ? parseInt(text, 10) : undefined;
                  setLocalFilters({ ...localFilters, maxStops: value });
                }}
                placeholder="Aucune limite"
                keyboardType="numeric"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            {/* Accessibilité */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setLocalFilters({ 
                ...localFilters, 
                accessibility: !localFilters.accessibility 
              })}
            >
              <View style={[
                styles.checkbox,
                localFilters.accessibility && styles.checkboxSelected,
              ]}>
                {localFilters.accessibility && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={styles.checkboxLabel}>Accessibilité requise</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.resetButton} onPress={handleResetFilters}>
          <Text style={styles.resetButtonText}>Réinitialiser</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
          <Text style={styles.applyButtonText}>Appliquer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  transportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  transportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
  },
  transportOptionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  transportLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  transportLabelSelected: {
    color: theme.colors.white,
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sortOption: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
  },
  sortOptionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  sortOptionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  sortOptionTextSelected: {
    color: theme.colors.white,
  },
  sortOrder: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  sortOrderOption: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  sortOrderOptionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  sortOrderText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  sortOrderTextSelected: {
    color: theme.colors.white,
  },
  advancedToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  advancedToggleText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  advancedSection: {
    gap: theme.spacing.lg,
  },
  inputGroup: {
    gap: theme.spacing.sm,
  },
  inputLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.white,
  },
  comfortOptions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  comfortOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comfortOptionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  comfortOptionText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text,
  },
  comfortOptionTextSelected: {
    color: theme.colors.white,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  resetButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  applyButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.white,
  },
});