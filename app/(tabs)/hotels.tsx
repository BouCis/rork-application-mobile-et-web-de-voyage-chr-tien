import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search,
  MapPin,
  Star,
  Wifi,
  UtensilsCrossed,
  Dumbbell,
  Car,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import BookingModal from '@/components/BookingModal';



interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  amenities: string[];
  type: string;
}

const hotels: Hotel[] = [
  {
    id: '1',
    name: 'Grand Hotel Paris',
    location: 'Paris, France',
    rating: 4.8,
    reviews: 1245,
    price: 180,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    amenities: ['wifi', 'restaurant', 'gym', 'parking'],
    type: 'Hotel de luxe',
  },
  {
    id: '2',
    name: 'Beach Resort Bali',
    location: 'Bali, Indonésie',
    rating: 4.9,
    reviews: 892,
    price: 120,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    amenities: ['wifi', 'restaurant', 'gym'],
    type: 'Resort',
  },
  {
    id: '3',
    name: 'City Center Hotel',
    location: 'Tokyo, Japon',
    rating: 4.7,
    reviews: 654,
    price: 150,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    amenities: ['wifi', 'restaurant', 'parking'],
    type: 'Hotel',
  },
  {
    id: '4',
    name: 'Mountain Lodge',
    location: 'Suisse',
    rating: 4.6,
    reviews: 432,
    price: 200,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    amenities: ['wifi', 'restaurant', 'gym', 'parking'],
    type: 'Lodge',
  },
];

const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  restaurant: UtensilsCrossed,
  gym: Dumbbell,
  parking: Car,
};

export default function HotelsScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookingModalVisible, setBookingModalVisible] = useState<boolean>(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const filteredHotels = useMemo(() => {
    if (!searchQuery.trim()) return hotels;
    
    const query = searchQuery.toLowerCase();
    return hotels.filter(h => 
      h.name.toLowerCase().includes(query) ||
      h.location.toLowerCase().includes(query) ||
      h.type.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleHotelPress = useCallback((hotel: Hotel) => {
    console.log('[Hotels] Hotel pressed:', hotel.name);
    setSelectedHotel(hotel);
    setBookingModalVisible(true);
  }, []);



  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.backgroundDark, theme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Hôtels</Text>
        <Text style={styles.subtitle}>Trouvez votre hébergement idéal</Text>

        <View style={styles.searchBar}>
          <Search color={theme.colors.textLight} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un hôtel..."
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
        <Text style={styles.resultsCount}>{filteredHotels.length} hôtel{filteredHotels.length > 1 ? 's' : ''} trouvé{filteredHotels.length > 1 ? 's' : ''}</Text>

        {filteredHotels.map((hotel) => (
          <TouchableOpacity
            key={hotel.id}
            style={styles.hotelCard}
            onPress={() => handleHotelPress(hotel)}
          >
            <View style={styles.hotelImageContainer}>
              <Image
                source={{ uri: hotel.image }}
                style={styles.hotelImage}
                resizeMode="cover"
              />
              <View style={styles.hotelBadge}>
                <Text style={styles.hotelType}>{hotel.type}</Text>
              </View>
            </View>

            <View style={styles.hotelInfo}>
              <View style={styles.hotelHeader}>
                <Text style={styles.hotelName} numberOfLines={1}>
                  {hotel.name}
                </Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceFrom}>à partir de</Text>
                  <Text style={styles.price}>€{hotel.price}</Text>
                  <Text style={styles.priceNight}>/nuit</Text>
                </View>
              </View>

              <View style={styles.locationContainer}>
                <MapPin color={theme.colors.textSecondary} size={14} />
                <Text style={styles.location}>{hotel.location}</Text>
              </View>

              <View style={styles.ratingContainer}>
                <View style={styles.ratingBadge}>
                  <Star
                    color={theme.colors.warning}
                    size={14}
                    fill={theme.colors.warning}
                  />
                  <Text style={styles.ratingText}>{hotel.rating}</Text>
                </View>
                <Text style={styles.reviewsText}>({hotel.reviews} avis)</Text>
              </View>

              <View style={styles.amenitiesContainer}>
                {hotel.amenities.slice(0, 4).map((amenity, index) => {
                  const Icon = amenityIcons[amenity];
                  return Icon ? (
                    <View key={index} style={styles.amenityIcon}>
                      <Icon color={theme.colors.textLight} size={16} />
                    </View>
                  ) : null;
                })}
              </View>

              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => handleHotelPress(hotel)}
              >
                <Text style={styles.bookButtonText}>Réserver maintenant</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedHotel && (
        <BookingModal
          visible={bookingModalVisible}
          onClose={() => {
            setBookingModalVisible(false);
            setSelectedHotel(null);
          }}
          itemName={selectedHotel.name}
          itemPrice={`€${selectedHotel.price}/nuit`}
          itemType="hotel"
        />
      )}
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
    marginBottom: theme.spacing.lg,
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
    padding: theme.spacing.lg,
  },
  resultsCount: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold as '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  hotelCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  hotelImageContainer: {
    height: 200,
    position: 'relative' as const,
  },
  hotelImage: {
    width: '100%',
    height: '100%',
  },
  hotelBadge: {
    position: 'absolute' as const,
    top: theme.spacing.md,
    left: theme.spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  hotelType: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold as '600',
    color: theme.colors.white,
  },
  hotelInfo: {
    padding: theme.spacing.md,
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  hotelName: {
    flex: 1,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold as '700',
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceFrom: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  price: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold as '700',
    color: theme.colors.primary,
  },
  priceNight: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${theme.colors.warning}20`,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
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
  amenitiesContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  amenityIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.sm,
  },
  bookButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center' as const,
    marginTop: theme.spacing.md,
  },
  bookButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold as '700',
    color: theme.colors.white,
  },
});
