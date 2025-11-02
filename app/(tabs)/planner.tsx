import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
  Platform,
  Image,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Search, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Plane,
  Hotel,
  Sparkles,
  ArrowRight,
  Globe,
  Star,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useApp } from '@/store/AppContext';
import DestinationSearch from '@/components/DestinationSearch';
import type { Destination as DestinationType } from '@/data/destinations';

const { width } = Dimensions.get('window');

interface LocalDestination {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  price: string;
  description: string;
}

const trendingDestinations: LocalDestination[] = [
  {
    id: '1',
    name: 'Bali',
    country: 'Indonésie',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    rating: 4.9,
    price: '€890',
    description: 'Paradis tropical avec temples et plages',
  },
  {
    id: '2',
    name: 'Santorin',
    country: 'Grèce',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
    rating: 4.8,
    price: '€1,200',
    description: 'Couchers de soleil magiques et architecture blanche',
  },
  {
    id: '3',
    name: 'Tokyo',
    country: 'Japon',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    rating: 4.9,
    price: '€1,450',
    description: 'Fusion parfaite entre tradition et modernité',
  },
];

const quickActions = [
  { icon: Hotel, label: 'Hôtels', route: '/(tabs)/hotels', color: theme.colors.primary },
  { icon: MapPin, label: 'Activités', route: '/(tabs)/activities', color: theme.colors.secondary },
  { icon: Globe, label: 'Restaurants', route: '/(tabs)/restaurants', color: theme.colors.accent },
  { icon: Plane, label: 'Plus', route: '/(tabs)/more', color: theme.colors.warning },
];

const topTabs = [
  { label: 'Destinations', value: 'destinations' },
  { label: 'Hôtels', value: 'hotels' },
  { label: 'Activités', value: 'activities' },
  { label: 'Restaurants', value: 'restaurants' },
];

