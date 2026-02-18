import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RoleProvider, useRole } from './contexts/RoleContext';
import { ReportsProvider } from './contexts/ReportsContext';
import RoleSelectScreen from './screens/RoleSelectScreen';
import ReporterHomeScreen from './screens/ReporterHomeScreen';
import CollectorHomeScreen from './screens/CollectorHomeScreen';
import CreateReportScreen from './screens/CreateReportScreen';
import ReportSavedScreen from './screens/ReportSavedScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { role, isLoading } = useRole();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const initialRouteName = role === 'reporter'
    ? 'ReporterHome'
    : role === 'collector'
    ? 'CollectorHome'
    : 'RoleSelect';

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen
          name="RoleSelect"
          component={RoleSelectScreen}
          options={{ title: 'Trash Social' }}
        />
        <Stack.Screen
          name="ReporterHome"
          component={ReporterHomeScreen}
          options={{ title: 'Reporter' }}
        />
        <Stack.Screen
          name="CollectorHome"
          component={CollectorHomeScreen}
          options={{ title: 'Collector' }}
        />
        <Stack.Screen
          name="CreateReport"
          component={CreateReportScreen}
          options={{ title: 'New Report' }}
        />
        <Stack.Screen
          name="ReportSaved"
          component={ReportSavedScreen}
          options={{ title: 'Report Saved', headerBackVisible: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <RoleProvider>
      <ReportsProvider>
        <AppNavigator />
      </ReportsProvider>
    </RoleProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
