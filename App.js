import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RoleProvider, useRole } from './contexts/RoleContext';
import RoleSelectScreen from './screens/RoleSelectScreen';
import ReporterHomeScreen from './screens/ReporterHomeScreen';
import CollectorHomeScreen from './screens/CollectorHomeScreen';

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

  // Determine initial route based on saved role
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <RoleProvider>
      <AppNavigator />
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
