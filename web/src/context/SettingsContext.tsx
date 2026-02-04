import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AdminSettings } from '../types';
import { settingsApi } from '../services/settingsApi';

export interface SettingsContextType {
  settings: AdminSettings | null;
  loading: boolean;
  error: string | null;
  restartRequired: boolean;
  saveSettings: (settings: Partial<AdminSettings>) => Promise<void>;
  loadSettings: () => Promise<void>;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restartRequired, setRestartRequired] = useState(false);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsApi.getSettings();
      setSettings(data);
      setRestartRequired(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: Partial<AdminSettings>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await settingsApi.saveSettings(newSettings);
      setSettings(response.settings);
      setRestartRequired(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const value: SettingsContextType = {
    settings,
    loading,
    error,
    restartRequired,
    saveSettings,
    loadSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
