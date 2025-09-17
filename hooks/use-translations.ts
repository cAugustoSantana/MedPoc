'use client';

import { useState, useEffect } from 'react';

// Simple translation hook that works with cookies
export function useTranslations() {
  const [locale, setLocale] = useState('en');
  const [translations, setTranslations] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get locale from cookie
    const savedLocale =
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('locale='))
        ?.split('=')[1] || 'en';

    setLocale(savedLocale);
    setIsLoading(true);

    // Load translations based on locale
    import(`../messages/${savedLocale}.json`)
      .then((module) => {
        setTranslations(module.default);
        setIsLoading(false);
      })
      .catch(() => {
        // Fallback to English if locale file doesn't exist
        import('../messages/en.json').then((module) => {
          setTranslations(module.default);
          setIsLoading(false);
        });
      });
  }, []);

  const t = (key: string): string => {
    if (!translations) return key;

    const keys = key.split('.');
    let value: unknown = translations;

    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, locale, isLoading };
}
