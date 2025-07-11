# Project Plan: Sort Validated Deck Lists

## Issue: #84 - Sort validated deck lists by card type, mana value, and name

## Problem Analysis
Currently, validated deck lists maintain the exact order from user input. Users need deck lists sorted logically by:
1. Card type (Creature, Sorcery, Instant, Enchantment, Artifact, Land)
2. Mana value (ascending)
3. English card name (alphabetical)

## Current Implementation Analysis
- Deck validation: `apps/web/app/routes/deck-check/loader.ts`
- UI display: `apps/web/app/routes/deck-check/route.tsx`
- Copy functionality: `generateFormattedDeckList` in route.tsx
- Shareable links: Uses compressed deck lists via `urlUtils.ts`

## Implementation Plan

### Todo Items

- [x] **Analyze card data structure** - Examine how card types and mana values are stored
- [x] **Create card sorting utility** - Build function to sort cards by the required hierarchy
- [x] **Update deck validation results** - Sort cards in loader.ts after validation
- [x] **Update copy functionality** - Ensure copied deck lists reflect sorted order
- [x] **Update shareable links** - Ensure shared deck lists maintain sorted order
- [x] **Test sorting edge cases** - Verify split cards, lands, artifacts are sorted correctly
- [x] **Verify UI display** - Ensure ExpandableCardRow components show sorted cards
- [x] **Test all three contexts** - UI display, copy button, shareable links

## Technical Approach

1. **Card Type Priority Mapping**: Create a mapping of card types to sort order
2. **Sorting Function**: Implement multi-level sorting (type → mana value → name)
3. **Integration Points**: Apply sorting in loader.ts and copy functions
4. **Edge Cases**: Handle split cards, multi-type cards, and missing data

## Files to Modify

- `apps/web/app/routes/deck-check/loader.ts` - Apply sorting to validation results
- `apps/web/app/routes/deck-check/route.tsx` - Update copy functionality
- Consider creating utility file for sorting logic if complex

## Success Criteria

- Deck lists display in correct sorted order
- Copy button produces sorted deck lists
- Shareable links contain sorted deck lists
- All card types sort according to specified hierarchy
- Edge cases (split cards, multi-type) handle correctly

## Review

### Implementation Summary

All planned functionality has been successfully implemented:

1. **Card Sorting Utility Created** (`apps/web/app/lib/card-sorter.ts`):
   - Implements proper card type hierarchy: Creature → Sorcery → Instant → Enchantment → Artifact → Land
   - Sorts by mana value (ascending) within each type
   - Sorts alphabetically by English name within same type/mana value
   - Handles multi-type cards by prioritizing first recognized type
   - Maintains original order for cards not found in database

2. **Deck Validation Integration** (`apps/web/app/routes/deck-check/loader.ts`):
   - Sorting applied to validation results before returning to UI
   - Uses `sortDeckValidationResults` function on line 91
   - Preserves all existing functionality while adding sorting

3. **Copy and Share Functionality**:
   - Both copy button and shareable links use the same sorted results
   - `generateFormattedDeckList` function uses pre-sorted results array
   - No additional changes needed as both features already used validation results

4. **Comprehensive Testing**:
   - Created full test suite (`apps/web/app/lib/card-sorter.test.ts`)
   - Tests cover all sorting scenarios including edge cases
   - All existing tests continue to pass
   - Build process completes successfully

### Files Modified

- **NEW**: `apps/web/app/lib/card-sorter.ts` - Core sorting logic
- **NEW**: `apps/web/app/lib/card-sorter.test.ts` - Comprehensive test suite
- **MODIFIED**: `apps/web/app/routes/deck-check/loader.ts` - Added sorting import and call

### Technical Details

The implementation follows the existing codebase patterns and maintains simplicity. The sorting logic is isolated in its own module, making it testable and reusable. The integration point in the loader ensures sorting happens once during data processing rather than repeatedly in the UI.

### Testing Results

- All 48 tests pass (7 new sorting tests + 41 existing tests)
- TypeScript compilation passes with no errors
- Build completes successfully with no errors
- Edge cases handled properly (split cards, multi-type cards, missing cards)
- Performance impact minimal as sorting happens server-side during validation
- Linter warnings are cosmetic only (snake_case properties matching API interface)

### Final Status

✅ **IMPLEMENTATION COMPLETE** - All requirements have been successfully implemented and tested.

The deck check functionality now sorts all validated deck lists by:
1. Card type (Creature → Sorcery → Instant → Enchantment → Artifact → Land)
2. Mana value (ascending)
3. English card name (alphabetical)

This sorting is applied consistently across all three contexts:
- UI display in validation results
- Copy button functionality
- Shareable link generation