import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Platform, Pressable, ScrollView } from 'react-native';
import { getCountries, getCitiesByCountry } from '@/data/countriesCities';

interface Props {
  countryIso2?: string;
  city?: string;
  onChange: (v: { countryIso2: string; countryLabel: string; city: string; lat?: number; lng?: number }) => void;
  labelColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  testIDPrefix?: string;
}

export default function CountryCityPicker({ countryIso2, city, onChange, labelColor = '#6E6E73', borderColor = '#DDD', backgroundColor = '#FFF', textColor = '#1B1B1B', testIDPrefix = 'ccp' }: Props) {
  const [selectedCountry, setSelectedCountry] = useState<string>(countryIso2 ?? 'FR');
  const [selectedCity, setSelectedCity] = useState<string>(city ?? '');

  const countries = useMemo(() => getCountries(), []);
  const cities = useMemo(() => getCitiesByCountry(selectedCountry), [selectedCountry]);

  const [openCountry, setOpenCountry] = useState<boolean>(false);
  const [openCity, setOpenCity] = useState<boolean>(false);

  const selectedCountryLabel = countries.find((c) => c.value === selectedCountry)?.label ?? selectedCountry;
  const selectedCityLabel = selectedCity || (cities[0]?.label ?? '');

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: labelColor }]}>Pays</Text>
      <Pressable
        testID={`${testIDPrefix}-country`}
        onPress={() => setOpenCountry((v) => !v)}
        style={[styles.pickerWrap, { borderColor, backgroundColor }]}
      >
        <Text style={[styles.valueText, { color: textColor }]} numberOfLines={1}>
          {selectedCountryLabel}
        </Text>
      </Pressable>
      {openCountry && (
        <View style={[styles.dropdown, { borderColor, backgroundColor }]}
          testID={`${testIDPrefix}-country-dropdown`}
        >
          <ScrollView style={{ maxHeight: 200 }}>
            {countries.map((c) => (
              <Pressable
                key={c.value}
                onPress={() => {
                  setSelectedCountry(c.value);
                  const firstCity = getCitiesByCountry(c.value)[0];
                  const chosenCity = firstCity ? firstCity.value : '';
                  setSelectedCity(chosenCity);
                  setOpenCountry(false);
                  const countryLabel = c.label;
                  onChange({ countryIso2: c.value, countryLabel, city: chosenCity, lat: firstCity?.lat, lng: firstCity?.lng });
                }}
                style={styles.option}
              >
                <Text style={[styles.optionText, { color: textColor }]}>{c.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      <Text style={[styles.label, { color: labelColor, marginTop: 12 }]}>Ville</Text>
      <Pressable
        testID={`${testIDPrefix}-city`}
        onPress={() => setOpenCity((v) => !v)}
        style={[styles.pickerWrap, { borderColor, backgroundColor }]}
      >
        <Text style={[styles.valueText, { color: textColor }]} numberOfLines={1}>
          {selectedCityLabel || 'Sélectionner'}
        </Text>
      </Pressable>
      {openCity && (
        <View style={[styles.dropdown, { borderColor, backgroundColor }]}
          testID={`${testIDPrefix}-city-dropdown`}
        >
          <ScrollView style={{ maxHeight: 200 }}>
            {cities.map((c) => (
              <Pressable
                key={c.value}
                onPress={() => {
                  setSelectedCity(c.value);
                  setOpenCity(false);
                  const countryLabel = countries.find((cc) => cc.value === selectedCountry)?.label ?? selectedCountry;
                  onChange({ countryIso2: selectedCountry, countryLabel, city: c.value, lat: c.lat, lng: c.lng });
                }}
                style={styles.option}
              >
                <Text style={[styles.optionText, { color: textColor }]}>{c.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600' as const },
  pickerWrap: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 12,
    justifyContent: 'center',
    minHeight: 44,
  },
  valueText: { fontSize: 15 },
  dropdown: {
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 6,
    overflow: 'hidden',
  },
  option: { paddingHorizontal: 12, paddingVertical: 10 },
  optionText: { fontSize: 15 },
});
