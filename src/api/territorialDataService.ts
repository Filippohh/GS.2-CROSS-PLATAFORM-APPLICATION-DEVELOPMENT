import {
  Territory,
  TerritoryId,
  MetricDimension,
  PredictiveAlert,
  DecisionSimulation,
  HistoricalDataPoint
} from '../types';
import { fetchLiveClimateData } from './openMeteoService';

export const TERRITORIES: Territory[] = [
  {
    id: 'sp_geral',
    name: 'Município Consolidado (Visão Geral)',
    type: 'Consolidado Municipal',
    population: 12396372,
    areaKm2: 1521,
    latitude: -23.5505,
    longitude: -46.6333,
    vulnerabilityIndex: 42,
    dominantRisk: 'Sobrecarga de Serviços',
  },
  {
    id: 'sp_zona_leste',
    name: 'Distrito Leste - Comunidade São Pedro',
    type: 'Comunidade Periférica',
    population: 412000,
    areaKm2: 58.4,
    latitude: -23.5868,
    longitude: -46.4682,
    vulnerabilityIndex: 78,
    dominantRisk: 'Hídrico',
  },
  {
    id: 'sp_centro',
    name: 'Setor Central - República & Sé',
    type: 'Urbano Alta Densidade',
    population: 320000,
    areaKm2: 24.1,
    latitude: -23.5489,
    longitude: -46.6388,
    vulnerabilityIndex: 65,
    dominantRisk: 'Resíduos',
  },
  {
    id: 'sp_vale_verde',
    name: 'Distrito Sul - Vale Verde (Rural)',
    type: 'Comunidade Rural',
    population: 45000,
    areaKm2: 210.5,
    latitude: -23.8322,
    longitude: -46.7214,
    vulnerabilityIndex: 58,
    dominantRisk: 'Energético',
  },
  {
    id: 'sp_parque_aguas',
    name: 'Distrito Sul - Parque das Águas',
    type: 'Área de Manancial',
    population: 98000,
    areaKm2: 115.0,
    latitude: -23.7083,
    longitude: -46.6975,
    vulnerabilityIndex: 51,
    dominantRisk: 'Climático',
  },
];

// Indicadores sintéticos base calibrados por território
const BASE_METRICS: Record<TerritoryId, Omit<MetricDimension, 'climate'>> = {
  sp_geral: {
    water: { reservoirLevelPercent: 54, networkPressureBar: 2.4, distributionLossPercent: 28, status: 'alerta' },
    energy: { gridLoadPercent: 76, transformerStressIndex: 62, peakDemandMw: 4850, status: 'normal' },
    waste: { binsFillAveragePercent: 71, overdueCollectionRoutes: 5, irregularDumpingPoints: 34, status: 'alerta' },
    services: { healthCenterWaitHours: 2.8, emergencyRequestsPending: 42, citizenReports24h: 312, status: 'alerta' },
  },
  sp_zona_leste: {
    water: { reservoirLevelPercent: 32, networkPressureBar: 1.1, distributionLossPercent: 41, status: 'critico' },
    energy: { gridLoadPercent: 84, transformerStressIndex: 78, peakDemandMw: 890, status: 'alerta' },
    waste: { binsFillAveragePercent: 88, overdueCollectionRoutes: 11, irregularDumpingPoints: 62, status: 'critico' },
    services: { healthCenterWaitHours: 4.1, emergencyRequestsPending: 38, citizenReports24h: 184, status: 'critico' },
  },
  sp_centro: {
    water: { reservoirLevelPercent: 68, networkPressureBar: 3.2, distributionLossPercent: 19, status: 'normal' },
    energy: { gridLoadPercent: 91, transformerStressIndex: 83, peakDemandMw: 1420, status: 'critico' },
    waste: { binsFillAveragePercent: 94, overdueCollectionRoutes: 8, irregularDumpingPoints: 47, status: 'critico' },
    services: { healthCenterWaitHours: 2.2, emergencyRequestsPending: 19, citizenReports24h: 240, status: 'alerta' },
  },
  sp_vale_verde: {
    water: { reservoirLevelPercent: 48, networkPressureBar: 1.8, distributionLossPercent: 22, status: 'normal' },
    energy: { gridLoadPercent: 88, transformerStressIndex: 91, peakDemandMw: 210, status: 'critico' },
    waste: { binsFillAveragePercent: 52, overdueCollectionRoutes: 2, irregularDumpingPoints: 9, status: 'normal' },
    services: { healthCenterWaitHours: 3.5, emergencyRequestsPending: 14, citizenReports24h: 46, status: 'alerta' },
  },
  sp_parque_aguas: {
    water: { reservoirLevelPercent: 61, networkPressureBar: 2.6, distributionLossPercent: 24, status: 'normal' },
    energy: { gridLoadPercent: 65, transformerStressIndex: 45, peakDemandMw: 340, status: 'normal' },
    waste: { binsFillAveragePercent: 67, overdueCollectionRoutes: 3, irregularDumpingPoints: 18, status: 'normal' },
    services: { healthCenterWaitHours: 1.9, emergencyRequestsPending: 11, citizenReports24h: 78, status: 'normal' },
  },
};

