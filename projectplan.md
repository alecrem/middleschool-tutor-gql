# Add 4-Copy Limit Validation Rule

## Problem Statement
Add a new deck validation rule: "This deck contains more than 4 copies of a card"

## Requirements Analysis
- Cards with the same English name are considered the same card
- If multiple lines contain the same card within main deck or sideboard, consolidate quantities
- Don't consolidate between main deck and sideboard (count separately)
- Total copies = main deck copies + sideboard copies
- Cards with "Basic Land" in their type are exempt (unlimited copies allowed)
- Validation should show which specific cards exceed the limit

## Current Architecture Analysis
- Validation logic in `apps/web/app/lib/deckValidation.ts`
- Card type detection available via `cardDetails.type` field
- Basic lands identified by type containing "Basic Land —"
- Current validation structure supports adding new rules

## Implementation Plan

### Phase 1: Core Logic Implementation
- [ ] Add helper function to check if a card is a basic land
- [ ] Add helper function to count copies of each unique card name across sections
- [ ] Add function to validate 4-copy rule and return violating cards
- [ ] Update main `validateDeck` function to include copy limit check
- [ ] Update validation result type to include copy limit violations

### Phase 2: Integration & Testing
- [ ] Add internationalization keys for copy limit error messages
- [ ] Update `getValidationErrors` and `getValidationMessage` functions
- [ ] Test with various deck configurations:
  - Basic deck with no violations
  - Deck with >4 non-basic lands
  - Deck with >4 basic lands (should be valid)
  - Deck with same card in main and sideboard totaling >4
  - Deck with multiple entries of same card that need consolidation

### Phase 3: Error Display
- [ ] Verify error messages display correctly in the UI
- [ ] Ensure copy limit violations are clearly communicated to users

## Files to Modify
1. `apps/web/app/lib/deckValidation.ts` - Core validation logic
2. `apps/web/app/lib/types.ts` - Add new validation result properties if needed  
3. Internationalization files - Add new error message keys

## Test Cases to Verify
1. **Valid deck**: Standard deck with ≤4 copies of each non-basic card
2. **Invalid deck**: Deck with 5+ copies of a non-basic card
3. **Basic land exemption**: Deck with 10+ basic lands (should be valid)
4. **Cross-section counting**: 3 copies in main + 2 copies in sideboard = 5 total (invalid)
5. **Card consolidation**: Multiple lines with same card name get consolidated before counting

## Success Criteria
- New validation rule correctly identifies decks with >4 copies of non-basic cards
- Basic lands are properly exempted from the rule
- Error messages clearly indicate which cards violate the limit
- Existing validation continues to work correctly
- UI displays the new validation errors appropriately

## Implementation Review

### Changes Made

#### Core Logic (`apps/web/app/lib/deckValidation.ts`)
✅ **Added helper functions:**
- `isBasicLand()` - Checks if a card is a basic land by examining its type line for "Basic Land"
- `countCardCopies()` - Consolidates card counts across all sections using matched names
- `validateCopyLimits()` - Validates 4-copy rule, exempting basic lands

✅ **Updated main validation function:**
- `validateDeck()` now includes copy limit validation
- Added new return properties: `copyLimitViolations`, `hasCopyLimitViolations`
- Updated `isDeckValid` calculation to include copy limit check

✅ **Updated error handling:**
- `getValidationErrors()` now includes copy limit violations

#### Internationalization (`apps/web/app/lib/translations.ts`)
✅ **Added new error message keys:**
- English: "This deck contains more than 4 copies of a card"
- Japanese: "このデッキには4枚を超えるカードが含まれています"

#### Testing (`apps/web/app/lib/deckValidation.test.ts`)
✅ **Created comprehensive test suite covering:**
- Legal decks with no violations
- Copy limit violations for non-basic cards
- Basic land exemptions (unlimited copies allowed)
- Multiple card violations
- Integration with existing validation rules
- Edge cases like empty decks and duplicate entries

### Key Features Implemented

1. **Cross-section counting**: Cards are counted across main deck and sideboard
2. **Card name consolidation**: Multiple entries of the same card are consolidated using matched names
3. **Basic land exemption**: Cards with "Basic Land" in their type are exempt from the 4-copy limit
4. **Multiple violation detection**: Can detect and report multiple cards exceeding the limit
5. **Backward compatibility**: All existing validation rules continue to work unchanged

### Test Results  
- ✅ All existing tests continue to pass
- ✅ 17 new tests added and passing (14 validation + 3 copy/share)
- ✅ Total: 69 tests passing
- ✅ No regressions in API functionality

### Technical Implementation Notes
- Uses the existing `cardDetails.type` field to detect basic lands
- Leverages `matchedName` when available for accurate card counting
- Integrates seamlessly with existing validation pipeline
- Returns specific violating card names for detailed error reporting

The implementation successfully addresses all requirements from GitHub issue #92 and maintains full backward compatibility with existing functionality.

### Display Consolidation Fix

#### Problem Identified
- During testing, discovered that duplicate card entries (e.g., "1 Disenchant", "1 Disenchant", "1 Disenchant") were not being consolidated in the UI display
- Validation logic correctly counted duplicates, but users saw confusing display

#### Solution Implemented
✅ **Added display consolidation functions:**
- `consolidateCardsForDisplay()` - Consolidates duplicate card entries by name and sums quantities
- `separateDeckSectionsForDisplay()` - Provides consolidated sections for UI display

✅ **Updated validation hook:**
- `useDeckValidation()` now returns both raw data (for validation) and consolidated data (for display)
- Added `mainDeckCardsDisplay` and `sideboardCardsDisplay` properties

✅ **Updated UI component:**
- `deck-check/route.tsx` now uses consolidated display arrays
- Users now see "3 Disenchant" instead of three separate "1 Disenchant" entries

✅ **Added comprehensive tests:**
- 6 additional test cases covering consolidation edge cases
- Tests verify both display consolidation and validation accuracy
- All 66 tests passing

#### Result
- UI now correctly displays consolidated card entries (e.g., "3 Disenchant")
- Validation logic remains unchanged and accurate 
- Copy limit violations are detected correctly regardless of how cards are entered
- Enhanced user experience with cleaner, more intuitive deck display

### Copy/Share Consolidation Fix

#### Problem Identified  
- Copy to clipboard and share URL functionality was not consolidating duplicate cards
- Users would copy/share deck lists with "1 Disenchant, 1 Disenchant, 1 Disenchant" instead of "3 Disenchant"

#### Solution Implemented
✅ **Updated `useDeckList` hook:**
- `generateFormattedDeckList()` now uses `consolidateCardsForDisplay()` before formatting
- Consolidates duplicates within main deck and sideboard separately
- Maintains proper main deck / sideboard separation with double newlines

✅ **Added comprehensive tests:**
- 3 test cases covering copy/share consolidation scenarios
- Verifies duplicate consolidation within sections
- Tests main-deck-only and mixed deck configurations  
- All 69 total tests passing

#### Result
- ✅ **Copy to clipboard** now consolidates duplicate entries
- ✅ **Share URLs** now generate with consolidated deck lists
- ✅ **Validation** and **display** both work correctly with consolidation
- Users get clean, professional deck lists when copying or sharing