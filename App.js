import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoleSelectScreen from './screens/RoleSelectScreen';
import ReporterHomeScreen from './screens/ReporterHomeScreen';
import CollectorHomeScreen from './screens/CollectorHomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RoleSelect">
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
