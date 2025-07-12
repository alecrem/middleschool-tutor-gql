# Project Plan: Separate Main Deck and Sideboard in Deck Check Results

## Goal
Implement main deck and sideboard separation in the deck check feature by detecting the last `\n\n` in user input that has cards after it, treating everything after that point as sideboard cards.

## Implementation Plan

### Phase 1: Type System Updates
- [ ] Update `DeckEntry` type to include section information (`'main' | 'sideboard'`)
- [ ] Update `DeckValidationResult` type to include section information
- [ ] Update related interfaces/types as needed

### Phase 2: Parser Enhancement
- [ ] Enhance `parseDeckList()` in `deck-parser.ts` to:
  - Find the last `\n\n` that has valid cards after it
  - Split deck into main deck and sideboard sections
  - Return entries with section information
  - Handle edge cases (no sideboard, empty sections)

### Phase 3: Translations
- [ ] Add sideboard-related strings to `translations.ts`:
  - English: "Sideboard"
  - Japanese: "サイドボード"

### Phase 4: Sorting Updates
- [ ] Update `card-sorter.ts` to sort within each section separately
- [ ] Maintain existing sorting logic within each section

### Phase 5: Display Updates
- [ ] Update deck check loader to handle sectioned data
- [ ] Update deck check route display to:
  - Group cards by section
  - Show section headers for sideboard (only if cards exist)
  - Maintain existing card display functionality

### Phase 6: Testing
- [ ] Test with various deck formats
- [ ] Verify edge cases work correctly
- [ ] Ensure existing functionality is preserved

## Technical Details

### Current Flow
1. User input → `parseDeckList()` → `DeckEntry[]`
2. `DeckEntry[]` → validation → `DeckValidationResult[]`
3. `DeckValidationResult[]` → sorting → display

### New Flow
1. User input → enhanced `parseDeckList()` → `DeckEntry[]` (with sections)
2. `DeckEntry[]` → validation → `DeckValidationResult[]` (with sections)
3. `DeckValidationResult[]` → section-aware sorting → grouped display

### Key Files to Modify
- `apps/web/app/lib/deck-parser.ts` - Parser logic
- `apps/web/app/lib/card-sorter.ts` - Sorting logic
- `apps/web/app/lib/translations.ts` - Translations
- `apps/web/app/routes/deck-check/loader.ts` - Data handling
- `apps/web/app/routes/deck-check/route.tsx` - Display logic

## Notes
- Must handle "no sideboard" case (show no sideboard section)
- Must preserve all existing functionality
- Must maintain current sorting behavior within each section
- Copy/share functionality should preserve original format

## Review

### Changes Made
- [x] Updated `DeckEntry` and `DeckValidationResult` types to include `section: 'main' | 'sideboard'`
- [x] Enhanced `parseDeckList()` to detect the last `\n\n` that has valid cards after it
- [x] Updated card sorter to sort by section first (main before sideboard), then by existing criteria
- [x] Added sideboard translations ("Sideboard" / "サイドボード")
- [x] Updated deck check loader to pass through section information
- [x] Modified deck check display to group cards by section with localized headers
- [x] Updated all tests to include section property
- [x] Added comprehensive tests for sideboard detection logic

### Key Features Implemented
1. **Parser Enhancement**: Detects double newlines (`\n\n`) and treats content after the last one with valid cards as sideboard
2. **Sectioned Display**: Shows main deck first, then sideboard section (only if cards exist) with localized header
3. **Sorting**: Maintains existing card sorting within each section
4. **Copy Functionality**: Preserves original format with double newlines between main deck and sideboard
5. **Backward Compatibility**: Decks without sideboard work exactly as before

### Edge Cases Handled
- No sideboard cards: Shows no sideboard section
- Multiple `\n\n` separators: Uses the last one with valid cards after it
- Invalid/comment lines: Treated as cards if they parse successfully
- Empty sideboard sections: Ignored completely
- Existing functionality: All preserved without breaking changes

### Testing
- All existing tests updated and passing
- New tests added for sideboard detection scenarios
- TypeScript compilation successful
- Edge cases thoroughly tested

The implementation successfully separates main deck and sideboard according to the requirements while maintaining all existing functionality.