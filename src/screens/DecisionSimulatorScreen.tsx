import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTerritory } from '../context/TerritoryContext';
import { AVAILABLE_SIMULATIONS } from '../api/territorialDataService';
import { DecisionSimulation } from '../types';
import { colors } from '../theme/colors';
import { CustomButton } from '../components/CustomButton';
import { CustomInput } from '../components/CustomInput';

interface DecisionSimulatorScreenProps {
  navigation: any;
}

export const DecisionSimulatorScreen: React.FC<DecisionSimulatorScreenProps> = ({ navigation }) => {
  const { selectedTerritory, registerIntervention, highContrastMode } = useTerritory();
  const [selectedSim, setSelectedSim] = useState<DecisionSimulation | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [managerName, setManagerName] = useState<string>('Gestor Territorial');
  const [managerNotes, setManagerNotes] = useState<string>('');
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  const handleOpenSimModal = (sim: DecisionSimulation) => {
    setSelectedSim(sim);
    setManagerNotes(`Despacho fundamentado na simulação territorial para ${selectedTerritory.name}.`);
    setModalVisible(true);
  };

  const handleConfirmAuthorization = async () => {
    if (!selectedSim) return;
    if (!managerName.trim()) {
      Alert.alert('Atenção', 'Informe o nome do responsável pela assinatura da diretriz.');
      return;
    }

    setIsDeploying(true);
    try {
      const success = await registerIntervention({
        territoryId: selectedTerritory.id,
        dimension: selectedSim.targetDimension,
        title: selectedSim.name,
        severity: selectedSim.projectedRiskReductionPercent >= 50 ? 'Crítico' : 'Alto',
        impactedCitizens: Math.round(selectedTerritory.population * 0.35),
        budgetEstimatedBrl: selectedSim.estimatedCostBrl,
        technicalJustification: `${selectedSim.description} Efeitos secundários avaliados: ${selectedSim.sideEffectsConsideration}. Notas do gestor: ${managerNotes}`,
        responsibleAgency: 'Coordenação Geral de Defesa Civil e Serviços Urbanos',
        humanApprover: managerName,
        status: 'Em Execução',
      });

      if (success) {
        setModalVisible(false);
        Alert.alert(
          'Diretriz Registrada com Sucesso',
          `A ação "${selectedSim.name}" foi oficializada e salva no histórico persistente de intervenções auditáveis.`,
          [
            {
              text: 'Ver no Histórico',
              onPress: () => navigation.navigate('Intervenções'),
            },
            { text: 'Concluir' },
          ]
        );
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível persistir a diretriz.');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, highContrastMode && styles.containerHighContrast]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Top Banner Explaining Human Decision Support */}
      <View style={styles.topCard}>
        <View style={styles.topCardHeader}>
          <MaterialCommunityIcons name="account-tie" size={24} color="#FFFFFF" />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.topCardTitle}>Suporte à Decisão Humana</Text>
            <Text style={styles.topCardSub}>
              Território: {selectedTerritory.name}
            </Text>
          </View>
        </View>

        <Text style={styles.topCardBody}>
          Este simulador calcula impactos preditivos sem automação de alto risco. O sistema
          projeta cenários e custos, cabendo exclusivamente à liderança humana validar a viabilidade
          orçamentária e a priorização social.
        </Text>
      </View>

      {/* Simulations List */}
      <Text style={styles.sectionTitle}>Simulações Pré-Calibradas de Resposta:</Text>

      {AVAILABLE_SIMULATIONS.map((sim: DecisionSimulation) => (
        <View key={sim.id} style={styles.simCard}>
          <View style={styles.simHeader}>
            <View style={styles.simHeaderLeft}>
              <View style={styles.dimensionTag}>
                <Text style={styles.dimensionTagText}>{sim.targetDimension}</Text>
              </View>
              <Text style={styles.simCode}>{sim.id}</Text>
            </View>
            <View style={styles.reductionBadge}>
              <MaterialCommunityIcons name="trending-down" size={16} color={colors.riskStable} />
              <Text style={styles.reductionText}>
                -{sim.projectedRiskReductionPercent}% Risco
              </Text>
            </View>
          </View>

          <Text style={styles.simTitle}>{sim.name}</Text>
          <Text style={styles.simDescription}>{sim.description}</Text>

          {/* Metrics Matrix */}
          <View style={styles.metricsMatrix}>
            <View style={styles.matrixItem}>
              <Text style={styles.matrixLabel}>CUSTO PREVISTO</Text>
              <Text style={styles.matrixValue}>
                {sim.estimatedCostBrl.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </Text>
            </View>

            <View style={styles.matrixItem}>
              <Text style={styles.matrixLabel}>TEMPO RESPOSTA</Text>
              <Text style={styles.matrixValue}>
                {sim.estimatedTimeToDeployDays} {sim.estimatedTimeToDeployDays === 1 ? 'dia útil' : 'dias úteis'}
              </Text>
            </View>

            <View style={styles.matrixItem}>
              <Text style={styles.matrixLabel}>IMPACTO ESTIMADO</Text>
              <Text style={[styles.matrixValue, { color: colors.riskStable }]}>
                Alta Atenuação
              </Text>
            </View>
          </View>

          {/* Trade-off / Side Effects consideration */}
          <View style={styles.sideEffectBox}>
            <MaterialCommunityIcons name="scale-balance" size={16} color={colors.textSecondary} />
            <Text style={styles.sideEffectText}>
              <Text style={{ fontWeight: '700' }}>Trade-off a considerar: </Text>
              {sim.sideEffectsConsideration}
            </Text>
          </View>

          {/* Action Trigger */}
          <CustomButton
            title="Avaliar e Despachar Diretriz"
            variant="primary"
            iconName="clipboard-check"
            onPress={() => handleOpenSimModal(sim)}
            style={{ marginTop: 12 }}
          />
        </View>
      ))}

      {/* Confirmation & Authorization Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Despacho de Decisão Territorial</Text>
            </View>

            {selectedSim && (
              <ScrollView style={{ maxHeight: 380 }}>
                <View style={styles.selectedSimSummary}>
                  <Text style={styles.summaryTitle}>{selectedSim.name}</Text>
                  <Text style={styles.summaryMeta}>
                    Território: {selectedTerritory.name} • Eixo: {selectedSim.targetDimension}
                  </Text>
                  <Text style={styles.summaryCost}>
                    Orçamento: {selectedSim.estimatedCostBrl.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Text>
                </View>

                <CustomInput
                  label="Nome e Cargo do Gestor Autorizador"
                  value={managerName}
                  onChangeText={setManagerName}
                  required={true}
                  placeholder="Ex: Gestor Pedro Barreto - Defesa Civil"
                />

                <CustomInput
                  label="Notas Técnicas da Diretriz / Justificativa"
                  value={managerNotes}
                  onChangeText={setManagerNotes}
                  multiline={true}
                  numberOfLines={3}
                  required={true}
                  placeholder="Descreva a motivação e orientações para a equipe de campo"
                />

                <View style={styles.auditNotice}>
                  <MaterialCommunityIcons name="shield-check" size={16} color={colors.accentDark} />
                  <Text style={styles.auditNoticeText}>
                    Esta decisão será gravada no banco local persistente (AsyncStorage) para fins de
                    prestação de contas e conformidade com a governança pública.
                  </Text>
                </View>
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              <CustomButton
                title="Cancelar"
                variant="outline"
                onPress={() => setModalVisible(false)}
                style={{ flex: 1, marginRight: 8 }}
                disabled={isDeploying}
              />
              <CustomButton
                title="Confirmar e Assinar"
                variant="primary"
                loading={isDeploying}
                onPress={handleConfirmAuthorization}
                style={{ flex: 1.2 }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  topCard: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  topCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  topCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  topCardSub: {
    fontSize: 11,
    color: colors.accentLight,
  },
  topCardBody: {
    fontSize: 12.5,
    color: '#E2E8F0',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  simCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  simHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  simHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dimensionTag: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dimensionTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  simCode: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  reductionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.riskStableBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  reductionText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.riskStable,
  },
  simTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  simDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  metricsMatrix: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 8,
    padding: 10,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  matrixItem: {
    flex: 1,
    alignItems: 'center',
  },
  matrixLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 2,
  },
  matrixValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sideEffectBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    padding: 8,
    borderRadius: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  sideEffectText: {
    fontSize: 11,
    color: '#795548',
    flex: 1,
    lineHeight: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  selectedSimSummary: {
    backgroundColor: colors.surfaceSubtle,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  summaryMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  summaryCost: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accentDark,
    marginTop: 4,
  },
  auditNotice: {
    flexDirection: 'row',
    backgroundColor: colors.accentLight,
    padding: 10,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  auditNoticeText: {
    fontSize: 11,
    color: colors.accentDark,
    flex: 1,
    lineHeight: 15,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 10,
  },
});
