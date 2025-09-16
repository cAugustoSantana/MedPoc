import { cookies } from 'next/headers';

export async function getTranslations() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('locale')?.value || 'en';

  try {
    const translations = await import(`../messages/${locale}.json`);
    return translations.default;
  } catch {
    // Fallback to English
    const translations = await import('../messages/en.json');
    return translations.default;
  }
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