export async function getTerritoryMetrics(territoryId: TerritoryId): Promise<MetricDimension> {
  const territory = TERRITORIES.find((t) => t.id === territoryId) || TERRITORIES[0];
  const base = BASE_METRICS[territoryId] || BASE_METRICS.sp_geral;

  // Consumo da API pública Open-Meteo em tempo real com fallback
  const climateLive = await fetchLiveClimateData(territory.latitude, territory.longitude);

  let heatRisk: 'baixo' | 'moderado' | 'alto' | 'extremo' = 'moderado';
  if (climateLive.temperatureC >= 32) heatRisk = 'extremo';
  else if (climateLive.temperatureC >= 28) heatRisk = 'alto';
  else if (climateLive.temperatureC >= 22) heatRisk = 'moderado';
  else heatRisk = 'baixo';

  return {
    ...base,
    climate: {
      temperatureC: climateLive.temperatureC,
      relativeHumidityPercent: climateLive.relativeHumidityPercent,
      rainfallMm24h: climateLive.precipitationMm,
      windSpeedKmh: climateLive.windSpeedKmh,
      heatIslandRisk: heatRisk,
      source: climateLive.isRealApi ? 'Open-Meteo Real-time API' : 'Sensor Local',
    },
  };
}

export const INITIAL_PREDICTIVE_ALERTS: PredictiveAlert[] = [
  {
    id: 'ALT-101',
    territoryId: 'sp_zona_leste',
    dimension: 'Água',
    severity: 'Crítico',
    title: 'Risco Iminente de Desabastecimento Noturno',
    summary: 'Reservatório Setorial São Pedro com declínio acelerado de vazão combinado a 41% de perdas na tubulação.',
    justification: 'A projeção estatística de consumo das últimas 72h somada à pressão anômala de 1.1 bar indica exaustão do reservatório secundário em menos de 18 horas caso a adução não seja reforçada.',
    confidenceScore: 92,
    timeHorizon: 'Próximas 18 a 24 horas',
    limitations: 'O modelo assume estabilidade no bombeamento da ETA principal; eventuais oscilações elétricas na captação podem antecipar a falta d\'água em ±4h.',
    recommendedAction: 'Acionamento preventivo de manobra de válvulas e envio de caminhões-pipa para os postos de saúde da região.',
    status: 'Ativo',
    createdAt: 'Hoje às 08:30',
  },
  {
    id: 'ALT-102',
    territoryId: 'sp_vale_verde',
    dimension: 'Energia',
    severity: 'Alto',
    title: 'Sobrecarga Crítica de Alimentadores Rurais',
    summary: 'Índice de estresse em transformadores de média tensão atingiu 91% na zona de bombeamento agrícola.',
    justification: 'Algoritmo de previsão de carga detectou pico concomitante de irrigação com altas temperaturas previstas pela API meteorológica para a tarde.',
    confidenceScore: 86,
    timeHorizon: 'Próximas 6 a 12 horas',
    limitations: 'Baseado em telemetria de 14 transformadores rurais amostrados; propriedades sem telemetria inteligente podem gerar picos não computados.',
    recommendedAction: 'Recomenda-se alertar cooperativas rurais para escalonamento da irrigação e posicionar equipe técnica de campo.',
    status: 'Ativo',
    createdAt: 'Hoje às 09:15',
  },
  {
    id: 'ALT-103',
    territoryId: 'sp_centro',
    dimension: 'Resíduos',
    severity: 'Alto',
    title: 'Acúmulo Crítico e Bloqueio de Vias de Coleta',
    summary: 'Lixeiras inteligentes e ecopontos da Sé operando a 94% de capacidade com atraso de caminhões.',
    justification: 'Volume gerado pelo comércio superou em 35% o padrão histórico da semana; atraso logístico gerará transbordamento em 2 horas.',
    confidenceScore: 89,
    timeHorizon: 'Próximas 2 a 4 horas',
    limitations: 'Não considera interdições repentinas de trânsito não cadastradas pela CET em tempo real.',
    recommendedAction: 'Remanejar 2 caminhões coletores da rota Oeste e notificar equipes de varrição prioritária.',
    status: 'Ativo',
    createdAt: 'Hoje às 10:40',
  },
  {
    id: 'ALT-104',
    territoryId: 'sp_parque_aguas',
    dimension: 'Clima',
    severity: 'Moderado',
    title: 'Vulnerabilidade de Encosta por Chuva Acumulada',
    summary: 'Previsão de precipitação pontual moderada sobre solo com saturação hídrica prévia.',
    justification: 'Índices pluviométricos somados dos últimos 3 dias indicam umidade de solo em 81%, próxima ao limiar de instabilidade.',
    confidenceScore: 78,
    timeHorizon: 'Próximas 36 a 48 horas',
    limitations: 'Modelos meteorológicos numéricos em mesoescala apresentam incerteza espacial de 2 km na localização da mancha de chuva mais densa.',
    recommendedAction: 'Inspeção preventiva da Defesa Civil nos pontos de monitoramento 4 e 7.',
    status: 'Ativo',
    createdAt: 'Ontem às 17:00',
  },
  {
    id: 'ALT-105',
    territoryId: 'sp_geral',
    dimension: 'Serviços',
    severity: 'Preventivo',
    title: 'Saturação Prevista em Unidades de Pronto Atendimento',
    summary: 'Aumento contínuo de procura por sintomas respiratórios e desidratação associados à baixa umidade do ar.',
    justification: 'Correlação histórica de 0.83 entre umidade abaixo de 35% e aumento de 40% na demanda por triagem em até 48 horas.',
    confidenceScore: 81,
    timeHorizon: 'Próximos 3 dias',
    limitations: 'Não modela campanhas repentinas de vacinação ou fatores epidemiológicos externos não notificados.',
    recommendedAction: 'Avisar coordenação médica regional para reforço de equipe de triagem e abastecimento de soro.',
    status: 'Ativo',
    createdAt: 'Hoje às 07:00',
  },
];

