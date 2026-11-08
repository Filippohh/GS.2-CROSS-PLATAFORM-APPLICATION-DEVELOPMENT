import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Territory,
  TerritoryId,
  MetricDimension,
  PredictiveAlert,
  TerritoryIntervention,
  HistoricalDataPoint
} from '../types';
import {
  TERRITORIES,
  getTerritoryMetrics,
  INITIAL_PREDICTIVE_ALERTS,
  getHistoricalData
} from '../api/territorialDataService';

const STORAGE_KEY_INTERVENTIONS = '@citizentech_interventions_v1';
const STORAGE_KEY_ACKNOWLEDGED = '@citizentech_acknowledged_alerts_v1';
const STORAGE_KEY_PREFS = '@citizentech_user_preferences_v1';

interface TerritoryContextData {
  territories: Territory[];
  selectedTerritoryId: TerritoryId;
  selectedTerritory: Territory;
  metrics: MetricDimension | null;
  historicalData: HistoricalDataPoint[];
  alerts: PredictiveAlert[];
  interventions: TerritoryIntervention[];
  isLoading: boolean;
  isRefreshing: boolean;
  highContrastMode: boolean;
  setSelectedTerritoryId: (id: TerritoryId) => void;
  refreshData: () => Promise<void>;
  registerIntervention: (data: Omit<TerritoryIntervention, 'id' | 'createdAt'>) => Promise<boolean>;
  updateInterventionStatus: (id: string, status: TerritoryIntervention['status']) => Promise<void>;
  acknowledgeAlert: (alertId: string) => Promise<void>;
  toggleHighContrast: () => Promise<void>;
}

const TerritoryContext = createContext<TerritoryContextData>({} as TerritoryContextData);

