import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { useRole } from '../contexts/RoleContext';
import { useReports } from '../contexts/ReportsContext';

// MapView is only imported on native to avoid web bundling issues.
let MapView, Marker;
if (Platform.OS !== 'web') {
  ({ default: MapView, Marker } = require('react-native-maps'));
}

const FILTERS = ['ALL', 'OPEN', 'COLLECTED'];

export default function CollectorHomeScreen({ navigation }) {
  const { clearRole } = useRole();
  const { reports } = useReports();
  const [activeTab, setActiveTab] = useState('list');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const handleChangeRole = async () => {
    await clearRole();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'RoleSelect' }],
      })
    );
  };

  const filteredReports = useMemo(
    () =>
      filterStatus === 'ALL'
        ? reports
        : reports.filter((r) => r.status === filterStatus),
    [reports, filterStatus]
  );

  // Reports that have valid coordinates — the only ones shown on the map.
  const mappableReports = useMemo(
    () => filteredReports.filter((r) => r.lat != null && r.lon != null),
    [filteredReports]
  );

  // Compute a region that fits all markers, with a minimum delta so a single
  // pin doesn't zoom in to street level.
  const mapRegion = useMemo(() => {
    if (mappableReports.length === 0) return null;
    const lats = mappableReports.map((r) => r.lat);
    const lons = mappableReports.map((r) => r.lon);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLon + maxLon) / 2,
      latitudeDelta: Math.max(0.02, (maxLat - minLat) * 1.5),
      longitudeDelta: Math.max(0.02, (maxLon - minLon) * 1.5),
    };
  }, [mappableReports]);

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

  const renderMap = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.webFallback}>
          <Text style={styles.webFallbackText}>
            Map view is not available on web.
          </Text>
        </View>
      );
    }
    if (mappableReports.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No reports with location data yet.
          </Text>
        </View>
      );
    }
    return (
      <MapView style={styles.map} initialRegion={mapRegion}>
        {mappableReports.map((item) => (
          <Marker
            key={item.id}
            coordinate={{ latitude: item.lat, longitude: item.lon }}
            title={item.description}
            description={item.status}
            pinColor={item.status === 'COLLECTED' ? '#34C759' : '#FF9500'}
            onPress={() => navigation.navigate('ReportDetail', { report: item })}
          />
        ))}
      </MapView>
    );
  };

  const emptyText = () => {
    if (filterStatus === 'OPEN') return 'No open reports.';
    if (filterStatus === 'COLLECTED') return 'No collected reports yet.';
    return 'No reports yet.\nReporters will create them.';
  };

  return (
    <View style={styles.container}>
      {/* Status filter */}
      <View style={styles.filter}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterSegment, filterStatus === f && styles.filterSegmentActive]}
            onPress={() => setFilterStatus(f)}
          >
            <Text style={[styles.filterText, filterStatus === f && styles.filterTextActive]}>
              {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab toggle */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'list' && styles.tabActive]}
          onPress={() => setActiveTab('list')}
        >
          <Text style={[styles.tabText, activeTab === 'list' && styles.tabTextActive]}>
            List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'map' && styles.tabActive]}
          onPress={() => setActiveTab('map')}
        >
          <Text style={[styles.tabText, activeTab === 'map' && styles.tabTextActive]}>
            Map
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'list' ? (
        filteredReports.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{emptyText()}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredReports}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            style={styles.flatList}
          />
        )
      ) : (
        renderMap()
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
  filter: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8E8E93',
    overflow: 'hidden',
    marginBottom: 8,
  },
  filterSegment: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  filterSegmentActive: {
    backgroundColor: '#8E8E93',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
  },
  filterTextActive: {
    color: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    overflow: 'hidden',
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  tabActive: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  tabTextActive: {
    color: '#fff',
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
  map: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webFallbackText: {
    color: '#999',
    fontSize: 15,
    textAlign: 'center',
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
