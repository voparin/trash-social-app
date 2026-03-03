import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoleSelectScreen from '../../screens/RoleSelectScreen';
import { RoleProvider } from '../../contexts/RoleContext';
import App from '../../App';

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: View, Marker: View };
});

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: { Balanced: 3 },
}));

// ─── RoleSelectScreen ─────────────────────────────────────────────────────────

describe('RoleSelectScreen', () => {
  let nav;

  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(null);
    AsyncStorage.setItem.mockResolvedValue(undefined);
    AsyncStorage.removeItem.mockResolvedValue(undefined);
    nav = { navigate: jest.fn(), dispatch: jest.fn() };
  });

  // TC-008
  it('TC-008: renders title and both role buttons', () => {
    const { getByText } = render(
      <RoleProvider>
        <RoleSelectScreen navigation={nav} />
      </RoleProvider>
    );
    expect(getByText('Select Your Role')).toBeTruthy();
    expect(getByText('Reporter')).toBeTruthy();
    expect(getByText('Collector')).toBeTruthy();
  });

  // TC-009
  it('TC-009: tapping Reporter calls saveRole("reporter") and navigates to ReporterHome', async () => {
    const { getByText } = render(
      <RoleProvider>
        <RoleSelectScreen navigation={nav} />
      </RoleProvider>
    );
    fireEvent.press(getByText('Reporter'));
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@trash_social_role', 'reporter');
      expect(nav.navigate).toHaveBeenCalledWith('ReporterHome');
    });
  });

  // TC-010
  it('TC-010: tapping Collector calls saveRole("collector") and navigates to CollectorHome', async () => {
    const { getByText } = render(
      <RoleProvider>
        <RoleSelectScreen navigation={nav} />
      </RoleProvider>
    );
    fireEvent.press(getByText('Collector'));
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@trash_social_role', 'collector');
      expect(nav.navigate).toHaveBeenCalledWith('CollectorHome');
    });
  });
});

// ─── AppNavigator initial route ───────────────────────────────────────────────

describe('AppNavigator initial route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.setItem.mockResolvedValue(undefined);
    AsyncStorage.removeItem.mockResolvedValue(undefined);
  });

  // TC-011
  it('TC-011: role "reporter" in context → opens on ReporterHome', async () => {
    AsyncStorage.getItem.mockImplementation((key) =>
      Promise.resolve(key === '@trash_social_role' ? 'reporter' : null)
    );
    const { findByText } = render(<App />);
    await findByText('+ New Report');
  });

  // TC-012
  it('TC-012: role "collector" in context → opens on CollectorHome', async () => {
    AsyncStorage.getItem.mockImplementation((key) =>
      Promise.resolve(key === '@trash_social_role' ? 'collector' : null)
    );
    const { findByText } = render(<App />);
    await findByText(/No reports yet/);
  });

  // TC-013
  it('TC-013: role null in context → opens on RoleSelect', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    const { findByText } = render(<App />);
    await findByText('Select Your Role');
  });
});
