import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
  Image,
  Pressable,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MapPin,
  Sparkles,
  Star,
  Heart,
  Flame,
  Plane,
  Calendar,
  Sun,
  Moon,
  Compass,
} from 'lucide-react-native';
import { useApp } from '@/store/AppContext';
import { trpc } from '@/lib/trpc';
import countriesCities from '@/data/countries-cities.json';

const { width } = Dimensions.get('window');

type LocalDestination = {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  price: string;
  description: string;
};

const trendingDestinations: LocalDestination[] = [
  {
    id: '1',
    name: 'Bali',
    country: 'Indonésie',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200',
    rating: 4.9,
    price: '€890 (simulé)',
    description: 'Paradis tropical avec temples et plages',
  },
  {
    id: '2',
    name: 'Santorin',
    country: 'Grèce',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200',
    rating: 4.8,
    price: '€1 200 (simulé)',
    description: 'Couchers de soleil et villages blancs',
  },
  {
    id: '3',
    name: 'Tokyo',
    country: 'Japon',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200',
    rating: 4.9,
    price: '€1 450 (simulé)',
    description: 'Traditions et néons futuristes',
  },
];

const palette = {
  background: '#0B0F14',
  surface: '#111821',
  action: '#3BA3FF',
  price: '#FF7A3D',
  text: '#D9E2EC',
  textSecondary: '#8AA1B4',
  border: 'rgba(255,255,255,0.06)',
} as const;

type GPPlace = {
  place_id?: string;
  name?: string;
  formatted_address?: string;
  rating?: number;
  types?: string[];
  geometry?: { location?: { lat?: number; lng?: number } };
  photos?: unknown[];
};

