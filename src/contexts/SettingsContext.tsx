'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteSettings, DEFAULT_SETTINGS } from '@/types/settings';
import { SettingsService } from '@/services/settingsService';

interface SettingsContextValue {
  settings: SiteSettings;
  refreshSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  refreshSettings: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  const refreshSettings = () => {
    setSettings(SettingsService.getSettings());
  };

  useEffect(() => {
    // Load settings from localStorage on mount
    refreshSettings();

    // Listen for real-time updates (from admin panel)
    window.addEventListener('site_settings_updated', refreshSettings);
    return () => {
      window.removeEventListener('site_settings_updated', refreshSettings);
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  return useContext(SettingsContext);
}
