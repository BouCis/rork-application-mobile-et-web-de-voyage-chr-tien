import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  ActivityIndicator,
  Pressable,
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
  Plane,
  Calendar,
  Building2,
} from 'lucide-react-native';
import { useTheme } from '@/store/ThemeContext';
import BookingModal from '../../components/BookingModal';
import { trpc } from '@/lib/trpc';
import { TransportComparison } from '@/components/TransportComparison';
import type { TransportOption } from '@/types';

interface HotelCardData {
  id: string;
  name: string;
  address: string;
  rating: number;
  priceSimulated: number;
  image: string;
  type: string;
}

const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  restaurant: UtensilsCrossed,
  gym: Dumbbell,
  parking: Car,
};

export default function HotelsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const [mode, setMode] = useState<'hotels' | 'flights'>('hotels');

  const [hotelKeyword, setHotelKeyword] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<{ code: string; name: string } | null>(null);

  const [originKeyword, setOriginKeyword] = useState<string>('');
  const [destKeyword, setDestKeyword] = useState<string>('');
  const [originCode, setOriginCode] = useState<{ code: string; name: string } | null>(null);
  const [destCode, setDestCode] = useState<{ code: string; name: string } | null>(null);
  const [date, setDate] = useState<string>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));

  const cityQuery = trpc.external.amadeus.cityOrAirport.useQuery(
    { keyword: hotelKeyword, subType: 'CITY' },
    { enabled: mode === 'hotels' && hotelKeyword.trim().length >= 2, staleTime: 5 * 60 * 1000 }
  );

  const hotelsQuery = trpc.external.amadeus.hotels.useQuery(
    { cityCode: selectedCity?.code ?? '' },
    { enabled: mode === 'hotels' && !!selectedCity?.code }
  );

  const originQuery = trpc.external.amadeus.cityOrAirport.useQuery(
    { keyword: originKeyword, subType: 'AIRPORT' },
    { enabled: mode === 'flights' && originKeyword.trim().length >= 2 }
  );
  const destQuery = trpc.external.amadeus.cityOrAirport.useQuery(
    { keyword: destKeyword, subType: 'AIRPORT' },
    { enabled: mode === 'flights' && destKeyword.trim().length >= 2 }
  );

  const flightsQuery = trpc.external.amadeus.flights.useQuery(
    { origin: originCode?.code ?? '', destination: destCode?.code ?? '', departureDate: date },
    { enabled: mode === 'flights' && !!originCode?.code && !!destCode?.code && !!date }
  );

  const mappedHotels = useMemo<HotelCardData[]>(() => {
    const items: any[] = (hotelsQuery.data as any)?.items ?? [];
    return items.map((it: any, idx: number) => {
      const name: string = it.name || it.hotelName || `Hôtel ${idx + 1}`;
      const address: string = it.address?.lines?.join(', ') || it.address?.cityName || selectedCity?.name || '';
      const rating: number = typeof it.rating === 'number' ? it.rating : Math.round((Math.random() * 2 + 3) * 10) / 10;
      const priceSimulated = Math.floor(60 + Math.random() * 90);
      const image = `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=60&ixid=${idx}`;
      const type = it.type || 'Hotel';
      return { id: it.hotelId || it.iataCode || String(idx), name, address, rating, priceSimulated, image, type } as HotelCardData;
    });
  }, [hotelsQuery.data, selectedCity?.name]);

  const mappedFlights = useMemo<TransportOption[]>(() => {
    const items: any[] = (flightsQuery.data as any)?.items ?? [];
    return items.slice(0, 10).map((offer: any, idx: number) => {
      const firstItin = offer.itineraries?.[0];
      const firstSeg = firstItin?.segments?.[0];
      const lastSeg = firstItin?.segments?.[firstItin?.segments?.length - 1];
      const dep = firstSeg?.departure;
      const arr = lastSeg?.arrival;
      const durationISO: string = firstItin?.duration || 'PT3H45M';
      const duration = durationISO.replace('PT', '').replace('H', 'h').replace('M', 'm');
      const price = Math.floor(120 + Math.random() * 180);
      const airline = firstSeg?.carrierCode || offer.validatingAirlineCodes?.[0] || 'Compagnie';
      const stops = (firstItin?.segments?.length ?? 1) - 1;
      const departureDT = dep?.at || new Date().toISOString();
      const arrivalDT = arr?.at || new Date(Date.now() + 2 * 3600000).toISOString();
      const depTime = new Date(departureDT).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      const arrTime = new Date(arrivalDT).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      return {
        id: offer.id || String(idx),
        type: 'flight',
        provider: airline,
        departure: { location: originCode?.code ?? '', time: depTime, date },
        arrival: { location: destCode?.code ?? '', time: arrTime, date },
        duration,
        price,
        currency: 'EUR',
        comfort: 3,
        stops,
        class: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'Economy',
        carbonFootprint: Math.floor(90 + Math.random() * 180),
        accessibility: true,
      } as TransportOption;
    });
  }, [flightsQuery.data, originCode?.code, destCode?.code, date]);

  const [bookingModalVisible, setBookingModalVisible] = useState<boolean>(false);
  const [selectedHotel, setSelectedHotel] = useState<HotelCardData | null>(null);

  const handleHotelPress = useCallback((hotel: HotelCardData) => {
    console.log('[Hotels] Hotel pressed:', hotel.name);
    setSelectedHotel(hotel);
    setBookingModalVisible(true);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.background, colors.backgroundSecondary]} style={StyleSheet.absoluteFillObject} />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.tabRow}>
          <TouchableOpacity
            testID="tab-hotels"
            onPress={() => setMode('hotels')}
            style={[styles.tabBtn, mode === 'hotels' && styles.tabBtnActive]}
          >
            <Building2 color={mode === 'hotels' ? colors.primary : colors.textSecondary} size={18} />
            <Text style={[styles.tabLabel, { color: mode === 'hotels' ? colors.primary : colors.textSecondary }]}>Hôtels</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="tab-flights"
            onPress={() => setMode('flights')}
            style={[styles.tabBtn, mode === 'flights' && styles.tabBtnActive]}
          >
            <Plane color={mode === 'flights' ? colors.primary : colors.textSecondary} size={18} />
            <Text style={[styles.tabLabel, { color: mode === 'flights' ? colors.primary : colors.textSecondary }]}>Vols</Text>
          </TouchableOpacity>
        </View>

        {mode === 'hotels' ? (
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Hôtels</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Données réelles Amadeus, prix simulés</Text>
            <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Search color={colors.textLight} size={20} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Ville (ex: Paris)"
                placeholderTextColor={colors.textLight}
                value={hotelKeyword}
                onChangeText={(t) => {
                  setHotelKeyword(t);
                  setSelectedCity(null);
                }}
                autoCorrect={false}
                autoCapitalize="words"
              />
            </View>
            {hotelKeyword.trim().length >= 2 && (
              <View style={[styles.suggestions, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                {cityQuery.isLoading ? (
                  <View style={styles.suggestionItem}><ActivityIndicator size="small" color={colors.primary} /><Text style={[styles.suggestionText, { color: colors.textSecondary }]}>Recherche…</Text></View>
                ) : (Array.isArray((cityQuery.data as any)?.items) && (cityQuery.data as any).items.length > 0) ? (
                  ((cityQuery.data as any).items as any[]).map((c: any) => (
                    <Pressable key={c.id} style={styles.suggestionItem} onPress={() => setSelectedCity({ code: c.iataCode, name: c.name })}>
                      <MapPin color={colors.textLight} size={16} />
                      <Text style={[styles.suggestionText, { color: colors.text }]}>{c.name} ({c.iataCode})</Text>
                    </Pressable>
                  ))
                ) : (
                  <View style={styles.suggestionItem}><Text style={[styles.suggestionText, { color: colors.textSecondary }]}>Aucun résultat</Text></View>
                )}
              </View>
            )}
          </View>
        ) : (
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Vols</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Données réelles Amadeus, prix simulés</Text>
            <View style={[styles.row, { gap: 8 }]}>
              <View style={[styles.inputBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <Search color={colors.textLight} size={18} />
                <TextInput
                  style={[styles.inputInline, { color: colors.text }]}
                  placeholder="Origine (aéroport)"
                  placeholderTextColor={colors.textLight}
                  value={originKeyword}
                  onChangeText={(t) => { setOriginKeyword(t); setOriginCode(null); }}
                  autoCorrect={false}
                  autoCapitalize="characters"
                />
              </View>
              <View style={[styles.inputBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <Search color={colors.textLight} size={18} />
                <TextInput
                  style={[styles.inputInline, { color: colors.text }]}
                  placeholder="Destination (aéroport)"
                  placeholderTextColor={colors.textLight}
                  value={destKeyword}
                  onChangeText={(t) => { setDestKeyword(t); setDestCode(null); }}
                  autoCorrect={false}
                  autoCapitalize="characters"
                />
              </View>
            </View>
            {(originKeyword.trim().length >= 2 || destKeyword.trim().length >= 2) && (
              <View style={[styles.suggestionsRow]}>
                <View style={[styles.suggestionsCol, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                  {originKeyword.trim().length < 2 ? null : originQuery.isLoading ? (
                    <View style={styles.suggestionItem}><ActivityIndicator size="small" color={colors.primary} /><Text style={[styles.suggestionText, { color: colors.textSecondary }]}>Origine…</Text></View>
                  ) : (Array.isArray((originQuery.data as any)?.items) ? (originQuery.data as any).items : []).map((c: any) => (
                    <Pressable key={c.id} style={styles.suggestionItem} onPress={() => { setOriginCode({ code: c.iataCode, name: c.name }); setOriginKeyword(`${c.name} (${c.iataCode})`); }}>
                      <Plane color={colors.textLight} size={16} />
                      <Text style={[styles.suggestionText, { color: colors.text }]}>{c.name} ({c.iataCode})</Text>
                    </Pressable>
                  ))}
                </View>
                <View style={[styles.suggestionsCol, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                  {destKeyword.trim().length < 2 ? null : destQuery.isLoading ? (
                    <View style={styles.suggestionItem}><ActivityIndicator size="small" color={colors.primary} /><Text style={[styles.suggestionText, { color: colors.textSecondary }]}>Destination…</Text></View>
                  ) : (Array.isArray((destQuery.data as any)?.items) ? (destQuery.data as any).items : []).map((c: any) => (
                    <Pressable key={c.id} style={styles.suggestionItem} onPress={() => { setDestCode({ code: c.iataCode, name: c.name }); setDestKeyword(`${c.name} (${c.iataCode})`); }}>
                      <Plane color={colors.textLight} size={16} />
                      <Text style={[styles.suggestionText, { color: colors.text }]}>{c.name} ({c.iataCode})</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
            <View style={[styles.inputBox, { marginTop: 8, borderColor: colors.border, backgroundColor: colors.surface }]}>
              <Calendar color={colors.textLight} size={18} />
              <TextInput
                style={[styles.inputInline, { color: colors.text }]}
                placeholder="Date de départ (AAAA-MM-JJ)"
                placeholderTextColor={colors.textLight}
                value={date}
                onChangeText={setDate}
                autoCorrect={false}
              />
            </View>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {mode === 'hotels' ? (
          <>
            {selectedCity ? (
              <Text style={[styles.resultsCount, { color: colors.text }]}>{mappedHotels.length} hôtel{mappedHotels.length > 1 ? 's' : ''} à {selectedCity.name}</Text>
            ) : (
              <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>Recherchez une ville pour voir les hôtels</Text>
            )}

            {hotelsQuery.isLoading && (
              <View style={styles.loadingBox}><ActivityIndicator size="large" color={colors.primary} /><Text style={[styles.loadingText, { color: colors.textSecondary }]}>Chargement des hôtels…</Text></View>
            )}

            {mappedHotels.map((hotel) => (
              <TouchableOpacity key={hotel.id} style={[styles.hotelCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => handleHotelPress(hotel)}>
                <View style={styles.hotelImageContainer}>
                  <Image source={{ uri: hotel.image }} style={styles.hotelImage} resizeMode="cover" />
                  <View style={styles.hotelBadge}><Text style={styles.hotelType}>{hotel.type}</Text></View>
                </View>
                <View style={styles.hotelInfo}>
                  <View style={styles.hotelHeader}>
                    <Text style={[styles.hotelName, { color: colors.text }]} numberOfLines={1}>{hotel.name}</Text>
                    <View style={styles.priceContainer}>
                      <Text style={[styles.priceFrom, { color: colors.textLight }]}>dès</Text>
                      <Text style={[styles.price, { color: colors.primary }]}>€{hotel.priceSimulated}</Text>
                      <Text style={[styles.priceNight, { color: colors.textLight }]}>/nuit (simulé)</Text>
                    </View>
                  </View>
                  <View style={styles.locationContainer}>
                    <MapPin color={colors.textSecondary} size={14} />
                    <Text style={[styles.location, { color: colors.textSecondary }]} numberOfLines={1}>{hotel.address}</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    <View style={[styles.ratingBadge, { backgroundColor: `${colors.warning}20` }]}>
                      <Star color={colors.warning} size={14} fill={colors.warning} />
                      <Text style={[styles.ratingText, { color: colors.text }]}>{hotel.rating.toFixed(1)}</Text>
                    </View>
                    <Text style={[styles.reviewsText, { color: colors.textSecondary }]}>Prix simulés • Amadeus</Text>
                  </View>
                  <TouchableOpacity style={[styles.bookButton, { backgroundColor: colors.primary }]} onPress={() => handleHotelPress(hotel)}>
                    <Text style={[styles.bookButtonText, { color: colors.white }]}>Détails</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            {originCode && destCode ? (
              <Text style={[styles.resultsCount, { color: colors.text }]}>
                {mappedFlights.length} option{mappedFlights.length > 1 ? 's' : ''} • {originCode.code} → {destCode.code} • {date}
              </Text>
            ) : (
              <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>Choisissez origine, destination et date</Text>
            )}

            {flightsQuery.isLoading && (
              <View style={styles.loadingBox}><ActivityIndicator size="large" color={colors.primary} /><Text style={[styles.loadingText, { color: colors.textSecondary }]}>Recherche des vols…</Text></View>
            )}

            {mappedFlights.length > 0 ? (
              <TransportComparison options={mappedFlights} onSelectOption={(opt) => console.log('[Flights] select', opt.id)} />
            ) : (!flightsQuery.isLoading && originCode && destCode) ? (
              <View style={styles.loadingBox}><Text style={[styles.loadingText, { color: colors.textSecondary }]}>Aucun vol trouvé. Essayez une autre date.</Text></View>
            ) : null}
          </>
        )}
      </ScrollView>

      {selectedHotel && (
        <BookingModal
          visible={bookingModalVisible}
          onClose={() => {
            setBookingModalVisible(false);
            setSelectedHotel(null);
          }}
          itemName={selectedHotel.name}
          itemPrice={`€${selectedHotel.priceSimulated}/nuit (simulé)`}
          itemType="hotel"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 12 },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  tabBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: 'transparent' },
  tabBtnActive: { borderColor: '#1f2937' },
  tabLabel: { fontSize: 14, fontWeight: '700' as const },
  title: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.3 },
  subtitle: { fontSize: 14, marginTop: 2, marginBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderWidth: 1, marginBottom: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  suggestions: { borderWidth: 1, borderRadius: 12, overflow: 'hidden', marginTop: 6 },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  suggestionText: { fontSize: 14 },
  row: { flexDirection: 'row' },
  inputBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  inputInline: { flex: 1, fontSize: 15 },
  suggestionsRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  suggestionsCol: { flex: 1, borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24 },
  resultsCount: { fontSize: 14, fontWeight: '600' as const, marginBottom: 12 },
  loadingBox: { padding: 32, alignItems: 'center', justifyContent: 'center', gap: 8 },
  loadingText: { fontSize: 14 },
  hotelCard: { borderRadius: 20, marginBottom: 16, overflow: 'hidden', borderWidth: 1 },
  hotelImageContainer: { height: 200, position: 'relative' as const },
  hotelImage: { width: '100%', height: '100%' },
  hotelBadge: { position: 'absolute' as const, top: 16, left: 16, backgroundColor: 'rgba(0, 0, 0, 0.7)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  hotelType: { fontSize: 12, fontWeight: '600' as const, color: '#fff' },
  hotelInfo: { padding: 16 },
  hotelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  hotelName: { flex: 1, fontSize: 18, fontWeight: '700' as const, marginRight: 12 },
  priceContainer: { alignItems: 'flex-end' },
  priceFrom: { fontSize: 12 },
  price: { fontSize: 20, fontWeight: '700' as const },
  priceNight: { fontSize: 12 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  location: { fontSize: 14 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  ratingText: { fontSize: 14, fontWeight: '700' as const },
  reviewsText: { fontSize: 14 },
  amenitiesContainer: { flexDirection: 'row', gap: 12 },
  amenityIcon: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  bookButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24, alignItems: 'center' as const, marginTop: 16 },
  bookButtonText: { fontSize: 14, fontWeight: '700' as const },
});
