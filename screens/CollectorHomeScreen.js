import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRole } from '../contexts/RoleContext';
import { CommonActions } from '@react-navigation/native';

export default function CollectorHomeScreen({ navigation }) {
  const { clearRole } = useRole();

  const handleChangeRole = async () => {
    await clearRole();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'RoleSelect' }],
      })
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Collector Home</Text>
      <Text style={styles.subtitle}>View and collect trash reports</Text>

      <TouchableOpacity style={styles.changeRoleButton} onPress={handleChangeRole}>
        <Text style={styles.changeRoleText}>Change Role</Text>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  changeRoleButton: {
    marginTop: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  changeRoleText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
