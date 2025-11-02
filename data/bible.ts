import AsyncStorage from '@react-native-async-storage/async-storage';
import { BibleVerse } from '@/types';

export type BibleVersion = 'LSG';

export type BibleBookInfo = {
  fr: string;
  en: string;
  chapters: number;
  testament: 'old' | 'new';
};

export const BIBLE_BOOKS: BibleBookInfo[] = [
  { fr: 'Genèse', en: 'Genesis', chapters: 50, testament: 'old' },
  { fr: 'Exode', en: 'Exodus', chapters: 40, testament: 'old' },
  { fr: 'Lévitique', en: 'Leviticus', chapters: 27, testament: 'old' },
  { fr: 'Nombres', en: 'Numbers', chapters: 36, testament: 'old' },
  { fr: 'Deutéronome', en: 'Deuteronomy', chapters: 34, testament: 'old' },
  { fr: 'Josué', en: 'Joshua', chapters: 24, testament: 'old' },
  { fr: 'Juges', en: 'Judges', chapters: 21, testament: 'old' },
  { fr: 'Ruth', en: 'Ruth', chapters: 4, testament: 'old' },
  { fr: '1 Samuel', en: '1 Samuel', chapters: 31, testament: 'old' },
  { fr: '2 Samuel', en: '2 Samuel', chapters: 24, testament: 'old' },
  { fr: '1 Rois', en: '1 Kings', chapters: 22, testament: 'old' },
  { fr: '2 Rois', en: '2 Kings', chapters: 25, testament: 'old' },
  { fr: '1 Chroniques', en: '1 Chronicles', chapters: 29, testament: 'old' },
  { fr: '2 Chroniques', en: '2 Chronicles', chapters: 36, testament: 'old' },
  { fr: 'Esdras', en: 'Ezra', chapters: 10, testament: 'old' },
  { fr: 'Néhémie', en: 'Nehemiah', chapters: 13, testament: 'old' },
  { fr: 'Esther', en: 'Esther', chapters: 10, testament: 'old' },
  { fr: 'Job', en: 'Job', chapters: 42, testament: 'old' },
  { fr: 'Psaumes', en: 'Psalms', chapters: 150, testament: 'old' },
  { fr: 'Proverbes', en: 'Proverbs', chapters: 31, testament: 'old' },
  { fr: 'Ecclésiaste', en: 'Ecclesiastes', chapters: 12, testament: 'old' },
  { fr: 'Cantique des Cantiques', en: 'Song of Solomon', chapters: 8, testament: 'old' },
  { fr: 'Ésaïe', en: 'Isaiah', chapters: 66, testament: 'old' },
  { fr: 'Jérémie', en: 'Jeremiah', chapters: 52, testament: 'old' },
  { fr: 'Lamentations', en: 'Lamentations', chapters: 5, testament: 'old' },
  { fr: 'Ézéchiel', en: 'Ezekiel', chapters: 48, testament: 'old' },
  { fr: 'Daniel', en: 'Daniel', chapters: 12, testament: 'old' },
  { fr: 'Osée', en: 'Hosea', chapters: 14, testament: 'old' },
  { fr: 'Joël', en: 'Joel', chapters: 3, testament: 'old' },
  { fr: 'Amos', en: 'Amos', chapters: 9, testament: 'old' },
  { fr: 'Abdias', en: 'Obadiah', chapters: 1, testament: 'old' },
  { fr: 'Jonas', en: 'Jonah', chapters: 4, testament: 'old' },
  { fr: 'Michée', en: 'Micah', chapters: 7, testament: 'old' },
  { fr: 'Nahum', en: 'Nahum', chapters: 3, testament: 'old' },
  { fr: 'Habacuc', en: 'Habakkuk', chapters: 3, testament: 'old' },
  { fr: 'Sophonie', en: 'Zephaniah', chapters: 3, testament: 'old' },
  { fr: 'Aggée', en: 'Haggai', chapters: 2, testament: 'old' },
  { fr: 'Zacharie', en: 'Zechariah', chapters: 14, testament: 'old' },
  { fr: 'Malachie', en: 'Malachi', chapters: 4, testament: 'old' },
  { fr: 'Matthieu', en: 'Matthew', chapters: 28, testament: 'new' },
  { fr: 'Marc', en: 'Mark', chapters: 16, testament: 'new' },
  { fr: 'Luc', en: 'Luke', chapters: 24, testament: 'new' },
  { fr: 'Jean', en: 'John', chapters: 21, testament: 'new' },
  { fr: 'Actes', en: 'Acts', chapters: 28, testament: 'new' },
  { fr: 'Romains', en: 'Romans', chapters: 16, testament: 'new' },
  { fr: '1 Corinthiens', en: '1 Corinthians', chapters: 16, testament: 'new' },
  { fr: '2 Corinthiens', en: '2 Corinthians', chapters: 13, testament: 'new' },
  { fr: 'Galates', en: 'Galatians', chapters: 6, testament: 'new' },
  { fr: 'Éphésiens', en: 'Ephesians', chapters: 6, testament: 'new' },
  { fr: 'Philippiens', en: 'Philippians', chapters: 4, testament: 'new' },
  { fr: 'Colossiens', en: 'Colossians', chapters: 4, testament: 'new' },
  { fr: '1 Thessaloniciens', en: '1 Thessalonians', chapters: 5, testament: 'new' },
  { fr: '2 Thessaloniciens', en: '2 Thessalonians', chapters: 3, testament: 'new' },
  { fr: '1 Timothée', en: '1 Timothy', chapters: 6, testament: 'new' },
  { fr: '2 Timothée', en: '2 Timothy', chapters: 4, testament: 'new' },
  { fr: 'Tite', en: 'Titus', chapters: 3, testament: 'new' },
  { fr: 'Philémon', en: 'Philemon', chapters: 1, testament: 'new' },
  { fr: 'Hébreux', en: 'Hebrews', chapters: 13, testament: 'new' },
  { fr: 'Jacques', en: 'James', chapters: 5, testament: 'new' },
  { fr: '1 Pierre', en: '1 Peter', chapters: 5, testament: 'new' },
  { fr: '2 Pierre', en: '2 Peter', chapters: 3, testament: 'new' },
  { fr: '1 Jean', en: '1 John', chapters: 5, testament: 'new' },
  { fr: '2 Jean', en: '2 John', chapters: 1, testament: 'new' },
  { fr: '3 Jean', en: '3 John', chapters: 1, testament: 'new' },
  { fr: 'Jude', en: 'Jude', chapters: 1, testament: 'new' },
  { fr: 'Apocalypse', en: 'Revelation', chapters: 22, testament: 'new' },
];

