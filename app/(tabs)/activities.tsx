import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search,
  MapPin,
  Star,
  Clock,
  Mountain,
  Camera,
  Landmark,
  Waves,
  Trees,
  Navigation,
} from 'lucide-react-native';
import { useTheme } from '@/store/ThemeContext';
import * as Location from 'expo-location';
import { trpc } from '@/lib/trpc';

interface Activity {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  duration: string;
  image: string;
  category: string;
  description: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
}





function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function ActivitiesScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const categories = [
    { icon: Landmark, label: 'Culture', color: colors.primary },
    { icon: Mountain, label: 'Aventure', color: colors.secondary },
    { icon: Trees, label: 'Nature', color: colors.accent },
    { icon: Camera, label: 'Visites', color: colors.warning },
    { icon: Waves, label: 'Plage', color: '#3b82f6' },
  ];
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  const activitiesQuery = trpc.activities.getAll.useQuery({
    category: selectedCategory || undefined,
    search: searchQuery || undefined,
  });

  useEffect(() => {
    console.log('[Activities] Requesting location permission...');
    (async () => {
      try {
        if (Platform.OS === 'web') {
          if (!navigator.geolocation) {
            console.log('[Activities] Geolocation not supported on web');
            setLocationError('Géolocalisation non supportée');
            setLocationLoading(false);
            return;
          }

          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log('[Activities] Web location obtained:', position.coords);
              setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
              setLocationLoading(false);
            },
            (error) => {
              console.log('[Activities] Web location error:', error);
              setLocationError('Impossible d\'obtenir votre position');
              setLocationLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        } else {
          const { status } = await Location.requestForegroundPermissionsAsync();
          console.log('[Activities] Permission status:', status);

          if (status !== 'granted') {
            console.log('[Activities] Permission denied');
            setLocationError('Permission de localisation refusée');
            setLocationLoading(false);
            return;
          }

          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          console.log('[Activities] Location obtained:', location.coords);
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          setLocationLoading(false);
        }
      } catch (error) {
        console.log('[Activities] Location error:', error);
        setLocationError('Erreur lors de la récupération de votre position');
        setLocationLoading(false);
      }
    })();
  }, []);

  const filteredActivities = useMemo(() => {
    if (!activitiesQuery.data) return [];

    type ActivityWithDistance = typeof activitiesQuery.data[number] & { distance?: number };

    let results: ActivityWithDistance[] = activitiesQuery.data.map(activity => {
      if (userLocation && activity.latitude && activity.longitude) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          activity.latitude,
          activity.longitude
        );
        return { ...activity, distance };
      }
      return activity;
    });

    if (userLocation) {
      results.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }

    return results;
  }, [activitiesQuery.data, userLocation]);

  const handleActivityPress = useCallback((activity: Activity) => {
    console.log('[Activities] Activity pressed:', activity.name);
    Alert.alert(
      activity.name,
      `${activity.location}\n\n${activity.description}\n\n⭐ ${activity.rating} (${activity.reviews} avis)\n⏱️ ${activity.duration}\n🎫 ${activity.category}`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Détails', onPress: () => {
          Alert.alert(
            'Réservation',
            `Confirmer la réservation pour ${activity.name} ?\n\nPrix: €${activity.price} par personne\nDurée: ${activity.duration}`,
            [
              { text: 'Annuler', style: 'cancel' },
              { text: 'Confirmer', onPress: () => {
                Alert.alert('Succès', `Réservation confirmée pour ${activity.name} !\n\nVous recevrez un email de confirmation.`);
              }}
            ]
          );
        }}
      ]
    );
  }, []);

  const handleCategoryPress = useCallback((category: string) => {
    console.log('[Activities] Category pressed:', category);
    setSelectedCategory(selectedCategory === category ? '' : category);
  }, [selectedCategory]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.backgroundSecondary]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Activités</Text>
          {locationLoading && (
            <ActivityIndicator size="small" color={colors.primary} />
          )}
          {!locationLoading && userLocation && (
            <View style={styles.locationIndicator}>
              <Navigation color={colors.primary} size={16} />
              <Text style={styles.locationText}>Autour de vous</Text>
            </View>
          )}
        </View>
        {locationError && (
          <Text style={styles.locationError}>{locationError}</Text>
        )}
        <Text style={styles.subtitle}>Choses à faire</Text>

        <View style={styles.searchBar}>
          <Search color={colors.textSecondary} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une activité..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Catégories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.label && styles.categoryCardActive,
                ]}
                onPress={() => handleCategoryPress(category.label)}
              >
                <LinearGradient
                  colors={
                    selectedCategory === category.label
                      ? [category.color, `${category.color}80`]
                      : [`${category.color}20`, `${category.color}10`]
                  }
                  style={styles.categoryGradient}
                >
                  <category.icon
                    color={
                      selectedCategory === category.label
                        ? colors.white
                        : category.color
                    }
                    size={24}
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      selectedCategory === category.label && styles.categoryLabelActive,
                    ]}
                  >
                    {category.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.activitiesSection}>
          <View style={styles.activitiesHeader}>
            <Text style={styles.sectionTitle}>
              {userLocation ? 'Activités proches' : 'Activités populaires'}
            </Text>
            <Text style={styles.resultsCount}>{filteredActivities.length} activité{filteredActivities.length > 1 ? 's' : ''}</Text>
          </View>

          {activitiesQuery.isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Chargement des activités...</Text>
            </View>
          ) : activitiesQuery.error ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Erreur lors du chargement des activités
              </Text>
            </View>
          ) : filteredActivities.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Aucune activité trouvée avec ces critères
              </Text>
            </View>
          ) : (
            filteredActivities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={styles.activityCard}
              onPress={() => handleActivityPress(activity)}
            >
              <View style={styles.activityImageContainer}>
                <Image
                  source={{ uri: activity.image }}
                  style={styles.activityImage}
                  resizeMode="cover"
                />
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{activity.category}</Text>
                </View>
              </View>

              <View style={styles.activityInfo}>
                <Text style={styles.activityName} numberOfLines={1}>
                  {activity.name}
                </Text>

                <View style={styles.locationContainer}>
                  <MapPin color={colors.textSecondary} size={14} />
                  <Text style={styles.location}>{activity.location}</Text>
                  {activity.distance !== undefined && (
                    <Text style={styles.distanceText}>
                      • {activity.distance < 1
                        ? `${Math.round(activity.distance * 1000)}m`
                        : `${activity.distance.toFixed(1)}km`}
                    </Text>
                  )}
                </View>

                <Text style={styles.description} numberOfLines={2}>
                  {activity.description}
                </Text>

                <View style={styles.activityMeta}>
                  <View style={styles.ratingContainer}>
                    <Star
                      color={colors.warning}
                      size={14}
                      fill={colors.warning}
                    />
                    <Text style={styles.ratingText}>{activity.rating}</Text>
                    <Text style={styles.reviewsText}>({activity.reviews})</Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Clock color={colors.textSecondary} size={14} />
                    <Text style={styles.metaText}>{activity.duration}</Text>
                  </View>
                </View>

                <View style={styles.activityFooter}>
                  <View>
                    <Text style={styles.priceLabel}>À partir de</Text>
                    <Text style={styles.price}>€{activity.price}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => handleActivityPress(activity)}
                  >
                    <Text style={styles.bookButtonText}>Détails</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as '700',
    letterSpacing: -0.5,
  },
  locationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '600' as '600',
  },
  locationError: {
    fontSize: 12,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  categoriesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as '700',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 24,
    gap: 16,
  },
  categoryCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryCardActive: {
    transform: [{ scale: 1.05 }],
  },
  categoryGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 4,
    borderWidth: 1,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600' as '600',
  },
  categoryLabelActive: {
  },
  activitiesSection: {
    paddingHorizontal: 24,
  },
  activitiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 13,
  },
  activityCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  activityImageContainer: {
    height: 180,
    position: 'relative' as const,
  },
  activityImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute' as const,
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 24,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600' as '600',
    color: '#fff',
  },
  activityInfo: {
    padding: 16,
  },
  activityName: {
    fontSize: 17,
    fontWeight: '700' as '700',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    flex: 1,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600' as '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  activityMeta: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700' as '700',
  },
  reviewsText: {
    fontSize: 13,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  priceLabel: {
    fontSize: 11,
  },
  price: {
    fontSize: 20,
    fontWeight: '700' as '700',
  },
  bookButton: {
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  bookButtonText: {
    fontSize: 13,
    fontWeight: '700' as '700',
  },
  emptyState: {
    padding: 64,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  emptyStateText: {
    fontSize: 15,
    textAlign: 'center' as const,
  },
  loadingContainer: {
    padding: 64,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    textAlign: 'center' as const,
  },
});
