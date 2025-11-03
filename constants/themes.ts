export type ColorSchemeType = 'light' | 'dark' | 'system';
export type ThemeType = 'heavenLux';

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
  backgroundLight: string;
  surface: string;
  surfaceSecondary: string;
  surfaceElevated: string;
  
  text: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;
  textInverse: string;
  textLight: string;
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

const heavenLuxLight: Theme = {
  name: 'Heaven Lux - Light',
  isDark: false,
  colors: {
    primary: '#AFCBFF',
    primaryLight: '#C4D7FF',
    primaryDark: '#96B8F0',
    
    secondary: '#E6C97A',
    secondaryLight: '#F0D99A',
    secondaryDark: '#D4B665',
    
    accent: '#AFCBFF',
    accentLight: '#C4D7FF',
    accentDark: '#96B8F0',
    
    gold: '#E6C97A',
    goldLight: '#F0D99A',
    goldDark: '#D4B665',
    
    background: '#FAFAFA',
    backgroundSecondary: '#FFFFFF',
    backgroundTertiary: '#F5F5F5',
    backgroundLight: 'rgba(230, 201, 122, 0.08)',
    surface: '#FFFFFF',
    surfaceSecondary: '#FAFAFA',
    surfaceElevated: '#FFFFFF',
    
    text: '#1B1B1B',
    textSecondary: '#6E6E73',
    textTertiary: '#8E8E93',
    textMuted: 'rgba(27, 27, 27, 0.4)',
    textInverse: '#FFFFFF',
    textLight: '#8E8E93',
    white: '#FFFFFF',
    
    border: 'rgba(230, 201, 122, 0.15)',
    borderLight: 'rgba(230, 201, 122, 0.1)',
    borderSubtle: 'rgba(230, 201, 122, 0.05)',
    
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#AFCBFF',
    
    dove: '#1B1B1B',
    spiritual: '#E6C97A',
    
    primaryGradient: ['#AFCBFF', '#E6C97A'] as const,
    secondaryGradient: ['#FAFAFA', '#FFFFFF'] as const,
    goldGradient: ['#F0D99A', '#E6C97A'] as const,
    spiritualGradient: ['#AFCBFF', '#FAFAFA', '#E6C97A'] as const,
    glassGradient: ['rgba(255, 255, 255, 0.85)', 'rgba(250, 250, 250, 0.6)'] as const,
    neonGradient: ['#AFCBFF', '#E6C97A'] as const,
    
    tabBarBackground: 'rgba(250, 250, 250, 0.9)',
    tabBarBlur: true,
    cardGlow: 'rgba(230, 201, 122, 0.1)',
    glassEffect: true,
  },
};

const heavenLuxDark: Theme = {
  name: 'Heaven Lux - Dark',
  isDark: true,
  colors: {
    primary: '#AFCBFF',
    primaryLight: '#C4D7FF',
    primaryDark: '#96B8F0',
    
    secondary: '#E6C97A',
    secondaryLight: '#F0D99A',
    secondaryDark: '#D4B665',
    
    accent: '#AFCBFF',
    accentLight: '#C4D7FF',
    accentDark: '#96B8F0',
    
    gold: '#E6C97A',
    goldLight: '#F0D99A',
    goldDark: '#D4B665',
    
    background: '#2C2C2C',
    backgroundSecondary: '#3A3A3A',
    backgroundTertiary: '#484848',
    backgroundLight: 'rgba(230, 201, 122, 0.12)',
    surface: '#3A3A3A',
    surfaceSecondary: '#484848',
    surfaceElevated: '#525252',
    
    text: '#FFFFFF',
    textSecondary: '#AEAEB2',
    textTertiary: '#8E8E93',
    textMuted: 'rgba(255, 255, 255, 0.4)',
    textInverse: '#2C2C2C',
    textLight: '#AEAEB2',
    white: '#FFFFFF',
    
    border: 'rgba(230, 201, 122, 0.2)',
    borderLight: 'rgba(230, 201, 122, 0.15)',
    borderSubtle: 'rgba(230, 201, 122, 0.08)',
    
    success: '#32D74B',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#AFCBFF',
    
    dove: '#FFFFFF',
    spiritual: '#E6C97A',
    
    primaryGradient: ['#AFCBFF', '#E6C97A'] as const,
    secondaryGradient: ['#3A3A3A', '#2C2C2C'] as const,
    goldGradient: ['#F0D99A', '#E6C97A'] as const,
    spiritualGradient: ['#AFCBFF', '#2C2C2C', '#E6C97A'] as const,
    glassGradient: ['rgba(58, 58, 58, 0.85)', 'rgba(44, 44, 44, 0.6)'] as const,
    neonGradient: ['#AFCBFF', '#E6C97A'] as const,
    
    tabBarBackground: 'rgba(44, 44, 44, 0.9)',
    tabBarBlur: true,
    cardGlow: 'rgba(230, 201, 122, 0.15)',
    glassEffect: true,
  },
};

export const themes = {
  heavenLux: {
    light: heavenLuxLight,
    dark: heavenLuxDark,
  },
} as const;

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
