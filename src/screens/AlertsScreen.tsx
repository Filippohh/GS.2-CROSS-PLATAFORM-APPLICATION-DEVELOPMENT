import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTerritory } from '../context/TerritoryContext';
import { colors } from '../theme/colors';
import { PredictiveAlertCard } from '../components/PredictiveAlertCard';
import { PredictiveAlert } from '../types';

interface AlertsScreenProps {
  navigation: any;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({ navigation }) => {
  const { alerts, selectedTerritory, acknowledgeAlert, highContrastMode } = useTerritory();
  const [selectedDimension, setSelectedDimension] = useState<string>('Todas');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('Todas');

  const dimensions = ['Todas', 'Água', 'Energia', 'Clima', 'Resíduos', 'Serviços'];
  const severities = ['Todas', 'Crítico', 'Alto', 'Moderado', 'Preventivo'];

  // Filter alerts by current territory, dimension and severity
  const filteredAlerts = alerts.filter((alert) => {
    const matchesTerritory =
      selectedTerritory.id === 'sp_geral' ||
      alert.territoryId === selectedTerritory.id ||
      alert.territoryId === 'sp_geral';

    const matchesDimension =
      selectedDimension === 'Todas' || alert.dimension === selectedDimension;

    const matchesSeverity =
      selectedSeverity === 'Todas' || alert.severity === selectedSeverity;

    return matchesTerritory && matchesDimension && matchesSeverity;
  });

  return (
    <ScrollView
      style={[styles.container, highContrastMode && styles.containerHighContrast]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Informative Guidance Card */}
      <View style={styles.guidanceCard}>
        <View style={styles.guidanceTop}>
          <MaterialCommunityIcons name="information" size={20} color={colors.accent} />
          <Text style={styles.guidanceTitle}>Inteligência Preditiva Responsável</Text>
        </View>
        <Text style={styles.guidanceText}>
          Os alertas são gerados por cruzamento de telemetria histórica e clima em tempo real.
          Cada alerta explicita a <Text style={{ fontWeight: '700' }}>justificativa técnica</Text>, o{' '}
          <Text style={{ fontWeight: '700' }}>nível de confiança estatística</Text> e as{' '}
          <Text style={{ fontWeight: '700' }}>limitações do modelo</Text>, preservando a soberania da
          decisão do gestor público.
        </Text>
      </View>

      {/* Dimension Filters */}
      <Text style={styles.filterGroupTitle}>Filtrar por Eixo Temático:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {dimensions.map((dim) => {
          const isSelected = selectedDimension === dim;
          return (
            <TouchableOpacity
              key={dim}
              onPress={() => setSelectedDimension(dim)}
              style={[styles.filterChip, isSelected && styles.filterChipActive]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Filtrar por eixo ${dim}`}
            >
              <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                {dim}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Severity Filters */}
      <Text style={styles.filterGroupTitle}>Filtrar por Severidade:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {severities.map((sev) => {
          const isSelected = selectedSeverity === sev;
          return (
            <TouchableOpacity
              key={sev}
              onPress={() => setSelectedSeverity(sev)}
              style={[styles.filterChip, isSelected && styles.filterChipActive]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Filtrar por severidade ${sev}`}
            >
              <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                {sev}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredAlerts.length} {filteredAlerts.length === 1 ? 'alerta preditivo encontrado' : 'alertas preditivos encontrados'}
        </Text>
        <Text style={styles.resultsTerritory}>
          Território: {selectedTerritory.name.split('-')[0]}
        </Text>
      </View>

      {/* Alerts List */}
      {filteredAlerts.length > 0 ? (
        filteredAlerts.map((alert: PredictiveAlert) => (
          <PredictiveAlertCard
            key={alert.id}
            alert={alert}
            onAcknowledge={acknowledgeAlert}
            onSimulateAction={() => navigation.navigate('Decisão')}
          />
        ))
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="shield-check" size={48} color={colors.riskStable} />
          <Text style={styles.emptyTitle}>Nenhum alerta para o filtro atual</Text>
          <Text style={styles.emptySubtitle}>
            Tente selecionar outro eixo ou alterar o território no cabeçalho superior.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerHighContrast: {
    backgroundColor: '#000000',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  guidanceCard: {
    backgroundColor: colors.accentLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#B2EBF2',
  },
  guidanceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  guidanceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accentDark,
  },
  guidanceText: {
    fontSize: 12,
    color: colors.accentDark,
    lineHeight: 18,
  },
  filterGroupTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
    marginTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 2,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  resultsTerritory: {
    fontSize: 11,
    color: colors.textMuted,
  },
  emptyState: {
    backgroundColor: colors.surface,
    padding: 32,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
