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
import { theme } from '@/constants/theme';

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

const categories = [
  { icon: Landmark, label: 'Culture', color: theme.colors.primary },
  { icon: Mountain, label: 'Aventure', color: theme.colors.secondary },
  { icon: Trees, label: 'Nature', color: theme.colors.accent },
  { icon: Camera, label: 'Visites', color: theme.colors.warning },
  { icon: Waves, label: 'Plage', color: '#3b82f6' },
];

export default function ActivitiesScreen() {
  const insets = useSafeAreaInsets();
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
        colors={[theme.colors.backgroundDark, theme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Activités</Text>
        <Text style={styles.subtitle}>Choses à faire</Text>

        <View style={styles.searchBar}>
          <Search color={theme.colors.textLight} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une activité..."
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
                        ? theme.colors.white
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
                  <MapPin color={theme.colors.textSecondary} size={14} />
                  <Text style={styles.location}>{activity.location}</Text>
                </View>

                <Text style={styles.description} numberOfLines={2}>
                  {activity.description}
                </Text>

                <View style={styles.activityMeta}>
                  <View style={styles.ratingContainer}>
                    <Star
                      color={theme.colors.warning}
                      size={14}
                      fill={theme.colors.warning}
                    />
                    <Text style={styles.ratingText}>{activity.rating}</Text>
                    <Text style={styles.reviewsText}>({activity.reviews})</Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Clock color={theme.colors.textLight} size={14} />
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
  categoriesSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold as '700',
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  categoriesScroll: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  categoryCard: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  categoryCardActive: {
    transform: [{ scale: 1.05 }],
  },
  categoryGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold as '600',
    color: theme.colors.text,
  },
  categoryLabelActive: {
    color: theme.colors.white,
  },
  activitiesSection: {
    paddingHorizontal: theme.spacing.lg,
  },
  activitiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  resultsCount: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  activityCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  categoryBadgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold as '600',
    color: theme.colors.white,
  },
  activityInfo: {
    padding: theme.spacing.md,
  },
  activityName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold as '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
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
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  activityMeta: {
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
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  priceLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  price: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold as '700',
    color: theme.colors.primary,
  },
  bookButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  },
  bookButtonText: {
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
