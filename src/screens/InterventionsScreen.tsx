import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTerritory } from '../context/TerritoryContext';
import { colors } from '../theme/colors';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { RiskBadge } from '../components/RiskBadge';
import { TerritoryIntervention, TerritoryId } from '../types';

interface FormErrors {
  title?: string;
  impactedCitizens?: string;
  budgetEstimatedBrl?: string;
  technicalJustification?: string;
  responsibleAgency?: string;
  humanApprover?: string;
}

export const InterventionsScreen: React.FC = () => {
  const {
    territories,
    selectedTerritory,
    interventions,
    registerIntervention,
    updateInterventionStatus,
    highContrastMode,
  } = useTerritory();

  const [activeTab, setActiveTab] = useState<'historico' | 'formulario'>('historico');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');

  // Form States
  const [targetTerritoryId, setTargetTerritoryId] = useState<TerritoryId>(selectedTerritory.id);
  const [dimension, setDimension] = useState<TerritoryIntervention['dimension']>('Água');
  const [severity, setSeverity] = useState<TerritoryIntervention['severity']>('Alto');
  const [title, setTitle] = useState<string>('');
  const [impactedCitizens, setImpactedCitizens] = useState<string>('');
  const [budgetEstimatedBrl, setBudgetEstimatedBrl] = useState<string>('');
  const [technicalJustification, setTechnicalJustification] = useState<string>('');
  const [responsibleAgency, setResponsibleAgency] = useState<string>('');
  const [humanApprover, setHumanApprover] = useState<string>('Gestor Territorial');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const dimensions: TerritoryIntervention['dimension'][] = ['Água', 'Energia', 'Clima', 'Resíduos', 'Serviços'];
  const severities: TerritoryIntervention['severity'][] = ['Preventivo', 'Moderado', 'Alto', 'Crítico'];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = 'O título da intervenção é obrigatório.';
    } else if (title.trim().length < 6) {
      newErrors.title = 'O título deve ter pelo menos 6 caracteres.';
    }

    if (!impactedCitizens.trim()) {
      newErrors.impactedCitizens = 'Informe a população estimada.';
    } else {
      const num = Number(impactedCitizens.replace(/\D/g, ''));
      if (isNaN(num) || num <= 0) {
        newErrors.impactedCitizens = 'Insira um número válido de munícipes (maior que zero).';
      }
    }

    if (!budgetEstimatedBrl.trim()) {
      newErrors.budgetEstimatedBrl = 'Informe a estimativa orçamentária.';
    } else {
      const budget = Number(budgetEstimatedBrl.replace(/[^\d.]/g, ''));
      if (isNaN(budget) || budget <= 0) {
        newErrors.budgetEstimatedBrl = 'Insira um valor financeiro válido.';
      }
    }

    if (!technicalJustification.trim()) {
      newErrors.technicalJustification = 'A fundamentação técnica é obrigatória.';
    } else if (technicalJustification.trim().length < 15) {
      newErrors.technicalJustification = 'A justificativa deve ter ao menos 15 caracteres para auditoria.';
    }

    if (!responsibleAgency.trim()) {
      newErrors.responsibleAgency = 'Informe a secretaria ou órgão executor.';
    }

    if (!humanApprover.trim()) {
      newErrors.humanApprover = 'Informe o gestor responsável pela autorização.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitForm = async () => {
    if (!validateForm()) {
      Alert.alert('Formulário Incompleto', 'Por favor, corrija os campos indicados em vermelho antes de enviar.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await registerIntervention({
        territoryId: targetTerritoryId,
        dimension,
        severity,
        title: title.trim(),
        impactedCitizens: Number(impactedCitizens.replace(/\D/g, '')),
        budgetEstimatedBrl: Number(budgetEstimatedBrl.replace(/[^\d.]/g, '')),
        technicalJustification: technicalJustification.trim(),
        responsibleAgency: responsibleAgency.trim(),
        humanApprover: humanApprover.trim(),
        status: 'Planejada',
      });

      if (success) {
        Alert.alert(
          'Sucesso!',
          'A intervenção foi cadastrada e gravada permanentemente no armazenamento do app (AsyncStorage).',
          [{ text: 'OK' }]
        );

        // Reset form
        setTitle('');
        setImpactedCitizens('');
        setBudgetEstimatedBrl('');
        setTechnicalJustification('');
        setResponsibleAgency('');
        setErrors({});
        setActiveTab('historico');
      }
    } catch (e) {
      Alert.alert('Erro', 'Ocorreu uma falha ao persistir a intervenção.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredInterventions = interventions.filter((item) => {
    if (filterStatus === 'Todos') return true;
    return item.status === filterStatus;
  });

  return (
    <ScrollView
      style={[styles.container, highContrastMode && styles.containerHighContrast]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Top Navigation Tabs */}
      <View style={styles.topTabs}>
        <TouchableOpacity
          onPress={() => setActiveTab('historico')}
          style={[styles.topTabBtn, activeTab === 'historico' && styles.topTabBtnActive]}
          accessible={true}
          accessibilityRole="tab"
          accessibilityLabel="Aba de Histórico de Intervenções"
        >
          <MaterialCommunityIcons
            name="format-list-checks"
            size={18}
            color={activeTab === 'historico' ? '#FFFFFF' : colors.textSecondary}
          />
          <Text
            style={[styles.topTabText, activeTab === 'historico' && styles.topTabTextActive]}
          >
            Histórico Auditável ({interventions.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('formulario')}
          style={[styles.topTabBtn, activeTab === 'formulario' && styles.topTabBtnActive]}
          accessible={true}
          accessibilityRole="tab"
          accessibilityLabel="Aba de Cadastrar Nova Intervenção"
        >
          <MaterialCommunityIcons
            name="plus-circle-outline"
            size={18}
            color={activeTab === 'formulario' ? '#FFFFFF' : colors.textSecondary}
          />
          <Text
            style={[styles.topTabText, activeTab === 'formulario' && styles.topTabTextActive]}
          >
            Nova Intervenção
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB 1: HISTÓRICO DE INTERVENÇÕES */}
      {activeTab === 'historico' ? (
        <View>
          {/* Status Filter Chips */}
          <View style={styles.filterBar}>
            {['Todos', 'Planejada', 'Em Execução', 'Concluída'].map((st) => {
              const isSel = filterStatus === st;
              return (
                <TouchableOpacity
                  key={st}
                  onPress={() => setFilterStatus(st)}
                  style={[styles.statusChip, isSel && styles.statusChipActive]}
                  accessibilityRole="button"
                  accessibilityLabel={`Filtrar por status ${st}`}
                >
                  <Text style={[styles.statusChipText, isSel && styles.statusChipTextActive]}>
                    {st}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {filteredInterventions.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={44} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>Nenhuma intervenção cadastrada</Text>
              <Text style={styles.emptySubtitle}>
                Cadastre uma nova intervenção na aba acima para registrar ações tomadas no território.
              </Text>
            </View>
          ) : (
            filteredInterventions.map((item) => {
              const terrName = territories.find((t) => t.id === item.territoryId)?.name || item.territoryId;
              return (
                <View key={item.id} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemMetaLeft}>
                      <Text style={styles.itemCode}>{item.id}</Text>
                      <Text style={styles.itemDate}>{item.createdAt}</Text>
                    </View>
                    <RiskBadge level={item.severity} size="sm" />
                  </View>

                  <Text style={styles.itemTitle}>{item.title}</Text>

                  <View style={styles.itemInfoRow}>
                    <Text style={styles.itemTag}>Eixo: {item.dimension}</Text>
                    <Text style={styles.itemTag}>Território: {terrName.split('-')[0]}</Text>
                  </View>

                  <Text style={styles.itemJustification}>
                    <Text style={{ fontWeight: '700' }}>Fundamentação: </Text>
                    {item.technicalJustification}
                  </Text>

                  <View style={styles.itemStatsGrid}>
                    <View style={styles.statBox}>
                      <Text style={styles.statLabel}>População Beneficiada</Text>
                      <Text style={styles.statValue}>
                        {item.impactedCitizens.toLocaleString('pt-BR')} munícipes
                      </Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statLabel}>Orçamento Estimado</Text>
                      <Text style={styles.statValue}>
                        {item.budgetEstimatedBrl.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.itemSignerRow}>
                    <MaterialCommunityIcons name="account-check" size={16} color={colors.accent} />
                    <Text style={styles.signerText}>
                      Autorizado por: <Text style={{ fontWeight: '700' }}>{item.humanApprover}</Text> ({item.responsibleAgency})
                    </Text>
                  </View>

                  {/* Status Switcher Button */}
                  <View style={styles.statusActionRow}>
                    <Text style={styles.statusCurrentLabel}>
                      Status Atual:{' '}
                      <Text style={[styles.statusHighlight, item.status === 'Concluída' && { color: colors.riskStable }]}>
                        {item.status.toUpperCase()}
                      </Text>
                    </Text>

                    {item.status === 'Planejada' && (
                      <CustomButton
                        title="Iniciar Execução"
                        size="sm"
                        variant="secondary"
                        onPress={() => updateInterventionStatus(item.id, 'Em Execução')}
                      />
                    )}
                    {item.status === 'Em Execução' && (
                      <CustomButton
                        title="Marcar Concluída"
                        size="sm"
                        variant="primary"
                        onPress={() => updateInterventionStatus(item.id, 'Concluída')}
                      />
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>
      ) : (
        /* TAB 2: FORMULÁRIO COM VALIDAÇÃO ESTREITA */
        <View style={styles.formContainer}>
          <View style={styles.formIntro}>
            <Text style={styles.formIntroTitle}>Registro Formal de Intervenção Territorial</Text>
            <Text style={styles.formIntroSub}>
              Todos os campos marcados com (*) passam por validação imediata e serão armazenados no dispositivo (AsyncStorage).
            </Text>
          </View>

          {/* Territory Selector */}
          <Text style={styles.fieldSectionLabel}>1. Selecione o Território de Aplicação *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillList}>
            {territories.map((t) => {
              const isSel = targetTerritoryId === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setTargetTerritoryId(t.id)}
                  style={[styles.choicePill, isSel && styles.choicePillActive]}
                  accessibilityRole="button"
                  accessibilityLabel={`Território ${t.name}`}
                >
                  <Text style={[styles.choicePillText, isSel && styles.choicePillTextActive]}>
                    {t.name.split('-')[0]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Dimension Selector */}
          <Text style={styles.fieldSectionLabel}>2. Eixo Temático do Problema *</Text>
          <View style={styles.pillGrid}>
            {dimensions.map((dim) => {
              const isSel = dimension === dim;
              return (
                <TouchableOpacity
                  key={dim}
                  onPress={() => setDimension(dim)}
                  style={[styles.choicePill, isSel && styles.choicePillActive]}
                  accessibilityRole="button"
                  accessibilityLabel={`Eixo ${dim}`}
                >
                  <Text style={[styles.choicePillText, isSel && styles.choicePillTextActive]}>
                    {dim}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Severity Selector */}
          <Text style={styles.fieldSectionLabel}>3. Nível de Prioridade / Severidade *</Text>
          <View style={styles.pillGrid}>
            {severities.map((sev) => {
              const isSel = severity === sev;
              return (
                <TouchableOpacity
                  key={sev}
                  onPress={() => setSeverity(sev)}
                  style={[styles.choicePill, isSel && styles.choicePillActive]}
                  accessibilityRole="button"
                  accessibilityLabel={`Severidade ${sev}`}
                >
                  <Text style={[styles.choicePillText, isSel && styles.choicePillTextActive]}>
                    {sev}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Title */}
          <CustomInput
            label="Título da Intervenção"
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            placeholder="Ex: Ampliação de Caminhões-Pipa na Zona Leste"
            required={true}
            error={errors.title}
            helperText="Mínimo de 6 caracteres descritivos"
          />

          {/* Impacted citizens */}
          <CustomInput
            label="Estimativa de Munícipes Beneficiados"
            value={impactedCitizens}
            onChangeText={(t) => {
              setImpactedCitizens(t);
              if (errors.impactedCitizens) setErrors((prev) => ({ ...prev, impactedCitizens: undefined }));
            }}
            placeholder="Ex: 25000"
            keyboardType="numeric"
            required={true}
            error={errors.impactedCitizens}
            helperText="Número de pessoas diretamente protegidas"
          />

          {/* Budget */}
          <CustomInput
            label="Orçamento Estimado Previsto (R$)"
            value={budgetEstimatedBrl}
            onChangeText={(t) => {
              setBudgetEstimatedBrl(t);
              if (errors.budgetEstimatedBrl) setErrors((prev) => ({ ...prev, budgetEstimatedBrl: undefined }));
            }}
            placeholder="Ex: 35000"
            keyboardType="numeric"
            required={true}
            error={errors.budgetEstimatedBrl}
            helperText="Valor estimado para custeio da operação"
          />

          {/* Technical Justification */}
          <CustomInput
            label="Fundamentação Técnica e Justificativa"
            value={technicalJustification}
            onChangeText={(t) => {
              setTechnicalJustification(t);
              if (errors.technicalJustification) setErrors((prev) => ({ ...prev, technicalJustification: undefined }));
            }}
            placeholder="Descreva a razão técnica, limites e dados analisados para sustentar esta ordem..."
            multiline={true}
            numberOfLines={4}
            required={true}
            error={errors.technicalJustification}
            helperText="Mínimo de 15 caracteres para fins de prestação de contas"
          />

          {/* Responsible Agency */}
          <CustomInput
            label="Secretaria ou Agência Executora"
            value={responsibleAgency}
            onChangeText={(t) => {
              setResponsibleAgency(t);
              if (errors.responsibleAgency) setErrors((prev) => ({ ...prev, responsibleAgency: undefined }));
            }}
            placeholder="Ex: Defesa Civil / SMSP / Secretaria de Obras"
            required={true}
            error={errors.responsibleAgency}
          />

          {/* Human Approver */}
          <CustomInput
            label="Nome e Matrícula do Gestor Autorizador"
            value={humanApprover}
            onChangeText={(t) => {
              setHumanApprover(t);
              if (errors.humanApprover) setErrors((prev) => ({ ...prev, humanApprover: undefined }));
            }}
            placeholder="Ex: Gestor Pedro Barreto - RM 564437"
            required={true}
            error={errors.humanApprover}
            helperText="Assinatura humana obrigatória (Princípio Human-in-the-Loop)"
          />

          {/* Submit Button */}
          <CustomButton
            title="Salvar e Registrar Intervenção"
            variant="primary"
            iconName="content-save-check"
            size="lg"
            loading={isSubmitting}
            onPress={handleSubmitForm}
            style={{ marginTop: 12, marginBottom: 24 }}
          />
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
    paddingBottom: 36,
  },
  topTabs: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  topTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  topTabBtnActive: {
    backgroundColor: colors.primary,
  },
  topTabText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  topTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  filterBar: {
    flexDirection: 'row',
    marginBottom: 14,
    gap: 8,
    flexWrap: 'wrap',
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusChipText: {
    fontSize: 11.5,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  statusChipTextActive: {
    color: '#FFFFFF',
  },
  itemCard: {
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemMetaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemCode: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accentDark,
  },
  itemDate: {
    fontSize: 11,
    color: colors.textMuted,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  itemInfoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  itemTag: {
    fontSize: 11,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  itemJustification: {
    fontSize: 12.5,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  itemStatsGrid: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    fontSize: 9.5,
    color: colors.textMuted,
    fontWeight: '700',
  },
  statValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  itemSignerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    marginBottom: 10,
  },
  signerText: {
    fontSize: 11,
    color: colors.textSecondary,
    flex: 1,
  },
  statusActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  statusCurrentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statusHighlight: {
    fontWeight: '800',
    color: colors.accentDark,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formIntro: {
    marginBottom: 16,
  },
  formIntroTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  formIntroSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 17,
  },
  fieldSectionLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    marginTop: 6,
  },
  pillList: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  choicePill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSubtle,
    marginRight: 6,
  },
  choicePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  choicePillText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  choicePillTextActive: {
    color: '#FFFFFF',
  },
  emptyState: {
    backgroundColor: colors.surface,
    padding: 32,
    borderRadius: 14,
    alignItems: 'center',
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
