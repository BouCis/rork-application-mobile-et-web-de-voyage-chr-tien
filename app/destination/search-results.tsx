import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Plane,
  Hotel,
  Calendar,
  MapPin,
  Search,
  AlertCircle,
} from 'lucide-react-native';
import { useTheme } from '@/store/ThemeContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { trpc } from '@/lib/trpc';

export default function SearchResultsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ cityName?: string; cityCode?: string }>();
  const { colors } = useTheme();

  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights');
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>(params.cityCode ?? '');
  const [departureDate, setDepartureDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [searchTrigger, setSearchTrigger] = useState<number>(0);

  const cityQuery = trpc.external.amadeus.cityOrAirport.useQuery(
    { keyword: params.cityName ?? '', subType: 'CITY' },
    { 
      enabled: !!params.cityName && !params.cityCode,
      staleTime: 1000 * 60 * 5,
      retry: 0,
    }
  );

  const detectedCityCode = useMemo(() => {
    if (params.cityCode) return params.cityCode;
    const items = cityQuery.data?.items ?? [];
    if (Array.isArray(items) && items.length > 0) {
      const first = items[0] as any;
      return first?.iataCode ?? '';
    }
    return '';
  }, [params.cityCode, cityQuery.data]);

  const flightsQuery = trpc.external.amadeus.flights.useQuery(
    { origin, destination: detectedCityCode, departureDate },
    { 
      enabled: activeTab === 'flights' && !!origin && !!detectedCityCode && !!departureDate && searchTrigger > 0,
      staleTime: 1000 * 60 * 2,
      retry: 0,
    }
  );

  const hotelsQuery = trpc.external.amadeus.hotels.useQuery(
    { cityCode: detectedCityCode },
    { 
      enabled: activeTab === 'hotels' && !!detectedCityCode && searchTrigger > 0,
      staleTime: 1000 * 60 * 5,
      retry: 0,
    }
  );

  const handleBack = useCallback(() => router.back(), [router]);
  
  const handleSearch = useCallback(() => {
    if (activeTab === 'flights') {
      if (!origin || !detectedCityCode || !departureDate) {
        console.warn('[SearchResults] Missing flight search params', { origin, destination: detectedCityCode, departureDate });
        return;
      }
    } else {
      if (!detectedCityCode) {
        console.warn('[SearchResults] Missing hotel search params', { cityCode: detectedCityCode });
        return;
      }
    }
    setSearchTrigger((prev) => prev + 1);
  }, [activeTab, origin, detectedCityCode, departureDate]);

  const renderFlightResults = useCallback(() => {
    if (!searchTrigger) {
      return (
        <View style={styles.emptyState}>
          <Plane color={colors.textSecondary} size={48} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Renseignez l&apos;origine et lancez la recherche
          </Text>
        </View>
      );
    }

    if (flightsQuery.isLoading) {
      return (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Recherche de vols en cours…
          </Text>
        </View>
      );
    }

    if (flightsQuery.error) {
      return (
        <View style={styles.errorState}>
          <AlertCircle color={colors.error} size={48} />
          <Text style={[styles.errorText, { color: colors.error }]}>
            Erreur lors de la recherche de vols
          </Text>
          <Text style={[styles.errorSubtext, { color: colors.textSecondary }]}>
            {flightsQuery.error.message}
          </Text>
        </View>
      );
    }

    const items = (flightsQuery.data?.items ?? []) as any[];
    const mode = flightsQuery.data?.mode;

    if (items.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Plane color={colors.textSecondary} size={48} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Aucun vol trouvé pour cette recherche
          </Text>
          {mode === 'simulation' && (
            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
              Mode simulation (API non configurée)
            </Text>
          )}
        </View>
      );
    }

    return (
      <ScrollView 
        style={styles.resultsList}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {mode === 'simulation' && (
          <View style={[styles.modeBanner, { backgroundColor: colors.warning + '20' }]}>
            <AlertCircle color={colors.warning} size={16} />
            <Text style={[styles.modeBannerText, { color: colors.warning }]}>
              Mode simulation - API non configurée
            </Text>
          </View>
        )}
        {items.map((flight, idx) => {
          const itinerary = flight?.itineraries?.[0];
          const segment = itinerary?.segments?.[0];
          const price = flight?.price?.total ?? '—';
          const currency = flight?.price?.currency ?? 'EUR';
          const departure = segment?.departure;
          const arrival = segment?.arrival;
          const carrier = segment?.carrierCode ?? '??';

          return (
            <View key={idx} style={[styles.flightCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.flightHeader}>
                <View style={[styles.carrierBadge, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.carrierText, { color: colors.primary }]}>{carrier}</Text>
                </View>
                <View style={[styles.priceBadge, { backgroundColor: '#2A1209', borderColor: '#3D1B0C' }]}>
                  <Text style={[styles.priceText, { color: '#FF7A3D' }]}>{price} {currency}</Text>
                </View>
              </View>
              <View style={styles.flightRoute}>
                <View style={styles.flightPoint}>
                  <Text style={[styles.flightCode, { color: colors.text }]}>{departure?.iataCode ?? origin}</Text>
                  <Text style={[styles.flightTime, { color: colors.textSecondary }]}>
                    {departure?.at ? new Date(departure.at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </Text>
                </View>
                <View style={styles.flightLine}>
                  <Plane color={colors.textSecondary} size={18} />
                </View>
                <View style={styles.flightPoint}>
                  <Text style={[styles.flightCode, { color: colors.text }]}>{arrival?.iataCode ?? destination}</Text>
                  <Text style={[styles.flightTime, { color: colors.textSecondary }]}>
                    {arrival?.at ? new Date(arrival.at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.flightDuration, { color: colors.textMuted }]}>
                Durée: {itinerary?.duration ?? '—'}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    );
  }, [
    searchTrigger,
    flightsQuery,
    colors,
    insets.bottom,
    origin,
    destination,
  ]);

  const renderHotelResults = useCallback(() => {
    if (!searchTrigger) {
      return (
        <View style={styles.emptyState}>
          <Hotel color={colors.textSecondary} size={48} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Lancez la recherche d&apos;hôtels
          </Text>
        </View>
      );
    }

    if (hotelsQuery.isLoading) {
      return (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Recherche d&apos;hôtels en cours…
          </Text>
        </View>
      );
    }

    if (hotelsQuery.error) {
      return (
        <View style={styles.errorState}>
          <AlertCircle color={colors.error} size={48} />
          <Text style={[styles.errorText, { color: colors.error }]}>
            Erreur lors de la recherche d&apos;hôtels
          </Text>
          <Text style={[styles.errorSubtext, { color: colors.textSecondary }]}>
            {hotelsQuery.error.message}
          </Text>
        </View>
      );
    }

    const items = (hotelsQuery.data?.items ?? []) as any[];
    const mode = hotelsQuery.data?.mode;

    if (items.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Hotel color={colors.textSecondary} size={48} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Aucun hôtel trouvé pour cette destination
          </Text>
          {mode === 'simulation' && (
            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
              Mode simulation (API non configurée)
            </Text>
          )}
        </View>
      );
    }

    return (
      <ScrollView 
        style={styles.resultsList}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {mode === 'simulation' && (
          <View style={[styles.modeBanner, { backgroundColor: colors.warning + '20' }]}>
            <AlertCircle color={colors.warning} size={16} />
            <Text style={[styles.modeBannerText, { color: colors.warning }]}>
              Mode simulation - API non configurée
            </Text>
          </View>
        )}
        {items.map((hotel, idx) => {
          const name = hotel?.name ?? 'Hôtel';
          const hotelId = hotel?.hotelId ?? `hotel-${idx}`;
          const distance = hotel?.distance?.value ?? null;
          const distanceUnit = hotel?.distance?.unit ?? 'KM';

          return (
            <View key={hotelId} style={[styles.hotelCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.hotelHeader}>
                <Hotel color={colors.primary} size={20} />
                <Text style={[styles.hotelName, { color: colors.text }]} numberOfLines={2}>{name}</Text>
              </View>
              <View style={styles.hotelMeta}>
                <MapPin color={colors.textSecondary} size={14} />
                <Text style={[styles.hotelMetaText, { color: colors.textSecondary }]}>
                  {distance !== null ? `${distance} ${distanceUnit}` : 'Centre-ville'}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  }, [
    searchTrigger,
    hotelsQuery,
    colors,
    insets.bottom,
  ]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.text,
    },
    headerSpacer: { width: 40 },
    
    tabsRow: {
      flexDirection: 'row',
      gap: 8,
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: 'center',
    },
    tabActive: {
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.textSecondary,
    },
    tabTextActive: {
      color: colors.primary,
    },

    searchForm: {
      paddingHorizontal: 20,
      gap: 12,
      marginBottom: 16,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
    },
    searchButton: {
      borderRadius: 12,
      overflow: 'hidden',
    },
    searchGradient: {
      paddingVertical: 14,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
    },
    searchButtonText: {
      fontSize: 15,
      fontWeight: '700' as const,
      color: colors.textInverse,
    },

    resultsList: {
      flex: 1,
      paddingHorizontal: 20,
    },
    modeBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 12,
      borderRadius: 10,
      marginBottom: 16,
    },
    modeBannerText: {
      fontSize: 12,
      fontWeight: '600' as const,
    },

    flightCard: {
      borderRadius: 16,
      borderWidth: 1,
      padding: 16,
      marginBottom: 12,
    },
    flightHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    carrierBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
    },
    carrierText: {
      fontSize: 13,
      fontWeight: '700' as const,
    },
    priceBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
    },
    priceText: {
      fontSize: 13,
      fontWeight: '800' as const,
    },
    flightRoute: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    flightPoint: {
      alignItems: 'center',
    },
    flightCode: {
      fontSize: 20,
      fontWeight: '700' as const,
    },
    flightTime: {
      fontSize: 12,
      marginTop: 2,
    },
    flightLine: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    flightDuration: {
      fontSize: 12,
      textAlign: 'center' as const,
    },

    hotelCard: {
      borderRadius: 14,
      borderWidth: 1,
      padding: 14,
      marginBottom: 12,
    },
    hotelHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 8,
    },
    hotelName: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600' as const,
    },
    hotelMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    hotelMetaText: {
      fontSize: 12,
    },

    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
      gap: 12,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: '600' as const,
      textAlign: 'center' as const,
    },
    emptySubtext: {
      fontSize: 13,
      textAlign: 'center' as const,
    },
    loadingState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
    },
    loadingText: {
      fontSize: 15,
    },
    errorState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
      gap: 12,
    },
    errorText: {
      fontSize: 16,
      fontWeight: '600' as const,
      textAlign: 'center' as const,
    },
    errorSubtext: {
      fontSize: 13,
      textAlign: 'center' as const,
    },
  }), [colors]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.backgroundTertiary, colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          testID="btn-back"
        >
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {params.cityName ?? 'Recherche'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'flights' && styles.tabActive]}
          onPress={() => setActiveTab('flights')}
        >
          <Text style={[styles.tabText, activeTab === 'flights' && styles.tabTextActive]}>
            Vols
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'hotels' && styles.tabActive]}
          onPress={() => setActiveTab('hotels')}
        >
          <Text style={[styles.tabText, activeTab === 'hotels' && styles.tabTextActive]}>
            Hôtels
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchForm}>
        {activeTab === 'flights' && (
          <>
            <View style={styles.inputRow}>
              <Plane color={colors.textSecondary} size={18} />
              <TextInput
                style={styles.input}
                placeholder="Origine (ex: PAR, NYC)"
                placeholderTextColor={colors.textMuted}
                value={origin}
                onChangeText={setOrigin}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={3}
              />
            </View>
            <View style={styles.inputRow}>
              <MapPin color={colors.textSecondary} size={18} />
              <TextInput
                style={styles.input}
                placeholder="Destination"
                placeholderTextColor={colors.textMuted}
                value={destination || detectedCityCode || params.cityName || ''}
                onChangeText={setDestination}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>
            <View style={styles.inputRow}>
              <Calendar color={colors.textSecondary} size={18} />
              <TextInput
                style={styles.input}
                placeholder="Date départ (YYYY-MM-DD)"
                placeholderTextColor={colors.textMuted}
                value={departureDate}
                onChangeText={setDepartureDate}
                autoCorrect={false}
              />
            </View>
          </>
        )}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <LinearGradient
            colors={colors.primaryGradient as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.searchGradient}
          >
            <Search color={colors.textInverse} size={18} />
            <Text style={styles.searchButtonText}>Rechercher</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {activeTab === 'flights' ? renderFlightResults() : renderHotelResults()}
    </View>
  );
}
