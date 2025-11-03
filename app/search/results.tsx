import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  TrendingUp,
  Globe,
  X,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { destinations, searchDestinations } from '@/data/destinations';
import type { Destination } from '@/data/destinations';

export default function SearchResultsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [searchQuery, setSearchQuery] = useState<string>((params.query as string) || '');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedContinent, setSelectedContinent] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');

  const continents = ['all', 'Europe', 'Asie', 'Afrique', 'Amérique du Nord', 'Amérique du Sud'];
  const categories = ['all', 'cultural', 'adventure', 'nature', 'beach', 'historical'];
  const priceRanges = [
    { label: 'Tous', value: 'all' },
    { label: 'Économique (< 100€)', value: 'budget' },
    { label: 'Modéré (100-200€)', value: 'moderate' },
    { label: 'Luxe (> 200€)', value: 'luxury' },
  ];

  const filteredDestinations = useMemo(() => {
    let results = searchQuery ? searchDestinations(searchQuery) : destinations;

    if (selectedContinent !== 'all') {
      results = results.filter(d => d.continent === selectedContinent);
    }

    if (selectedCategory !== 'all') {
      results = results.filter(d => d.categories.includes(selectedCategory as any));
    }

    if (priceRange !== 'all') {
      results = results.filter(d => {
        const avgPrice = d.averageBudget.moderate;
        switch (priceRange) {
          case 'budget':
            return avgPrice < 100;
          case 'moderate':
            return avgPrice >= 100 && avgPrice <= 200;
          case 'luxury':
            return avgPrice > 200;
          default:
            return true;
        }
      });
    }

    return results;
  }, [searchQuery, selectedContinent, selectedCategory, priceRange]);

  const handleDestinationPress = (destination: Destination) => {
    console.log('[SearchResults] Destination pressed:', destination.name);
    router.push({
      pathname: '/destination/prepare',
      params: { destinationId: destination.id }
    });
  };

  const clearFilters = () => {
    setSelectedContinent('all');
    setSelectedCategory('all');
    setPriceRange('all');
  };

  const activeFiltersCount = [
    selectedContinent !== 'all',
    selectedCategory !== 'all',
    priceRange !== 'all',
  ].filter(Boolean).length;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Recherche',
          headerStyle: {
            backgroundColor: theme.colors.backgroundDark,
          },
          headerTintColor: theme.colors.text,
          headerShadowVisible: false,
        }}
      />

      <LinearGradient
        colors={[theme.colors.backgroundDark, theme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.searchHeader, { paddingTop: insets.top }]}>
        <View style={styles.searchContainer}>
          <Search color={theme.colors.textLight} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une destination..."
            placeholderTextColor={theme.colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={false}
            autoCorrect={false}
            autoCapitalize="words"
            keyboardType="default"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X color={theme.colors.textLight} size={20} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal color={theme.colors.primary} size={20} />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Continent</Text>
              {selectedContinent !== 'all' && (
                <TouchableOpacity onPress={() => setSelectedContinent('all')}>
                  <Text style={styles.clearText}>Effacer</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                {continents.map((continent) => (
                  <TouchableOpacity
                    key={continent}
                    style={[
                      styles.filterChip,
                      selectedContinent === continent && styles.filterChipActive,
                    ]}
                    onPress={() => setSelectedContinent(continent)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedContinent === continent && styles.filterChipTextActive,
                      ]}
                    >
                      {continent === 'all' ? 'Tous' : continent}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Catégorie</Text>
              {selectedCategory !== 'all' && (
                <TouchableOpacity onPress={() => setSelectedCategory('all')}>
                  <Text style={styles.clearText}>Effacer</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterChip,
                      selectedCategory === category && styles.filterChipActive,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedCategory === category && styles.filterChipTextActive,
                      ]}
                    >
                      {category === 'all' ? 'Toutes' : 
                       category === 'cultural' ? 'Culturel' :
                       category === 'adventure' ? 'Aventure' :
                       category === 'nature' ? 'Nature' :
                       category === 'beach' ? 'Plage' :
                       category === 'historical' ? 'Historique' : category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Budget journalier</Text>
              {priceRange !== 'all' && (
                <TouchableOpacity onPress={() => setPriceRange('all')}>
                  <Text style={styles.clearText}>Effacer</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.filterChips}>
              {priceRanges.map((range) => (
                <TouchableOpacity
                  key={range.value}
                  style={[
                    styles.filterChip,
                    priceRange === range.value && styles.filterChipActive,
                  ]}
                  onPress={() => setPriceRange(range.value)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      priceRange === range.value && styles.filterChipTextActive,
                    ]}
                  >
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {activeFiltersCount > 0 && (
            <TouchableOpacity style={styles.clearAllButton} onPress={clearFilters}>
              <Text style={styles.clearAllText}>Effacer tous les filtres</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredDestinations.length} destination{filteredDestinations.length > 1 ? 's' : ''} trouvée{filteredDestinations.length > 1 ? 's' : ''}
          </Text>
          {searchQuery && (
            <Text style={styles.searchQueryText}>pour &ldquo;{searchQuery}&rdquo;</Text>
          )}
        </View>

        {filteredDestinations.length === 0 ? (
          <View style={styles.emptyState}>
            <Globe color={theme.colors.textLight} size={64} strokeWidth={1} />
            <Text style={styles.emptyStateTitle}>Aucune destination trouvée</Text>
            <Text style={styles.emptyStateText}>
              Essayez de modifier vos critères de recherche ou vos filtres
            </Text>
          </View>
        ) : (
          <View style={styles.destinationsList}>
            {filteredDestinations.map((destination) => (
              <TouchableOpacity
                key={destination.id}
                style={styles.destinationCard}
                onPress={() => handleDestinationPress(destination)}
              >
                <View style={styles.destinationImageContainer}>
                  <LinearGradient
                    colors={['transparent', 'rgba(15, 23, 42, 0.9)']}
                    style={styles.destinationGradient}
                  >
                    <View style={styles.destinationBadge}>
                      <Star color={theme.colors.warning} size={12} fill={theme.colors.warning} />
                      <Text style={styles.ratingText}>{destination.rating}</Text>
                    </View>
                  </LinearGradient>
                  <Image
                    source={{ uri: destination.image }}
                    style={styles.destinationImage}
                    resizeMode="cover"
                  />
                </View>

                <View style={styles.destinationInfo}>
                  <View style={styles.destinationHeader}>
                    <View style={styles.destinationTitleContainer}>
                      <Text style={styles.destinationName}>{destination.name}</Text>
                      <View style={styles.locationRow}>
                        <MapPin color={theme.colors.textSecondary} size={14} />
                        <Text style={styles.destinationCountry}>{destination.country}</Text>
                      </View>
                    </View>
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceLabel}>À partir de</Text>
                      <Text style={styles.priceValue}>€{destination.averageBudget.budget}</Text>
                      <Text style={styles.priceUnit}>/jour</Text>
                    </View>
                  </View>

                  <Text style={styles.destinationDescription} numberOfLines={2}>
                    {destination.description}
                  </Text>

                  <View style={styles.destinationTags}>
                    {destination.categories.slice(0, 3).map((category, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>
                          {category === 'cultural' ? 'Culturel' :
                           category === 'adventure' ? 'Aventure' :
                           category === 'nature' ? 'Nature' :
                           category === 'beach' ? 'Plage' :
                           category === 'historical' ? 'Historique' : category}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.destinationFooter}>
                    <View style={styles.durationContainer}>
                      <TrendingUp color={theme.colors.primary} size={14} />
                      <Text style={styles.durationText}>{destination.recommendedDuration}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.exploreButton}
                      onPress={() => handleDestinationPress(destination)}
                    >
                      <Text style={styles.exploreButtonText}>Explorer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.backgroundDark,
  },
  searchContainer: {
    flex: 1,
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
    paddingVertical: Platform.select({ ios: theme.spacing.xs, android: 0, default: 0 }),
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textInverse,
  },
  filtersContainer: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
  },
  filterSection: {
    marginBottom: theme.spacing.md,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  filterTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  clearText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
  },
  filterChips: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  filterChip: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  filterChipTextActive: {
    color: theme.colors.textInverse,
  },
  clearAllButton: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  clearAllText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.error,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  resultsHeader: {
    marginBottom: theme.spacing.lg,
  },
  resultsCount: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  searchQueryText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxxl,
  },
  emptyStateTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
  },
  emptyStateText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
  },
  destinationsList: {
    gap: theme.spacing.lg,
  },
  destinationCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  destinationImageContainer: {
    height: 180,
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  destinationGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 1,
    justifyContent: 'flex-end',
    padding: theme.spacing.md,
  },
  destinationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  ratingText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  destinationInfo: {
    padding: theme.spacing.md,
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  destinationTitleContainer: {
    flex: 1,
  },
  destinationName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  destinationCountry: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  priceValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  priceUnit: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  destinationDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  destinationTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: `${theme.colors.primary}15`,
  },
  tagText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primary,
  },
  destinationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  exploreButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
  },
  exploreButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textInverse,
  },
});
