# Project Plan: Allow Basic Snow Land Cards in Deck Validation

## Problem
Currently, the deck validation logic only exempts "Basic Land" cards from the 4-copy limit. However, Basic Snow Land cards (like Snow-Covered Forest, Snow-Covered Island, etc.) should also be allowed to have more than 4 copies in a deck, as they follow the same rules as regular basic lands in Magic: The Gathering.

## Current Implementation Analysis
The validation logic in `apps/web/app/lib/deckValidation.ts` uses an `isBasicLand()` function (line 6-9) that only checks if the card type includes "Basic Land". This works for regular basic lands but does not properly handle Basic Snow Lands.

Looking at the current implementation:
```typescript
function isBasicLand(cardDetails?: { type: string } | null): boolean {
  if (!cardDetails?.type) return false;
  return cardDetails.type.includes("Basic Land");
}
```

## Solution
Update the `isBasicLand()` function to check for both "Basic" AND "Land" in the card type, which will cover both regular basic lands and Basic Snow Lands.

## Todo Items
- [ ] Update the `isBasicLand()` function to check for "Basic" AND "Land" separately
- [ ] Add comprehensive test cases for Basic Snow Land cards
- [ ] Test with various Basic Snow Land card names (Snow-Covered Forest, Snow-Covered Island, etc.)
- [ ] Verify that regular basic lands continue to work as before
- [ ] Run existing tests to ensure no regressions
- [ ] Run lint and typecheck commands

## Files to Modify
1. `apps/web/app/lib/deckValidation.ts` - Update the `isBasicLand()` function
2. `apps/web/app/lib/deckValidation.test.ts` - Add test cases for Basic Snow Land cards

## Test Plan
- Verify Basic Snow Land cards are exempt from 4-copy limit
- Verify regular basic lands continue to work
- Verify validation works correctly for both main deck and sideboard
- Test edge cases like mixed basic and snow basic lands
- Ensure no regressions in existing functionality

## Review
All tasks have been successfully completed. The implementation involved:

### Changes Made:
1. **Updated `isBasicLand()` function** (`apps/web/app/lib/deckValidation.ts:6-10`):
   - Changed from checking `cardDetails.type.includes("Basic Land")` 
   - To checking `cardDetails.type.includes("Basic") && cardDetails.type.includes("Land")`
   - This allows both "Basic Land — Forest" and "Basic Snow Land — Forest" to be recognized as basic lands

2. **Added comprehensive test coverage** (`apps/web/app/lib/deckValidation.test.ts:122-168`):
   - Test for unlimited Basic Snow Land cards
   - Test for mixed basic and basic snow lands
   - Test for all 5 types of basic snow lands (Plains, Island, Swamp, Mountain, Forest)
   - All tests ensure proper deck size (60+ cards in main deck)

### Verification:
- ✅ All existing tests continue to pass (no regressions)
- ✅ Basic Snow Land cards are now exempt from 4-copy limit
- ✅ Regular basic lands continue to work as before
- ✅ Mixed decks with both basic and basic snow lands work correctly
- ✅ Lint and typecheck pass without issues

### Summary:
The fix was minimal and targeted - only changing the string matching logic in the `isBasicLand()` function to be more flexible. This allows any card type containing both "Basic" and "Land" to be treated as a basic land, which correctly handles both regular basic lands and basic snow lands while maintaining all existing functionality.