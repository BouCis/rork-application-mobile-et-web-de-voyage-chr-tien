import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search,
  MapPin,
  Star,
  Clock,
  DollarSign,
  UtensilsCrossed,
  Pizza,
  Coffee,
  Soup,
  IceCream,
  Beef,
  Salad,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';

interface Restaurant {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  priceRange: string;
  cuisine: string;
  image: string;
  openHours: string;
  specialties: string[];
}

const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Le Petit Bistro',
    location: 'Paris, France',
    rating: 4.8,
    reviews: 1823,
    priceRange: '€€€',
    cuisine: 'Français',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    openHours: '12:00 - 22:00',
    specialties: ['Coq au vin', 'Escargots', 'Crème brûlée'],
  },
  {
    id: '2',
    name: 'Sushi Master',
    location: 'Tokyo, Japon',
    rating: 4.9,
    reviews: 2145,
    priceRange: '€€€€',
    cuisine: 'Japonais',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    openHours: '11:30 - 23:00',
    specialties: ['Sushi', 'Sashimi', 'Omakase'],
  },
  {
    id: '3',
    name: 'Trattoria Bella',
    location: 'Rome, Italie',
    rating: 4.7,
    reviews: 1567,
    priceRange: '€€',
    cuisine: 'Italien',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800',
    openHours: '12:00 - 23:00',
    specialties: ['Carbonara', 'Tiramisu', 'Pizza'],
  },
  {
    id: '4',
    name: 'Spice Garden',
    location: 'Bangkok, Thaïlande',
    rating: 4.6,
    reviews: 892,
    priceRange: '€',
    cuisine: 'Thaï',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
    openHours: '11:00 - 22:00',
    specialties: ['Pad Thai', 'Tom Yum', 'Curry vert'],
  },
  {
    id: '5',
    name: 'The Steakhouse',
    location: 'New York, USA',
    rating: 4.8,
    reviews: 2341,
    priceRange: '€€€€',
    cuisine: 'Américain',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    openHours: '17:00 - 23:00',
    specialties: ['Steak', 'Burger', 'Cheesecake'],
  },
];

const cuisineTypes = [
  { icon: UtensilsCrossed, label: 'Tous', color: theme.colors.primary },
  { icon: Pizza, label: 'Italien', color: '#ef4444' },
  { icon: Coffee, label: 'Café', color: '#8b5cf6' },
  { icon: Soup, label: 'Asiatique', color: '#f59e0b' },
  { icon: Beef, label: 'Viande', color: '#dc2626' },
  { icon: Salad, label: 'Végétarien', color: '#10b981' },
];

