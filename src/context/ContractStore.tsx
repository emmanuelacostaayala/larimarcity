'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ContractPayload } from '@/types/contract';

export interface StoredContract {
    id: string;
    generatedAt: string; // ISO date
    payload: ContractPayload;
    filename: string;
    format: 'pdf' | 'docx' | 'zip' | 'both';
    blobUrl?: string; // Optional URL for preview/download
}

interface ContractStoreContextType {
    contracts: StoredContract[];
    addContract: (contract: StoredContract) => void;
    removeContract: (id: string) => void;
    clearAll: () => void;
}

const ContractStoreContext = createContext<ContractStoreContextType | null>(null);

const STORAGE_KEY = 'larimar_clm_contracts';

export function ContractStoreProvider({ children }: { children: React.ReactNode }) {
    const [contracts, setContracts] = useState<StoredContract[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setContracts(JSON.parse(stored));
        } catch { /* ignore */ }
    }, []);

    // Sync to localStorage on change (without blobUrl which is ephemeral)
    useEffect(() => {
        try {
            const toStore = contracts.map(({ blobUrl, ...rest }) => rest);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
        } catch { /* ignore */ }
    }, [contracts]);

    const addContract = useCallback((c: StoredContract) => {
        setContracts(prev => [c, ...prev]);
    }, []);

    const removeContract = useCallback((id: string) => {
        setContracts(prev => prev.filter(c => c.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setContracts([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return (
        <ContractStoreContext.Provider value={{ contracts, addContract, removeContract, clearAll }}>
            {children}
        </ContractStoreContext.Provider>
    );
}

export function useContractStore() {
    const ctx = useContext(ContractStoreContext);
    if (!ctx) throw new Error('useContractStore must be used within ContractStoreProvider');
    return ctx;
}