export default function PlannerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { trips, user } = useApp();
  const [searchModalVisible, setSearchModalVisible] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('destinations');
  const [scrollY] = useState<Animated.Value>(new Animated.Value(0));

  const headerOpacity = Platform.OS === 'web' ? 0 : scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleNotifyPress = useCallback(() => {
    console.log('[Planner] Notifications pressed');
    Alert.alert(
      'Notifications',
      'Vous avez 3 nouvelles notifications :\n\n• Offre spéciale : -30% sur les vols vers Bali\n• Rappel : Créez votre profil complet\n• Nouvelle destination tendance : Lisbonne',
      [{ text: 'OK' }]
    );
  }, []);

  const handleSeeAllPress = useCallback(() => {
    console.log('[Planner] See all destinations pressed');
    router.push('/search/results');
  }, [router]);

  const handleDestinationPress = useCallback((destination: LocalDestination) => {
    console.log('[Planner] Destination pressed', destination);
    try {
      router.push({ pathname: '/destination/[id]', params: { id: destination.name } });
    } catch (e) {
      console.error('Navigation error', e);
      Alert.alert('Navigation', 'Impossible d\'ouvrir la destination.');
    }
  }, [router]);

  const handleExplorePress = useCallback((destination: LocalDestination) => {
    console.log('[Planner] Explore pressed', destination);
    handleDestinationPress(destination);
  }, [handleDestinationPress]);

  const handleQuickAction = useCallback((route: string, label: string) => {
    console.log('[Planner] Quick action pressed', label);
    router.push(route as any);
  }, [router]);

  const handleTabPress = useCallback((tab: string) => {
    console.log('[Planner] Tab pressed', tab);
    setSelectedTab(tab);
    switch (tab) {
      case 'hotels':
        router.push('/(tabs)/hotels');
        break;
      case 'activities':
        router.push('/(tabs)/activities');
        break;
      case 'restaurants':
        router.push('/(tabs)/restaurants');
        break;
      default:
        break;
    }
  }, [router]);

  const handleCreateTrip = useCallback(() => {
    console.log('[Planner] Create trip pressed');
    router.push('/trip/create');
  }, [router]);

  const handleDiscoverInspiration = useCallback(() => {
    console.log('[Planner] Discover inspiration pressed');
    const randomDestinations = [...trendingDestinations].sort(() => Math.random() - 0.5);
    const randomDest = randomDestinations[0];
    
    Alert.alert(
      `✨ ${randomDest.name}, ${randomDest.country}`,
      `${randomDest.description}\n\n⭐ Note: ${randomDest.rating}\n💰 À partir de ${randomDest.price}\n\nVoulez-vous explorer cette destination ?`,
      [
        { text: 'Pas maintenant', style: 'cancel' },
        { 
          text: 'Explorer', 
          onPress: () => handleDestinationPress(randomDest)
        }
      ]
    );
  }, [handleDestinationPress]);

  const handleOpenSearch = useCallback(() => {
    console.log('[Planner] Opening destination search');
    setSearchModalVisible(true);
  }, []);

  const handleCloseSearch = useCallback(() => {
    setSearchModalVisible(false);
  }, []);

  const handleSelectDestination = useCallback((destination: DestinationType) => {
    console.log('[Planner] Selected destination:', destination.name);
    router.push({
      pathname: '/destination/prepare',
      params: { destinationId: destination.id }
    });
  }, [router]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.backgroundDark, theme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <Animated.View 
        style={[
          styles.headerBackground,
          {
            opacity: headerOpacity,
          }
        ]}
      >
        <LinearGradient
          colors={['rgba(30, 41, 59, 0.95)', 'rgba(15, 23, 42, 0.8)']}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>
              {new Date().getHours() < 12 ? 'Bonjour' : new Date().getHours() < 18 ? 'Bon après-midi' : 'Bonsoir'} {user?.firstName || 'Voyageur'} 👋
            </Text>
            <Text style={styles.title}>Où partons-nous ?</Text>
          </View>
          <TouchableOpacity testID="btn-notifications" style={styles.notificationButton} onPress={handleNotifyPress} accessible accessibilityRole="button" accessibilityLabel="Notifications">
            <View style={styles.notificationDot} />
            <Sparkles color={theme.colors.primary} size={24} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          testID="btn-open-search"
          style={styles.searchContainer}
          onPress={handleOpenSearch}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Rechercher une destination"
        >
          <LinearGradient
            colors={['rgba(99, 102, 241, 0.1)', 'rgba(236, 72, 153, 0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.searchGradient}
          >
            <Search color={theme.colors.textLight} size={20} />
            <Text style={styles.searchPlaceholder}>Où allez-vous ?</Text>
          </LinearGradient>
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {topTabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tabChip,
                selectedTab === tab.value && styles.tabChipActive,
              ]}
              onPress={() => handleTabPress(tab.value)}
            >
              <Text
                style={[
                  styles.tabLabel,
                  selectedTab === tab.value && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Réservez votre prochaine aventure</Text>
          <View style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                testID={`quick-action-${action.label}`}
                style={styles.quickActionCard}
                onPress={() => handleQuickAction(action.route, action.label)}
                accessible
                accessibilityRole="button"
                accessibilityLabel={action.label}
              >
                <LinearGradient
                  colors={[`${action.color}20`, `${action.color}10`]}
                  style={styles.quickActionGradient}
                >
                  <action.icon color={action.color} size={24} strokeWidth={2} />
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <TrendingUp color={theme.colors.primary} size={20} />
              <Text style={styles.sectionTitle}>Destinations populaires</Text>
            </View>
            <TouchableOpacity testID="btn-see-all" onPress={handleSeeAllPress} accessible accessibilityRole="button" accessibilityLabel="Voir tout">
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destinationsScroll}
          >
            {trendingDestinations.map((destination) => (
              <View
                key={destination.id}
                testID={`card-destination-${destination.id}`}
                style={styles.destinationCard}
              >
                <Pressable onPress={() => handleDestinationPress(destination)} accessibilityRole="button" accessibilityLabel={`Ouvrir ${destination.name}`}>
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
                </Pressable>
                <View style={styles.destinationInfo}>
                  <View style={styles.destinationHeader}>
                    <View>
                      <Text style={styles.destinationName}>{destination.name}</Text>
                      <Text style={styles.destinationCountry}>{destination.country}</Text>
                    </View>
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceLabel}>À partir de</Text>
                      <Text style={styles.priceValue}>{destination.price}</Text>
                    </View>
                  </View>
                  <Text style={styles.destinationDescription} numberOfLines={2}>
                    {destination.description}
                  </Text>
                  <Pressable
                    testID={`btn-explore-${destination.id}`}
                    style={styles.exploreButton}
                    onPress={() => handleExplorePress(destination)}
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={`Explorer ${destination.name}`}
                  >
                    <Text style={styles.exploreButtonText}>Explorer</Text>
                    <ArrowRight color={theme.colors.primary} size={16} />
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes voyages</Text>
          {trips.length === 0 ? (
            <TouchableOpacity
              testID="card-create-trip"
              style={styles.emptyCard}
              onPress={handleCreateTrip}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Créer un voyage"
            >
              <LinearGradient
                colors={theme.colors.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.emptyGradient}
              >
                <MapPin color={theme.colors.textInverse} size={32} strokeWidth={2} />
                <Text style={styles.emptyTitle}>Commencez votre aventure</Text>
                <Text style={styles.emptyText}>
                  Créez votre premier voyage et découvrez le monde
                </Text>
                <View testID="btn-create-trip" style={styles.createButton}>
                  <Text style={styles.createButtonText}>Créer un voyage</Text>
                  <ArrowRight color={theme.colors.textInverse} size={18} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            trips.map((trip) => (
              <View key={trip.id} style={styles.tripCard}>
                <Text style={styles.tripTitle}>{trip.title}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.inspirationSection}>
          <LinearGradient
            colors={['rgba(236, 72, 153, 0.1)', 'rgba(99, 102, 241, 0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.inspirationCard}
          >
            <Sparkles color={theme.colors.secondary} size={32} />
            <Text style={styles.inspirationTitle}>Besoin d&apos;inspiration ?</Text>
            <Text style={styles.inspirationText}>
              Découvrez des destinations uniques sélectionnées pour vous
            </Text>
            <TouchableOpacity
              testID="btn-discover-inspiration"
              style={styles.inspirationButton}
              onPress={handleDiscoverInspiration}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Découvrir l\'inspiration"
            >
              <Text style={styles.inspirationButtonText}>Découvrir</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>

      <DestinationSearch
        visible={searchModalVisible}
        onClose={handleCloseSearch}
        onSelectDestination={handleSelectDestination}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    zIndex: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  greeting: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: theme.fontSize.hero,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.secondary,
  },
  searchContainer: {
    marginTop: theme.spacing.md,
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
  },
  tabsScroll: {
    paddingTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  tabChip: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tabChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  tabLabelActive: {
    color: theme.colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: theme.spacing.md,
  },
  quickActionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  quickActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  quickActionCard: {
    flex: 1,
  },
  quickActionGradient: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  quickActionLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  seeAllText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },
  destinationsScroll: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  destinationCard: {
    width: width * 0.75,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  destinationImageContainer: {
    height: 200,
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
    height: 100,
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
  destinationName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  destinationCountry: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  priceValue: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  destinationDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: `${theme.colors.primary}15`,
  },
  exploreButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },
  emptyCard: {
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  emptyGradient: {
    padding: theme.spacing.xxxl,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textInverse,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textInverse,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    opacity: 0.9,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  createButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textInverse,
  },
  tripCard: {
    marginHorizontal: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tripTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  inspirationSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  inspirationCard: {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inspirationTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  inspirationText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    lineHeight: 22,
  },
  inspirationButton: {
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
  },
  inspirationButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textInverse,
  },
});
