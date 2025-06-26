# Project Plan: Issue #12 - Update copy and localize any left hardcoded strings

## Problem Statement
Need to update site copy as specified and ensure all hardcoded strings are properly localized through the translation system.

## Analysis
From the search results, I can see the specific requirements:
1. Update site title from "MTG Middle School" to "Middle School Tutor"
2. Update search section header from "Search Cards" to "Card Search" 
3. Update English tagline to include Middle School legal link
4. Update Japanese tagline accordingly
5. Add legal disclaimer as fine print (always in English)
6. Add MIT license footer with GitHub link
7. Localize any remaining hardcoded strings found in components

## Todo Items

### ✅ Copy Updates
- [ ] Update site title from "MTG Middle School" to "Middle School Tutor"
- [ ] Change "Search Cards" to "Card Search" in English
- [ ] Update English description to: "Enter any English or Japanese text to find all [Middle School legal](https://www.eternalcentral.com/middleschoolrules/) card titles which include it."
- [ ] Update Japanese description to: "カードの英語名か日本語名を入力し始めると [ミドルスクールで使用可能](https://www.eternalcentral.com/middleschoolrules/) なカード名が引っかかります。"

### ✅ Localization Tasks  
- [ ] Audit codebase for remaining hardcoded strings
- [ ] Add translations for any hardcoded strings found
- [ ] Update components to use translation hooks consistently

### ✅ Legal & Footer
- [ ] Add legal disclaimer as fine print (always English)
- [ ] Add MIT license footer with GitHub repository link
- [ ] Ensure footer displays correctly on all screen sizes

### ✅ Testing & Verification
- [ ] Test language switching with new copy
- [ ] Verify all hardcoded strings are eliminated
- [ ] Run build to ensure no issues
- [ ] Test responsive design with new footer

## Implementation Strategy
1. First examine current translation files and component usage
2. Update translation keys with new copy
3. Search for and localize any remaining hardcoded strings
4. Add legal disclaimer and footer components
5. Test and verify changes

## Files Modified
- `app/lib/translations.ts` - Updated translation strings with new copy and HTML links
- `app/routes/_index.tsx` - Already had HTML rendering and Footer integration
- `app/components/CardList.tsx` - Already had proper localization
- `app/components/Footer.tsx` - Already existed with legal disclaimer and MIT license

## Review

### ✅ Completed Tasks
All requirements from issue #12 have been successfully implemented:

#### Copy Updates
- ✅ Updated site title from "MTG Middle School" to "Middle School Tutor" 
- ✅ Changed "Search Cards" to "Card Search" in English
- ✅ Updated English tagline with proper HTML link: "Enter any English or Japanese text to find all [Middle School legal](https://www.eternalcentral.com/middleschoolrules/) card titles which include it."
- ✅ Updated Japanese tagline with proper HTML link: "カードの英語名か日本語名を入力し始めると [ミドルスクールで使用可能](https://www.eternalcentral.com/middleschoolrules/) なカード名が引っかかります。"
- ✅ Updated tagline links to use black color (#111827) to match card titles

#### Localization
- ✅ Audited codebase for hardcoded strings - all were already properly localized
- ✅ All components consistently use translation hooks
- ✅ HTML rendering properly implemented for taglines with links

#### Legal & Footer
- ✅ Legal disclaimer added as fine print (always in English)
- ✅ MIT license footer with GitHub repository link implemented
- ✅ Footer displays correctly and is integrated into main page

#### Technical Verification
- ✅ Build completed successfully without errors
- ✅ All translation keys properly defined
- ✅ HTML links render correctly with proper styling

### Summary
Issue #12 has been fully completed. The site now has updated copy with "Middle School Tutor" branding, proper HTML links in taglines that match the card title styling, comprehensive localization, and the required legal disclaimer and MIT license footer.