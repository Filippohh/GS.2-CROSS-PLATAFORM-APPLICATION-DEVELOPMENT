import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PredictiveAlert } from '../types';
import { colors } from '../theme/colors';
import { RiskBadge } from './RiskBadge';
import { ConfidenceMeter } from './ConfidenceMeter';
import { CustomButton } from './CustomButton';

interface PredictiveAlertCardProps {
  alert: PredictiveAlert;
  onAcknowledge?: (alertId: string) => void;
  onSimulateAction?: (alert: PredictiveAlert) => void;
}

export const PredictiveAlertCard: React.FC<PredictiveAlertCardProps> = ({
  alert,
  onAcknowledge,
  onSimulateAction,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const getDimensionIcon = (): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (alert.dimension) {
      case 'Água':
        return 'water';
      case 'Energia':
        return 'flash';
      case 'Clima':
        return 'weather-partly-cloudy';
      case 'Resíduos':
        return 'trash-can';
      case 'Serviços':
      default:
        return 'hospital-building';
    }
  };

  const isAcknowledged = alert.status === 'Reconhecido';

  return (
    <View
      style={[styles.card, isAcknowledged && styles.cardAcknowledged]}
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel={`Alerta preditivo de ${alert.dimension}: ${alert.title}, Severidade ${alert.severity}, Confiança ${alert.confidenceScore}%`}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.dimensionIconBox}>
            <MaterialCommunityIcons name={getDimensionIcon()} size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.dimensionLabel}>{alert.dimension.toUpperCase()}</Text>
            <Text style={styles.timeHorizonText}>{alert.timeHorizon}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <RiskBadge level={alert.severity} size="sm" />
          {isAcknowledged && (
            <View style={styles.ackBadge}>
              <Text style={styles.ackBadgeText}>RECONHECIDO</Text>
            </View>
          )}
        </View>
      </View>

      {/* Title & Summary */}
      <Text style={styles.title}>{alert.title}</Text>
      <Text style={styles.summary}>{alert.summary}</Text>

      {/* Confidence Meter (Requisito Explícito) */}
      <ConfidenceMeter score={alert.confidenceScore} />

      {/* Expand/Collapse Justification & Limitations */}
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.expandToggle}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={isExpanded ? 'Recolher detalhes explicativos' : 'Expandir justificativa e limitações do modelo'}
      >
        <Text style={styles.expandToggleText}>
          {isExpanded ? 'Ocultar Justificativa & Limitações' : 'Ver Justificativa & Limitações do Modelo'}
        </Text>
        <MaterialCommunityIcons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.accent}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.expandedSection}>
          {/* Justificativa Técnica do Modelo */}
          <View style={styles.infoBlock}>
            <View style={styles.infoBlockHeader}>
              <MaterialCommunityIcons name="brain" size={16} color={colors.primary} />
              <Text style={styles.infoBlockTitle}>Justificativa Algorítmica:</Text>
            </View>
            <Text style={styles.infoBlockContent}>{alert.justification}</Text>
          </View>

          {/* Limitações do Modelo (Requisito Crítico para Apoio à Decisão Humana) */}
          <View style={[styles.infoBlock, styles.limitationsBlock]}>
            <View style={styles.infoBlockHeader}>
              <MaterialCommunityIcons name="alert-circle-outline" size={16} color={colors.riskHigh} />
              <Text style={[styles.infoBlockTitle, { color: colors.riskHigh }]}>
                Limitações Conhecidas do Modelo:
              </Text>
            </View>
            <Text style={styles.limitationsContent}>{alert.limitations}</Text>
            <Text style={styles.humanLoopNotice}>
              * Sistema de auxílio à decisão humana: a autorização final depende da avaliação do gestor público responsável.
            </Text>
          </View>

          {/* Ação Recomendada */}
          <View style={styles.actionBlock}>
            <Text style={styles.actionBlockTitle}>Ação Recomendada (Não impositiva):</Text>
            <Text style={styles.actionBlockContent}>{alert.recommendedAction}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            {onSimulateAction && (
              <CustomButton
                title="Simular Ação no Painel"
                size="sm"
                variant="secondary"
                iconName="chart-timeline-variant"
                onPress={() => onSimulateAction(alert)}
                style={{ flex: 1, marginRight: 8 }}
              />
            )}

            {!isAcknowledged && onAcknowledge && (
              <CustomButton
                title="Ciente / Reconhecer"
                size="sm"
                variant="outline"
                iconName="check"
                onPress={() => onAcknowledge(alert.id)}
                style={{ flex: 1 }}
              />
            )}
          </View>
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
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardAcknowledged: {
    borderColor: '#CBD5E1',
    backgroundColor: '#FAFBFD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dimensionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  dimensionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  timeHorizonText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ackBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ackBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  summary: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  expandToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 6,
  },
  expandToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
    marginRight: 4,
  },
  expandedSection: {
    marginTop: 8,
    paddingTop: 8,
  },
  infoBlock: {
    backgroundColor: colors.surfaceSubtle,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  limitationsBlock: {
    backgroundColor: colors.riskModerateBg,
    borderColor: colors.riskModerateBorder,
    borderWidth: 1,
  },
  infoBlockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  infoBlockTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  infoBlockContent: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  limitationsContent: {
    fontSize: 12,
    color: '#8A5300',
    lineHeight: 17,
  },
  humanLoopNotice: {
    fontSize: 10.5,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 6,
  },
  actionBlock: {
    backgroundColor: colors.accentLight,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  actionBlockTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accentDark,
    marginBottom: 3,
  },
  actionBlockContent: {
    fontSize: 12,
    color: colors.accentDark,
    lineHeight: 17,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
});
