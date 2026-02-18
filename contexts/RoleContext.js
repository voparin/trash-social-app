import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ROLE_STORAGE_KEY = '@trash_social_role';

export const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved role on mount
  useEffect(() => {
    loadRole();
  }, []);

  const loadRole = async () => {
    try {
      const savedRole = await AsyncStorage.getItem(ROLE_STORAGE_KEY);
      if (savedRole) {
        setRole(savedRole);
      }
    } catch (error) {
      console.error('Failed to load role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRole = async (newRole) => {
    try {
      await AsyncStorage.setItem(ROLE_STORAGE_KEY, newRole);
      setRole(newRole);
    } catch (error) {
      console.error('Failed to save role:', error);
    }
  };

  const clearRole = async () => {
    try {
      await AsyncStorage.removeItem(ROLE_STORAGE_KEY);
      setRole(null);
    } catch (error) {
      console.error('Failed to clear role:', error);
    }
  };

  return (
    <RoleContext.Provider value={{ role, isLoading, saveRole, clearRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
