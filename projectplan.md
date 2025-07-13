# Project Plan: Add Card Counts and Improve Validation (Issue #90)

## Problem Analysis
Currently the deck display lacks clear card count information and validation messages are generic. We need to:
1. Add card counts to main deck and sideboard headings
2. Reorganize UI layout (move buttons to right of main deck heading)
3. Improve validation with specific error messages for different validation failures

## Research Completed ✓
- [x] Found main deck display in `/apps/web/app/routes/deck-check/route.tsx` (lines 481-559)
- [x] Located validation logic in `/apps/web/app/routes/deck-check/loader.ts` and route component (lines 49-51)
- [x] Found i18n system using `/apps/web/app/lib/translations.ts` with English/Japanese support
- [x] Identified "copy list" and "share list" buttons in validation results section (lines 428-477)

## Current Structure Analysis
- **Validation**: Currently only checks for banned cards and unknown cards (lines 49-51 in route.tsx)
- **Layout**: Copy/share buttons are in a flex container to the right of validation results heading
- **Card Counts**: No card counts currently displayed in headings
- **Main Deck Section**: Lines 482-512 (no heading, just a bordered container)
- **Sideboard Section**: Lines 514-558 (has "Sideboard" h3 heading on line 517-525)

## Implementation Plan

### Phase 1: Research and Understanding ✓
- [x] Examine current deck display components
- [x] Review validation logic and error handling
- [x] Understand i18n structure for bilingual support

### Phase 2: Card Count Display ✓
- [x] Add main deck card count to heading
- [x] Update sideboard heading to include card count
- [x] Ensure proper internationalization

### Phase 3: UI Layout Changes ✓
- [x] Move copy/share buttons to right of main deck heading
- [x] Ensure responsive design is maintained

### Phase 4: Validation Improvements ✓
- [x] Extend validation to check main deck minimum (60 cards)
- [x] Add sideboard maximum validation (15 cards)
- [x] Separate banned cards and unknown cards validation messages
- [x] Implement combined error message formatting (comma-separated for multiple errors)
- [x] Update validation display from heading to paragraph format

### Phase 5: Testing and Polish ✓
- [x] Test with various deck configurations
- [x] Verify internationalization works correctly
- [x] Build succeeds without errors

## Implementation Summary ✅

All features have been successfully implemented:

### ✅ Card Count Display
- Added "Main Deck: X cards" / "メインデッキ: X枚" heading with proper card count calculation
- Updated "Sideboard: X cards" / "サイドボード: X枚" heading to show actual card count
- Both headings use internationalized strings with interpolation

### ✅ UI Layout Improvements  
- Moved "Copy Deck List" and "Share Deck" buttons to the right of the Main Deck heading
- Removed buttons from the validation results section for cleaner layout
- Maintained responsive design with flexbox layout

### ✅ Enhanced Validation System
- **New validation rules**: Main deck minimum (60 cards), sideboard maximum (15 cards)
- **Specific error messages**: Separate messages for banned cards, unknown cards, deck size issues
- **Consistent error formatting**: 
  - Always shows "This deck is not valid:" / "このデッキは無効です：" header when deck is invalid
  - Followed by bullet point list showing all specific validation issues
  - Bullet points have no punctuation at the end
  - Works for both single and multiple validation errors
- **Improved UI**: Changed validation display from heading to paragraph format with proper styling

### ✅ Technical Implementation
- Extended validation logic in route component with card count calculations  
- Added 10 new translation keys for English and Japanese (including "deckNotValid")
- Implemented smart validation message formatting with bullet point lists
- Maintained existing code patterns and component structure
- All changes are minimal and focused, avoiding major refactoring

### ✅ Build & Testing
- Application builds successfully without errors  
- Development server runs correctly
- Ready for manual testing at http://localhost:5173/