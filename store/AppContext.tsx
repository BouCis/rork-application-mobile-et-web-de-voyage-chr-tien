import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { 
  User, 
  Trip, 
  Media, 
  SavedPlace, 
  TravelJournal, 
  ChecklistItem,
  Expense,
  Playlist,
  Post,
  Notification
} from '@/types';

const STORAGE_KEYS = {
  USER: '@voyage_chretien_user',
  TRIPS: '@voyage_chretien_trips',
  MEDIA: '@voyage_chretien_media',
  PLACES: '@voyage_chretien_places',
  JOURNALS: '@voyage_chretien_journals',
  CHECKLISTS: '@voyage_chretien_checklists',
  EXPENSES: '@voyage_chretien_expenses',
  PLAYLISTS: '@voyage_chretien_playlists',
  POSTS: '@voyage_chretien_posts',
  NOTIFICATIONS: '@voyage_chretien_notifications',
  ONBOARDING_COMPLETED: '@voyage_chretien_onboarding',
};

export const [AppProvider, useApp] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [journals, setJournals] = useState<TravelJournal[]>([]);
  const [checklists, setChecklists] = useState<ChecklistItem[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        userData,
        tripsData,
        mediaData,
        placesData,
        journalsData,
        checklistsData,
        expensesData,
        playlistsData,
        postsData,
        notificationsData,
        onboardingData,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.TRIPS),
        AsyncStorage.getItem(STORAGE_KEYS.MEDIA),
        AsyncStorage.getItem(STORAGE_KEYS.PLACES),
        AsyncStorage.getItem(STORAGE_KEYS.JOURNALS),
        AsyncStorage.getItem(STORAGE_KEYS.CHECKLISTS),
        AsyncStorage.getItem(STORAGE_KEYS.EXPENSES),
        AsyncStorage.getItem(STORAGE_KEYS.PLAYLISTS),
        AsyncStorage.getItem(STORAGE_KEYS.POSTS),
        AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS),
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED),
      ]);

      if (userData) setUser(JSON.parse(userData));
      if (tripsData) setTrips(JSON.parse(tripsData));
      if (mediaData) setMedia(JSON.parse(mediaData));
      if (placesData) setSavedPlaces(JSON.parse(placesData));
      if (journalsData) setJournals(JSON.parse(journalsData));
      if (checklistsData) setChecklists(JSON.parse(checklistsData));
      if (expensesData) setExpenses(JSON.parse(expensesData));
      if (playlistsData) setPlaylists(JSON.parse(playlistsData));
      if (postsData) setPosts(JSON.parse(postsData));
      if (notificationsData) setNotifications(JSON.parse(notificationsData));
      if (onboardingData) setOnboardingCompleted(JSON.parse(onboardingData));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = useCallback(async (userData: User) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }, []);

  const addTrip = useCallback(async (trip: Trip) => {
    try {
      const updatedTrips = [...trips, trip];
      await AsyncStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(updatedTrips));
      setTrips(updatedTrips);
    } catch (error) {
      console.error('Error adding trip:', error);
    }
  }, [trips]);

  const updateTrip = useCallback(async (tripId: string, updates: Partial<Trip>) => {
    try {
      const updatedTrips = trips.map(t => 
        t.id === tripId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      );
      await AsyncStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(updatedTrips));
      setTrips(updatedTrips);
    } catch (error) {
      console.error('Error updating trip:', error);
    }
  }, [trips]);

  const deleteTrip = useCallback(async (tripId: string) => {
    try {
      const updatedTrips = trips.filter(t => t.id !== tripId);
      await AsyncStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(updatedTrips));
      setTrips(updatedTrips);
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  }, [trips]);

  const addMedia = useCallback(async (mediaItem: Media) => {
    try {
      const updatedMedia = [...media, mediaItem];
      await AsyncStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(updatedMedia));
      setMedia(updatedMedia);
    } catch (error) {
      console.error('Error adding media:', error);
    }
  }, [media]);

  const addSavedPlace = useCallback(async (place: SavedPlace) => {
    try {
      const updatedPlaces = [...savedPlaces, place];
      await AsyncStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(updatedPlaces));
      setSavedPlaces(updatedPlaces);
    } catch (error) {
      console.error('Error adding saved place:', error);
    }
  }, [savedPlaces]);

  const addJournal = useCallback(async (journal: TravelJournal) => {
    try {
      const updatedJournals = [...journals, journal];
      await AsyncStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(updatedJournals));
      setJournals(updatedJournals);
    } catch (error) {
      console.error('Error adding journal:', error);
    }
  }, [journals]);

  const addChecklistItem = useCallback(async (item: ChecklistItem) => {
    try {
      const updatedChecklists = [...checklists, item];
      await AsyncStorage.setItem(STORAGE_KEYS.CHECKLISTS, JSON.stringify(updatedChecklists));
      setChecklists(updatedChecklists);
    } catch (error) {
      console.error('Error adding checklist item:', error);
    }
  }, [checklists]);

  const updateChecklistItem = useCallback(async (itemId: string, updates: Partial<ChecklistItem>) => {
    try {
      const updatedChecklists = checklists.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      );
      await AsyncStorage.setItem(STORAGE_KEYS.CHECKLISTS, JSON.stringify(updatedChecklists));
      setChecklists(updatedChecklists);
    } catch (error) {
      console.error('Error updating checklist item:', error);
    }
  }, [checklists]);

  const addExpense = useCallback(async (expense: Expense) => {
    try {
      const updatedExpenses = [...expenses, expense];
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updatedExpenses));
      setExpenses(updatedExpenses);
      
      const trip = trips.find(t => t.id === expense.tripId);
      if (trip) {
        const newSpent = trip.budget.spent + expense.amount;
        await updateTrip(expense.tripId, {
          budget: { ...trip.budget, spent: newSpent }
        });
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  }, [expenses, trips, updateTrip]);

  const addPlaylist = useCallback(async (playlist: Playlist) => {
    try {
      const updatedPlaylists = [...playlists, playlist];
      await AsyncStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(updatedPlaylists));
      setPlaylists(updatedPlaylists);
    } catch (error) {
      console.error('Error adding playlist:', error);
    }
  }, [playlists]);

  const addPost = useCallback(async (post: Post) => {
    try {
      const updatedPosts = [post, ...posts];
      await AsyncStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error adding post:', error);
    }
  }, [posts]);

  const addNotification = useCallback(async (notification: Notification) => {
    try {
      const updatedNotifications = [notification, ...notifications];
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  }, [notifications]);

  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      const updatedNotifications = notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [notifications]);

  const completeOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, JSON.stringify(true));
      setOnboardingCompleted(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      setUser(null);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.TRIPS,
        STORAGE_KEYS.MEDIA,
        STORAGE_KEYS.PLACES,
        STORAGE_KEYS.JOURNALS,
        STORAGE_KEYS.CHECKLISTS,
        STORAGE_KEYS.EXPENSES,
        STORAGE_KEYS.PLAYLISTS,
        STORAGE_KEYS.POSTS,
        STORAGE_KEYS.NOTIFICATIONS,
      ]);
      setUser(null);
      setTrips([]);
      setMedia([]);
      setSavedPlaces([]);
      setJournals([]);
      setChecklists([]);
      setExpenses([]);
      setPlaylists([]);
      setPosts([]);
      setNotifications([]);
      console.log('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }, []);

  return useMemo(() => ({
    user,
    trips,
    media,
    savedPlaces,
    journals,
    checklists,
    expenses,
    playlists,
    posts,
    notifications,
    onboardingCompleted,
    isLoading,
    saveUser,
    addTrip,
    updateTrip,
    deleteTrip,
    addMedia,
    addSavedPlace,
    addJournal,
    addChecklistItem,
    updateChecklistItem,
    addExpense,
    addPlaylist,
    addPost,
    addNotification,
    markNotificationAsRead,
    completeOnboarding,
    logout,
    deleteAccount,
  }), [
    user,
    trips,
    media,
    savedPlaces,
    journals,
    checklists,
    expenses,
    playlists,
    posts,
    notifications,
    onboardingCompleted,
    isLoading,
    saveUser,
    addTrip,
    updateTrip,
    deleteTrip,
    addMedia,
    addSavedPlace,
    addJournal,
    addChecklistItem,
    updateChecklistItem,
    addExpense,
    addPlaylist,
    addPost,
    addNotification,
    markNotificationAsRead,
    completeOnboarding,
    logout,
    deleteAccount,
  ]);
});
