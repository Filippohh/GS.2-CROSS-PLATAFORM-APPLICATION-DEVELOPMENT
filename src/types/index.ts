export type TerritoryId = 'sp_zona_leste' | 'sp_centro' | 'sp_vale_verde' | 'sp_parque_aguas' | 'sp_geral';

export interface Territory {
  id: TerritoryId;
  name: string;
  type: 'Urbano Alta Densidade' | 'Comunidade Periférica' | 'Comunidade Rural' | 'Área de Manancial' | 'Consolidado Municipal';
  population: number;
  areaKm2: number;
  latitude: number;
  longitude: number;
  vulnerabilityIndex: number; // 0 a 100
  dominantRisk: 'Hídrico' | 'Energético' | 'Climático' | 'Resíduos' | 'Sobrecarga de Serviços';
}

export interface MetricDimension {
  water: {
    reservoirLevelPercent: number;
    networkPressureBar: number;
    distributionLossPercent: number;
    status: 'normal' | 'alerta' | 'critico';
  };
  energy: {
    gridLoadPercent: number;
    transformerStressIndex: number; // 0 a 100
    peakDemandMw: number;
    status: 'normal' | 'alerta' | 'critico';
  };
  climate: {
    temperatureC: number;
    relativeHumidityPercent: number;
    rainfallMm24h: number;
    windSpeedKmh: number;
    heatIslandRisk: 'baixo' | 'moderado' | 'alto' | 'extremo';
    source: 'Open-Meteo Real-time API' | 'Sensor Local';
  };
  waste: {
    binsFillAveragePercent: number;
    overdueCollectionRoutes: number;
    irregularDumpingPoints: number;
    status: 'normal' | 'alerta' | 'critico';
  };
  services: {
    healthCenterWaitHours: number;
    emergencyRequestsPending: number;
    citizenReports24h: number;
    status: 'normal' | 'alerta' | 'critico';
  };
}

export interface PredictiveAlert {
  id: string;
  territoryId: TerritoryId;
  dimension: 'Água' | 'Energia' | 'Clima' | 'Resíduos' | 'Serviços';
  severity: 'Preventivo' | 'Moderado' | 'Alto' | 'Crítico';
  title: string;
  summary: string;
  justification: string;
  confidenceScore: number; // 0 a 100%
  timeHorizon: string; // Ex: 'Próximas 24 a 48 horas'
  limitations: string; // Limitações do modelo
  recommendedAction: string;
  status: 'Ativo' | 'Reconhecido' | 'Em Mitigação' | 'Resolvido';
  createdAt: string;
}

export interface DecisionSimulation {
  id: string;
  name: string;
  description: string;
  targetDimension: 'Água' | 'Energia' | 'Clima' | 'Resíduos' | 'Serviços';
  estimatedCostBrl: number;
  estimatedTimeToDeployDays: number;
  projectedRiskReductionPercent: number;
  sideEffectsConsideration: string;
}

export interface TerritoryIntervention {
  id: string;
  territoryId: TerritoryId;
  dimension: 'Água' | 'Energia' | 'Clima' | 'Resíduos' | 'Serviços';
  title: string;
  severity: 'Preventivo' | 'Moderado' | 'Alto' | 'Crítico';
  impactedCitizens: number;
  budgetEstimatedBrl: number;
  technicalJustification: string;
  responsibleAgency: string;
  humanApprover: string;
  status: 'Planejada' | 'Em Execução' | 'Concluída';
  createdAt: string;
}

export interface HistoricalDataPoint {
  day: string;
  waterStress: number;
  energyDemand: number;
  rainfall: number;
  wasteVolume: number;
}
