import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTerritory } from '../context/TerritoryContext';
import { colors } from '../theme/colors';
import { Territory, TerritoryId } from '../types';

export const Header: React.FC = () => {
  const {
    territories,
    selectedTerritoryId,
    selectedTerritory,
    setSelectedTerritoryId,
    highContrastMode,
    toggleHighContrast,
  } = useTerritory();

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleSelectTerritory = (id: TerritoryId) => {
    setSelectedTerritoryId(id);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, highContrastMode && styles.safeAreaHighContrast]}>
      <View style={[styles.headerContainer, highContrastMode && styles.headerHighContrast]}>
        {/* Top Branding Row */}
        <View style={styles.topRow}>
          <View style={styles.branding}>
            <View style={styles.logoIcon}>
              <MaterialCommunityIcons name="shield-home" size={20} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.appTitle}>CITIZENTECH</Text>
              <Text style={styles.appSubtitle}>Painel de Inteligência Territorial</Text>
            </View>
          </View>

          {/* High Contrast Accessibility Action */}
          <TouchableOpacity
            onPress={toggleHighContrast}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={highContrastMode ? 'Desativar modo alto contraste' : 'Ativar modo alto contraste'}
            style={[styles.accessibilityBtn, highContrastMode && styles.accessibilityBtnActive]}
          >
            <MaterialCommunityIcons
              name="contrast-box"
              size={20}
              color={highContrastMode ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        {/* Territory Selector Bar */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Território atual: ${selectedTerritory.name}. Toque para trocar de território.`}
          style={styles.territorySelector}
        >
          <View style={styles.selectorLeft}>
            <MaterialCommunityIcons name="map-marker-radius" size={18} color={colors.accent} />
            <View style={styles.territoryTexts}>
              <Text style={styles.territoryLabel}>TERRITÓRIO SELECIONADO:</Text>
              <Text style={styles.territoryName} numberOfLines={1}>
                {selectedTerritory.name}
              </Text>
            </View>
          </View>
          <View style={styles.selectorRight}>
            <Text style={styles.changeText}>Trocar</Text>
            <MaterialCommunityIcons name="chevron-down" size={18} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Territory Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o Território de Análise</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Fechar seleção de território"
              >
                <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Os dados de água, energia, clima (Open-Meteo), resíduos e alertas serão filtrados para a região:
            </Text>

            <FlatList
              data={territories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }: { item: Territory }) => {
                const isSelected = item.id === selectedTerritoryId;
                return (
                  <TouchableOpacity
                    onPress={() => handleSelectTerritory(item.id)}
                    style={[
                      styles.territoryOption,
                      isSelected && styles.territoryOptionSelected,
                    ]}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.name}, Tipo: ${item.type}, População: ${item.population.toLocaleString('pt-BR')} habitantes`}
                  >
                    <View style={styles.optionLeft}>
                      <MaterialCommunityIcons
                        name={isSelected ? 'check-circle' : 'circle-outline'}
                        size={22}
                        color={isSelected ? colors.accent : colors.textMuted}
                        style={{ marginRight: 12 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.optionName, isSelected && styles.optionNameSelected]}>
                          {item.name}
                        </Text>
                        <Text style={styles.optionMeta}>
                          {item.type} • {item.population.toLocaleString('pt-BR')} hab • {item.areaKm2} km²
                        </Text>
                        <Text style={styles.optionRisk}>
                          Risco Dominante: <Text style={{ fontWeight: '700' }}>{item.dominantRisk}</Text>
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  safeAreaHighContrast: {
    backgroundColor: '#000000',
  },
  headerContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryDark,
  },
  headerHighContrast: {
    backgroundColor: '#000000',
    borderBottomColor: '#FFFFFF',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  appTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  appSubtitle: {
    fontSize: 11,
    color: '#CBD5E1',
  },
  accessibilityBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accessibilityBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  territorySelector: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  territoryTexts: {
    marginLeft: 8,
    flex: 1,
  },
  territoryLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  territoryName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  selectorRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  territoryOption: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  territoryOptionSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentLight,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  optionNameSelected: {
    color: colors.accentDark,
  },
  optionMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  optionRisk: {
    fontSize: 11,
    color: colors.textMuted,
  },
});
