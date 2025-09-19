# Internationalization (i18n) Implementation Guide

## Overview

This document explains how internationalization (i18n) is implemented in the MedPoc application, allowing users to switch between English and Spanish languages.

## Architecture

### Simple Cookie-Based Approach

We use a **simple, cookie-based i18n solution** that doesn't modify URL routing. This approach:

```
┌─────────────────────────────────────────────────────────────┐
│                    i18n Architecture                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User Action: Language Switch                              │
│  ↓                                                         │
│  Language Switcher Component                               │
│  ↓                                                         │
│  Cookie Updated: locale=es                                 │
│  ↓                                                         │
│  Page Reload                                               │
│  ↓                                                         │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │ Server Components│    │ Client Components│               │
│  │                 │    │                 │                │
│  │ getTranslations()│    │ useTranslations()│               │
│  │ ↓               │    │ ↓               │                │
│  │ Read Cookie     │    │ Read Cookie     │                │
│  │ ↓               │    │ ↓               │                │
│  │ Load messages/  │    │ Load messages/  │                │
│  │ es.json         │    │ es.json         │                │
│  │ ↓               │    │ ↓               │                │
│  │ Render with     │    │ Render with     │                │
│  │ Spanish text    │    │ Spanish text    │                │
│  └─────────────────┘    └─────────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- ✅ **No complex routing** - All existing URLs work exactly as before
- ✅ **Cookie-based language preference** - Language choice persists across sessions
- ✅ **Server-side and client-side support** - Works with both SSR and CSR components
- ✅ **Loading states** - Prevents flash of translation keys during language switching

## File Structure

```
├── messages/
│   ├── en.json          # English translations
│   └── es.json          # Spanish translations
├── hooks/
│   └── use-translations.ts    # Client-side translation hook
├── lib/
│   └── translations.ts        # Server-side translation utilities
└── components/
    ├── language-switcher.tsx  # Language selection component
    └── app-sidebar.tsx        # Updated with i18n support
```

## Implementation Details

### 1. Translation Files

**Location**: `messages/en.json` and `messages/es.json`

These JSON files contain all translatable text organized by feature:

```json
{
  "Navigation": {
    "dashboard": "Dashboard",
    "patients": "Patients",
    "appointments": "Appointments",
    "prescriptions": "Prescriptions"
  },
  "Dashboard": {
    "schedule": "Schedule",
    "quickStats": "Quick Stats",
    "totalPatients": "Total Patients"
  }
}
```

### 2. Client-Side Translation Hook

**Location**: `hooks/use-translations.ts`

```typescript
export function useTranslations() {
  const [locale, setLocale] = useState('en');
  const [translations, setTranslations] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Loads translations based on cookie
  // Returns: { t, locale, isLoading }
}
```

**Usage in Client Components**:

```typescript
import { useTranslations } from '@/hooks/use-translations';

export function MyComponent() {
  const { t, isLoading } = useTranslations();

  return (
    <div>
      {isLoading ? 'Loading...' : t('Navigation.dashboard')}
    </div>
  );
}
```

### 3. Server-Side Translation Utilities

**Location**: `lib/translations.ts`

```typescript
export async function getTranslations() {
  // Reads locale from cookies
  // Returns translation object
}

export function t(translations: Record<string, unknown>, key: string): string {
  // Safely accesses nested translation keys
  // Returns translated string or fallback key
}
```

**Usage in Server Components**:

```typescript
import { getTranslations, t } from '@/lib/translations';

