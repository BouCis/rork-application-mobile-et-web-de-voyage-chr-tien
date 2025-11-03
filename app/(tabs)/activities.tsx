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
  Users,
  Compass,
  Mountain,
  Camera,
  Landmark,
  Waves,
  Trees,
} from 'lucide-react-native';
import { useTheme } from '@/store/ThemeContext';

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
}

const activities: Activity[] = [
  {
    id: '1',
    name: 'Visite guidée du Louvre',
    location: 'Paris, France',
    rating: 4.9,
    reviews: 3245,
    price: 45,
    duration: '3h',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
    category: 'Culture',
    description: 'Découvrez les trésors du plus grand musée du monde',
  },
  {
    id: '2',
    name: 'Plongée sous-marine',
    location: 'Bali, Indonésie',
    rating: 4.8,
    reviews: 892,
    price: 80,
    duration: '4h',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    category: 'Aventure',
    description: 'Explorez les récifs coralliens',
  },
  {
    id: '3',
    name: 'Safari en jeep',
    location: 'Serengeti, Tanzanie',
    rating: 4.9,
    reviews: 1567,
    price: 150,
    duration: '8h',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
    category: 'Nature',
    description: 'Observation de la faune sauvage',
  },
  {
    id: '4',
    name: 'Cours de cuisine locale',
    location: 'Tokyo, Japon',
    rating: 4.7,
    reviews: 654,
    price: 70,
    duration: '3h',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
    category: 'Gastronomie',
    description: 'Apprenez à préparer des sushis authentiques',
  },
  {
    id: '5',
    name: 'Randonnée en montagne',
    location: 'Alpes, Suisse',
    rating: 4.6,
    reviews: 432,
    price: 60,
    duration: '6h',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    category: 'Sport',
    description: 'Randonnée guidée avec vues panoramiques',
  },
];



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

  const filteredActivities = useMemo(() => {
    let results = activities;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.location.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      results = results.filter(a => a.category === selectedCategory);
    }

    return results;
  }, [searchQuery, selectedCategory]);

  const handleActivityPress = useCallback((activity: Activity) => {
    console.log('[Activities] Activity pressed:', activity.name);
    Alert.alert(
      activity.name,
      `${activity.location}\n\n${activity.description}\n\n⭐ ${activity.rating} (${activity.reviews} avis)\n⏱️ ${activity.duration}\n🎫 ${activity.category}`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Réserver - €${activity.price}', onPress: () => {
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
        <Text style={styles.title}>Activités</Text>
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
            <Text style={styles.sectionTitle}>Activités populaires</Text>
            <Text style={styles.resultsCount}>{filteredActivities.length} activité{filteredActivities.length > 1 ? 's' : ''}</Text>
          </View>

          {filteredActivities.length === 0 ? (
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
                    <Text style={styles.bookButtonText}>Réserver</Text>
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
  title: {
    fontSize: 32,
    fontWeight: '700' as '700',
    letterSpacing: -0.5,
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
});