export default function PlannerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { trips } = useApp();

  const [scrollY] = useState<Animated.Value>(new Animated.Value(0));
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [selectedShortcut, setSelectedShortcut] = useState<string>('');
  const [failedDeck, setFailedDeck] = useState<Record<string, boolean>>({});
  const [failedAround, setFailedAround] = useState<Record<number, boolean>>({});
  const [failedWish, setFailedWish] = useState<Record<number, boolean>>({});

  const promptScale = useRef(new Animated.Value(1)).current;

  const hour = new Date().getHours();
  const isMorning = hour < 12;
  const isEvening = hour >= 18;

  const skyTranslate = scrollY.interpolate({ inputRange: [0, 200], outputRange: [0, -60], extrapolate: 'clamp' });

  const greetings = useMemo(() => {
    if (isMorning) return '⛅ Prêt à charger ton sac à dos au lever du soleil ? Où t’envole-t-on aujourd’hui ?';
    if (isEvening) return '✨ Les étoiles montrent la route. On trace où cette nuit ?';
    return '🌍 Envie d’improviser une escapade ? Dis-moi ta prochaine évasion… ✈';
  }, [isMorning, isEvening]);

  const onPromptPressIn = useCallback(() => {
    Animated.spring(promptScale, { toValue: 0.98, useNativeDriver: true, friction: 6, tension: 120 }).start();
  }, [promptScale]);
  const onPromptPressOut = useCallback(() => {
    Animated.spring(promptScale, { toValue: 1, useNativeDriver: true, friction: 6, tension: 120 }).start();
  }, [promptScale]);

  const handleInspire = useCallback(() => {
    console.log('[Home] Inspire me');
    Alert.alert('Inspirations IA', 'Nous allons vous proposer 5 idées adaptées.');
  }, []);

  const handleDestinationPress = useCallback((destination: LocalDestination) => {
    router.push({ pathname: '/destination/[id]', params: { id: destination.name } });
  }, [router]);

  const handleCreateTrip = useCallback(() => {
    router.push('/trip/create');
  }, [router]);

  const handleSelectPlace = useCallback((p: GPPlace) => {
    setSearchQuery('');
    setShowSearchResults(false);
    const name = p.name ?? '';
    router.push({ pathname: '/destination/search-results', params: { cityName: name } });
  }, [router]);

  const handleSearchFocus = useCallback(() => setShowSearchResults(true), []);
  const handleSearchBlur = useCallback(() => setTimeout(() => setShowSearchResults(false), 180), []);

  const placesQuery = trpc.external.places.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.trim().length >= 2, retry: 0, staleTime: 1000 * 60 }
  );

  const offlineResults = useMemo<GPPlace[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    const list: GPPlace[] = [];
    const entries = Object.entries(countriesCities as Record<string, { name: string; cities: string[] }>);
    for (const [, val] of entries) {
      const countryName = (val as any).name ?? '';
      if (typeof countryName === 'string' && countryName.toLowerCase().includes(q)) {
        list.push({ name: countryName, formatted_address: countryName });
      }
      const cities = (val as any).cities as string[] | undefined;
      if (Array.isArray(cities)) {
        for (const city of cities) {
          if (city.toLowerCase().includes(q)) {
            list.push({ name: city, formatted_address: `${city}, ${countryName}` });
          }
        }
      }
      if (list.length >= 20) break;
    }
    return list.slice(0, 20);
  }, [searchQuery]);

  const searchResults = useMemo<GPPlace[]>(() => {
    const items: unknown = placesQuery.data?.items ?? [];
    const arr = Array.isArray(items) ? (items as GPPlace[]) : [];
    const typed = arr.filter((it) => {
      const types = it.types ?? [];
      return types.includes('locality') || types.includes('administrative_area_level_1') || types.includes('administrative_area_level_2');
    });
    if (typed.length > 0) return typed;
    if (arr.length > 0) return arr.slice(0, 8);
    return offlineResults;
  }, [placesQuery.data, offlineResults]);

  const shortcuts = useMemo(() => ['Weekend', 'Plage', 'Montagne', 'Cité d’art', 'Road-trip'], []);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.background },
    skyWrap: { position: 'absolute', top: 0, left: 0, right: 0, height: 260 },
    skyLayer: { ...StyleSheet.absoluteFillObject },
    header: { paddingHorizontal: 20, paddingTop: insets.top + 14, paddingBottom: 12 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    brand: { color: palette.text, fontSize: 18, fontWeight: '700' as const, letterSpacing: 0.4 },
    avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: palette.surface, alignItems: 'center', justifyContent: 'center' },

    promptCard: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 18, padding: 16, gap: 10 },
    promptText: { color: palette.text, fontSize: 16, fontWeight: '700' as const, lineHeight: 22 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap' as const, gap: 8 },
    chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: '#0E141B', borderWidth: 1, borderColor: palette.border },
    chipActive: { backgroundColor: '#13212E', borderColor: '#1E2F40' },
    chipText: { color: palette.textSecondary, fontSize: 12, fontWeight: '600' as const },

    searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 16, backgroundColor: '#0E141B', borderWidth: 1, borderColor: palette.border },
    searchInput: { flex: 1, fontSize: 15, color: palette.text },
    shortcutsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
    shortcut: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: palette.border },
    shortcutText: { color: palette.textSecondary, fontSize: 12 },
    resultsWrap: { position: 'absolute', top: 58, left: 0, right: 0, borderRadius: 14, borderWidth: 1, borderColor: palette.border, backgroundColor: palette.surface, maxHeight: 280, overflow: 'hidden' },
    resultItem: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10, borderBottomWidth: 1, borderBottomColor: palette.border },
    resultName: { color: palette.text, fontSize: 15, fontWeight: '600' as const },
    resultMeta: { color: palette.textSecondary, fontSize: 12 },

    section: { paddingHorizontal: 20, marginTop: 18 },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    sectionTitle: { color: palette.text, fontSize: 16, fontWeight: '700' as const },

    deckScroll: { paddingHorizontal: 20, gap: 14 },
    deckCard: { width: width * 0.8, borderRadius: 18, overflow: 'hidden', backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border },
    deckImage: { width: '100%', height: 200 },
    deckOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12, backgroundColor: 'rgba(7,10,14,0.55)' },
    deckTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    titleText: { color: palette.text, fontSize: 18, fontWeight: '800' as const },
    subText: { color: palette.textSecondary, fontSize: 12, marginTop: 2 },
    pricePill: { backgroundColor: '#2A1209', borderColor: '#3D1B0C', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
    priceText: { color: palette.price, fontSize: 12, fontWeight: '800' as const },
    ctaBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
    ctaBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#0F2234', borderWidth: 1, borderColor: '#14304B' },
    ctaLabel: { color: palette.action, fontSize: 12, fontWeight: '700' as const },

    aroundRow: { flexDirection: 'row', gap: 12 },
    roundCard: { width: 90, alignItems: 'center' as const },
    roundThumb: { width: 90, height: 90, borderRadius: 52 },
    roundLabel: { color: palette.text, fontSize: 12, marginTop: 6 },
    roundMeta: { color: palette.textSecondary, fontSize: 11 },

    grid: { flexDirection: 'row', flexWrap: 'wrap' as const, gap: 10 },
    wishTile: { width: (width - 20 * 2 - 10) / 2, height: 120, borderRadius: 14, overflow: 'hidden', backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border },
    wishBadge: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, backgroundColor: '#2A1209', borderWidth: 1, borderColor: '#3D1B0C' },
    wishBadgeText: { color: palette.price, fontSize: 11, fontWeight: '700' as const },

    timelineCard: { backgroundColor: palette.surface, borderRadius: 16, borderWidth: 1, borderColor: palette.border, padding: 14 },
    timelineItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.action },
    line: { position: 'absolute', left: 3.5, top: 0, bottom: 0, width: 1, backgroundColor: palette.border },

    duoRow: { flexDirection: 'row', gap: 12 },
    miniCard: { flex: 1, backgroundColor: palette.surface, borderRadius: 16, borderWidth: 1, borderColor: palette.border, padding: 14 },
    miniTitle: { color: palette.text, fontSize: 14, fontWeight: '700' as const, marginBottom: 8 },
    checkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
    checkLabel: { color: palette.textSecondary, fontSize: 12 },

    iaRow: { flexDirection: 'row', gap: 10 },
    iaChip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, backgroundColor: '#0E141B', borderWidth: 1, borderColor: palette.border },
    iaText: { color: palette.text, fontSize: 12 },
  }), [insets.top]);

  return (
    <View style={styles.container} testID="home-root">
      <Animated.View style={[styles.skyWrap, { transform: [{ translateY: skyTranslate }] }]}>        
        {isMorning ? (
          <LinearGradient colors={[palette.background, '#14202B']} style={styles.skyLayer} />
        ) : isEvening ? (
          <LinearGradient colors={[palette.background, '#0A1220']} style={styles.skyLayer} />
        ) : (
          <LinearGradient colors={[palette.background, '#0E1722']} style={styles.skyLayer} />
        )}
      </Animated.View>

      <ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.badge}>
              {isEvening ? <Moon color={palette.textSecondary} size={18} /> : isMorning ? <Sun color={palette.textSecondary} size={18} /> : <Compass color={palette.textSecondary} size={18} />}
              <Text style={styles.brand}>Sacados</Text>
            </View>
            <View style={styles.avatar} testID="avatar-pill">
              <Plane color={palette.action} size={18} />
            </View>
          </View>

          <Animated.View style={[styles.promptCard, { transform: [{ scale: promptScale }] }]} onTouchStart={onPromptPressIn} onTouchEnd={onPromptPressOut} testID="prompt-card">
            <Text style={styles.promptText}>{greetings}</Text>
            <View style={styles.chipRow}>
              {['Inspirer‑moi', 'Budget < 500€', '3–5 jours', 'Solo', 'Nature'].map((c) => (
                <TouchableOpacity key={c} onPress={() => (c === 'Inspirer‑moi' ? handleInspire() : setSelectedShortcut(c))} activeOpacity={0.85} style={[styles.chip, selectedShortcut === c && styles.chipActive]}>
                  <Text style={styles.chipText}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          <View style={{ marginTop: 12, position: 'relative' }}>
            <View style={styles.searchBar}>
              <MapPin color={palette.textSecondary} size={18} />
              <TextInput
                testID="home-search"
                style={styles.searchInput}
                placeholder="Où dors-tu ce soir ? Ville, pays, idée…"
                placeholderTextColor={palette.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="words"
              />
              <Sparkles color={palette.action} size={18} />
            </View>
            <View style={styles.shortcutsRow}>
              {shortcuts.map((s) => (
                <TouchableOpacity key={s} style={styles.shortcut} onPress={() => setSelectedShortcut(s)}>
                  <Text style={styles.shortcutText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {showSearchResults && (
              <View style={styles.resultsWrap} testID="search-results">
                <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                  {placesQuery.isLoading ? (
                    <View style={{ padding: 14 }}>
                      <Text style={styles.resultMeta}>Recherche…</Text>
                    </View>
                  ) : placesQuery.error ? (
                    <View style={{ padding: 14 }}>
                      <Text style={styles.resultMeta}>Serveur indisponible — suggestions hors‑ligne</Text>
                    </View>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((p) => (
                      <Pressable key={p.place_id ?? p.name} style={styles.resultItem} onPress={() => handleSelectPlace(p)}>
                        <MapPin color={palette.action} size={16} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.resultName}>{p.name}</Text>
                          <Text style={styles.resultMeta}>{p.formatted_address}</Text>
                        </View>
                        {typeof p.rating === 'number' ? (
                          <Text style={styles.resultMeta}>★ {p.rating.toFixed(1)}</Text>
                        ) : null}
                      </Pressable>
                    ))
                  ) : (
                    <View style={{ padding: 14 }}>
                      <Text style={styles.resultMeta}>{searchQuery ? 'Aucun résultat' : 'Tapez pour rechercher'}</Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Inspiration nomade</Text>
            <Flame color={palette.price} size={16} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.deckScroll}>
            {trendingDestinations.map((d) => (
              <View key={d.id} style={styles.deckCard}>
                <Image
                  source={{ uri: failedDeck[d.id] ? 'https://images.unsplash.com/photo-1502920917128-1aa500764ce7?w=1200&auto=format' : d.image }}
                  style={styles.deckImage}
                  onError={() => setFailedDeck((s) => ({ ...s, [d.id]: true }))}
                  accessibilityLabel={`Inspiration ${d.name}`}
                />
                <View style={styles.deckOverlay}>
                  <View style={styles.deckTopRow}>
                    <View>
                      <Text style={styles.titleText}>{d.name}</Text>
                      <Text style={styles.subText}>{d.country}</Text>
                    </View>
                    <View style={styles.pricePill}><Text style={styles.priceText}>Dès {d.price}</Text></View>
                  </View>
                  <View style={styles.ctaBar}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Star color={palette.price} size={14} fill={palette.price} />
                      <Text style={styles.subText}>{d.rating.toFixed(1)}</Text>
                    </View>
                    <TouchableOpacity style={styles.ctaBtn} onPress={() => handleDestinationPress(d)}>
                      <Text style={styles.ctaLabel}>Voir l’itinéraire estimé</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}><Text style={styles.sectionTitle}>Autour de toi</Text></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
            {['Café', 'Parc', 'Musée', 'Viewpoint', 'Plage'].map((n, i) => (
              <View key={n + i} style={styles.roundCard}>
                <Image
                  source={{ uri: failedAround[i] ? 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&auto=format' : `https://images.unsplash.com/photo-150${i}0${i}0${i}0-aaaa?w=400&auto=format` }}
                  style={styles.roundThumb}
                  onError={() => setFailedAround((s) => ({ ...s, [i]: true }))}
                  accessibilityLabel={`Spot ${n}`}
                />
                <Text style={styles.roundLabel}>{n}</Text>
                <Text style={styles.roundMeta}>{(i + 1) * 0.6} km • 4.{i + 3}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}><Text style={styles.sectionTitle}>Wishlist</Text><Heart color={palette.action} size={16} /></View>
          <View style={styles.grid}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.wishTile}>
                <Image
                  source={{ uri: failedWish[i] ? 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format' : `https://images.unsplash.com/photo-15${i}0${i}0${i}0-aaaa?w=800` }}
                  style={{ width: '100%', height: '100%' }}
                  onError={() => setFailedWish((s) => ({ ...s, [i]: true }))}
                  accessibilityLabel={`Wishlist ${i}`}
                />
                <View style={styles.wishBadge}><Text style={styles.wishBadgeText}>−{10 * i}% vol (simulé)</Text></View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}><Text style={styles.sectionTitle}>Mes voyages</Text><Calendar color={palette.textSecondary} size={16} /></View>
          {trips.length === 0 ? (
            <TouchableOpacity onPress={handleCreateTrip} activeOpacity={0.9}>
              <View style={styles.timelineCard}>
                <Text style={styles.subText}>Premier départ ?</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  {['City-break 3j < 300€', 'Micro‑aventure 2j', 'Nomad 1 mois'].map((p) => (
                    <View key={p} style={[styles.chip, { backgroundColor: '#0F2234', borderColor: '#14304B' }]}><Text style={[styles.chipText, { color: palette.action }]}>{p}</Text></View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={[styles.timelineCard, { position: 'relative' }]}>
              <View style={styles.line} />
              {trips.slice(0, 3).map((t) => (
                <View key={t.id} style={styles.timelineItem}>
                  <View style={styles.dot} />
                  <Text style={{ color: palette.text, fontSize: 13, fontWeight: '700' as const }}>{t.destination}</Text>
                  <Text style={styles.subText}> • {new Date(t.startDate).toLocaleDateString('fr-FR')}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.duoRow}>
            <View style={styles.miniCard}>
              <Text style={styles.miniTitle}>Visa & administratif</Text>
              <View style={styles.checkRow}><Text style={styles.checkLabel}>Passeport 6 mois</Text><Text style={[styles.checkLabel, { color: palette.action }]}>À faire</Text></View>
              <View style={styles.checkRow}><Text style={styles.checkLabel}>Demande eVisa</Text><Text style={[styles.checkLabel, { color: palette.textSecondary }]}>Lien officiel</Text></View>
            </View>
            <View style={styles.miniCard}>
              <Text style={styles.miniTitle}>Santé & vaccins</Text>
              <View style={styles.checkRow}><Text style={styles.checkLabel}>Fièvre jaune</Text><Text style={[styles.checkLabel, { color: palette.action }]}>Rappel</Text></View>
              <View style={styles.checkRow}><Text style={styles.checkLabel}>Carnet vaccination</Text><Text style={[styles.checkLabel, { color: palette.textSecondary }]}>Ok</Text></View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}><Text style={styles.sectionTitle}>Explorations IA</Text><Sparkles color={palette.action} size={16} /></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
            {[
              '3 jours, budget < 400€, culture + street food',
              'Randonnée + hostel, 7 jours en septembre',
              'Surf + couchsurfing, 10 jours',
            ].map((q) => (
              <TouchableOpacity key={q} style={styles.iaChip} onPress={() => Alert.alert('Exploration IA', q)}>
                <Text style={styles.iaText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
