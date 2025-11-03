'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface AdminContextValue {
  isAdmin: boolean;
  toggleAdminMode: () => void;
  setAdminMode: (value: boolean) => void;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

const STORAGE_KEY = 'product-store-admin-mode';

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(STORAGE_KEY);
      if (storedValue) {
        setIsAdmin(storedValue === 'true');
      }
    } catch (error) {
      console.error('Failed to load admin mode from storage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isAdmin));
    } catch (error) {
      console.error('Failed to persist admin mode:', error);
    }
  }, [isAdmin]);

  const toggleAdminMode = () => setIsAdmin((prev) => !prev);
  const setAdminMode = (value: boolean) => setIsAdmin(value);

  const value = useMemo(
    () => ({
      isAdmin,
      toggleAdminMode,
      setAdminMode,
    }),
    [isAdmin]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdminMode = (): AdminContextValue => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminMode must be used within an AdminProvider');
  }
  return context;
};
