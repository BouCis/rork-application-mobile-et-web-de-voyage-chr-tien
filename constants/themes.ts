export type ThemeType = 'neo-travel-dark' | 'sunny-voyage' | 'minimal-light' | 'liquid-glass' | 'midnight-glow' | 'system';

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
  
  background: string;
  backgroundDark: string;
  backgroundLight: string;
  surface: string;
  surfaceSecondary: string;
  surfaceElevated: string;
  
  text: string;
  textSecondary: string;
  textLight: string;
  textMuted: string;
  textInverse: string;
  white: string;
  
  border: string;
  borderLight: string;
  
  success: string;
  warning: string;
  error: string;
  info: string;
  
  dove: string;
  spiritual: string;
  
  primaryGradient: readonly [string, string];
  secondaryGradient: readonly [string, string];
  goldenGradient: readonly [string, string];
  spiritualGradient: readonly [string, string, string];
  darkGradient: readonly [string, string];
  
  tabBarBackground?: string;
  tabBarBlur?: boolean;
  cardGlow?: string;
  glassEffect?: boolean;
}

export interface Theme {
  id: ThemeType;
  name: string;
  description: string;
  icon: string;
  colors: ThemeColors;
  isDark: boolean;
}

const neoTravelDark: Theme = {
  id: 'neo-travel-dark',
  name: 'Neo-Travel Dark',
  description: 'Élégant, sombre, premium',
  icon: '🌙',
  isDark: true,
  colors: {
    primary: '#6C63FF',
    primaryLight: '#8B83FF',
    primaryDark: '#5548E6',
    
    secondary: '#009FFD',
    secondaryLight: '#33B4FF',
    secondaryDark: '#0088DB',
    
    accent: '#00C2BA',
    accentLight: '#33CFCA',
    accentDark: '#00A89F',
    
    background: '#0D0D12',
    backgroundDark: '#05050A',
    backgroundLight: '#1A1A24',
    surface: '#1A1A24',
    surfaceSecondary: '#252535',
    surfaceElevated: '#2D2D40',
    
    text: '#EAEAEA',
    textSecondary: '#B0B0C5',
    textLight: '#8A8A9F',
    textMuted: 'rgba(234, 234, 234, 0.3)',
    textInverse: '#0D0D12',
    white: '#FFFFFF',
    
    border: '#2D2D40',
    borderLight: '#3A3A50',
    
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    dove: '#E8E8E8',
    spiritual: '#8B7355',
    
    primaryGradient: ['#6C63FF', '#009FFD'] as const,
    secondaryGradient: ['#009FFD', '#6C63FF'] as const,
    goldenGradient: ['#F59E0B', '#EC4899'] as const,
    spiritualGradient: ['#6C63FF', '#8B7355', '#D4AF37'] as const,
    darkGradient: ['#0D0D12', '#1A1A24'] as const,
    
    tabBarBackground: 'rgba(26, 26, 36, 0.85)',
    tabBarBlur: true,
    cardGlow: 'rgba(108, 99, 255, 0.15)',
  },
};

const sunnyVoyage: Theme = {
  id: 'sunny-voyage',
  name: 'Sunny Voyage',
  description: 'Lumineux, joyeux, inspiré des vacances',
  icon: '☀️',
  isDark: false,
  colors: {
    primary: '#FF6F61',
    primaryLight: '#FF8A7F',
    primaryDark: '#E65A4D',
    
    secondary: '#00C2BA',
    secondaryLight: '#33CFCA',
    secondaryDark: '#00A89F',
    
    accent: '#FFB347',
    accentLight: '#FFC266',
    accentDark: '#E6A03D',
    
    background: '#FAFAFA',
    backgroundDark: '#F0F0F0',
    backgroundLight: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceSecondary: '#F5F5F5',
    surfaceElevated: '#FFFFFF',
    
    text: '#2C2C2C',
    textSecondary: '#5A5A5A',
    textLight: '#8A8A8A',
    textMuted: 'rgba(44, 44, 44, 0.3)',
    textInverse: '#FFFFFF',
    white: '#FFFFFF',
    
    border: '#E5E5E5',
    borderLight: '#D0D0D0',
    
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    dove: '#2C2C2C',
    spiritual: '#8B7355',
    
    primaryGradient: ['#FF6F61', '#FFB347'] as const,
    secondaryGradient: ['#00C2BA', '#FF6F61'] as const,
    goldenGradient: ['#FFB347', '#FF6F61'] as const,
    spiritualGradient: ['#FF6F61', '#8B7355', '#D4AF37'] as const,
    darkGradient: ['#F0F0F0', '#FAFAFA'] as const,
    
    tabBarBackground: '#FFFFFF',
    tabBarBlur: false,
  },
};

