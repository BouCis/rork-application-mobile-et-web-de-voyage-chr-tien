import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { themes, ColorSchemeType, ThemeType, Theme, spacing, borderRadius, fontSize, fontWeight, shadows, animation } from '@/constants/themes';

const COLOR_SCHEME_STORAGE_KEY = '@app_color_scheme';
const THEME_TYPE_STORAGE_KEY = '@app_theme_type';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const systemColorScheme = useColorScheme();
  const [selectedColorScheme, setSelectedColorScheme] = useState<ColorSchemeType>('system');
  const [selectedThemeType, setSelectedThemeType] = useState<ThemeType>('heavenLux');
  const [isLoading, setIsLoading] = useState(true);

  const loadColorScheme = useCallback(async () => {
    try {
      const storedScheme = await AsyncStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
      const storedThemeType = await AsyncStorage.getItem(THEME_TYPE_STORAGE_KEY);
      
      if (storedScheme && isValidColorScheme(storedScheme)) {
        setSelectedColorScheme(storedScheme as ColorSchemeType);
      }
      
      if (storedThemeType && isValidThemeType(storedThemeType)) {
        setSelectedThemeType(storedThemeType as ThemeType);
      }
    } catch (error) {
      console.error('Error loading theme preferences:', error);
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

  const isValidThemeType = (themeType: string): boolean => {
    return themeType === 'heavenLux';
  };

  const getActiveTheme = useCallback((): Theme => {
    const colorScheme = selectedColorScheme === 'system' 
      ? (systemColorScheme === 'dark' ? 'dark' : 'light')
      : selectedColorScheme;
    
    return themes[selectedThemeType][colorScheme];
  }, [selectedColorScheme, selectedThemeType, systemColorScheme]);

  const changeColorScheme = useCallback(async (newScheme: ColorSchemeType) => {
    try {
      setSelectedColorScheme(newScheme);
      await AsyncStorage.setItem(COLOR_SCHEME_STORAGE_KEY, newScheme);
      console.log('Color scheme changed to:', newScheme);
    } catch (error) {
      console.error('Error saving color scheme:', error);
    }
  }, []);

  const changeThemeType = useCallback(async (newThemeType: ThemeType) => {
    try {
      setSelectedThemeType(newThemeType);
      await AsyncStorage.setItem(THEME_TYPE_STORAGE_KEY, newThemeType);
      console.log('Theme type changed to:', newThemeType);
    } catch (error) {
      console.error('Error saving theme type:', error);
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
    selectedThemeType,
    activeTheme,
    changeColorScheme,
    changeThemeType,
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
  }), [selectedColorScheme, selectedThemeType, activeTheme, changeColorScheme, changeThemeType, toggleColorScheme, isLoading]);
});
