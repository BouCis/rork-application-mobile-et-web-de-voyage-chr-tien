import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Phone,
  Shield,
  Ambulance,
  Flame,
  MapPin,
  Search,
  AlertCircle,
} from 'lucide-react-native';
import { useTheme } from '@/store/ThemeContext';

interface EmergencyInfo {
  country: string;
  police: string;
  medical: string;
  fire: string;
  general?: string;
  continent: string;
}

const emergencyNumbers: EmergencyInfo[] = [
  { country: 'France', police: '17', medical: '15', fire: '18', general: '112', continent: 'Europe' },
  { country: 'Espagne', police: '091', medical: '061', fire: '080', general: '112', continent: 'Europe' },
  { country: 'Italie', police: '113', medical: '118', fire: '115', general: '112', continent: 'Europe' },
  { country: 'Allemagne', police: '110', medical: '112', fire: '112', general: '112', continent: 'Europe' },
  { country: 'Royaume-Uni', police: '999', medical: '999', fire: '999', general: '112', continent: 'Europe' },
  { country: 'Grèce', police: '100', medical: '166', fire: '199', general: '112', continent: 'Europe' },
  { country: 'Portugal', police: '112', medical: '112', fire: '112', general: '112', continent: 'Europe' },
  { country: 'Suisse', police: '117', medical: '144', fire: '118', general: '112', continent: 'Europe' },
  { country: 'États-Unis', police: '911', medical: '911', fire: '911', general: '911', continent: 'Amérique du Nord' },
  { country: 'Canada', police: '911', medical: '911', fire: '911', general: '911', continent: 'Amérique du Nord' },
  { country: 'Maroc', police: '19', medical: '15', fire: '15', general: '112', continent: 'Afrique' },
  { country: 'Tunisie', police: '197', medical: '190', fire: '198', general: '112', continent: 'Afrique' },
  { country: 'Égypte', police: '122', medical: '123', fire: '180', continent: 'Afrique' },
  { country: 'Sénégal', police: '17', medical: '15', fire: '18', continent: 'Afrique' },
  { country: 'Côte d\'Ivoire', police: '111', medical: '185', fire: '180', continent: 'Afrique' },
  { country: 'Kenya', police: '999', medical: '999', fire: '999', general: '112', continent: 'Afrique' },
  { country: 'Afrique du Sud', police: '10111', medical: '10177', fire: '10177', general: '112', continent: 'Afrique' },
  { country: 'Japon', police: '110', medical: '119', fire: '119', continent: 'Asie' },
  { country: 'Chine', police: '110', medical: '120', fire: '119', continent: 'Asie' },
  { country: 'Thaïlande', police: '191', medical: '1669', fire: '199', continent: 'Asie' },
  { country: 'Indonésie', police: '110', medical: '118', fire: '113', continent: 'Asie' },
  { country: 'Émirats Arabes Unis', police: '999', medical: '998', fire: '997', general: '112', continent: 'Asie' },
  { country: 'Israël', police: '100', medical: '101', fire: '102', continent: 'Asie' },
  { country: 'Turquie', police: '155', medical: '112', fire: '110', general: '112', continent: 'Asie' },
  { country: 'Australie', police: '000', medical: '000', fire: '000', general: '112', continent: 'Océanie' },
  { country: 'Brésil', police: '190', medical: '192', fire: '193', continent: 'Amérique du Sud' },
];

