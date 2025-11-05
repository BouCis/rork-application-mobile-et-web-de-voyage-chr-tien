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
  
  primaryGradient: readonly [string, string];
  secondaryGradient: readonly [string, string];
  goldGradient: readonly [string, string];
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
  name: 'Classic Rork - Light',
  isDark: false,
  colors: {
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',

    secondary: '#EC4899',
    secondaryLight: '#F472B6',
    secondaryDark: '#DB2777',

    accent: '#14B8A6',
    accentLight: '#2DD4BF',
    accentDark: '#0D9488',

    gold: '#F59E0B',
    goldLight: '#FBBF24',
    goldDark: '#D97706',

    background: '#FFFFFF',
    backgroundSecondary: '#F8FAFC',
    backgroundTertiary: '#F1F5F9',
    backgroundLight: 'rgba(99, 102, 241, 0.06)',
    surface: '#FFFFFF',
    surfaceSecondary: '#F8FAFC',
    surfaceElevated: '#FFFFFF',

    text: '#0F172A',
    textSecondary: '#334155',
    textTertiary: '#64748B',
    textMuted: 'rgba(15, 23, 42, 0.35)',
    textInverse: '#FFFFFF',
    textLight: '#94A3B8',
    white: '#FFFFFF',

    border: '#E2E8F0',
    borderLight: '#E5E7EB',
    borderSubtle: '#EEF2F7',

    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    dove: '#1F2937',

    primaryGradient: ['#6366F1', '#EC4899'] as const,
    secondaryGradient: ['#14B8A6', '#6366F1'] as const,
    goldGradient: ['#F59E0B', '#EC4899'] as const,
    glassGradient: ['rgba(255, 255, 255, 0.9)', 'rgba(248, 250, 252, 0.7)'] as const,
    neonGradient: ['#6366F1', '#14B8A6'] as const,

    tabBarBackground: 'rgba(255, 255, 255, 0.92)',
    tabBarBlur: true,
    cardGlow: 'rgba(99, 102, 241, 0.08)',
    glassEffect: true,
  },
};

const heavenLuxDark: Theme = {
  name: 'Classic Rork - Dark',
  isDark: true,
  colors: {
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',

    secondary: '#EC4899',
    secondaryLight: '#F472B6',
    secondaryDark: '#DB2777',

    accent: '#14B8A6',
    accentLight: '#2DD4BF',
    accentDark: '#0D9488',

    gold: '#F59E0B',
    goldLight: '#FBBF24',
    goldDark: '#D97706',

    background: '#0F172A',
    backgroundSecondary: '#1E293B',
    backgroundTertiary: '#334155',
    backgroundLight: 'rgba(99, 102, 241, 0.12)',
    surface: '#1E293B',
    surfaceSecondary: '#334155',
    surfaceElevated: '#334155',

    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    textMuted: 'rgba(255, 255, 255, 0.3)',
    textInverse: '#0F172A',
    textLight: '#94A3B8',
    white: '#FFFFFF',

    border: '#334155',
    borderLight: '#475569',
    borderSubtle: 'rgba(148, 163, 184, 0.15)',

    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    dove: '#E8E8E8',

    primaryGradient: ['#6366F1', '#EC4899'] as const,
    secondaryGradient: ['#14B8A6', '#6366F1'] as const,
    goldGradient: ['#F59E0B', '#EC4899'] as const,
    glassGradient: ['rgba(30, 41, 59, 0.85)', 'rgba(15, 23, 42, 0.6)'] as const,
    neonGradient: ['#6366F1', '#14B8A6'] as const,

    tabBarBackground: 'rgba(15, 23, 42, 0.9)',
    tabBarBlur: true,
    cardGlow: 'rgba(99, 102, 241, 0.12)',
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
