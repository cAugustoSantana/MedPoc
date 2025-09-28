'use client';

import { useState, useEffect } from 'react';

// Keep your API the same
export function useTranslations() {
  const [locale, setLocale] = useState('en');
  const [translations, setTranslations] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Namespaces (files) you keep inside messages/{locale}/
  // Add/remove as your app grows.
  const NAMESPACES = [
    'common',
    'patient',
    'appointment',
    'prescription',
    'medicalRecord',
    'tests',
    'navigation',
  ] as const;

  // Load a single namespace with per-file fallback to English
  const loadNamespace = async (loc: string, ns: string) => {
    try {
      const mod = await import(`../messages/${loc}/${ns}.json`);
      return mod.default as Record<string, unknown>;
    } catch {
      // fallback to English for this specific file
      const fallback = await import(`../messages/en/${ns}.json`);
      return fallback.default as Record<string, unknown>;
    }
  };

  // Try to load all modular namespaces. If that fails entirely, fall back to legacy single-file.
  const loadAll = async (loc: string) => {
    try {
      const entries = await Promise.all(
        NAMESPACES.map(
          async (ns) => [ns, await loadNamespace(loc, ns)] as const
        )
      );
      // Build an object like: { common: {...}, patient: {...}, appointment: {...}, ... }
      return Object.fromEntries(entries) as Record<string, unknown>;
    } catch {
      // Legacy single-file fallback: messages/{locale}.json -> messages/en.json
      try {
        const mod = await import(`../messages/${loc}.json`);
        return mod.default as Record<string, unknown>;
      } catch {
        const fb = await import('../messages/en.json');
        return fb.default as Record<string, unknown>;
      }
    }
  };

  useEffect(() => {
    const savedLocale =
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('locale='))
        ?.split('=')[1] || 'en';

    setLocale(savedLocale);
    setIsLoading(true);

    (async () => {
      const dict = await loadAll(savedLocale);
      setTranslations(dict);
      setIsLoading(false);
    })();
  }, []);

  // Same t() API, but now it can resolve namespaced keys like "appointment.Appointments.title"
  const t = (key: string): string => {
    if (!translations) return key;

    const parts = key.split('.');
    let node: unknown = translations;

    for (const p of parts) {
      if (
        node &&
        typeof node === 'object' &&
        p in (node as Record<string, unknown>)
      ) {
        node = (node as Record<string, unknown>)[p];
      } else {
        return key; // not found → return the key
      }
    }

    return typeof node === 'string' ? node : key;
  };

  return { t, locale, isLoading };
}
