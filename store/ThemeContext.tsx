import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { themes, ColorSchemeType, Theme, spacing, borderRadius, fontSize, fontWeight, shadows, animation } from '@/constants/themes';

const COLOR_SCHEME_STORAGE_KEY = '@app_color_scheme';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const systemColorScheme = useColorScheme();
  const [selectedColorScheme, setSelectedColorScheme] = useState<ColorSchemeType>('system');
  const [isLoading, setIsLoading] = useState(true);

  const loadColorScheme = useCallback(async () => {
    try {
      const storedScheme = await AsyncStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
      if (storedScheme && isValidColorScheme(storedScheme)) {
        setSelectedColorScheme(storedScheme as ColorSchemeType);
      }
    } catch (error) {
      console.error('Error loading color scheme:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadColorScheme();
  }, [loadColorScheme]);

  const isValidColorScheme = (scheme: string): boolean => {
    return scheme === 'light' || scheme === 'dark' || scheme === 'system';
  };

  const getActiveTheme = useCallback((): Theme => {
    if (selectedColorScheme === 'system') {
      return systemColorScheme === 'dark' ? themes.dark : themes.light;
    }
    return themes[selectedColorScheme];
  }, [selectedColorScheme, systemColorScheme]);

  const changeColorScheme = useCallback(async (newScheme: ColorSchemeType) => {
    try {
      setSelectedColorScheme(newScheme);
      await AsyncStorage.setItem(COLOR_SCHEME_STORAGE_KEY, newScheme);
      console.log('Color scheme changed to:', newScheme);
    } catch (error) {
      console.error('Error saving color scheme:', error);
    }
  }, []);

  const toggleColorScheme = useCallback(() => {
    const current = selectedColorScheme === 'system' ? systemColorScheme : selectedColorScheme;
    const next = current === 'dark' ? 'light' : 'dark';
    changeColorScheme(next as ColorSchemeType);
  }, [selectedColorScheme, systemColorScheme, changeColorScheme]);

  const activeTheme = useMemo(() => getActiveTheme(), [getActiveTheme]);

  return useMemo(() => ({
    selectedColorScheme,
    activeTheme,
    changeColorScheme,
    toggleColorScheme,
    isLoading,
    colors: activeTheme.colors,
    spacing,
    borderRadius,
    fontSize,
    fontWeight,
    shadows,
    animation,
    isDark: activeTheme.isDark,
  }), [selectedColorScheme, activeTheme, changeColorScheme, toggleColorScheme, isLoading]);
});
