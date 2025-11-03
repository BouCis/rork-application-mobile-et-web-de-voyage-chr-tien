export type ColorSchemeType = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  accent: string;
  accentLight: string;
  accentDark: string;
  
  gold: string;
  goldLight: string;
  goldDark: string;
  
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  surface: string;
  surfaceSecondary: string;
  surfaceElevated: string;
  
  text: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;
  textInverse: string;
  white: string;
  
  border: string;
  borderLight: string;
  borderSubtle: string;
  
  success: string;
  warning: string;
  error: string;
  info: string;
  
  dove: string;
  spiritual: string;
  
  primaryGradient: readonly [string, string];
  secondaryGradient: readonly [string, string];
  goldGradient: readonly [string, string];
  spiritualGradient: readonly [string, string, string];
  glassGradient: readonly [string, string];
  neonGradient: readonly [string, string];
  
  tabBarBackground?: string;
  tabBarBlur?: boolean;
  cardGlow?: string;
  glassEffect?: boolean;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  isDark: boolean;
}

const neonLuxLight: Theme = {
  name: 'NEON LUX Gold Whisper - Light',
  isDark: false,
  colors: {
    primary: '#007AFF',
    primaryLight: '#4DA3FF',
    primaryDark: '#0055CC',
    
    secondary: '#C0AFFF',
    secondaryLight: '#D4C7FF',
    secondaryDark: '#A897E6',
    
    accent: '#5856D6',
    accentLight: '#7C7AE0',
    accentDark: '#4644AD',
    
    gold: '#DCC48E',
    goldLight: '#E6D5A3',
    goldDark: '#C9AF7A',
    
    background: '#F9F9F9',
    backgroundSecondary: '#FFFFFF',
    backgroundTertiary: '#F2F2F7',
    surface: '#FFFFFF',
    surfaceSecondary: '#F9F9F9',
    surfaceElevated: '#FFFFFF',
    
    text: '#1B1B1B',
    textSecondary: '#6E6E73',
    textTertiary: '#8E8E93',
    textMuted: 'rgba(27, 27, 27, 0.35)',
    textInverse: '#FFFFFF',
    white: '#FFFFFF',
    
    border: 'rgba(0, 0, 0, 0.08)',
    borderLight: 'rgba(0, 0, 0, 0.05)',
    borderSubtle: 'rgba(0, 0, 0, 0.03)',
    
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#007AFF',
    
    dove: '#1B1B1B',
    spiritual: '#8B7355',
    
    primaryGradient: ['#007AFF', '#5856D6'] as const,
    secondaryGradient: ['#C0AFFF', '#DCC48E'] as const,
    goldGradient: ['#E6D5A3', '#DCC48E'] as const,
    spiritualGradient: ['#007AFF', '#8B7355', '#DCC48E'] as const,
    glassGradient: ['rgba(255, 255, 255, 0.7)', 'rgba(249, 249, 249, 0.5)'] as const,
    neonGradient: ['#C0AFFF', '#007AFF'] as const,
    
    tabBarBackground: 'rgba(249, 249, 249, 0.85)',
    tabBarBlur: true,
    cardGlow: 'rgba(192, 175, 255, 0.08)',
    glassEffect: true,
  },
};

const neonLuxDark: Theme = {
  name: 'NEON LUX Gold Whisper - Dark',
  isDark: true,
  colors: {
    primary: '#0A84FF',
    primaryLight: '#409CFF',
    primaryDark: '#006BD6',
    
    secondary: '#C0AFFF',
    secondaryLight: '#D4C7FF',
    secondaryDark: '#A897E6',
    
    accent: '#5E5CE6',
    accentLight: '#7D7AEA',
    accentDark: '#4644B8',
    
    gold: '#DCC48E',
    goldLight: '#E6D5A3',
    goldDark: '#C9AF7A',
    
    background: '#0C0C0E',
    backgroundSecondary: '#1C1C1E',
    backgroundTertiary: '#2C2C2E',
    surface: '#1C1C1E',
    surfaceSecondary: '#2C2C2E',
    surfaceElevated: '#3A3A3C',
    
    text: '#FFFFFF',
    textSecondary: '#AEAEB2',
    textTertiary: '#8E8E93',
    textMuted: 'rgba(255, 255, 255, 0.3)',
    textInverse: '#0C0C0E',
    white: '#FFFFFF',
    
    border: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(255, 255, 255, 0.08)',
    borderSubtle: 'rgba(255, 255, 255, 0.05)',
    
    success: '#32D74B',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#0A84FF',
    
    dove: '#FFFFFF',
    spiritual: '#C4B5A0',
    
    primaryGradient: ['#0A84FF', '#5E5CE6'] as const,
    secondaryGradient: ['#C0AFFF', '#DCC48E'] as const,
    goldGradient: ['#E6D5A3', '#DCC48E'] as const,
    spiritualGradient: ['#0A84FF', '#C4B5A0', '#DCC48E'] as const,
    glassGradient: ['rgba(28, 28, 30, 0.7)', 'rgba(12, 12, 14, 0.5)'] as const,
    neonGradient: ['#C0AFFF', '#0A84FF'] as const,
    
    tabBarBackground: 'rgba(28, 28, 30, 0.85)',
    tabBarBlur: true,
    cardGlow: 'rgba(192, 175, 255, 0.12)',
    glassEffect: true,
  },
};

export const themes = {
  light: neonLuxLight,
  dark: neonLuxDark,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  huge: 120,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  full: 9999,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  hero: 40,
  display: 48,
};

export const fontWeight = {
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 9,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  }),
  neon: {
    shadowColor: '#C0AFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  gold: {
    shadowColor: '#DCC48E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const animation = {
  fast: 150,
  normal: 250,
  slow: 350,
  smooth: 450,
};
