import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { getDestinationsByContinent } from '@/data/destinations';

export default function MapScreenWeb() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const africanDestinations = getDestinationsByContinent('Afrique');

  const handleMarkerPress = (destinationId: string) => {
    router.push(`/destination/${destinationId}` as const);
  };

  return (
    <View style={styles.container} testID="map-screen-web">
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={styles.title}>Carte</Text>
          <Text style={styles.subtitle}>{africanDestinations.length} destinations en Afrique</Text>
        </View>
      </View>

      <ScrollView style={styles.webListContainer} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <View style={styles.webList}>
          <Text style={styles.webInfoText}>La carte interactive est disponible sur l&apos;application mobile. Voici la liste des destinations:</Text>
          {africanDestinations.map((dest) => (
            <TouchableOpacity
              key={dest.id}
              testID={`destination-${dest.id}`}
              style={styles.webDestinationCard}
              onPress={() => handleMarkerPress(dest.id)}
              activeOpacity={0.85}
            >
              <View style={styles.webDestinationIcon}>
                <MapPin color={theme.colors.primary} size={24} />
              </View>
              <View style={styles.webDestinationInfo}>
                <Text style={styles.webDestinationName}>{dest.name}</Text>
                <Text style={styles.webDestinationCountry}>{dest.country}</Text>
                <Text style={styles.webDestinationCoords}>
                  {dest.coordinates.latitude.toFixed(4)}, {dest.coordinates.longitude.toFixed(4)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: { fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.bold, color: theme.colors.text, letterSpacing: -0.5 },
  subtitle: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, marginTop: 2 },
  webListContainer: { flex: 1 },
  webList: { padding: theme.spacing.lg, gap: theme.spacing.md },
  webInfoText: { fontSize: theme.fontSize.md, color: theme.colors.textSecondary, marginBottom: theme.spacing.md, textAlign: 'center' },
  webDestinationCard: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  webDestinationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webDestinationInfo: { flex: 1 },
  webDestinationName: { fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.semibold, color: theme.colors.text, marginBottom: 2 },
  webDestinationCountry: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, marginBottom: 4 },
  webDestinationCoords: { fontSize: theme.fontSize.xs, color: theme.colors.textMuted, fontFamily: 'monospace' },
});