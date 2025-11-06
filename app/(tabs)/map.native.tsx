import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, MapType } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Layers, Locate, MapPin } from 'lucide-react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { getDestinationsByContinent } from '@/data/destinations';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [mapType, setMapType] = useState<MapType>('standard');
  const mapRef = useRef<MapView | null>(null);

  const africanDestinations = getDestinationsByContinent('Afrique');

  const handleLocationPress = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', "Impossible d'accéder à votre position");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 10,
            longitudeDelta: 10,
          },
          1000,
        );
      }
    } catch (error) {
      console.error('[Map] Error getting location', error);
      Alert.alert('Erreur', "Impossible d'obtenir votre position");
    }
  };

  const handleMarkerPress = (destinationId: string) => {
    router.push(`/destination/${destinationId}` as const);
  };

  return (
    <View style={styles.container} testID="map-screen-native">
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={styles.title}>Carte</Text>
          <Text style={styles.subtitle}>{africanDestinations.length} destinations en Afrique</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            testID="toggle-map-type"
            style={styles.iconButton}
            onPress={() => {
              const types = ['standard', 'hybrid', 'satellite'] as const;
              const i = types.indexOf(mapType as typeof types[number]);
              const next = types[(i + 1) % types.length];
              setMapType(next);
            }}
            activeOpacity={0.8}
          >
            <Layers color={theme.colors.text} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          testID="map-view"
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={{ latitude: 0, longitude: 20, latitudeDelta: 60, longitudeDelta: 60 }}
          mapType={mapType}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass
          showsScale
          loadingEnabled
          loadingIndicatorColor={theme.colors.primary}
        >
          {africanDestinations.map((dest) => (
            <Marker
              key={dest.id}
              coordinate={{ latitude: dest.coordinates.latitude, longitude: dest.coordinates.longitude }}
              title={dest.name}
              description={dest.country}
              onCalloutPress={() => handleMarkerPress(dest.id)}
            >
              <View style={styles.markerContainer}>
                <View style={styles.markerPin}>
                  <MapPin color="#fff" size={20} />
                </View>
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      <TouchableOpacity
        testID="my-location"
        style={[styles.myLocationButton, { bottom: insets.bottom + 100 }]}
        onPress={handleLocationPress}
        activeOpacity={0.85}
      >
        <Locate color="#fff" size={20} />
      </TouchableOpacity>
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
  headerActions: { flexDirection: 'row', gap: theme.spacing.sm },
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
  title: { fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.bold, color: theme.colors.text, letterSpacing: -0.5 },
  subtitle: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, marginTop: 2 },
  mapContainer: { flex: 1 },
  map: { flex: 1, width: '100%', height: '100%' },
  markerContainer: { alignItems: 'center', justifyContent: 'center' },
  markerPin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
});