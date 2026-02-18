import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { useRole } from '../contexts/RoleContext';
import { useReports } from '../contexts/ReportsContext';

export default function ReporterHomeScreen({ navigation }) {
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

  const formatCoords = (lat, lon) => {
    if (lat == null || lon == null) return null;
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  };

  const formatTime = (iso) => new Date(iso).toLocaleString();

  const renderItem = ({ item }) => (
    <View style={styles.reportItem}>
      {item.photoUri ? (
        <Image source={{ uri: item.photoUri }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.noPhoto]}>
          <Text style={styles.noPhotoText}>No{'\n'}Photo</Text>
        </View>
      )}
      <View style={styles.reportInfo}>
        <Text style={styles.reportDescription} numberOfLines={1}>
          {item.description}
        </Text>
        {formatCoords(item.lat, item.lon) && (
          <Text style={styles.reportCoords}>
            {formatCoords(item.lat, item.lon)}
          </Text>
        )}
        <View style={styles.reportMeta}>
          <Text style={styles.reportStatus}>{item.status}</Text>
          <Text style={styles.reportTime}>{formatTime(item.createdAt)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.newReportButton}
        onPress={() => navigation.navigate('CreateReport')}
      >
        <Text style={styles.newReportText}>+ New Report</Text>
      </TouchableOpacity>

      {reports.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No reports yet.{'\n'}Tap "+ New Report" to get started.
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
  newReportButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  newReportText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
    alignItems: 'center',
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 6,
    marginRight: 12,
    resizeMode: 'cover',
  },
  noPhoto: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPhotoText: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  reportInfo: {
    flex: 1,
  },
  reportDescription: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  reportCoords: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  reportMeta: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
    gap: 8,
  },
  reportStatus: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '600',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  reportTime: {
    fontSize: 12,
    color: '#999',
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
