import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Globe, Volume2, Star } from 'lucide-react-native';
import { useTheme } from '@/store/ThemeContext';

interface Phrase {
  french: string;
  translation: string;
  phonetic?: string;
  category: string;
}

interface LanguageGuide {
  language: string;
  flag: string;
  phrases: Phrase[];
}

const languageGuides: LanguageGuide[] = [
  {
    language: 'Anglais',
    flag: '🇬🇧',
    phrases: [
      { french: 'Bonjour', translation: 'Hello', phonetic: 'hé-lo', category: 'Salutations' },
      { french: 'Au revoir', translation: 'Goodbye', phonetic: 'goud-baï', category: 'Salutations' },
      { french: 'Merci', translation: 'Thank you', phonetic: 'thank iou', category: 'Politesse' },
      { french: 'S\'il vous plaît', translation: 'Please', phonetic: 'pli:z', category: 'Politesse' },
      { french: 'Excusez-moi', translation: 'Excuse me', phonetic: 'èks-kiouz mi', category: 'Politesse' },
      { french: 'Combien ça coûte?', translation: 'How much is it?', phonetic: 'haou match iz it', category: 'Shopping' },
      { french: 'Où sont les toilettes?', translation: 'Where is the bathroom?', phonetic: 'wèr iz ze bass-roum', category: 'Utile' },
      { french: 'Je ne comprends pas', translation: 'I don\'t understand', phonetic: 'aï dont eun-deur-stand', category: 'Communication' },
    ],
  },
  {
    language: 'Espagnol',
    flag: '🇪🇸',
    phrases: [
      { french: 'Bonjour', translation: 'Hola', phonetic: 'o-la', category: 'Salutations' },
      { french: 'Au revoir', translation: 'Adiós', phonetic: 'a-di-os', category: 'Salutations' },
      { french: 'Merci', translation: 'Gracias', phonetic: 'gra-ssi-as', category: 'Politesse' },
      { french: 'S\'il vous plaît', translation: 'Por favor', phonetic: 'por fa-vor', category: 'Politesse' },
      { french: 'Oui', translation: 'Sí', phonetic: 'si', category: 'Basique' },
      { french: 'Non', translation: 'No', phonetic: 'no', category: 'Basique' },
      { french: 'Combien ça coûte?', translation: '¿Cuánto cuesta?', phonetic: 'kouan-to koues-ta', category: 'Shopping' },
      { french: 'L\'addition, s\'il vous plaît', translation: 'La cuenta, por favor', phonetic: 'la kouen-ta por fa-vor', category: 'Restaurant' },
    ],
  },
  {
    language: 'Italien',
    flag: '🇮🇹',
    phrases: [
      { french: 'Bonjour', translation: 'Ciao / Buongiorno', phonetic: 'tchao / bouo-n-djor-no', category: 'Salutations' },
      { french: 'Au revoir', translation: 'Arrivederci', phonetic: 'ar-ri-vè-dèr-tchi', category: 'Salutations' },
      { french: 'Merci', translation: 'Grazie', phonetic: 'gra-tsié', category: 'Politesse' },
      { french: 'S\'il vous plaît', translation: 'Per favore', phonetic: 'pèr fa-vo-ré', category: 'Politesse' },
      { french: 'Excusez-moi', translation: 'Scusi', phonetic: 'skou-zi', category: 'Politesse' },
      { french: 'Délicieux!', translation: 'Delizioso!', phonetic: 'dé-li-tsio-zo', category: 'Restaurant' },
      { french: 'Où est...?', translation: 'Dov\'è...?', phonetic: 'do-vè', category: 'Utile' },
    ],
  },
  {
    language: 'Arabe',
    flag: '🇸🇦',
    phrases: [
      { french: 'Bonjour', translation: 'مرحبا (Marhaba)', phonetic: 'mar-ha-ba', category: 'Salutations' },
      { french: 'Au revoir', translation: 'مع السلامة (Ma\'a salama)', phonetic: 'ma-a sa-la-ma', category: 'Salutations' },
      { french: 'Merci', translation: 'شكرا (Shukran)', phonetic: 'chou-kran', category: 'Politesse' },
      { french: 'S\'il vous plaît', translation: 'من فضلك (Min fadlak)', phonetic: 'min fad-lak', category: 'Politesse' },
      { french: 'Oui', translation: 'نعم (Na\'am)', phonetic: 'na-am', category: 'Basique' },
      { french: 'Non', translation: 'لا (La)', phonetic: 'la', category: 'Basique' },
      { french: 'La paix soit avec vous', translation: 'السلام عليكم (As-salamu alaykum)', phonetic: 'as-sa-la-mou a-laï-koum', category: 'Salutations' },
    ],
  },
  {
    language: 'Japonais',
    flag: '🇯🇵',
    phrases: [
      { french: 'Bonjour', translation: 'こんにちは (Konnichiwa)', phonetic: 'ko-n-ni-tchi-wa', category: 'Salutations' },
      { french: 'Au revoir', translation: 'さようなら (Sayōnara)', phonetic: 'sa-yo-na-ra', category: 'Salutations' },
      { french: 'Merci', translation: 'ありがとう (Arigatō)', phonetic: 'a-ri-ga-to', category: 'Politesse' },
      { french: 'S\'il vous plaît', translation: 'お願いします (Onegaishimasu)', phonetic: 'o-né-gaï-chi-mass', category: 'Politesse' },
      { french: 'Excusez-moi', translation: 'すみません (Sumimasen)', phonetic: 'sou-mi-ma-sèn', category: 'Politesse' },
      { french: 'Délicieux!', translation: 'おいしい (Oishii)', phonetic: 'o-ï-chi', category: 'Restaurant' },
    ],
  },
];

