import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../lib/translations';

// Interface for translation interpolation options
interface TranslationOptions {
  [key: string]: string | number;
}

/**
 * A hydration-safe wrapper around useTranslation that prevents server/client mismatch.
 * During SSR, it returns English fallback text. After hydration, it returns localized content.
 */
export function useHydratedTranslation() {
  const [mounted, setMounted] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return a wrapper function that provides fallback during SSR
  const safeT = (key: string, options?: TranslationOptions): string => {
    if (!mounted) {
      // Return English fallback during SSR to prevent hydration mismatch
      return getFallbackTranslation(key, options);
    }
    return t(key, options) as string;
  };

  return {
    t: safeT,
    i18n: {
      ...i18n,
      // Return 'en' during SSR to prevent conditional rendering mismatch
      language: mounted ? i18n.language : 'en',
    },
    mounted,
  };
}

// Get English fallback translations from the translations file
function getFallbackTranslation(key: string, options?: TranslationOptions): string {
  const englishTranslations = translations.en.common;
  let result: string = englishTranslations[key as keyof typeof englishTranslations] || key;
  
  // Handle interpolation for strings with variables
  if (options && typeof result === 'string') {
    Object.keys(options).forEach(optionKey => {
      result = result.replace(new RegExp(`{{${optionKey}}}`, 'g'), String(options[optionKey]));
    });
  }
  
  return result;
}