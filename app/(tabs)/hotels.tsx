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
import { useTheme } from '@/store/ThemeContext';
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
  const { colors, spacing, fontSize, fontWeight, borderRadius } = useTheme();
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
        colors={[colors.backgroundDark, colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[styles.title, { color: colors.text }]}>Hôtels</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Trouvez votre hébergement idéal</Text>

        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search color={colors.textLight} size={20} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Rechercher un hôtel..."
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
        <Text style={[styles.resultsCount, { color: colors.text }]}>{filteredHotels.length} hôtel{filteredHotels.length > 1 ? 's' : ''} trouvé{filteredHotels.length > 1 ? 's' : ''}</Text>

        {filteredHotels.map((hotel) => (
          <TouchableOpacity
            key={hotel.id}
            style={[styles.hotelCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
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
                <Text style={[styles.hotelName, { color: colors.text }]} numberOfLines={1}>
                  {hotel.name}
                </Text>
                <View style={styles.priceContainer}>
                  <Text style={[styles.priceFrom, { color: colors.textLight }]}>à partir de</Text>
                  <Text style={[styles.price, { color: colors.primary }]}>€{hotel.price}</Text>
                  <Text style={[styles.priceNight, { color: colors.textLight }]}>/nuit</Text>
                </View>
              </View>

              <View style={styles.locationContainer}>
                <MapPin color={colors.textSecondary} size={14} />
                <Text style={[styles.location, { color: colors.textSecondary }]}>{hotel.location}</Text>
              </View>

              <View style={styles.ratingContainer}>
                <View style={[styles.ratingBadge, { backgroundColor: `${colors.warning}20` }]}>
                  <Star
                    color={colors.warning}
                    size={14}
                    fill={colors.warning}
                  />
                  <Text style={[styles.ratingText, { color: colors.text }]}>{hotel.rating}</Text>
                </View>
                <Text style={[styles.reviewsText, { color: colors.textSecondary }]}>({hotel.reviews} avis)</Text>
              </View>

              <View style={styles.amenitiesContainer}>
                {hotel.amenities.slice(0, 4).map((amenity, index) => {
                  const Icon = amenityIcons[amenity];
                  return Icon ? (
                    <View key={index} style={[styles.amenityIcon, { backgroundColor: colors.backgroundLight }]}>
                      <Icon color={colors.textLight} size={16} />
                    </View>
                  ) : null;
                })}
              </View>

              <TouchableOpacity
                style={[styles.bookButton, { backgroundColor: colors.primary }]}
                onPress={() => handleHotelPress(hotel)}
              >
                <Text style={[styles.bookButtonText, { color: colors.white }]}>Réserver maintenant</Text>
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
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600' as '600',
    marginBottom: 16,
  },
  hotelCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
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
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hotelType: {
    fontSize: 12,
    fontWeight: '600' as '600',
    color: '#fff',
  },
  hotelInfo: {
    padding: 16,
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  hotelName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700' as '700',
    marginRight: 12,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceFrom: {
    fontSize: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: '700' as '700',
  },
  priceNight: {
    fontSize: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700' as '700',
  },
  reviewsText: {
    fontSize: 14,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  amenityIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  bookButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center' as const,
    marginTop: 16,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '700' as '700',
  },
});
