import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { RiskBadge } from './RiskBadge';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor?: string;
  status?: 'normal' | 'alerta' | 'critico' | 'baixo' | 'extremo';
  subtitle?: string;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  iconName,
  iconColor = colors.accent,
  status,
  subtitle,
}) => {
  return (
    <View
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel={`${title}: ${value} ${unit || ''}. ${subtitle || ''}`}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
          <MaterialCommunityIcons name={iconName} size={22} color={iconColor} />
        </View>
        {status && <RiskBadge level={status} size="sm" />}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    flex: 1,
    minWidth: 150,
    margin: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  unit: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 4,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 6,
  },
});