export default function RestaurantsScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('Tous');

  const filteredRestaurants = useMemo(() => {
    let results = restaurants;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(r => 
        r.name.toLowerCase().includes(query) ||
        r.location.toLowerCase().includes(query) ||
        r.cuisine.toLowerCase().includes(query)
      );
    }

    if (selectedCuisine !== 'Tous') {
      const cuisineMap: Record<string, string[]> = {
        'Italien': ['Italien'],
        'Asiatique': ['Japonais', 'Thaï', 'Chinois', 'Coréen'],
        'Viande': ['Américain', 'Argentin'],
        'Végétarien': [],
        'Café': [],
      };
      
      const allowedCuisines = cuisineMap[selectedCuisine] || [];
      if (allowedCuisines.length > 0) {
        results = results.filter(r => allowedCuisines.includes(r.cuisine));
      }
    }

    return results;
  }, [searchQuery, selectedCuisine]);

  const handleRestaurantPress = useCallback((restaurant: Restaurant) => {
    console.log('[Restaurants] Restaurant pressed:', restaurant.name);
    Alert.alert(
      restaurant.name,
      `${restaurant.location}\n\n⭐ ${restaurant.rating} (${restaurant.reviews} avis)\n🍴 ${restaurant.cuisine}\n💰 ${restaurant.priceRange}\n⏰ ${restaurant.openHours}\n\nSpécialités: ${restaurant.specialties.join(', ')}`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Réserver', onPress: () => {
          Alert.alert('Réservation', `Fonctionnalité de réservation pour ${restaurant.name} à venir.`);
        }}
      ]
    );
  }, []);

  const handleCuisinePress = useCallback((cuisine: string) => {
    console.log('[Restaurants] Cuisine pressed:', cuisine);
    setSelectedCuisine(cuisine);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.backgroundDark, theme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Restaurants</Text>
        <Text style={styles.subtitle}>Découvrez la gastronomie locale</Text>

        <View style={styles.searchBar}>
          <Search color={theme.colors.textLight} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un restaurant..."
            placeholderTextColor={theme.colors.textLight}
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
        <View style={styles.cuisinesSection}>
          <Text style={styles.sectionTitle}>Cuisines</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cuisinesScroll}
          >
            {cuisineTypes.map((cuisine, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.cuisineCard,
                  selectedCuisine === cuisine.label && styles.cuisineCardActive,
                ]}
                onPress={() => handleCuisinePress(cuisine.label)}
              >
                <LinearGradient
                  colors={
                    selectedCuisine === cuisine.label
                      ? [cuisine.color, `${cuisine.color}80`]
                      : [`${cuisine.color}20`, `${cuisine.color}10`]
                  }
                  style={styles.cuisineGradient}
                >
                  <cuisine.icon
                    color={
                      selectedCuisine === cuisine.label
                        ? theme.colors.white
                        : cuisine.color
                    }
                    size={24}
                  />
                  <Text
                    style={[
                      styles.cuisineLabel,
                      selectedCuisine === cuisine.label && styles.cuisineLabelActive,
                    ]}
                  >
                    {cuisine.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.restaurantsSection}>
          <View style={styles.restaurantsHeader}>
            <Text style={styles.sectionTitle}>Restaurants populaires</Text>
            <Text style={styles.resultsCount}>{filteredRestaurants.length} restaurant{filteredRestaurants.length > 1 ? 's' : ''}</Text>
          </View>

          {filteredRestaurants.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Aucun restaurant trouvé avec ces critères
              </Text>
            </View>
          ) : (
            filteredRestaurants.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.restaurantCard}
              onPress={() => handleRestaurantPress(restaurant)}
            >
              <View style={styles.restaurantImageContainer}>
                <Image
                  source={{ uri: restaurant.image }}
                  style={styles.restaurantImage}
                  resizeMode="cover"
                />
                <View style={styles.cuisineBadge}>
                  <Text style={styles.cuisineBadgeText}>{restaurant.cuisine}</Text>
                </View>
              </View>

              <View style={styles.restaurantInfo}>
                <View style={styles.restaurantHeader}>
                  <Text style={styles.restaurantName} numberOfLines={1}>
                    {restaurant.name}
                  </Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceRange}>{restaurant.priceRange}</Text>
                  </View>
                </View>

                <View style={styles.locationContainer}>
                  <MapPin color={theme.colors.textSecondary} size={14} />
                  <Text style={styles.location}>{restaurant.location}</Text>
                </View>

                <View style={styles.metaRow}>
                  <View style={styles.ratingContainer}>
                    <Star
                      color={theme.colors.warning}
                      size={14}
                      fill={theme.colors.warning}
                    />
                    <Text style={styles.ratingText}>{restaurant.rating}</Text>
                    <Text style={styles.reviewsText}>({restaurant.reviews})</Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Clock color={theme.colors.textLight} size={14} />
                    <Text style={styles.metaText}>{restaurant.openHours}</Text>
                  </View>
                </View>

                <View style={styles.specialtiesContainer}>
                  <Text style={styles.specialtiesLabel}>Spécialités:</Text>
                  <View style={styles.specialtiesRow}>
                    {restaurant.specialties.slice(0, 3).map((specialty, index) => (
                      <View key={index} style={styles.specialtyChip}>
                        <Text style={styles.specialtyText}>{specialty}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.reserveButton}
                  onPress={() => handleRestaurantPress(restaurant)}
                >
                  <Text style={styles.reserveButtonText}>Réserver</Text>
                </TouchableOpacity>
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
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.hero,
    fontWeight: theme.fontWeight.bold as '700',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: theme.spacing.md,
  },
  cuisinesSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold as '700',
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  cuisinesScroll: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  cuisineCard: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  cuisineCardActive: {
    transform: [{ scale: 1.05 }],
  },
  cuisineGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cuisineLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold as '600',
    color: theme.colors.text,
  },
  cuisineLabelActive: {
    color: theme.colors.white,
  },
  restaurantsSection: {
    paddingHorizontal: theme.spacing.lg,
  },
  restaurantsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  resultsCount: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  restaurantCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  restaurantImageContainer: {
    height: 180,
    position: 'relative' as const,
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  cuisineBadge: {
    position: 'absolute' as const,
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  cuisineBadgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold as '600',
    color: theme.colors.white,
  },
  restaurantInfo: {
    padding: theme.spacing.md,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  restaurantName: {
    flex: 1,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold as '700',
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  priceContainer: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.sm,
  },
  priceRange: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold as '700',
    color: theme.colors.primary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: theme.spacing.sm,
  },
  location: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold as '700',
    color: theme.colors.text,
  },
  reviewsText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  specialtiesContainer: {
    marginBottom: theme.spacing.md,
  },
  specialtiesLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold as '600',
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  specialtiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  specialtyChip: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    backgroundColor: `${theme.colors.primary}15`,
    borderRadius: theme.borderRadius.full,
  },
  specialtyText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text,
  },
  reserveButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
  },
  reserveButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold as '700',
    color: theme.colors.white,
  },
  emptyState: {
    padding: theme.spacing.xxxl,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  emptyStateText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
  },
});