export default function EmergencyNumbersScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return emergencyNumbers;
    const query = searchQuery.toLowerCase();
    return emergencyNumbers.filter(e =>
      e.country.toLowerCase().includes(query) ||
      e.continent.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleCall = useCallback((number: string, type: string) => {
    Alert.alert(
      `Appeler ${type}`,
      `Voulez-vous appeler le ${number} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Appeler',
          onPress: () => {
            Linking.openURL(`tel:${number}`);
          },
        },
      ]
    );
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Numéros d\'urgence',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      <LinearGradient
        colors={[colors.background, colors.backgroundSecondary]}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.error}20` }]}>
            <AlertCircle color={colors.error} size={32} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Numéros d'urgence</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Numéros importants par pays
          </Text>
        </View>

        <View style={[styles.warningCard, { backgroundColor: `${colors.warning}15`, borderColor: `${colors.warning}40` }]}>
          <AlertCircle color={colors.warning} size={24} />
          <View style={styles.warningTextContainer}>
            <Text style={[styles.warningTitle, { color: colors.text }]}>Important</Text>
            <Text style={[styles.warningText, { color: colors.textSecondary }]}>
              Ces numéros sont pour les urgences réelles. En cas d'urgence, composez immédiatement.
            </Text>
          </View>
        </View>

        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search color={colors.textLight} size={20} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Rechercher un pays..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
          {filteredCountries.length} pays trouvé{filteredCountries.length > 1 ? 's' : ''}
        </Text>

        {filteredCountries.map((country, index) => (
          <View
            key={index}
            style={[styles.countryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={styles.countryHeader}>
              <View style={[styles.flagPlaceholder, { backgroundColor: `${colors.primary}20` }]}>
                <MapPin color={colors.primary} size={20} />
              </View>
              <View style={styles.countryInfo}>
                <Text style={[styles.countryName, { color: colors.text }]}>{country.country}</Text>
                <Text style={[styles.continent, { color: colors.textSecondary }]}>{country.continent}</Text>
              </View>
            </View>

            <View style={styles.numbersGrid}>
              {country.general && (
                <TouchableOpacity
                  style={[styles.numberCard, { backgroundColor: colors.backgroundLight }]}
                  onPress={() => handleCall(country.general!, 'Urgences générales')}
                >
                  <View style={[styles.numberIcon, { backgroundColor: `${colors.accent}20` }]}>
                    <Phone color={colors.accent} size={20} />
                  </View>
                  <Text style={[styles.numberLabel, { color: colors.textSecondary }]}>Général</Text>
                  <Text style={[styles.numberValue, { color: colors.text }]}>{country.general}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.numberCard, { backgroundColor: colors.backgroundLight }]}
                onPress={() => handleCall(country.police, 'Police')}
              >
                <View style={[styles.numberIcon, { backgroundColor: `${colors.primary}20` }]}>
                  <Shield color={colors.primary} size={20} />
                </View>
                <Text style={[styles.numberLabel, { color: colors.textSecondary }]}>Police</Text>
                <Text style={[styles.numberValue, { color: colors.text }]}>{country.police}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.numberCard, { backgroundColor: colors.backgroundLight }]}
                onPress={() => handleCall(country.medical, 'Urgences médicales')}
              >
                <View style={[styles.numberIcon, { backgroundColor: `${colors.error}20` }]}>
                  <Ambulance color={colors.error} size={20} />
                </View>
                <Text style={[styles.numberLabel, { color: colors.textSecondary }]}>Médical</Text>
                <Text style={[styles.numberValue, { color: colors.text }]}>{country.medical}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.numberCard, { backgroundColor: colors.backgroundLight }]}
                onPress={() => handleCall(country.fire, 'Pompiers')}
              >
                <View style={[styles.numberIcon, { backgroundColor: `${colors.warning}20` }]}>
                  <Flame color={colors.warning} size={20} />
                </View>
                <Text style={[styles.numberLabel, { color: colors.textSecondary }]}>Pompiers</Text>
                <Text style={[styles.numberValue, { color: colors.text }]}>{country.fire}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
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
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  warningCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    gap: 12,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    lineHeight: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  resultsCount: {
    fontSize: 13,
    marginBottom: 16,
    fontWeight: '600' as const,
  },
  countryCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  countryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  flagPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 2,
  },
  continent: {
    fontSize: 13,
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  numberCard: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  numberIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  numberLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  numberValue: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
});
