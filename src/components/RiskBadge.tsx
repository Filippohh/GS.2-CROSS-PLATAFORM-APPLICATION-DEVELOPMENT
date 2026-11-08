import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface RiskBadgeProps {
  level: 'Preventivo' | 'Moderado' | 'Alto' | 'Crítico' | 'normal' | 'alerta' | 'critico' | 'baixo' | 'extremo';
  size?: 'sm' | 'md';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const getBadgeStyle = () => {
    switch (level.toLowerCase()) {
      case 'crítico':
      case 'critico':
      case 'extremo':
        return {
          bg: colors.riskCriticalBg,
          text: colors.riskCritical,
          border: colors.riskCriticalBorder,
          label: 'CRÍTICO',
        };
      case 'alto':
        return {
          bg: colors.riskHighBg,
          text: colors.riskHigh,
          border: colors.riskHighBorder,
          label: 'ALTO RISCO',
        };
      case 'moderado':
      case 'alerta':
        return {
          bg: colors.riskModerateBg,
          text: colors.riskModerate,
          border: colors.riskModerateBorder,
          label: 'ATENÇÃO',
        };
      case 'preventivo':
      case 'baixo':
      case 'normal':
      default:
        return {
          bg: colors.riskStableBg,
          text: colors.riskStable,
          border: colors.riskStableBorder,
          label: 'ESTÁVEL',
        };
    }
  };

  const style = getBadgeStyle();
  const isSm = size === 'sm';

  return (
    <View
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`Nível de risco: ${style.label}`}
      style={[
        styles.badge,
        { backgroundColor: style.bg, borderColor: style.border },
        isSm ? styles.badgeSm : styles.badgeMd,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: style.text }]} />
      <Text style={[styles.text, { color: style.text }, isSm ? styles.textSm : styles.textMd]}>
        {style.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeMd: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeSm: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textMd: {
    fontSize: 11,
  },
  textSm: {
    fontSize: 9.5,
  },
});
