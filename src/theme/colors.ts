export const colors = {
  primary: '#0F2942',        // Deep GovTech Navy
  primaryLight: '#1B3F63',
  primaryDark: '#091A2B',
  accent: '#00838F',         // Smart City Cyan/Teal
  accentLight: '#E0F7FA',
  accentDark: '#006064',
  
  background: '#F4F7FA',     // Soft accessible light grey-blue
  surface: '#FFFFFF',
  surfaceSubtle: '#F0F4F8',
  
  textPrimary: '#102A43',    // High-contrast readable dark navy
  textSecondary: '#486581',  // Muted readable grey
  textMuted: '#829AB1',
  textInverse: '#FFFFFF',
  
  // Severity / Risk Indicator Colors
  riskCritical: '#D32F2F',   // Vermelho Crítico
  riskCriticalBg: '#FFEBEE',
  riskCriticalBorder: '#FFCDD2',
  
  riskHigh: '#E65100',       // Laranja Alerta Alto
  riskHighBg: '#FFF3E0',
  riskHighBorder: '#FFE0B2',
  
  riskModerate: '#F57F17',   // Âmbar Moderado
  riskModerateBg: '#FFFDE7',
  riskModerateBorder: '#FFF9C4',
  
  riskStable: '#2E7D32',     // Verde Estável / Seguro
  riskStableBg: '#E8F5E9',
  riskStableBorder: '#C8E6C9',
  
  // Dimensional Colors
  dimensionWater: '#0288D1',
  dimensionEnergy: '#F57C00',
  dimensionClimate: '#00897B',
  dimensionWaste: '#6D4C41',
  dimensionServices: '#7B1FA2',
  
  border: '#D9E2EC',
  borderFocus: '#00838F',
  borderError: '#D32F2F',
  
  shadowColor: '#0A2540',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  heading1: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.textPrimary,
  },
  heading2: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.textPrimary,
  },
  heading3: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
  },
};
