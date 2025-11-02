import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { themes, ThemeType, Theme, spacing, borderRadius, fontSize, fontWeight, shadows, animation } from '@/constants/themes';

const THEME_STORAGE_KEY = '@app_theme';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const systemColorScheme = useColorScheme();
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('neo-travel-dark');
  const [isLoading, setIsLoading] = useState(true);

  const loadTheme = useCallback(async () => {
    try {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme && isValidTheme(storedTheme)) {
        setSelectedTheme(storedTheme as ThemeType);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  useEffect(() => {
    if (selectedTheme === 'system') {
      return;
    }
  }, [systemColorScheme, selectedTheme]);



  const isValidTheme = (theme: string): boolean => {
    return theme === 'system' || theme in themes;
  };

  const getActiveTheme = (): Theme => {
    if (selectedTheme === 'system') {
      return systemColorScheme === 'dark' ? themes['neo-travel-dark'] : themes['minimal-light'];
    }
    return themes[selectedTheme];
  };

  const changeTheme = useCallback(async (newTheme: ThemeType) => {
    try {
      setSelectedTheme(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      console.log('Theme changed to:', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, []);

  const activeTheme = getActiveTheme();

  return useMemo(() => ({
    selectedTheme,
    activeTheme,
    changeTheme,
    isLoading,
    colors: activeTheme.colors,
    spacing,
    borderRadius,
    fontSize,
    fontWeight,
    shadows,
    animation,
    isDark: activeTheme.isDark,
  }), [selectedTheme, activeTheme, changeTheme, isLoading]);
});
