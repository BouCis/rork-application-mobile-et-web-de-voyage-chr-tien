import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Search, Layers } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { getDestinationsByContinent } from '@/data/destinations';
import * as Location from 'expo-location';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [mapType, setMapType] = useState<'standard' | 'hybrid' | 'terrain'>('standard');

  const mapRef = useRef<any>(null);

  const africanDestinations = getDestinationsByContinent('Afrique');

  const handleLocationPress = async () => {
    console.log('[Map] Location button pressed');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Impossible d\'accéder à votre position');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    if (Platform.OS !== 'web' && mapRef.current) {
      Alert.alert('Position', `Lat: ${location.coords.latitude.toFixed(4)}, Lng: ${location.coords.longitude.toFixed(4)}`);
    }
  };

  const handleMarkerPress = (destinationId: string) => {
    console.log('[Map] Marker pressed:', destinationId);
    router.push(`/destination/${destinationId}`);
  };

  const MapComponent = Platform.OS === 'web' ? (
    <View style={styles.webMapContainer}>
      <LinearGradient
        colors={['#1a472a', '#2d5f3f', '#1a472a']}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.destinationGrid}>
        {africanDestinations.map((dest) => (
          <TouchableOpacity
            key={dest.id}
            style={styles.webDestinationCard}
            onPress={() => handleMarkerPress(dest.id)}
            activeOpacity={0.7}
          >
            <View style={styles.pinIcon}>
              <MapPin color={theme.colors.primary} size={20} />
            </View>
            <Text style={styles.destName} numberOfLines={1}>{dest.name}</Text>
            <Text style={styles.destCountry} numberOfLines={1}>{dest.country}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>★ {dest.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  ) : null;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={styles.title}>Carte</Text>
          <Text style={styles.subtitle}>{africanDestinations.length} destinations en Afrique</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              const types = ['standard', 'hybrid', 'terrain'] as const;
              const currentIndex = types.indexOf(mapType);
              const nextType = types[(currentIndex + 1) % types.length];
              setMapType(nextType);
            }}
          >
            <Layers color={theme.colors.text} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapContainer}>
        {MapComponent ? MapComponent : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Carte disponible sur web uniquement</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.myLocationButton, { bottom: insets.bottom + 100 }]}
        onPress={handleLocationPress}
      >
        <Search color="#fff" size={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
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
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold as '700',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  mapContainer: {
    flex: 1,
  },
  webMapContainer: {
    flex: 1,
    position: 'relative',
  },
  destinationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  webDestinationCard: {
    width: '47%',
    backgroundColor: theme.colors.backgroundDark,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  pinIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  destName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold as '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  destCountry: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  ratingContainer: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    marginTop: 4,
  },
  rating: {
    fontSize: theme.fontSize.sm,
    color: '#fff',
    fontWeight: theme.fontWeight.bold as '700',
  },
  myLocationButton: {
    position: 'absolute',
    right: theme.spacing.lg,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
