import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { CommonActions } from '@react-navigation/native';

export default function ReportSavedScreen({ navigation, route }) {
  const { report } = route.params;
  const hasLocation = report.lat != null && report.lon != null;

  const handleBackToHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'ReporterHome' }],
      })
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Report Saved!</Text>
      <Text style={styles.description} numberOfLines={2}>
        {report.description}
      </Text>

      <Text style={styles.sectionLabel}>Photo</Text>
      {report.photoUri ? (
        <Image source={{ uri: report.photoUri }} style={styles.photo} />
      ) : (
        <View style={styles.noPhotoBox}>
          <Text style={styles.noPhotoText}>No photo attached</Text>
        </View>
      )}

      <Text style={styles.sectionLabel}>Location</Text>
      {hasLocation ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: report.lat,
            longitude: report.lon,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker coordinate={{ latitude: report.lat, longitude: report.lon }} />
        </MapView>
      ) : (
        <View style={styles.noLocationBox}>
          <Text style={styles.noLocationText}>
            No location recorded for this report.
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.homeButton} onPress={handleBackToHome}>
        <Text style={styles.homeButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#34C759',
    marginBottom: 6,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  noPhotoBox: {
    width: '100%',
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  noPhotoText: {
    color: '#999',
    fontSize: 14,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 24,
  },
  noLocationBox: {
    width: '100%',
    height: 80,
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  noLocationText: {
    color: '#FF9500',
    fontSize: 14,
    textAlign: 'center',
  },
  homeButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  homeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