export default function PhraseGuideScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(languageGuides[0].language);

  const currentGuide = useMemo(() => {
    return languageGuides.find(g => g.language === selectedLanguage) || languageGuides[0];
  }, [selectedLanguage]);

  const filteredPhrases = useMemo(() => {
    if (!searchQuery.trim()) return currentGuide.phrases;
    const query = searchQuery.toLowerCase();
    return currentGuide.phrases.filter(p =>
      p.french.toLowerCase().includes(query) ||
      p.translation.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }, [searchQuery, currentGuide]);

  const categories = useMemo(() => {
    const cats = new Set(currentGuide.phrases.map(p => p.category));
    return Array.from(cats);
  }, [currentGuide]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Guide de phrases',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      <LinearGradient
        colors={[colors.background, colors.backgroundSecondary]}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.accent}20` }]}>
            <Globe color={colors.accent} size={32} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Guide de phrases</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Apprenez les phrases essentielles
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.languagesScroll}
          contentContainerStyle={styles.languagesContainer}
        >
          {languageGuides.map((guide) => (
            <TouchableOpacity
              key={guide.language}
              style={[
                styles.languageChip,
                { backgroundColor: colors.surface, borderColor: colors.border },
                selectedLanguage === guide.language && {
                  backgroundColor: `${colors.primary}15`,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => setSelectedLanguage(guide.language)}
            >
              <Text style={styles.languageFlag}>{guide.flag}</Text>
              <Text
                style={[
                  styles.languageChipText,
                  { color: colors.text },
                  selectedLanguage === guide.language && { color: colors.primary },
                ]}
              >
                {guide.language}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search color={colors.textLight} size={20} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Rechercher une phrase..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {categories.map((category) => {
          const categoryPhrases = filteredPhrases.filter(p => p.category === category);
          if (categoryPhrases.length === 0) return null;

          return (
            <View key={category} style={styles.categorySection}>
              <Text style={[styles.categoryTitle, { color: colors.text }]}>{category}</Text>
              {categoryPhrases.map((phrase, index) => (
                <View
                  key={index}
                  style={[styles.phraseCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <View style={styles.phraseContent}>
                    <Text style={[styles.phraseFrench, { color: colors.text }]}>{phrase.french}</Text>
                    <Text style={[styles.phraseTranslation, { color: colors.primary }]}>
                      {phrase.translation}
                    </Text>
                    {phrase.phonetic && (
                      <View style={[styles.phoneticContainer, { backgroundColor: `${colors.accent}10` }]}>
                        <Volume2 color={colors.accent} size={14} />
                        <Text style={[styles.phoneticText, { color: colors.accent }]}>{phrase.phonetic}</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    style={[styles.favoriteButton, { backgroundColor: `${colors.gold}20` }]}
                  >
                    <Star color={colors.gold} size={18} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  languagesScroll: {
    marginBottom: 24,
  },
  languagesContainer: {
    gap: 12,
  },
  languageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 2,
    gap: 8,
  },
  languageFlag: {
    fontSize: 20,
  },
  languageChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
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
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  phraseCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    gap: 12,
  },
  phraseContent: {
    flex: 1,
  },
  phraseFrench: {
    fontSize: 15,
    marginBottom: 4,
  },
  phraseTranslation: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  phoneticContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
    alignSelf: 'flex-start',
  },
  phoneticText: {
    fontSize: 12,
    fontWeight: '600' as const,
    fontStyle: 'italic',
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
