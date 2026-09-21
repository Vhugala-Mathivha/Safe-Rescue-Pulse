import AsyncStorage from '@react-native-async-storage/async-storage';
import { type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LANGUAGES, type LanguageCode, type TranslationKey, translations } from './translations';

const STORAGE_KEY = 'srp.language';

type Params = Record<string, string | number>;

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  /** Looks up a string in the chosen language, falling back to English. `{name}` placeholders take `params`. */
  t: (key: TranslationKey, params?: Params) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  // Restore the language chosen in a previous session.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved && LANGUAGES.some((l) => l.code === saved)) setLanguageState(saved as LanguageCode);
      })
      .catch(() => {});
  }, []);

  const setLanguage = useCallback((code: LanguageCode) => {
    setLanguageState(code);
    AsyncStorage.setItem(STORAGE_KEY, code).catch(() => {});
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key, params) => {
        const text = translations[language][key] ?? translations.en[key] ?? key;
        if (!params) return text;
        return Object.entries(params).reduce((result, [name, v]) => result.split(`{${name}}`).join(String(v)), text);
      },
    }),
    [language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