export const TerritoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<TerritoryId>('sp_geral');
  const [metrics, setMetrics] = useState<MetricDimension | null>(null);
  const [alerts, setAlerts] = useState<PredictiveAlert[]>(INITIAL_PREDICTIVE_ALERTS);
  const [interventions, setInterventions] = useState<TerritoryIntervention[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [highContrastMode, setHighContrastMode] = useState<boolean>(false);

  const selectedTerritory = TERRITORIES.find((t) => t.id === selectedTerritoryId) || TERRITORIES[0];
  const historicalData = getHistoricalData(selectedTerritoryId);

  // Carregar dados salvos no AsyncStorage ao inicializar
  useEffect(() => {
    loadPersistedData();
  }, []);

  // Quando o território muda, recarrega métricas
  useEffect(() => {
    fetchMetricsForTerritory(selectedTerritoryId);
  }, [selectedTerritoryId]);

  async function loadPersistedData() {
    try {
      const [savedInterventions, savedAcknowledged, savedPrefs] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_INTERVENTIONS),
        AsyncStorage.getItem(STORAGE_KEY_ACKNOWLEDGED),
        AsyncStorage.getItem(STORAGE_KEY_PREFS),
      ]);

      if (savedInterventions) {
        setInterventions(JSON.parse(savedInterventions));
      } else {
        // Inicializar com 2 intervenções exemplo pré-existentes
        const defaultInterventions: TerritoryIntervention[] = [
          {
            id: 'INT-2026-001',
            territoryId: 'sp_zona_leste',
            dimension: 'Água',
            title: 'Reforço de Adução Emergencial e Válvula Reguladora',
            severity: 'Crítico',
            impactedCitizens: 48000,
            budgetEstimatedBrl: 45000,
            technicalJustification: 'Queda de pressão acentuada na rede de distribuição secundária com risco de falta d\'água para 3 UBS.',
            responsibleAgency: 'Secretaria Municipal de Infraestrutura Hídrica / Sabesp',
            humanApprover: 'Gestor Regional Barreto',
            status: 'Em Execução',
            createdAt: '2026-11-07 14:20',
          },
          {
            id: 'INT-2026-002',
            territoryId: 'sp_centro',
            dimension: 'Resíduos',
            title: 'Operação Limpeza Noturna de Pontos Críticos Sé',
            severity: 'Alto',
            impactedCitizens: 85000,
            budgetEstimatedBrl: 18000,
            technicalJustification: 'Lixeiras inteligentes atingiram 95% de capacidade em vias de grande tráfego.',
            responsibleAgency: 'Amlurb / Autoridade de Limpeza Urbana',
            humanApprover: 'Gestor Picino',
            status: 'Concluída',
            createdAt: '2026-11-06 09:10',
          },
        ];
        setInterventions(defaultInterventions);
        await AsyncStorage.setItem(STORAGE_KEY_INTERVENTIONS, JSON.stringify(defaultInterventions));
      }

      if (savedAcknowledged) {
        const ackIds: string[] = JSON.parse(savedAcknowledged);
        setAlerts((prev) =>
          prev.map((alert) =>
            ackIds.includes(alert.id) ? { ...alert, status: 'Reconhecido' } : alert
          )
        );
      }

      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs);
        if (typeof prefs.highContrast === 'boolean') {
          setHighContrastMode(prefs.highContrast);
        }
        if (prefs.favoriteTerritory) {
          setSelectedTerritoryId(prefs.favoriteTerritory);
        }
      }
    } catch (e) {
      console.error('Erro ao ler AsyncStorage:', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchMetricsForTerritory(territoryId: TerritoryId) {
    try {
      setIsLoading(true);
      const data = await getTerritoryMetrics(territoryId);
      setMetrics(data);
    } catch (error) {
      console.error('Erro ao buscar telemetria:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshData() {
    setIsRefreshing(true);
    try {
      const data = await getTerritoryMetrics(selectedTerritoryId);
      setMetrics(data);
    } catch (e) {
      console.error('Erro ao atualizar dados:', e);
    } finally {
      setIsRefreshing(false);
    }
  }

  async function registerIntervention(data: Omit<TerritoryIntervention, 'id' | 'createdAt'>): Promise<boolean> {
    try {
      const newIntervention: TerritoryIntervention = {
        ...data,
        id: `INT-2026-${String(interventions.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      const updated = [newIntervention, ...interventions];
      setInterventions(updated);
      await AsyncStorage.setItem(STORAGE_KEY_INTERVENTIONS, JSON.stringify(updated));
      return true;
    } catch (err) {
      console.error('Erro ao salvar intervenção no AsyncStorage:', err);
      return false;
    }
  }

  async function updateInterventionStatus(id: string, status: TerritoryIntervention['status']) {
    const updated = interventions.map((item) => (item.id === id ? { ...item, status } : item));
    setInterventions(updated);
    await AsyncStorage.setItem(STORAGE_KEY_INTERVENTIONS, JSON.stringify(updated));
  }

  async function acknowledgeAlert(alertId: string) {
    try {
      const updatedAlerts = alerts.map((a) =>
        a.id === alertId ? { ...a, status: 'Reconhecido' as const } : a
      );
      setAlerts(updatedAlerts);

      const ackRaw = await AsyncStorage.getItem(STORAGE_KEY_ACKNOWLEDGED);
      const currentAcks: string[] = ackRaw ? JSON.parse(ackRaw) : [];
      if (!currentAcks.includes(alertId)) {
        currentAcks.push(alertId);
        await AsyncStorage.setItem(STORAGE_KEY_ACKNOWLEDGED, JSON.stringify(currentAcks));
      }
    } catch (err) {
      console.error('Erro ao reconhecer alerta:', err);
    }
  }

  async function toggleHighContrast() {
    const nextState = !highContrastMode;
    setHighContrastMode(nextState);
    try {
      const current = await AsyncStorage.getItem(STORAGE_KEY_PREFS);
      const parsed = current ? JSON.parse(current) : {};
      await AsyncStorage.setItem(
        STORAGE_KEY_PREFS,
        JSON.stringify({ ...parsed, highContrast: nextState, favoriteTerritory: selectedTerritoryId })
      );
    } catch (e) {
      console.error('Erro ao salvar preferências:', e);
    }
  }

  return (
    <TerritoryContext.Provider
      value={{
        territories: TERRITORIES,
        selectedTerritoryId,
        selectedTerritory,
        metrics,
        historicalData,
        alerts,
        interventions,
        isLoading,
        isRefreshing,
        highContrastMode,
        setSelectedTerritoryId,
        refreshData,
        registerIntervention,
        updateInterventionStatus,
        acknowledgeAlert,
        toggleHighContrast,
      }}
    >
      {children}
    </TerritoryContext.Provider>
  );
};

export function useTerritory() {
  const context = useContext(TerritoryContext);
  if (!context) {
    throw new Error('useTerritory deve ser utilizado dentro de um TerritoryProvider');
  }
  return context;
}
