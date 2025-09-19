# i18n Quick Reference Guide

## Quick Start

### 1. Add New Translation Keys

**Step 1**: Add to both language files

```json
// messages/en.json
{
  "MyFeature": {
    "title": "My Feature",
    "button": "Click Me"
  }
}

// messages/es.json
{
  "MyFeature": {
    "title": "Mi Característica",
    "button": "Haz Clic"
  }
}
```

**Step 2**: Use in components

```typescript
// Client component
const { t } = useTranslations();
return <h1>{t('MyFeature.title')}</h1>;

// Server component
const translations = await getTranslations();
return <h1>{t(translations, 'MyFeature.title')}</h1>;
```

### 2. Add New Language

**Step 1**: Create translation file

```bash
# Create messages/fr.json
cp messages/en.json messages/fr.json
# Edit with French translations
```

**Step 2**: Update language switcher

```typescript
// components/language-switcher.tsx
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }, // Add this
];
```

## API Reference

### Client-Side Hook

```typescript
import { useTranslations } from '@/hooks/use-translations';

const { t, locale, isLoading } = useTranslations();

// Usage
const title = t('Navigation.dashboard');
const isEnglish = locale === 'en';
const showLoading = isLoading;
```

### Server-Side Functions

```typescript
import { getTranslations, t } from '@/lib/translations';

// In server component
const translations = await getTranslations();
const title = t(translations, 'Navigation.dashboard');
```

### Language Switcher

```typescript
import { LanguageSwitcher } from '@/components/language-switcher';

// Usage in any component
<LanguageSwitcher />
```

## Common Patterns

### Loading State Pattern

```typescript
const { t, isLoading } = useTranslations();

return (
  <div>
    {isLoading ? (
      <Skeleton className="h-4 w-32" />
    ) : (
      t('Navigation.dashboard')
    )}
  </div>
);
```

### Conditional Rendering

```typescript
const { locale } = useTranslations();

return (
  <div>
    {locale === 'es' && <SpanishOnlyContent />}
    {locale === 'en' && <EnglishOnlyContent />}
  </div>
);
```

### Form Labels

```typescript
const { t } = useTranslations();

return (
  <form>
    <label>{t('Form.name')}</label>
    <input placeholder={t('Form.namePlaceholder')} />
    <button>{t('Common.save')}</button>
  </form>
);
```

## File Locations

```
├── messages/
│   ├── en.json          # English translations
│   └── es.json          # Spanish translations
├── hooks/
│   └── use-translations.ts    # Client hook
├── lib/
│   └── translations.ts        # Server utilities
└── components/
    └── language-switcher.tsx  # Language selector
```

## Translation Key Structure

```
Navigation.dashboard          → "Dashboard" / "Panel de Control"
Navigation.patients          → "Patients" / "Pacientes"
Dashboard.quickStats         → "Quick Stats" / "Estadísticas Rápidas"
Common.save                  → "Save" / "Guardar"
Common.cancel                → "Cancel" / "Cancelar"
```

## Debugging

### Check Current Language

```javascript
// In browser console
document.cookie.split('; ').find((row) => row.startsWith('locale='));
```

### Check Translations Loading

```typescript
const { isLoading, locale, t } = useTranslations();
console.log({ isLoading, locale, sample: t('Navigation.dashboard') });
```

### Force Language Change

```javascript
// In browser console
document.cookie = 'locale=es; path=/; max-age=31536000';
window.location.reload();
```

## Best Practices

### ✅ Do

- Use hierarchical key names: `Feature.section.item`
- Always handle loading states
- Provide fallback text for loading
- Test both languages thoroughly

### ❌ Don't

- Use flat key names: `feature_section_item`
- Forget loading states
- Hardcode text in components
- Assume translations exist

## Common Issues & Solutions

### Issue: Flash of translation keys

**Solution**: Implement loading states

```typescript
const { t, isLoading } = useTranslations();
return isLoading ? 'Loading...' : t('Navigation.dashboard');
```

### Issue: Translations not updating

**Solution**: Language switcher reloads page automatically

```typescript
// This is handled automatically in language-switcher.tsx
window.location.reload();
```

### Issue: Server/client mismatch

**Solution**: Both use same cookie approach

```typescript
// Both read from same cookie
const locale =
  document.cookie
    .split('; ')
    .find((row) => row.startsWith('locale='))
    ?.split('=')[1] || 'en';
```