export default async function DashboardPage() {
  const translations = await getTranslations();

  return (
    <h1>{t(translations, 'Navigation.dashboard')}</h1>
  );
}
```

### 4. Language Switcher Component

**Location**: `components/language-switcher.tsx`

Features:

- **Loading state** - Shows spinner during language change
- **Disabled state** - Prevents multiple simultaneous changes
- **Cookie persistence** - Saves language choice for future visits
- **Page reload** - Ensures all components update with new language

```typescript
const handleLanguageChange = (newLocale: string) => {
  setIsChanging(true);
  document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
  window.location.reload(); // Ensures complete language switch
};
```

## How It Works

### 1. Initial Load

1. **Server-side**: `getTranslations()` reads the `locale` cookie
2. **Client-side**: `useTranslations()` reads the same cookie
3. **Fallback**: If no cookie exists, defaults to English (`en`)

### 2. Language Switching

1. **User clicks language switcher**
2. **Loading state activates** - Prevents flash of translation keys
3. **Cookie is updated** with new locale
4. **Page reloads** to apply new language everywhere
5. **All components** load with new translations

### 3. Loading State Management

**Problem Solved**: Flash of untranslated content (FOUC)

**Solution**:

- **Client components**: Show fallback English text while loading
- **Language switcher**: Shows loading spinner during change
- **Server components**: Load translations before rendering

## Usage Examples

### Adding New Translations

1. **Add to translation files**:

```json
// messages/en.json
{
  "NewFeature": {
    "title": "New Feature",
    "description": "This is a new feature"
  }
}

// messages/es.json
{
  "NewFeature": {
    "title": "Nueva Característica",
    "description": "Esta es una nueva característica"
  }
}
```

2. **Use in components**:

```typescript
// Client component
const { t } = useTranslations();
return <h2>{t('NewFeature.title')}</h2>;

// Server component
const translations = await getTranslations();
return <h2>{t(translations, 'NewFeature.title')}</h2>;
```

### Adding New Languages

1. **Create new translation file**: `messages/fr.json`
2. **Update language switcher**:

```typescript
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }, // Add new language
];
```

## Benefits of This Approach

### ✅ **Simplicity**

- No complex routing configuration
- No middleware complications
- Easy to understand and maintain

### ✅ **Performance**

- No URL changes required
- Fast language switching
- Minimal bundle size impact

### ✅ **User Experience**

- Smooth loading states
- No flash of untranslated content
- Persistent language preference

### ✅ **Developer Experience**

- Simple API for both server and client
- Type-safe translation keys
- Easy to add new languages

## Best Practices

### 1. **Translation Key Naming**

```typescript
// ✅ Good - Hierarchical and descriptive
t('Dashboard.quickStats');
t('Navigation.patients');
t('Common.save');

// ❌ Avoid - Flat structure
t('dashboard_quick_stats');
t('nav_patients');
```

### 2. **Loading States**

```typescript
// ✅ Always handle loading state
const { t, isLoading } = useTranslations();
return isLoading ? 'Loading...' : t('Navigation.dashboard');
```

### 3. **Fallback Handling**

```typescript
// ✅ Server-side fallback
const translations = await getTranslations();
return t(translations, 'Navigation.dashboard'); // Returns key if not found
```

## Troubleshooting

### Common Issues

1. **Flash of translation keys**

   - **Solution**: Ensure loading states are properly implemented
   - **Check**: `isLoading` state in client components

2. **Translations not updating**

   - **Solution**: Language switcher triggers page reload
   - **Check**: Cookie is being set correctly

3. **Server/client mismatch**
   - **Solution**: Both use same cookie-based approach
   - **Check**: Cookie path and domain settings

### Debugging

```typescript
// Check current locale
console.log(document.cookie);

// Check translations loading
const { isLoading, locale } = useTranslations();
console.log({ isLoading, locale });
```

## Future Enhancements

### Potential Improvements

1. **Lazy loading** - Load translations on demand
2. **Pluralization** - Handle singular/plural forms
3. **Date/Number formatting** - Locale-specific formatting
4. **RTL support** - Right-to-left language support
5. **Translation management** - External translation service integration

### Migration Path

If you need more advanced features in the future, this simple implementation can be easily migrated to:

- `next-intl` with proper routing
- `react-i18next` with more features
- Custom translation management system

## Conclusion

This i18n implementation provides a **simple, effective solution** for MedPoc's bilingual requirements. It prioritizes:

- **Simplicity** over complexity
- **User experience** over technical sophistication
- **Maintainability** over feature richness

The approach successfully handles English/Spanish switching while maintaining all existing functionality and providing a smooth user experience.
