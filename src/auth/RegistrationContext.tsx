import AsyncStorage from '@react-native-async-storage/async-storage';
import { type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'srp.registered';

type RegistrationContextValue = {
  /** False until the saved state has been read, so returning users don't see the sign up page flash by. */
  ready: boolean;
  registered: boolean;
  /**
   * Records that this user has signed up. There is no backend yet, so the details they typed are not saved
   * anywhere; only a "registered" flag is kept on the device. Replace with a real API call later.
   */
  register: () => void;
};

const RegistrationContext = createContext<RegistrationContextValue | null>(null);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => setRegistered(saved === 'true'))
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const register = useCallback(() => {
    setRegistered(true);
    AsyncStorage.setItem(STORAGE_KEY, 'true').catch(() => {});
  }, []);

  const value = useMemo(() => ({ ready, registered, register }), [ready, registered, register]);
  return <RegistrationContext.Provider value={value}>{children}</RegistrationContext.Provider>;
}

export function useRegistration() {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error('useRegistration must be used inside <RegistrationProvider>');
  return ctx;
}
