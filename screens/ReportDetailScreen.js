import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useReports } from '../contexts/ReportsContext';

export default function ReportDetailScreen({ route }) {
  // Read live from context so status + proof photo update immediately after marking.
  const { reports, updateReport } = useReports();
  const reportId = route.params.report.id;
  const report = reports.find((r) => r.id === reportId);

  const [collecting, setCollecting] = useState(false);

  if (!report) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noValue}>Report not found.</Text>
      </View>
    );
  }

  const hasCoords = report.lat != null && report.lon != null;
  const isOpen = report.status === 'OPEN';

  const handleMarkCollected = async () => {
    setCollecting(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (result.canceled || !result.assets?.length) {
      setCollecting(false);
      return;
    }
    await updateReport({
      ...report,
      status: 'COLLECTED',
      proofPhotoUri: result.assets[0].uri,
    });
    setCollecting(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[
        styles.statusBadge,
        isOpen ? styles.statusOpen : styles.statusCollected,
      ]}>
        <Text style={[
          styles.statusText,
          isOpen ? styles.statusTextOpen : styles.statusTextCollected,
        ]}>
          {report.status}
        </Text>
      </View>

      <Text style={styles.sectionLabel}>Photo</Text>
      {report.photoUri ? (
        <Image source={{ uri: report.photoUri }} style={styles.photo} />
      ) : (
        <View style={styles.noPhotoBox}>
          <Text style={styles.noPhotoText}>No photo attached</Text>
        </View>
      )}

      <Text style={styles.sectionLabel}>Description</Text>
      <Text style={styles.description}>{report.description}</Text>

      <Text style={styles.sectionLabel}>Location</Text>
      {hasCoords ? (
        <Text style={styles.coords}>
          {report.lat.toFixed(5)}, {report.lon.toFixed(5)}
        </Text>
      ) : (
        <Text style={styles.noValue}>No location recorded</Text>
      )}

      <Text style={styles.sectionLabel}>Reported</Text>
      <Text style={styles.timestamp}>
        {new Date(report.createdAt).toLocaleString()}
      </Text>

      {report.proofPhotoUri && (
        <>
          <Text style={styles.sectionLabel}>Proof Photo</Text>
          <Image source={{ uri: report.proofPhotoUri }} style={styles.photo} />
        </>
      )}

      {isOpen && (
        <TouchableOpacity
          style={[styles.collectButton, collecting && styles.collectButtonDisabled]}
          onPress={handleMarkCollected}
          disabled={collecting}
        >
          {collecting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.collectButtonText}>Mark Collected</Text>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 20,
  },
  statusOpen: {
    backgroundColor: '#FFF3E0',
  },
  statusCollected: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusTextOpen: {
    color: '#FF9500',
  },
  statusTextCollected: {
    color: '#34C759',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 16,
  },
  photo: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  noPhotoBox: {
    width: '100%',
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPhotoText: {
    color: '#999',
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    color: '#222',
    lineHeight: 22,
  },
  coords: {
    fontSize: 15,
    color: '#444',
    fontVariant: ['tabular-nums'],
  },
  noValue: {
    fontSize: 15,
    color: '#bbb',
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
  },
  collectButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  collectButtonDisabled: {
    opacity: 0.6,
  },
  collectButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
