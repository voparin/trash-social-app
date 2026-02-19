import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REPORTS_STORAGE_KEY = '@trash_social_reports';

const ReportsContext = createContext();

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const stored = await AsyncStorage.getItem(REPORTS_STORAGE_KEY);
      if (stored) {
        setReports(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
    }
  };

  const addReport = async (report) => {
    try {
      const updated = [report, ...reports];
      await AsyncStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updated));
      setReports(updated);
    } catch (error) {
      console.error('Failed to save report:', error);
    }
  };

  const updateReport = async (updatedReport) => {
    try {
      const updated = reports.map((r) =>
        r.id === updatedReport.id ? updatedReport : r
      );
      await AsyncStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updated));
      setReports(updated);
    } catch (error) {
      console.error('Failed to update report:', error);
    }
  };

  return (
    <ReportsContext.Provider value={{ reports, addReport, updateReport }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}
