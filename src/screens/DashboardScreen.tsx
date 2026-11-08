import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTerritory } from '../context/TerritoryContext';
import { colors } from '../theme/colors';
import { StatCard } from '../components/StatCard';
import { RiskBadge } from '../components/RiskBadge';
import { MiniChart } from '../components/MiniChart';
import { PredictiveAlertCard } from '../components/PredictiveAlertCard';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const {
    selectedTerritory,
    metrics,
    historicalData,
    alerts,
    isLoading,
    isRefreshing,
    refreshData,
    acknowledgeAlert,
    highContrastMode,
  } = useTerritory();

  const activeAlerts = alerts.filter(
    (a) =>
      selectedTerritory.id === 'sp_geral' ||
      a.territoryId === selectedTerritory.id ||
      a.territoryId === 'sp_geral'
  );

  const criticalAlertsCount = activeAlerts.filter(
    (a) => (a.severity === 'Crítico' || a.severity === 'Alto') && a.status === 'Ativo'
  ).length;

  return (
    <ScrollView
      style={[styles.container, highContrastMode && styles.containerHighContrast]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refreshData}
          colors={[colors.accent]}
          tintColor={colors.accent}
        />
      }
    >
      {/* Territory Overview Banner */}
      <View style={styles.bannerCard}>
        <View style={styles.bannerTop}>
          <View>
            <Text style={styles.bannerTerritoryType}>{selectedTerritory.type.toUpperCase()}</Text>
            <Text style={styles.bannerTitle}>{selectedTerritory.name}</Text>
          </View>
          <View style={styles.vulnScoreBox}>
            <Text style={styles.vulnScoreNum}>{selectedTerritory.vulnerabilityIndex}</Text>
            <Text style={styles.vulnScoreLabel}>Índice Vulnerabilidade</Text>
          </View>
        </View>

        <View style={styles.bannerStatsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="account-group" size={16} color={colors.accent} />
            <Text style={styles.statText}>
              {selectedTerritory.population.toLocaleString('pt-BR')} munícipes
            </Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="vector-square" size={16} color={colors.accent} />
            <Text style={styles.statText}>{selectedTerritory.areaKm2} km²</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="alert-octagon" size={16} color={colors.riskHigh} />
            <Text style={styles.statText}>Foco: {selectedTerritory.dominantRisk}</Text>
          </View>
        </View>
      </View>

      {/* Critical Status Alert Header */}
      {criticalAlertsCount > 0 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Alertas')}
          style={styles.attentionBanner}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Atenção gestor: existem ${criticalAlertsCount} alertas críticos que exigem decisão humana. Toque para ver.`}
        >
          <MaterialCommunityIcons name="alert-decagram" size={24} color={colors.riskCritical} />
          <View style={styles.attentionTextWrap}>
            <Text style={styles.attentionTitle}>
              {criticalAlertsCount} {criticalAlertsCount === 1 ? 'Alerta Crítico Requer' : 'Alertas Críticos Requerem'} Decisão
            </Text>
            <Text style={styles.attentionSub}>
              Toque para abrir a lista detalhada com justificativas técnicas e limitações.
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.riskCritical} />
        </TouchableOpacity>
      )}

      {/* Loading state */}
      {isLoading && !metrics ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Coletando telemetria e conectando à Open-Meteo API...</Text>
        </View>
      ) : metrics ? (
        <>
          {/* Section: Hídrico & Energético */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="water-pump" size={20} color={colors.dimensionWater} />
            <Text style={styles.sectionTitle}>Segurança Hídrica & Rede de Distribuição</Text>
          </View>
          <View style={styles.cardsRow}>
            <StatCard
              title="Reservatório Local"
              value={metrics.water.reservoirLevelPercent}
              unit="%"
              iconName="water"
              iconColor={colors.dimensionWater}
              status={metrics.water.status}
              subtitle="Capacidade de reserva"
            />
            <StatCard
              title="Pressão na Rede"
              value={metrics.water.networkPressureBar}
              unit="bar"
              iconName="gauge"
              iconColor={colors.dimensionWater}
              status={metrics.water.networkPressureBar < 1.5 ? 'critico' : 'normal'}
              subtitle="Média dos manômetros"
            />
          </View>

          {/* Section: Rede Elétrica */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="lightning-bolt" size={20} color={colors.dimensionEnergy} />
            <Text style={styles.sectionTitle}>Estabilidade e Demanda Energética</Text>
          </View>
          <View style={styles.cardsRow}>
            <StatCard
              title="Carga da Subestação"
              value={metrics.energy.gridLoadPercent}
              unit="%"
              iconName="transmission-tower"
              iconColor={colors.dimensionEnergy}
              status={metrics.energy.status}
              subtitle="Capacidade nominal"
            />
            <StatCard
              title="Estresse Térmico"
              value={metrics.energy.transformerStressIndex}
              unit="/100"
              iconName="thermometer-alert"
              iconColor={colors.dimensionEnergy}
              status={metrics.energy.transformerStressIndex > 80 ? 'critico' : 'normal'}
              subtitle="Sobreaquecimento em transformadores"
            />
          </View>

          {/* Section: Clima em Tempo Real (Open-Meteo API) */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="weather-partly-cloudy" size={20} color={colors.dimensionClimate} />
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.sectionTitle}>Clima Local em Tempo Real</Text>
              <View style={styles.apiBadge}>
                <View style={styles.apiDot} />
                <Text style={styles.apiBadgeText}>{metrics.climate.source}</Text>
              </View>
            </View>
          </View>
          <View style={styles.cardsRow}>
            <StatCard
              title="Temperatura"
              value={metrics.climate.temperatureC}
              unit="°C"
              iconName="thermometer"
              iconColor={colors.dimensionClimate}
              subtitle={`Umidade: ${metrics.climate.relativeHumidityPercent}%`}
            />
            <StatCard
              title="Precipitação 24h"
              value={metrics.climate.rainfallMm24h}
              unit="mm"
              iconName="weather-rainy"
              iconColor={colors.dimensionClimate}
              subtitle={`Vento: ${metrics.climate.windSpeedKmh} km/h`}
            />
          </View>

          {/* Section: Resíduos e Demanda de Serviços */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.dimensionWaste} />
            <Text style={styles.sectionTitle}>Gestão de Resíduos & Serviços Públicos</Text>
          </View>
          <View style={styles.cardsRow}>
            <StatCard
              title="Lotação de Ecopontos"
              value={metrics.waste.binsFillAveragePercent}
              unit="%"
              iconName="trash-can"
              iconColor={colors.dimensionWaste}
              status={metrics.waste.status}
              subtitle={`${metrics.waste.overdueCollectionRoutes} rotas atrasadas`}
            />
            <StatCard
              title="Fila Média nas UBS"
              value={metrics.services.healthCenterWaitHours}
              unit="horas"
              iconName="hospital-box"
              iconColor={colors.dimensionServices}
              status={metrics.services.status}
              subtitle={`${metrics.services.citizenReports24h} relatos/dia`}
            />
          </View>

          {/* Interactive Historical & Trend Chart */}
          <MiniChart data={historicalData} />

          {/* Highlight Top Predictive Alert */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="shield-alert-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Alerta Preditivo em Evidência</Text>
          </View>

          {activeAlerts.length > 0 ? (
            <PredictiveAlertCard
              alert={activeAlerts[0]}
              onAcknowledge={acknowledgeAlert}
              onSimulateAction={() => navigation.navigate('Decisão')}
            />
          ) : (
            <View style={styles.noAlertsBox}>
              <MaterialCommunityIcons name="check-all" size={32} color={colors.riskStable} />
              <Text style={styles.noAlertsText}>
                Nenhum alerta crítico ativo para este território no momento.
              </Text>
            </View>
          )}
        </>
      ) : null}
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
  bannerCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  bannerTerritoryType: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accentLight,
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
    maxWidth: 210,
  },
  vulnScoreBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  vulnScoreNum: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  vulnScoreLabel: {
    fontSize: 9,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  bannerStatsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  attentionBanner: {
    backgroundColor: colors.riskCriticalBg,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.riskCriticalBorder,
  },
  attentionTextWrap: {
    flex: 1,
    marginLeft: 10,
    marginRight: 6,
  },
  attentionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.riskCritical,
  },
  attentionSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 8,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  apiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 5,
  },
  apiDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0284C7',
  },
  apiBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0369A1',
  },
  cardsRow: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  loadingBox: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  noAlertsBox: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  noAlertsText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});
