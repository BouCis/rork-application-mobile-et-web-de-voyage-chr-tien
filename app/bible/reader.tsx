import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Search, BookOpen, ChevronDown, Volume2, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { BIBLE_BOOKS, fetchChapter, getBookInfoByFrName, loadBookmarks, saveBookmarks, toggleBookmark } from '@/data/bible';
import type { Bookmark as BibleBookmark } from '@/data/bible';

export default function BibleReaderScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBook, setSelectedBook] = useState<string>('Jean');
  const [selectedChapter, setSelectedChapter] = useState<number>(3);
  const [showBookSelector, setShowBookSelector] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(16);
  const [bookmarks, setBookmarks] = useState<BibleBookmark[]>([]);

  useEffect(() => {
    loadBookmarks().then(setBookmarks);
  }, []);

  const bookInfo = useMemo(() => getBookInfoByFrName(selectedBook), [selectedBook]);

  const { data: verses, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['bible', 'chapter', selectedBook, selectedChapter],
    queryFn: async () => fetchChapter(selectedBook, selectedChapter),
  });

  const handleBack = () => {
    router.back();
  };

  const handleBookSelect = (bookName: string) => {
    setSelectedBook(bookName);
    setSelectedChapter(1);
    setShowBookSelector(false);
  };

  const handleFontSizeIncrease = () => {
    if (fontSize < 24) setFontSize(fontSize + 2);
  };

  const handleFontSizeDecrease = () => {
    if (fontSize > 12) setFontSize(fontSize - 2);
  };

  const filteredVerses = useMemo(() => {
    const list = verses ?? [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.trim().toLowerCase();
    return list.filter(v => v.text.toLowerCase().includes(q));
  }, [verses, searchQuery]);

  const onToggleBookmark = useCallback(async (vId: string) => {
    const v = (verses ?? []).find(vv => `${vv.book}-${vv.chapter}-${vv.verse}` === vId);
    if (!v) return;
    const updated = toggleBookmark(bookmarks, v);
    setBookmarks(updated);
    await saveBookmarks(updated);
  }, [bookmarks, verses]);

  const isBookmarked = useCallback((v: { book: string; chapter: number; verse: number }) => {
    const id = `${v.book}-${v.chapter}-${v.verse}`;
    return bookmarks.some(b => b.id === id);
  }, [bookmarks]);

  const onSpeak = useCallback(() => {
    const text = (verses ?? []).map(v => `${v.verse}. ${v.text}`).join(' ');
    if (!text) return;
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'fr-FR';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      } catch (e) {
        console.log('[Bible] speech error', e);
      }
    } else {
      Alert.alert('Audio', "La lecture vocale n'est pas disponible sur cet appareil.");
    }
  }, [verses]);


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
        <Text style={styles.headerTitle}>Bible</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Bookmark color={theme.colors.text} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color={theme.colors.textLight} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un verset..."
            placeholderTextColor={theme.colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          testID="btn-select-book"
          style={styles.bookSelector}
          onPress={() => setShowBookSelector(!showBookSelector)}
        >
          <BookOpen color={theme.colors.primary} size={20} />
          <Text style={styles.bookSelectorText}>
            {selectedBook} {selectedChapter}
          </Text>
          <ChevronDown color={theme.colors.textLight} size={20} />
        </TouchableOpacity>

        <View style={styles.fontControls}>
          <TouchableOpacity
            style={styles.fontButton}
            onPress={handleFontSizeDecrease}
          >
            <Text style={styles.fontButtonText}>A-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fontButton}
            onPress={handleFontSizeIncrease}
          >
            <Text style={styles.fontButtonText}>A+</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="btn-tts" style={styles.fontButton} onPress={onSpeak}>
            <Volume2 color={theme.colors.textLight} size={18} />
          </TouchableOpacity>
        </View>
      </View>

      {showBookSelector && (
        <View style={styles.bookList}>
          <ScrollView
            style={styles.bookListScroll}
            contentContainerStyle={styles.bookListContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.testamentTitle}>Ancien Testament</Text>
            {BIBLE_BOOKS
              .filter(b => b.testament === 'old')
              .map((book) => (
                <TouchableOpacity
                  key={book.fr}
                  style={[
                    styles.bookItem,
                    selectedBook === book.fr && styles.bookItemActive
                  ]}
                  onPress={() => handleBookSelect(book.fr)}
                >
                  <Text style={[
                    styles.bookItemText,
                    selectedBook === book.fr && styles.bookItemTextActive
                  ]}>
                    {book.fr}
                  </Text>
                  <Text style={styles.bookItemChapters}>{book.chapters} ch.</Text>
                </TouchableOpacity>
              ))}

            <Text style={[styles.testamentTitle, { marginTop: theme.spacing.lg }]}>Nouveau Testament</Text>
            {BIBLE_BOOKS
              .filter(b => b.testament === 'new')
              .map((book) => (
                <TouchableOpacity
                  key={book.fr}
                  style={[
                    styles.bookItem,
                    selectedBook === book.fr && styles.bookItemActive
                  ]}
                  onPress={() => handleBookSelect(book.fr)}
                >
                  <Text style={[
                    styles.bookItemText,
                    selectedBook === book.fr && styles.bookItemTextActive
                  ]}>
                    {book.fr}
                  </Text>
                  <Text style={styles.bookItemChapters}>{book.chapters} ch.</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.chapterHeader}>
          <Text style={styles.chapterTitle}>
            {selectedBook} {selectedChapter}
          </Text>
          <Text style={styles.chapterSubtitle}>Louis Segond 1910</Text>
        </View>

        {isLoading || isFetching ? (
          <View style={styles.loading}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Chargement du chapitre…</Text>
          </View>
        ) : isError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Impossible de charger le chapitre</Text>
            <Text style={styles.errorMessage}>{(error as Error)?.message ?? 'Erreur inconnue'}</Text>
            <TouchableOpacity testID="btn-retry" style={styles.retryBtn} onPress={() => refetch()}>
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.versesContainer}>
            {filteredVerses.map((verse) => {
              const id = `${verse.book}-${verse.chapter}-${verse.verse}`;
              const bookmarked = isBookmarked(verse);
              return (
                <TouchableOpacity
                  key={id}
                  testID={`verse-${id}`}
                  style={styles.verseCard}
                  onLongPress={() => onToggleBookmark(id)}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={`Verset ${verse.verse}. Appui long pour ${bookmarked ? 'retirer des favoris' : 'ajouter aux favoris'}`}
                >
                  <View style={styles.verseNumber}>
                    <Text style={styles.verseNumberText}>{verse.verse}</Text>
                  </View>
                  <Text style={[styles.verseText, { fontSize }]}>
                    {verse.text}
                  </Text>
                  {bookmarked && (
                    <Bookmark color={theme.colors.warning} size={16} />
                  )}
                </TouchableOpacity>
              );
            })}
            {filteredVerses.length === 0 && (
              <Text style={styles.emptyFilter}>Aucun verset ne correspond à votre recherche</Text>
            )}
          </View>
        )}

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            testID="btn-prev-chapter"
            style={[styles.navButton, { opacity: selectedChapter <= 1 ? 0.5 : 1 }]}
            disabled={selectedChapter <= 1}
            onPress={() => setSelectedChapter(Math.max(1, selectedChapter - 1))}
          >
            <LinearGradient
              colors={[`${theme.colors.primary}20`, `${theme.colors.primary}10`]}
              style={styles.navGradient}
            >
              <ChevronLeft color={theme.colors.text} />
              <Text style={styles.navButtonText}>Chapitre précédent</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            testID="btn-next-chapter"
            style={[styles.navButton, { opacity: (bookInfo?.chapters ?? Infinity) <= selectedChapter ? 0.5 : 1 }]}
            disabled={(bookInfo?.chapters ?? Infinity) <= selectedChapter}
            onPress={() => setSelectedChapter(selectedChapter + 1)}
          >
            <LinearGradient
              colors={[`${theme.colors.primary}20`, `${theme.colors.primary}10`]}
              style={styles.navGradient}
            >
              <Text style={styles.navButtonText}>Chapitre suivant</Text>
              <ChevronRight color={theme.colors.text} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Fonctionnalités</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <BookOpen color={theme.colors.primary} size={24} />
              <Text style={styles.infoCardTitle}>66 Livres</Text>
              <Text style={styles.infoCardText}>Bible complète</Text>
            </View>
            <View style={styles.infoCard}>
              <Search color={theme.colors.secondary} size={24} />
              <Text style={styles.infoCardTitle}>Recherche</Text>
              <Text style={styles.infoCardText}>Par verset</Text>
            </View>
            <View style={styles.infoCard}>
              <Volume2 color={theme.colors.accent} size={24} />
              <Text style={styles.infoCardTitle}>Audio</Text>
              <Text style={styles.infoCardText}>Lecture vocale</Text>
            </View>
            <View style={styles.infoCard}>
              <Bookmark color={theme.colors.warning} size={24} />
              <Text style={styles.infoCardTitle}>Favoris</Text>
              <Text style={styles.infoCardText}>Sauvegardez</Text>
            </View>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  bookSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  bookSelectorText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  fontControls: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  fontButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  bookList: {
    position: 'absolute',
    top: 180,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    maxHeight: 400,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bookListScroll: {
    flex: 1,
  },
  bookListContent: {
    padding: theme.spacing.md,
  },
  testamentTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  bookItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: 2,
  },
  bookItemActive: {
    backgroundColor: `${theme.colors.primary}15`,
  },
  bookItemText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  bookItemTextActive: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
  bookItemChapters: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  chapterHeader: {
    marginBottom: theme.spacing.xl,
  },
  chapterTitle: {
    fontSize: theme.fontSize.hero,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  chapterSubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  versesContainer: {
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  verseCard: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'flex-start',
  },
  verseNumber: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: `${theme.colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseNumberText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  verseText: {
    flex: 1,
    lineHeight: 28,
    color: theme.colors.text,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  navButton: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  navGradient: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  navButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  infoSection: {
    marginTop: theme.spacing.xl,
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  loadingText: {
    color: theme.colors.textSecondary,
  },
  errorBox: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  errorTitle: {
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
  },
  errorMessage: {
    color: theme.colors.textSecondary,
  },
  retryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: `${theme.colors.primary}20`,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.xs,
  },
  retryText: {
    color: theme.colors.text,
    fontWeight: theme.fontWeight.semibold,
  },
  emptyFilter: {
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  infoTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  infoCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  infoCardTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  infoCardText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});
