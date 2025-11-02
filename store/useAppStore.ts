import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo } from 'react';
import { User, Trip, Photo, SpiritualContent, TodoItem } from '@/types';

const useStorage = () => {
  const getItem = async (key: string) => {
    try {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  };

  const setItem = async (key: string, value: string) => {
    try {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage error:', error);
    }
  };

  return { getItem, setItem };
};

export const [AppProvider, useAppStore] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [dailyVerse, setDailyVerse] = useState<SpiritualContent | null>(null);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [favoriteTrips, setFavoriteTrips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const storage = useStorage();

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await storage.getItem('travelApp');
      if (data) {
        const parsed = JSON.parse(data);
        setUser(parsed.user || null);
        setTrips(parsed.trips || []);
        setPhotos(parsed.photos || []);
        setTodos(parsed.todos || []);
        setFavoriteTrips(parsed.favoriteTrips || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [storage]);

  const saveData = useCallback(async () => {
    try {
      const dataToSave = {
        user,
        trips,
        photos,
        todos,
        favoriteTrips,
      };
      await storage.setItem('travelApp', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [user, trips, photos, todos, favoriteTrips, storage]);

  const addTrip = useCallback((trip: Trip) => {
    setTrips(prev => [...prev, trip]);
  }, []);

  const updateTrip = useCallback((tripId: string, updates: Partial<Trip>) => {
    setTrips(prev => prev.map(trip => 
      trip.id === tripId ? { ...trip, ...updates } : trip
    ));
  }, []);

  const deleteTrip = useCallback((tripId: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== tripId));
  }, []);

  const addPhoto = useCallback((photo: Photo) => {
    setPhotos(prev => [...prev, photo]);
  }, []);

  const deletePhoto = useCallback((photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  }, []);

  const addTodo = useCallback((todo: TodoItem) => {
    setTodos(prev => [...prev, todo]);
  }, []);

  const toggleTodo = useCallback((todoId: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  const deleteTodo = useCallback((todoId: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== todoId));
  }, []);

  const toggleFavoriteTrip = useCallback((tripId: string) => {
    setFavoriteTrips(prev => 
      prev.includes(tripId)
        ? prev.filter(id => id !== tripId)
        : [...prev, tripId]
    );
  }, []);

  return useMemo(() => ({
    user,
    setUser,
    trips,
    setTrips,
    addTrip,
    updateTrip,
    deleteTrip,
    photos,
    setPhotos,
    addPhoto,
    deletePhoto,
    dailyVerse,
    setDailyVerse,
    todos,
    setTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    favoriteTrips,
    toggleFavoriteTrip,
    isLoading,
    setIsLoading,
    loadData,
    saveData,
  }), [
    user,
    trips,
    photos,
    dailyVerse,
    todos,
    favoriteTrips,
    isLoading,
    addTrip,
    updateTrip,
    deleteTrip,
    addPhoto,
    deletePhoto,
    addTodo,
    toggleTodo,
    deleteTodo,
    toggleFavoriteTrip,
    loadData,
    saveData,
  ]);
});