const minimalLight: Theme = {
  id: 'minimal-light',
  name: 'Minimal Light',
  description: 'Épuré, professionnel, tech',
  icon: '⚪️',
  isDark: false,
  colors: {
    primary: '#007AFF',
    primaryLight: '#3395FF',
    primaryDark: '#0062CC',
    
    secondary: '#5856D6',
    secondaryLight: '#7C7AE0',
    secondaryDark: '#4644AD',
    
    accent: '#34C759',
    accentLight: '#5DD57D',
    accentDark: '#28A745',
    
    background: '#FFFFFF',
    backgroundDark: '#F5F5F7',
    backgroundLight: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceSecondary: '#F9F9F9',
    surfaceElevated: '#FFFFFF',
    
    text: '#1B1B1B',
    textSecondary: '#6E6E73',
    textLight: '#8E8E93',
    textMuted: 'rgba(27, 27, 27, 0.3)',
    textInverse: '#FFFFFF',
    white: '#FFFFFF',
    
    border: '#E5E5EA',
    borderLight: '#D1D1D6',
    
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#007AFF',
    
    dove: '#1B1B1B',
    spiritual: '#8B7355',
    
    primaryGradient: ['#007AFF', '#5856D6'] as const,
    secondaryGradient: ['#5856D6', '#007AFF'] as const,
    goldenGradient: ['#FF9500', '#FF3B30'] as const,
    spiritualGradient: ['#007AFF', '#8B7355', '#D4AF37'] as const,
    darkGradient: ['#F5F5F7', '#FFFFFF'] as const,
    
    tabBarBackground: '#FFFFFF',
    tabBarBlur: false,
  },
};

const liquidGlass: Theme = {
  id: 'liquid-glass',
  name: 'LiquidGlass',
  description: 'Translucide, fluide, futuriste',
  icon: '💎',
  isDark: true,
  colors: {
    primary: '#A78BFA',
    primaryLight: '#C4B5FD',
    primaryDark: '#8B5CF6',
    
    secondary: '#60A5FA',
    secondaryLight: '#93C5FD',
    secondaryDark: '#3B82F6',
    
    accent: '#34D399',
    accentLight: '#6EE7B7',
    accentDark: '#10B981',
    
    background: 'rgba(15, 15, 20, 0.7)',
    backgroundDark: 'rgba(5, 5, 10, 0.8)',
    backgroundLight: 'rgba(30, 30, 40, 0.6)',
    surface: 'rgba(30, 30, 40, 0.5)',
    surfaceSecondary: 'rgba(45, 45, 60, 0.4)',
    surfaceElevated: 'rgba(60, 60, 80, 0.35)',
    
    text: '#F5F5F7',
    textSecondary: '#D1D1D6',
    textLight: '#A1A1A6',
    textMuted: 'rgba(245, 245, 247, 0.3)',
    textInverse: '#0F0F14',
    white: '#FFFFFF',
    
    border: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(255, 255, 255, 0.15)',
    
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
    
    dove: '#F5F5F7',
    spiritual: '#C4B5A0',
    
    primaryGradient: ['#A78BFA', '#60A5FA'] as const,
    secondaryGradient: ['#60A5FA', '#34D399'] as const,
    goldenGradient: ['#FBBF24', '#F87171'] as const,
    spiritualGradient: ['#A78BFA', '#C4B5A0', '#FCD34D'] as const,
    darkGradient: ['rgba(15, 15, 20, 0.7)', 'rgba(30, 30, 40, 0.6)'] as const,
    
    tabBarBackground: 'rgba(30, 30, 40, 0.4)',
    tabBarBlur: true,
    glassEffect: true,
  },
};

const midnightGlow: Theme = {
  id: 'midnight-glow',
  name: 'Midnight Glow',
  description: 'Sombre artistique avec touches néon',
  icon: '🌆',
  isDark: true,
  colors: {
    primary: '#A259FF',
    primaryLight: '#B67AFF',
    primaryDark: '#8B3FE6',
    
    secondary: '#00C4FF',
    secondaryLight: '#33D1FF',
    secondaryDark: '#00A8DB',
    
    accent: '#FF3D8E',
    accentLight: '#FF5DA3',
    accentDark: '#E62675',
    
    background: '#121212',
    backgroundDark: '#0A0A0A',
    backgroundLight: '#1E1E1E',
    surface: '#1E1E1E',
    surfaceSecondary: '#2A2A2A',
    surfaceElevated: '#353535',
    
    text: '#E0E0E0',
    textSecondary: '#B0B0B0',
    textLight: '#808080',
    textMuted: 'rgba(224, 224, 224, 0.3)',
    textInverse: '#121212',
    white: '#FFFFFF',
    
    border: '#2A2A2A',
    borderLight: '#3A3A3A',
    
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    dove: '#E0E0E0',
    spiritual: '#C4B5A0',
    
    primaryGradient: ['#A259FF', '#FF3D8E'] as const,
    secondaryGradient: ['#00C4FF', '#A259FF'] as const,
    goldenGradient: ['#F59E0B', '#FF3D8E'] as const,
    spiritualGradient: ['#A259FF', '#C4B5A0', '#FCD34D'] as const,
    darkGradient: ['#121212', '#1E1E1E'] as const,
    
    tabBarBackground: 'rgba(30, 30, 30, 0.9)',
    tabBarBlur: true,
    cardGlow: 'rgba(162, 89, 255, 0.2)',
  },
};

export const themes: Record<Exclude<ThemeType, 'system'>, Theme> = {
  'neo-travel-dark': neoTravelDark,
  'sunny-voyage': sunnyVoyage,
  'minimal-light': minimalLight,
  'liquid-glass': liquidGlass,
  'midnight-glow': midnightGlow,
};

export const themesList: Theme[] = Object.values(themes);

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
  full: 9999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  hero: 40,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  }),
};

export const animation = {
  fast: 150,
  normal: 250,
  slow: 350,
};
