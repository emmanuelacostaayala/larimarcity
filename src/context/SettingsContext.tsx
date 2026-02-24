'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AppSettings {
    // Default clause toggles
    defaultEarlyPaymentInterest: boolean;
    defaultGolfMembership: boolean;
    defaultQualityMemory: boolean;
    defaultVacationRental: boolean;
    // Default payment
    defaultCurrency: 'EUR' | 'USD';
    defaultConstructionInstallments: number;
    // Vendor info
    notaryName: string;
    sellerName: string;
}

const DEFAULT_SETTINGS: AppSettings = {
    defaultEarlyPaymentInterest: false,
    defaultGolfMembership: false,
    defaultQualityMemory: true,
    defaultVacationRental: false,
    defaultCurrency: 'EUR',
    defaultConstructionInstallments: 10,
    notaryName: 'DR. FRANKLIN CASTILLO CALDERON',
    sellerName: 'ÁLVARO MECA RUBIO',
};

interface SettingsContextType {
    settings: AppSettings;
    updateSettings: (partial: Partial<AppSettings>) => void;
    resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

const SETTINGS_KEY = 'larimar_clm_settings';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(SETTINGS_KEY);
            if (stored) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
        } catch { /* ignore */ }
    }, []);

    const updateSettings = (partial: Partial<AppSettings>) => {
        setSettings(prev => {
            const next = { ...prev, ...partial };
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
            return next;
        });
    };

    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS);
        localStorage.removeItem(SETTINGS_KEY);
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const ctx = useContext(SettingsContext);
    if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
    return ctx;
}
