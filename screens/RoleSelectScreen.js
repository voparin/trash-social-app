import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRole } from '../contexts/RoleContext';

export default function RoleSelectScreen({ navigation }) {
  const { saveRole } = useRole();

  const handleRoleSelect = async (selectedRole, screenName) => {
    await saveRole(selectedRole);
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleRoleSelect('reporter', 'ReporterHome')}
      >
        <Text style={styles.buttonText}>Reporter</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleRoleSelect('collector', 'CollectorHome')}
      >
        <Text style={styles.buttonText}>Collector</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
