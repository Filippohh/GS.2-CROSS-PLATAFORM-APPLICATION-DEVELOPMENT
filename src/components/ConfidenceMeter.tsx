import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface ConfidenceMeterProps {
  score: number; // 0 to 100
  label?: string;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ score, label = 'Nível de Confiança Preditiva' }) => {
  const getColor = () => {
    if (score >= 85) return colors.riskStable;
    if (score >= 70) return colors.riskModerate;
    return colors.riskCritical;
  };

  const getQualitativeText = () => {
    if (score >= 85) return 'Alta precisão estatística';
    if (score >= 70) return 'Moderada / Sensível a ruídos';
    return 'Baixa / Requer validação em campo';
  };

  const barColor = getColor();

  return (
    <View
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${score}%, ${getQualitativeText()}`}
      style={styles.container}
    >
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.percentage, { color: barColor }]}>{score}%</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, score))}%`, backgroundColor: barColor }]} />
      </View>

      <Text style={styles.subtext}>{getQualitativeText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  percentage: {
    fontSize: 13,
    fontWeight: '700',
  },
  track: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  subtext: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});
