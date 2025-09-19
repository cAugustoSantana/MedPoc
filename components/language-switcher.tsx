'use client';

import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';
import { Globe, Loader2, ChevronsUpDown } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export function LanguageSwitcher() {
  const { isMobile } = useSidebar();
  const [locale, setLocale] = useState('en');
  const [isChanging, setIsChanging] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Get locale from cookie or default to 'en'
    const savedLocale =
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('locale='))
        ?.split('=')[1] || 'en';
    setLocale(savedLocale);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;

    setIsChanging(true);

    // Save locale to cookie
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    setLocale(newLocale);

    // Reload the page to apply the new language
    window.location.reload();
  };

  const currentLanguage = languages.find((lang) => lang.code === locale);

  // Prevent hydration mismatch by showing default state until client loads
  if (!isClient) {
    return (
      <div className="px-2 py-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:opacity-50"
              disabled={isChanging}
            >
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="font-medium">🇺🇸 English</span>
              </div>
              <ChevronsUpDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-48 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={locale === language.code ? 'bg-accent' : ''}
                disabled={isChanging}
              >
                <span className="mr-2">{language.flag}</span>
                {language.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="px-2 py-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:opacity-50"
            disabled={isChanging}
          >
            <div className="flex items-center gap-2">
              {isChanging ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Globe className="h-4 w-4" />
              )}
              <span className="font-medium">
                {currentLanguage?.flag} {currentLanguage?.name}
              </span>
            </div>
            <ChevronsUpDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-48 rounded-lg"
          side={isMobile ? 'bottom' : 'right'}
          align="end"
          sideOffset={4}
        >
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={locale === language.code ? 'bg-accent' : ''}
              disabled={isChanging}
            >
              <span className="mr-2">{language.flag}</span>
              {language.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
