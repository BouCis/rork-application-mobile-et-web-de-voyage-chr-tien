export const theme = {
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
    
    background: '#0F172A',
    backgroundDark: '#020617',
    backgroundLight: '#1E293B',
    surface: '#1E293B',
    surfaceSecondary: '#334155',
    surfaceElevated: '#334155',
    
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textLight: '#94A3B8',
    textMuted: 'rgba(255, 255, 255, 0.3)',
    textInverse: '#0F172A',
    white: '#FFFFFF',
    
    border: '#334155',
    borderLight: '#475569',
    
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    dove: '#E8E8E8',
    spiritual: '#8B7355',
    
    primaryGradient: ['#6366F1', '#EC4899'] as const,
    secondaryGradient: ['#14B8A6', '#6366F1'] as const,
    goldenGradient: ['#F59E0B', '#EC4899'] as const,
    spiritualGradient: ['#6366F1', '#8B7355', '#D4AF37'] as const,
    darkGradient: ['#0F172A', '#1E293B'] as const,
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
    huge: 120,
  },
  
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    hero: 40,
  },
  
  fontWeight: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  
  shadows: {
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
  },
  
  animation: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
};
