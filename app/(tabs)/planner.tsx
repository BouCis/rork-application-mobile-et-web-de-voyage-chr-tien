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
import { useApp } from '@/store/AppContext';
import { useTheme } from '@/store/ThemeContext';
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
  const { colors, spacing, fontSize, fontWeight, borderRadius } = useTheme();
  const [searchModalVisible, setSearchModalVisible] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('destinations');
  const [scrollY] = useState<Animated.Value>(new Animated.Value(0));

  const quickActions = [
    { icon: Hotel, label: 'Hôtels', route: '/(tabs)/hotels', color: colors.primary },
    { icon: MapPin, label: 'Activités', route: '/(tabs)/activities', color: colors.secondary },
    { icon: Globe, label: 'Restaurants', route: '/(tabs)/restaurants', color: colors.accent },
    { icon: Plane, label: 'Plus', route: '/(tabs)/more', color: colors.warning },
  ];

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
        colors={[colors.background, colors.backgroundSecondary]}
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
            <Text style={[styles.greeting, { color: colors.text }]}>
              {new Date().getHours() < 12 ? 'Bonjour' : new Date().getHours() < 18 ? 'Bon après-midi' : 'Bonsoir'} {user?.firstName || 'Voyageur'} 👋
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>Où partons-nous ?</Text>
          </View>
          <TouchableOpacity testID="btn-notifications" style={styles.notificationButton} onPress={handleNotifyPress} accessible accessibilityRole="button" accessibilityLabel="Notifications">
            <View style={[styles.notificationDot, { backgroundColor: colors.gold }]} />
            <Sparkles color={colors.primary} size={24} />
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
            <Search color={colors.textSecondary} size={20} />
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Réservez votre prochaine aventure</Text>
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
                  <Text style={[styles.quickActionLabel, { color: colors.text }]}>{action.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <TrendingUp color={colors.primary} size={20} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Destinations populaires</Text>
            </View>
            <TouchableOpacity testID="btn-see-all" onPress={handleSeeAllPress} accessible accessibilityRole="button" accessibilityLabel="Voir tout">
              <Text style={[styles.seeAllText, { color: colors.primary }]}>Voir tout</Text>
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
                style={[styles.destinationCard, { borderColor: colors.gold + '33', backgroundColor: colors.surface }]}
              >
                <Pressable onPress={() => handleDestinationPress(destination)} accessibilityRole="button" accessibilityLabel={`Ouvrir ${destination.name}`}>
                  <View style={styles.destinationImageContainer}>
                  <LinearGradient
                    colors={['transparent', 'rgba(15, 23, 42, 0.9)']}
                    style={styles.destinationGradient}
                  >
                    <View style={styles.destinationBadge}>
                      <Star color={colors.warning} size={12} fill={colors.warning} />
                      <Text style={[styles.ratingText, { color: colors.text }]}>{destination.rating}</Text>
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
                      <Text style={[styles.destinationName, { color: colors.text }]}>{destination.name}</Text>
                      <Text style={[styles.destinationCountry, { color: colors.textSecondary }]}>{destination.country}</Text>
                    </View>
                    <View style={styles.priceContainer}>
                      <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
	                      À partir de
	                    </Text>
                      <Text style={[styles.priceValue, { color: colors.gold }]}>{destination.price}</Text>
                    </View>
                  </View>
                  <Text style={[styles.destinationDescription, { color: colors.textSecondary }]} numberOfLines={2}>
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
                    <Text style={[styles.exploreButtonText, { color: colors.primary }]}>Explorer</Text>
                    <ArrowRight color={colors.primary} size={16} />
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Mes voyages</Text>
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
                colors={colors.primaryGradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.emptyGradient}
              >
                <MapPin color={colors.textInverse} size={32} strokeWidth={2} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>Commencez votre aventure</Text>
                <Text style={[styles.emptyText, { color: colors.text }]}>
                  Créez votre premier voyage et découvrez le monde
                </Text>
                <View testID="btn-create-trip" style={styles.createButton}>
                  <Text style={[styles.createButtonText, { color: colors.text }]}>Créer un voyage</Text>
                  <ArrowRight color={colors.textInverse} size={18} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            {trips.map((trip) => (
  <View
    key={trip.id}
    style={[
      styles.tripCard,
      {
        borderColor: `${colors.gold}33`, // Template literal instead of +
        backgroundColor: colors.surface,
      },
    ]}
  >
    <Text style={[styles.tripTitle, { color: colors.text }]}>
      {trip.title}
    </Text>
  </View>
))}
          )}
        </View>

        <View style={styles.inspirationSection}>
          <LinearGradient
            colors={['rgba(236, 72, 153, 0.1)', 'rgba(99, 102, 241, 0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.inspirationCard}
          >
            <Sparkles color={colors.secondary} size={32} />
            <Text style={[styles.inspirationTitle, { color: colors.text }]}>Besoin d&apos;inspiration ?</Text>
            <Text style={[styles.inspirationText, { color: colors.textSecondary }]}>
              Découvrez des destinations uniques sélectionnées pour vous
            </Text>
            <TouchableOpacity
              testID="btn-discover-inspiration"
              style={styles.inspirationButton}
              onPress={handleDiscoverInspiration}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Découvrir l'inspiration"
            >
              <Text style={[styles.inspirationButtonText, { color: colors.gold }]}>Découvrir</Text>
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
    paddingHorizontal: 24,
    paddingBottom: 16,
    zIndex: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as '700',
    letterSpacing: -0.5,
    color: '#FFFFFF',
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E6C97A',
  },
  searchContainer: {
    marginTop: 16,
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  tabsScroll: {
    paddingTop: 16,
    gap: 12,
  },
  tabChip: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  tabChipActive: {
    backgroundColor: 'rgba(175, 203, 255, 0.15)',
    borderColor: 'rgba(175, 203, 255, 0.4)',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600' as '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  tabLabelActive: {
    color: '#AFCBFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  quickActionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  quickActionCard: {
    flex: 1,
  },
  quickActionGradient: {
    alignItems: 'center',
    paddingVertical: 24,
    borderRadius: 16,
    gap: 12,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600' as '600',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as '700',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600' as '600',
    color: '#AFCBFF',
  },
  destinationsScroll: {
    paddingHorizontal: 24,
    gap: 16,
  },
  destinationCard: {
    width: width * 0.75,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(230, 201, 122, 0.2)',
    backgroundColor: 'rgba(58, 58, 58, 0.5)',
  },
  destinationImageContainer: {
    height: 200,
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
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
    padding: 16,
  },
  destinationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700' as '700',
    color: '#FFFFFF',
  },
  destinationInfo: {
    padding: 16,
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: '700' as '700',
    color: '#FFFFFF',
  },
  destinationCountry: {
    fontSize: 14,
    marginTop: 2,
    color: '#AEAEB2',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700' as '700',
    color: '#E6C97A',
  },
  destinationDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    color: '#AEAEB2',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(175, 203, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(175, 203, 255, 0.3)',
  },
  exploreButtonText: {
    fontSize: 14,
    fontWeight: '600' as '600',
    color: '#AFCBFF',
  },
  emptyCard: {
    marginHorizontal: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  emptyGradient: {
    padding: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700' as '700',
    marginTop: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.9,
    color: '#FFFFFF',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700' as '700',
    color: '#FFFFFF',
  },
  tripCard: {
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(230, 201, 122, 0.2)',
    backgroundColor: 'rgba(58, 58, 58, 0.5)',
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '700' as '700',
    color: '#FFFFFF',
  },
  inspirationSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  inspirationCard: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(175, 203, 255, 0.2)',
  },
  inspirationTitle: {
    fontSize: 24,
    fontWeight: '700' as '700',
    marginTop: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  inspirationText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
    color: '#AEAEB2',
  },
  inspirationButton: {
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    backgroundColor: 'rgba(230, 201, 122, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(230, 201, 122, 0.4)',
  },
  inspirationButtonText: {
    fontSize: 16,
    fontWeight: '700' as '700',
    color: '#E6C97A',
  },
});
