import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTerritory } from '../context/TerritoryContext';
import { colors } from '../theme/colors';

export const GovernanceScreen: React.FC = () => {
  const { highContrastMode, toggleHighContrast, refreshData } = useTerritory();

  const teamMembers = [
    { name: 'Pedro Barreto', rm: '564437', role: 'Arquitetura Cross-Platform & Integrações de Telemetria' },
    { name: 'Filippo Picino', rm: '565994', role: 'Desenvolvimento Mobile, UI/UX & Acessibilidade' },
    { name: 'Gustavo Henrique', rm: '563695', role: 'Modelos Preditivos, Validações & Governança LGPD' },
  ];

  const handleResetData = () => {
    Alert.alert(
      'Redefinir Dados Locais',
      'Deseja restaurar as intervenções e preferências de fábrica salvas no AsyncStorage para uma nova demonstração?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Redefinir',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              await refreshData();
              Alert.alert('Pronto', 'Banco local redefinido com sucesso.');
            } catch (e) {
              Alert.alert('Erro', 'Falha ao limpar armazenamento local.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, highContrastMode && styles.containerHighContrast]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Team Header Card */}
      <View style={styles.teamCard}>
        <View style={styles.teamCardHeader}>
          <MaterialCommunityIcons name="school" size={24} color="#FFFFFF" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.fiapTitle}>FIAP • Ciência da Computação</Text>
            <Text style={styles.fiapSub}>Global Solution 2026.2 • Cross-Platform Application Development</Text>
          </View>
        </View>

        <Text style={styles.teamIntro}>Integrantes do Grupo de Desenvolvimento:</Text>

        {teamMembers.map((member) => (
          <View key={member.rm} style={styles.memberRow}>
            <View style={styles.memberAvatar}>
              <Text style={styles.memberInitials}>
                {member.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRm}>RM: {member.rm}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
            </View>
          </View>
        ))}

        <View style={styles.repoBox}>
          <MaterialCommunityIcons name="github" size={18} color="#FFFFFF" />
          <Text style={styles.repoText} numberOfLines={1}>
            github.com/Filippohh/GS.2-PLATAFORM-APPLICATION-DEVELOPMENT
          </Text>
        </View>
      </View>

      {/* LGPD & Privacy Section (Critério Requisitado) */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="shield-lock" size={22} color={colors.accent} />
          <Text style={styles.sectionTitle}>Privacidade dos Cidadãos & LGPD</Text>
        </View>

        <Text style={styles.sectionParagraph}>
          O <Text style={{ fontWeight: '700' }}>Painel de Inteligência Territorial</Text> foi projetado
          sob a arquitetura de <Text style={{ fontWeight: '700' }}>Privacy by Design</Text> e estrita
          conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018):
        </Text>

        <View style={styles.bulletItem}>
          <MaterialCommunityIcons name="check-circle" size={16} color={colors.riskStable} />
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: '700' }}>Zero PII (Personally Identifiable Information): </Text>
            Nenhum dado pessoal de cidadãos, nomes, CPFs ou endereços residenciais exatos é coletado ou armazenado.
          </Text>
        </View>

        <View style={styles.bulletItem}>
          <MaterialCommunityIcons name="check-circle" size={16} color={colors.riskStable} />
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: '700' }}>Anonimização e K-Anonymity Espacial: </Text>
            Todas as métricas de consumo de água, energia e chamados são agregadas em quadrantes territoriais e setores censitários mínimos.
          </Text>
        </View>

        <View style={styles.bulletItem}>
          <MaterialCommunityIcons name="check-circle" size={16} color={colors.riskStable} />
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: '700' }}>Transparência Ativa: </Text>
            Os munícipes têm direito a auditar as razões pelas quais um alerta ou intervenção foi registrado em seu bairro.
          </Text>
        </View>
      </View>

      {/* Explicabilidade e Governança de Decisão (Human-in-the-loop) */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="scale-balance" size={22} color={colors.dimensionEnergy} />
          <Text style={styles.sectionTitle}>Transparência e Governança de Decisão</Text>
        </View>

        <Text style={styles.sectionParagraph}>
          Em conformidade com a diretriz da disciplina, o sistema opera como um{' '}
          <Text style={{ fontWeight: '700' }}>Decision Support System (DSS)</Text>, com as seguintes premissas:
        </Text>

        <View style={styles.bulletItem}>
          <MaterialCommunityIcons name="information" size={16} color={colors.accent} />
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: '700' }}>Sem Automação de Alto Risco: </Text>
            Cortes de fornecimento, deslocamento de frotas e fechamento de serviços públicos jamais ocorrem de forma autônoma.
          </Text>
        </View>

        <View style={styles.bulletItem}>
          <MaterialCommunityIcons name="information" size={16} color={colors.accent} />
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: '700' }}>Níveis de Confiança Declarados: </Text>
            Cada predição apresenta porcentagem de acurácia esperada e limites de confiabilidade estatística.
          </Text>
        </View>

        <View style={styles.bulletItem}>
          <MaterialCommunityIcons name="information" size={16} color={colors.accent} />
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: '700' }}>Limitações do Modelo Explícitas: </Text>
            Premissas como dados de mesoescala, estabilidade de rede e latências de sensores são expostas ao tomador de decisão.
          </Text>
        </View>
      </View>

      {/* Fontes de Dados Utilizadas */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="database-sync" size={22} color={colors.dimensionWater} />
          <Text style={styles.sectionTitle}>Fontes de Dados do Aplicativo</Text>
        </View>

        <View style={styles.sourceItem}>
          <Text style={styles.sourceName}>1. Open-Meteo Weather Forecast API</Text>
          <Text style={styles.sourceDesc}>
            API pública e aberta com dados meteorológicos em tempo real por latitude/longitude (temperatura, umidade, vento, chuva horária).
          </Text>
        </View>

        <View style={styles.sourceItem}>
          <Text style={styles.sourceName}>2. SNIS (Sistema Nacional de Informações sobre Saneamento)</Text>
          <Text style={styles.sourceDesc}>
            Parâmetros médios nacionais de perda de distribuição de água potável e índices de desabastecimento.
          </Text>
        </View>

        <View style={styles.sourceItem}>
          <Text style={styles.sourceName}>3. Censo Demográfico & Bases Geográficas IBGE</Text>
          <Text style={styles.sourceDesc}>
            Área territorial, densidade populacional e fatores de vulnerabilidade social de São Paulo.
          </Text>
        </View>

        <View style={styles.sourceItem}>
          <Text style={styles.sourceName}>4. Telemetria Sintética Calibrada</Text>
          <Text style={styles.sourceDesc}>
            Sensores simulados de pressão de água, medidores de subestações de energia e ecopontos com latência realista.
          </Text>
        </View>
      </View>

      {/* Accessibility & Storage Management */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="cog-refresh" size={22} color={colors.textPrimary} />
          <Text style={styles.sectionTitle}>Acessibilidade e Armazenamento Local</Text>
        </View>

        <TouchableOpacity
          onPress={toggleHighContrast}
          style={styles.settingRow}
          accessible={true}
          accessibilityRole="switch"
          accessibilityLabel={`Modo Alto Contraste está ${highContrastMode ? 'Ativado' : 'Desativado'}`}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.settingLabel}>Modo Alto Contraste (WCAG 2.1)</Text>
            <Text style={styles.settingSub}>
              Aumenta o contraste visual para facilitar a leitura sob luz solar intensa.
            </Text>
          </View>
          <View style={[styles.toggleBadge, highContrastMode && styles.toggleBadgeActive]}>
            <Text style={[styles.toggleText, highContrastMode && styles.toggleTextActive]}>
              {highContrastMode ? 'ATIVO' : 'DESLIGADO'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResetData}
          style={[styles.settingRow, { borderBottomWidth: 0, marginTop: 10 }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Redefinir dados salvos localmente"
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.settingLabel, { color: colors.riskCritical }]}>
              Redefinir Dados do AsyncStorage
            </Text>
            <Text style={styles.settingSub}>
              Restaura as intervenções pré-definidas para avaliação da Global Solution.
            </Text>
          </View>
          <MaterialCommunityIcons name="refresh" size={20} color={colors.riskCritical} />
        </TouchableOpacity>
      </View>
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
  teamCard: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  teamCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fiapTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  fiapSub: {
    fontSize: 10.5,
    color: colors.accentLight,
    marginTop: 2,
  },
  teamIntro: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
    marginTop: 6,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  memberInitials: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  memberRm: {
    fontSize: 11.5,
    color: colors.accentLight,
    fontWeight: '600',
  },
  memberRole: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  repoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 6,
    gap: 8,
  },
  repoText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  sectionCard: {
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionParagraph: {
    fontSize: 12.5,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  bulletText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    flex: 1,
  },
  sourceItem: {
    backgroundColor: colors.surfaceSubtle,
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  sourceName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sourceDesc: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  settingSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    marginRight: 8,
  },
  toggleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  toggleBadgeActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
});
