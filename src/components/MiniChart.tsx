import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { HistoricalDataPoint } from '../types';

interface MiniChartProps {
  data: HistoricalDataPoint[];
}

type MetricKey = 'waterStress' | 'energyDemand' | 'wasteVolume' | 'rainfall';

interface MetricOption {
  key: MetricKey;
  label: string;
  color: string;
  unit: string;
}

const OPTIONS: MetricOption[] = [
  { key: 'waterStress', label: 'Estresse Hídrico', color: colors.dimensionWater, unit: '%' },
  { key: 'energyDemand', label: 'Demanda Elétrica', color: colors.dimensionEnergy, unit: '%' },
  { key: 'wasteVolume', label: 'Resíduos Coletados', color: colors.dimensionWaste, unit: '%' },
  { key: 'rainfall', label: 'Chuva Acumulada', color: colors.dimensionClimate, unit: 'mm' },
];

export const MiniChart: React.FC<MiniChartProps> = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('waterStress');
  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);

  const activeOption = OPTIONS.find((o) => o.key === selectedMetric) || OPTIONS[0];

  const values = data.map((d) => d[selectedMetric]);
  const maxValue = Math.max(...values, 10);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico e Tendência Preditiva (7 Dias)</Text>
        <Text style={styles.subtitle}>Toque nas barras para ver detalhes do dia</Text>
      </View>

      {/* Metric Selector Tabs */}
      <View style={styles.tabsRow}>
        {OPTIONS.map((opt) => {
          const isSelected = opt.key === selectedMetric;
          return (
            <TouchableOpacity
              key={opt.key}
              onPress={() => {
                setSelectedMetric(opt.key);
                setActiveDayIndex(null);
              }}
              style={[
                styles.tabButton,
                isSelected && { backgroundColor: `${opt.color}18`, borderColor: opt.color },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Filtrar gráfico por ${opt.label}`}
            >
              <Text
                style={[
                  styles.tabText,
                  isSelected && { color: opt.color, fontWeight: '700' },
                ]}
              >
                {opt.label.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Chart Display */}
      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const val = item[selectedMetric];
          const heightPercent = Math.max(8, Math.round((val / maxValue) * 100));
          const isSelected = activeDayIndex === index;

          return (
            <TouchableOpacity
              key={item.day}
              onPress={() => setActiveDayIndex(isSelected ? null : index)}
              style={styles.columnWrapper}
              accessible={true}
              accessibilityLabel={`${item.day}: ${val} ${activeOption.unit}`}
            >
              <Text style={styles.valueAboveBar}>
                {isSelected || index === data.length - 1 ? `${val}` : ''}
              </Text>

              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${heightPercent}%`,
                      backgroundColor: isSelected ? colors.primaryDark : activeOption.color,
                      opacity: isSelected ? 1 : 0.85,
                    },
                  ]}
                />
              </View>

              <Text style={[styles.dayLabel, isSelected && styles.dayLabelActive]}>
                {item.day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Active Day Detail Callout */}
      {activeDayIndex !== null && (
        <View style={styles.detailCallout}>
          <Text style={styles.calloutText}>
            <Text style={{ fontWeight: '700' }}>{data[activeDayIndex].day}: </Text>
            {activeOption.label} atingiu {data[activeDayIndex][selectedMetric]} {activeOption.unit}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tabsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 6,
    flexWrap: 'wrap',
  },
  tabButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSubtle,
  },
  tabText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 140,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 4,
  },
  columnWrapper: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  valueAboveBar: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
    height: 14,
  },
  barTrack: {
    width: 22,
    height: 90,
    backgroundColor: '#EDF2F7',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 6,
  },
  dayLabelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  detailCallout: {
    marginTop: 12,
    padding: 8,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 8,
    alignItems: 'center',
  },
  calloutText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
});
