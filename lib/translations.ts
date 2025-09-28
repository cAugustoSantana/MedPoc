import { cookies } from 'next/headers';

// Helper to safely import multiple JSON modules
async function loadModule(locale: string, file: string) {
  try {
    const mod = await import(`../messages/${locale}/${file}`);
    return mod.default;
  } catch {
    const fallback = await import(`../messages/en/${file}`);
    return fallback.default;
  }
}

export async function getTranslations() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('locale')?.value || 'en';

  const modules = [
    'patient.json',
    'appointment.json',
    'prescription.json',
    'common.json',
    'medicalRecord.json',
    'navigation.json',
    'dashboard.json',
    'tests.json',
  ];

  const translations: Record<string, unknown> = {};

  for (const file of modules) {
    const namespace = file.replace('.json', ''); // e.g. "patient"
    const content = await loadModule(locale, file);
    translations[namespace] = content;
  }

  return translations;
}

export function t(translations: Record<string, unknown>, key: string): string {
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
}
