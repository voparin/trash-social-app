import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { useRole } from '../contexts/RoleContext';
import { useReports } from '../contexts/ReportsContext';

export default function CollectorHomeScreen({ navigation }) {
  const { clearRole } = useRole();
  const { reports } = useReports();

  const handleChangeRole = async () => {
    await clearRole();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'RoleSelect' }],
      })
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.reportItem}
      onPress={() => navigation.navigate('ReportDetail', { report: item })}
    >
      <View style={styles.reportInfo}>
        <Text style={styles.reportDescription} numberOfLines={1}>
          {item.description}
        </Text>
        <Text style={styles.reportTime}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      <View style={[
        styles.statusBadge,
        item.status === 'COLLECTED' ? styles.statusCollected : styles.statusOpen,
      ]}>
        <Text style={[
          styles.statusText,
          item.status === 'COLLECTED' ? styles.statusTextCollected : styles.statusTextOpen,
        ]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {reports.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No reports yet.{'\n'}Reporters will create them.
          </Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          style={styles.flatList}
        />
      )}

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
    padding: 16,
  },
  flatList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  list: {
    paddingBottom: 10,
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  reportInfo: {
    flex: 1,
    marginRight: 10,
  },
  reportDescription: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  reportTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 3,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    overflow: 'hidden',
  },
  statusOpen: {
    backgroundColor: '#FFF3E0',
  },
  statusCollected: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextOpen: {
    color: '#FF9500',
  },
  statusTextCollected: {
    color: '#34C759',
  },
  changeRoleButton: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignSelf: 'center',
  },
  changeRoleText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