export function getBookInfoByFrName(name: string): BibleBookInfo | undefined {
  return BIBLE_BOOKS.find(b => b.fr.toLowerCase() === name.toLowerCase());
}

export function getBookInfoByEnName(name: string): BibleBookInfo | undefined {
  return BIBLE_BOOKS.find(b => b.en.toLowerCase() === name.toLowerCase());
}

export type ChapterResponse = {
  reference: string;
  verses: { book_id: string; book_name: string; chapter: number; verse: number; text: string }[];
  text?: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
};

// Minimal jeu de données local (LSG) en secours
const LOCAL_LSG: Record<string, Record<number, { verse: number; text: string }[]>> = {
  Jean: {
    3: [
      { verse: 1, text: "Il y eut un homme d'entre les pharisiens, nommé Nicodème, un chef des Juifs." },
      { verse: 2, text: "Qui vint, lui, auprès de Jésus, de nuit, et lui dit: Rabbi, nous savons que tu es un docteur venu de Dieu; car personne ne peut faire ces miracles que tu fais, si Dieu n'est avec lui." },
      { verse: 3, text: "Jésus lui répondit: En vérité, en vérité, je te le dis, si un homme ne naît de nouveau, il ne peut voir le royaume de Dieu." },
      { verse: 4, text: "Nicodème lui dit: Comment un homme peut-il naître quand il est vieux? Peut-il rentrer dans le sein de sa mère et naître?" },
      { verse: 5, text: "Jésus répondit: En vérité, en vérité, je te le dis, si un homme ne naît d'eau et d'Esprit, il ne peut entrer dans le royaume de Dieu." },
      { verse: 6, text: "Ce qui est né de la chair est chair, et ce qui est né de l'Esprit est esprit." },
      { verse: 7, text: "Ne t'étonne pas que je t'aie dit: Il faut que vous naissiez de nouveau." },
      { verse: 8, text: "Le vent souffle où il veut, et tu en entends le bruit; mais tu ne sais d'où il vient ni où il va. Il en est ainsi de tout homme qui est né de l'Esprit." },
      { verse: 9, text: "Nicodème lui dit: Comment cela peut-il se faire?" },
      { verse: 10, text: "Jésus lui répondit: Tu es le docteur d'Israël, et tu ne sais pas ces choses!" },
      { verse: 16, text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle." },
    ],
  },
};

export async function fetchChapter(bookFr: string, chapter: number): Promise<BibleVerse[]> {
  const info = getBookInfoByFrName(bookFr);
  if (!info) throw new Error('Livre introuvable');
  const passage = encodeURIComponent(`${info.en} ${chapter}`);
  const primaryUrl = `https://bible-api.com/${passage}?translation=ls1910`;
  console.log('[Bible] Fetching chapter (primary):', primaryUrl);

  try {
    const res = await fetch(primaryUrl);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${text}`);
    }
    const data: ChapterResponse = await res.json();
    const verses: BibleVerse[] = (data.verses || []).map((v, idx) => ({
      id: `${info.fr}-${chapter}-${v.verse}-${idx}`,
      book: info.fr,
      chapter: v.chapter,
      verse: v.verse,
      text: (v.text || '').trim(),
      version: 'LSG',
    }));
    if (verses.length > 0) return verses;
    throw new Error('Réponse vide');
  } catch (err) {
    console.warn('[Bible] Primary source failed, using local fallback if available', err);
    const local = LOCAL_LSG[info.fr]?.[chapter] ?? [];
    if (local.length > 0) {
      const verses: BibleVerse[] = local.map((v, idx) => ({
        id: `${info.fr}-${chapter}-${v.verse}-${idx}`,
        book: info.fr,
        chapter,
        verse: v.verse,
        text: v.text,
        version: 'LSG',
      }));
      return verses;
    }
    throw new Error("Impossible de charger le chapitre (source distante indisponible et aucun secours local)");
  }
}

const BOOKMARKS_KEY = '@bible_bookmarks_v1';
export type Bookmark = { id: string; book: string; chapter: number; verse: number; text: string; createdAt: string };

export async function loadBookmarks(): Promise<Bookmark[]> {
  try {
    const raw = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) as Bookmark[] : [];
  } catch (e) {
    console.error('[Bible] loadBookmarks error', e);
    return [];
  }
}

export async function saveBookmarks(list: Bookmark[]): Promise<void> {
  try {
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('[Bible] saveBookmarks error', e);
  }
}

export function toggleBookmark(list: Bookmark[], verse: BibleVerse): Bookmark[] {
  const id = `${verse.book}-${verse.chapter}-${verse.verse}`;
  const exists = list.some(b => b.id === id);
  if (exists) {
    return list.filter(b => b.id !== id);
  }
  return [
    { id, book: verse.book, chapter: verse.chapter, verse: verse.verse, text: verse.text, createdAt: new Date().toISOString() },
    ...list,
  ];
}
