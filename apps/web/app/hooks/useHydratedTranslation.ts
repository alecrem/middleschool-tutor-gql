import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
  const safeT = (key: string, options?: any): string => {
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

// English fallback translations to match what the server renders
function getFallbackTranslation(key: string, options?: any): string {
  const fallbacks: Record<string, string> = {
    // 404 page
    pageNotFound: "Page Not Found",
    pageNotFoundDescription: "The page you're looking for doesn't exist.",
    goBackHome: "Go back home",
    
    // Common UI
    title: "Middle School Tutor",
    searchCards: "Card Search",
    searchPlaceholder: "Search for cards...",
    search: "Search",
    searching: "Searching...",
    searchError: "Failed to search cards. Please try again.",
    deckValidationError: "Failed to validate deck. Please try again.",
    enterCardName: "Enter any text to search cards",
    noCardsFound: "No cards found. Try a different search term.",
    noImage: "No image",
    banned: "Banned",
    
    // Deck validation
    deckCheck: "Deck Check",
    deckListPlaceholder: 'Enter your deck list (e.g., "40 Lightning Bolt" or "20x Mountain")',
    validateDeck: "Validate Deck",
    validating: "Validating...",
    deckResults: "Validation Results",
    deckValid: "cards are legal",
    cardsNotAllowed: "cards are not allowed",
    bannedLabel: "Banned",
    notFound: "Not Found",
    cardSearchLink: "Card Search",
    deckCheckLink: "Deck Check",
    copyDeckList: "Copy Deck List",
    copied: "Copied!",
    copyFailed: "Copy failed",
    lines: "lines",
    
    // Theme and language
    selectTheme: "Select theme",
    themeSystem: "System",
    themeLight: "Light",
    themeDark: "Dark",
    
    // Advanced search
    advancedSearch: "Advanced Search",
    cardType: "Card Type",
    allCardTypes: "All Types",
    artifact: "Artifact",
    creature: "Creature",
    enchantment: "Enchantment",
    instant: "Instant",
    land: "Land",
    sorcery: "Sorcery",
    colors: "Colors",
    colorWhite: "White",
    colorBlue: "Blue",
    colorBlack: "Black",
    colorRed: "Red",
    colorGreen: "Green",
    power: "Power",
    toughness: "Toughness",
    cmc: "Mana Value",
    to: "to",
    resetToDefaults: "Reset to Defaults",
    
    // Pagination
    previous: "Previous",
    next: "Next",
    
    // Footer
    legalDisclaimer: "Portions of Middle School Tutor are unofficial Fan Content permitted under the Wizards of the Coast Fan Content Policy. The literal and graphical information presented on this site about Magic: The Gathering, including card images, mana symbols, and Oracle text, is copyright Wizards of the Coast, LLC, a subsidiary of Hasbro, Inc. Middle School Tutor is not produced by or endorsed by Wizards of the Coast. The GitHub and Twitter logos are copyright their respective owners. Middle School Tutor is not produced by or endorsed by these services.",
    footerLicense: "All other content MIT licensed since 2022 by",
  };

  let result = fallbacks[key] || key;
  
  // Handle interpolation for strings with variables
  if (options && typeof result === 'string') {
    Object.keys(options).forEach(optionKey => {
      result = result.replace(new RegExp(`{{${optionKey}}}`, 'g'), options[optionKey]);
    });
  }
  
  return result;
}