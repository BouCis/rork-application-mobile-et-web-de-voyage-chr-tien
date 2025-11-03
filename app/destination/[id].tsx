import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star, 
  Heart,
  Share2,
  Plane,
  Hotel,
  Utensils,
  Camera,
  Globe,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

interface DestinationInfo {
  name: string;
  country: string;
  description: string;
  rating: number;
  bestTime: string;
  duration: string;
  budget: string;
  highlights: string[];
  activities: Array<{ name: string; price: string }>;
}

const destinationsData: Record<string, DestinationInfo> = {
  'Bali': {
    name: 'Bali',
    country: 'Indonésie',
    description: 'Paradis tropical avec temples anciens, rizières en terrasses et plages magnifiques. Une destination relaxante.',
    rating: 4.9,
    bestTime: 'Avril - Octobre',
    duration: '7-14 jours',
    budget: '€890 - €1,500',
    highlights: [
      'Temples d\'Ubud',
      'Rizières de Tegallalang',
      'Plages de Seminyak',
      'Mont Batur au lever du soleil',
      'Cascades de Tegenungan',
    ],
    activities: [
      { name: 'Visite des temples', price: '€15' },
      { name: 'Cours de surf', price: '€30' },
      { name: 'Massage balinais', price: '€20' },
      { name: 'Randonnée Mont Batur', price: '€45' },
    ],
  },
  'Santorin': {
    name: 'Santorin',
    country: 'Grèce',
    description: 'Île volcanique célèbre pour ses couchers de soleil spectaculaires, ses maisons blanches et bleues, et ses vues imprenables sur la mer Égée.',
    rating: 4.8,
    bestTime: 'Mai - Septembre',
    duration: '4-7 jours',
    budget: '€1,200 - €2,000',
    highlights: [
      'Village d\'Oia',
      'Plage rouge',
      'Site archéologique d\'Akrotiri',
      'Dégustation de vins',
      'Croisière au coucher du soleil',
    ],
    activities: [
      { name: 'Croisière en catamaran', price: '€80' },
      { name: 'Visite de cave à vin', price: '€35' },
      { name: 'Randonnée Fira-Oia', price: 'Gratuit' },
      { name: 'Plongée sous-marine', price: '€60' },
    ],
  },
  'Tokyo': {
    name: 'Tokyo',
    country: 'Japon',
    description: 'Métropole fascinante où la tradition rencontre la modernité. Temples anciens, gratte-ciels futuristes, cuisine exceptionnelle.',
    rating: 4.9,
    bestTime: 'Mars - Mai, Septembre - Novembre',
    duration: '5-10 jours',
    budget: '€1,450 - €2,500',
    highlights: [
      'Temple Senso-ji',
      'Quartier de Shibuya',
      'Marché aux poissons de Tsukiji',
      'Mont Fuji',
      'Parc d\'Ueno',
    ],
    activities: [
      { name: 'Cérémonie du thé', price: '€40' },
      { name: 'Visite guidée des temples', price: '€50' },
      { name: 'Cours de sushi', price: '€70' },
      { name: 'Excursion Mont Fuji', price: '€120' },
    ],
  },
};

export default function DestinationDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const destination = destinationsData[params.id] || destinationsData['Bali'];

  const handleBack = () => {
    router.back();
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    console.log('Share destination');
  };

  const handleBookTrip = () => {
    router.push('/trip/create');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.backgroundDark, theme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <ArrowLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleShare}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Partager"
          >
            <Share2 color={theme.colors.text} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleFavorite}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Ajouter aux favoris"
          >
            <Heart 
              color={isFavorite ? theme.colors.error : theme.colors.text} 
              size={20}
              fill={isFavorite ? theme.colors.error : 'none'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(15, 23, 42, 0.9)']}
            style={styles.heroGradient}
          >
            <View style={styles.ratingBadge}>
              <Star color={theme.colors.warning} size={16} fill={theme.colors.warning} />
              <Text style={styles.ratingText}>{destination.rating}</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <View>
              <Text style={styles.destinationName}>{destination.name}</Text>
              <View style={styles.locationRow}>
                <MapPin color={theme.colors.textSecondary} size={16} />
                <Text style={styles.country}>{destination.country}</Text>
              </View>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.priceLabel}>À partir de</Text>
              <Text style={styles.priceValue}>{destination.budget.split(' - ')[0]}</Text>
            </View>
          </View>

          <Text style={styles.description}>{destination.description}</Text>

          <View style={styles.infoCards}>
            <View style={styles.infoCard}>
              <Calendar color={theme.colors.primary} size={24} />
              <Text style={styles.infoLabel}>Meilleure période</Text>
              <Text style={styles.infoValue}>{destination.bestTime}</Text>
            </View>
            <View style={styles.infoCard}>
              <DollarSign color={theme.colors.secondary} size={24} />
              <Text style={styles.infoLabel}>Budget</Text>
              <Text style={styles.infoValue}>{destination.budget}</Text>
            </View>
            <View style={styles.infoCard}>
              <Plane color={theme.colors.accent} size={24} />
              <Text style={styles.infoLabel}>Durée</Text>
              <Text style={styles.infoValue}>{destination.duration}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Points forts</Text>
            <View style={styles.highlightsList}>
              {destination.highlights.map((highlight, index) => (
                <View key={index} style={styles.highlightItem}>
                  <View style={styles.highlightDot} />
                  <Text style={styles.highlightText}>{highlight}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activités populaires</Text>
            <View style={styles.activitiesList}>
              {destination.activities.map((activity, index) => (
                <View key={index} style={styles.activityCard}>
                  <LinearGradient
                    colors={[`${theme.colors.primary}10`, `${theme.colors.primary}05`]}
                    style={styles.activityGradient}
                  >
                    <View style={styles.activityInfo}>
                      <Camera color={theme.colors.primary} size={20} />
                      <Text style={styles.activityName}>{activity.name}</Text>
                    </View>
                    <Text style={styles.activityPrice}>{activity.price}</Text>
                  </LinearGradient>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Services</Text>
            <View style={styles.servicesGrid}>
              <View style={styles.serviceCard}>
                <Plane color={theme.colors.primary} size={24} />
                <Text style={styles.serviceText}>Vols</Text>
              </View>
              <View style={styles.serviceCard}>
                <Hotel color={theme.colors.secondary} size={24} />
                <Text style={styles.serviceText}>Hôtels</Text>
              </View>
              <View style={styles.serviceCard}>
                <Utensils color={theme.colors.accent} size={24} />
                <Text style={styles.serviceText}>Restaurants</Text>
              </View>
              <View style={styles.serviceCard}>
                <Camera color={theme.colors.warning} size={24} />
                <Text style={styles.serviceText}>Activités</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookTrip}
        >
          <LinearGradient
            colors={theme.colors.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bookGradient}
          >
            <Text style={styles.bookButtonText}>Planifier ce voyage</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    height: 300,
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    justifyContent: 'flex-end',
    padding: theme.spacing.lg,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  ratingText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  content: {
    padding: theme.spacing.lg,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  destinationName: {
    fontSize: theme.fontSize.hero,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: theme.spacing.xs,
  },
  country: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  priceTag: {
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
  description: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  infoCards: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  infoCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  infoLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  highlightsList: {
    gap: theme.spacing.sm,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  highlightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  highlightText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  activitiesList: {
    gap: theme.spacing.md,
  },
  activityCard: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  activityGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  activityName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  activityPrice: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  serviceCard: {
    width: (width - theme.spacing.lg * 2 - theme.spacing.md) / 2,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  serviceText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.backgroundDark,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  bookButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  bookGradient: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textInverse,
  },
});
