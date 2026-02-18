import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useReports } from '../contexts/ReportsContext';

// Location permission decision:
// If permission is denied, the user sees an inline message and may still submit
// without coordinates. This allows offline/no-GPS use cases without blocking the flow.

export default function CreateReportScreen({ navigation }) {
  const { addReport } = useReports();
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [coords, setCoords] = useState(null); // { lat, lon } | null
  const [locationMsg, setLocationMsg] = useState('');
  const [locLoading, setLocLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets?.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const fetchLocation = async () => {
    setLocLoading(true);
    setLocationMsg('');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocationMsg('Location permission denied — report will be saved without coordinates.');
      setLocLoading(false);
      return;
    }
    try {
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      setLocationMsg(
        `GPS: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`
      );
    } catch {
      setLocationMsg('Could not get location — report will be saved without coordinates.');
    }
    setLocLoading(false);
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Missing description', 'Please enter a description.');
      return;
    }
    setSubmitting(true);
    const report = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
      description: description.trim(),
      photoUri: photoUri || null,
      lat: coords?.lat ?? null,
      lon: coords?.lon ?? null,
      status: 'OPEN',
    };
    await addReport(report);
    setSubmitting(false);
    navigation.navigate('ReportSaved', { report });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe the trash..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>Photo</Text>
      <TouchableOpacity style={styles.photoButton} onPress={pickPhoto}>
        <Text style={styles.photoButtonText}>
          {photoUri ? 'Change Photo' : 'Pick Photo from Library'}
        </Text>
      </TouchableOpacity>
      {photoUri && <Image source={{ uri: photoUri }} style={styles.preview} />}

      <Text style={styles.label}>Location</Text>
      <TouchableOpacity
        style={styles.locationButton}
        onPress={fetchLocation}
        disabled={locLoading}
      >
        {locLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.locationButtonText}>Get GPS Location</Text>
        )}
      </TouchableOpacity>
      {locationMsg ? <Text style={styles.locationMsg}>{locationMsg}</Text> : null}

      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit Report</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  photoButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  photoButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginTop: 10,
    resizeMode: 'cover',
  },
  locationButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  locationButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  locationMsg: {
    marginTop: 8,
    fontSize: 13,
    color: '#555',
  },
  submitButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