export const AVAILABLE_SIMULATIONS: DecisionSimulation[] = [
  {
    id: 'SIM-01',
    name: 'Redirecionamento de 4 Caminhões-Pipa e Manobra Hídrica',
    description: 'Priorizar abastecimento de hospitais, creches e bairros em cota alta com baixa pressão.',
    targetDimension: 'Água',
    estimatedCostBrl: 18500,
    estimatedTimeToDeployDays: 1,
    projectedRiskReductionPercent: 45,
    sideEffectsConsideration: 'Aumento momentâneo do tráfego local na Avenida Principal e redução de reserva estratégica.',
  },
  {
    id: 'SIM-02',
    name: 'Acionamento de Brigada Extra de Resíduos e Coleta Noturna',
    description: 'Deslocar 3 equipes de apoio para esvaziamento emergencial de ecopontos e lixeiras centrais.',
    targetDimension: 'Resíduos',
    estimatedCostBrl: 12000,
    estimatedTimeToDeployDays: 1,
    projectedRiskReductionPercent: 55,
    sideEffectsConsideration: 'Custo com horas extras de pessoal e ruído noturno em áreas residenciais mistas.',
  },
  {
    id: 'SIM-03',
    name: 'Escalonamento Voluntário de Bombeamento Agrícola',
    description: 'Pactuar com associações rurais o desligamento de motores de alta potência das 14h às 18h.',
    targetDimension: 'Energia',
    estimatedCostBrl: 3000,
    estimatedTimeToDeployDays: 2,
    projectedRiskReductionPercent: 60,
    sideEffectsConsideration: 'Exige adesão voluntária dos produtores e comunicação rápida via canal de WhatsApp oficial.',
  },
  {
    id: 'SIM-04',
    name: 'Instalação de Tendas de Hidratação e Acolhimento Climático',
    description: 'Montar 5 pontos de distribuição gratuita de água potável em áreas de grande fluxo de pedestres.',
    targetDimension: 'Clima',
    estimatedCostBrl: 9500,
    estimatedTimeToDeployDays: 1,
    projectedRiskReductionPercent: 40,
    sideEffectsConsideration: 'Necessita de equipes de assistência social e segurança nos pontos de grande aglomeração.',
  },
];

export function getHistoricalData(territoryId: TerritoryId): HistoricalDataPoint[] {
  // Dados históricos dos últimos 7 dias para geração de tendências
  return [
    { day: 'Seg', waterStress: 42, energyDemand: 68, rainfall: 0.0, wasteVolume: 65 },
    { day: 'Ter', waterStress: 45, energyDemand: 72, rainfall: 4.2, wasteVolume: 70 },
    { day: 'Qua', waterStress: 50, energyDemand: 75, rainfall: 12.0, wasteVolume: 74 },
    { day: 'Qui', waterStress: 62, energyDemand: 82, rainfall: 1.5, wasteVolume: 82 },
    { day: 'Sex', waterStress: 71, energyDemand: 89, rainfall: 0.0, wasteVolume: 91 },
    { day: 'Sáb', waterStress: 68, energyDemand: 78, rainfall: 0.0, wasteVolume: 88 },
    { day: 'Dom', waterStress: 64, energyDemand: 70, rainfall: 0.8, wasteVolume: 79 },
  ];
}
