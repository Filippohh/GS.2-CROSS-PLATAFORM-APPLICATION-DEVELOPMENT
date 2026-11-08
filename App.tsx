import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { TerritoryProvider, useTerritory } from './src/context/TerritoryContext';
import { Header } from './src/components/Header';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { AlertsScreen } from './src/screens/AlertsScreen';
import { DecisionSimulatorScreen } from './src/screens/DecisionSimulatorScreen';
import { InterventionsScreen } from './src/screens/InterventionsScreen';
import { GovernanceScreen } from './src/screens/GovernanceScreen';
import { colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();

function MainNavigator() {
  const { highContrastMode, alerts } = useTerritory();

  const activeAlertsCount = alerts.filter(
    (a) => (a.severity === 'Crítico' || a.severity === 'Alto') && a.status === 'Ativo'
  ).length;

  return (
    <View style={[styles.mainContainer, highContrastMode && styles.mainContainerHighContrast]}>
      <Header />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: highContrastMode ? '#000000' : colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: highContrastMode ? '#FFFFFF' : '#FFFFFF',
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarLabel: 'Dashboard',
            tabBarAccessibilityLabel: 'Aba Dashboard de Indicadores Territoriais',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="view-dashboard-outline" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Alertas"
          component={AlertsScreen}
          options={{
            tabBarLabel: 'Alertas',
            tabBarAccessibilityLabel: 'Aba de Alertas Preditivos e Justificativas',
            tabBarBadge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
            tabBarBadgeStyle: {
              backgroundColor: colors.riskCritical,
              fontSize: 10,
              fontWeight: '700',
            },
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="alert-decagram-outline" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Decisão"
          component={DecisionSimulatorScreen}
          options={{
            tabBarLabel: 'Simulador',
            tabBarAccessibilityLabel: 'Aba de Apoio à Decisão e Simulação de Intervenções',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="scale-balance" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Intervenções"
          component={InterventionsScreen}
          options={{
            tabBarLabel: 'Intervenções',
            tabBarAccessibilityLabel: 'Aba de Registro e Histórico de Intervenções',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="clipboard-check-outline" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Governança"
          component={GovernanceScreen}
          options={{
            tabBarLabel: 'Governança',
            tabBarAccessibilityLabel: 'Aba de Governança, LGPD e Integrantes do Grupo',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="shield-account-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

export default function App() {
  return (
    <TerritoryProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <MainNavigator />
      </NavigationContainer>
    </TerritoryProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainContainerHighContrast: {
    backgroundColor: '#000000',
  },
});
