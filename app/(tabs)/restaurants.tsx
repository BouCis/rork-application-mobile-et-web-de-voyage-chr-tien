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
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search,
  MapPin,
  Star,
  Clock,
  UtensilsCrossed,
  Pizza,
  Coffee,
  Soup,
  Beef,
  Salad,
} from 'lucide-react-native';
import { useTheme } from '@/store/ThemeContext';

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

export default function RestaurantsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, spacing, fontSize, fontWeight, borderRadius } = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('Tous');

  const cuisineTypes = useMemo(() => ([
    { icon: UtensilsCrossed, label: 'Tous', color: colors.primary },
    { icon: Pizza, label: 'Italien', color: '#ef4444' },
    { icon: Coffee, label: 'Café', color: '#8b5cf6' },
    { icon: Soup, label: 'Asiatique', color: '#f59e0b' },
    { icon: Beef, label: 'Viande', color: '#dc2626' },
    { icon: Salad, label: 'Végétarien', color: '#10b981' },
  ]), [colors.primary]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
    },
    title: {
      fontSize: fontSize.hero,
      fontWeight: fontWeight.bold,
      color: colors.text,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      marginBottom: spacing.lg,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: {
      flex: 1,
      fontSize: fontSize.md,
      color: colors.text,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: spacing.md,
    },
    cuisinesSection: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text,
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    cuisinesScroll: {
      paddingHorizontal: spacing.lg,
      gap: spacing.md,
    },
    cuisineCard: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
    },
    cuisineCardActive: {
      transform: [{ scale: 1.05 }],
    },
    cuisineGradient: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      gap: spacing.xs,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cuisineLabel: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: colors.text,
    },
    cuisineLabelActive: {
      color: colors.white,
    },
    restaurantsSection: {
      paddingHorizontal: spacing.lg,
    },
    restaurantsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    resultsCount: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    restaurantCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      marginBottom: spacing.md,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
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
      top: spacing.md,
      right: spacing.md,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
    },
    cuisineBadgeText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.semibold,
      color: colors.white,
    },
    restaurantInfo: {
      padding: spacing.md,
    },
    restaurantHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    restaurantName: {
      flex: 1,
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text,
      marginRight: spacing.sm,
    },
    priceContainer: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      backgroundColor: colors.backgroundLight,
      borderRadius: borderRadius.sm,
    },
    priceRange: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.primary,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: spacing.sm,
    },
    location: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    metaRow: {
      flexDirection: 'row',
      gap: spacing.lg,
      marginBottom: spacing.md,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    ratingText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.text,
    },
    reviewsText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    specialtiesContainer: {
      marginBottom: spacing.md,
    },
    specialtiesLabel: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: colors.textLight,
      marginBottom: spacing.xs,
    },
    specialtiesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
    },
    specialtyChip: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      backgroundColor: `${colors.primary}15`,
      borderRadius: borderRadius.full,
    },
    specialtyText: {
      fontSize: fontSize.xs,
      color: colors.text,
    },
    reserveButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xl,
      backgroundColor: colors.primary,
      borderRadius: borderRadius.full,
      alignItems: 'center',
    },
    reserveButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.white,
    },
    emptyState: {
      padding: spacing.xxxl,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    emptyStateText: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      textAlign: 'center' as const,
    },
  }), [colors, spacing, fontSize, fontWeight, borderRadius]);

  const handleRestaurantPress = useCallback((restaurant: Restaurant) => {
    Alert.alert(
      restaurant.name,
      `${restaurant.location}\n\n⭐ ${restaurant.rating} (${restaurant.reviews} avis)\n🍴 ${restaurant.cuisine}\n💰 ${restaurant.priceRange}\n⏰ ${restaurant.openHours}\n\nSpécialités: ${restaurant.specialties.join(', ')}`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Détails' },
      ]
    );
  }, []);

  const handleCuisinePress = useCallback((cuisine: string) => {
    setSelectedCuisine(cuisine);
  }, []);

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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.backgroundSecondary, colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}
        testID="restaurants-header"
      >
        <Text style={styles.title}>Restaurants</Text>
        <Text style={styles.subtitle}>Découvrez la gastronomie locale</Text>

        <View style={styles.searchBar}>
          <Search color={colors.textLight} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un restaurant..."
            placeholderTextColor={colors.textLight}
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
                        ? colors.white
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
                  <MapPin color={colors.textSecondary} size={14} />
                  <Text style={styles.location}>{restaurant.location}</Text>
                </View>

                <View style={styles.metaRow}>
                  <View style={styles.ratingContainer}>
                    <Star
                      color={colors.warning}
                      size={14}
                      fill={colors.warning}
                    />
                    <Text style={styles.ratingText}>{restaurant.rating}</Text>
                    <Text style={styles.reviewsText}>({restaurant.reviews})</Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Clock color={colors.textLight} size={14} />
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
                  <Text style={styles.reserveButtonText}>Détails</Text>
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
