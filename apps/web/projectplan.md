# Project Plan: Data Display Adjustments (Issue #21)

## Objective
Improve card data display by:
1. Formatting power/toughness values to remove unnecessary trailing ".0"
2. Hiding rarity values from the card display

## Analysis
Looking at `apps/web/app/components/CardList.tsx`:
- Power/toughness is displayed on line 203: `{card.power}/{card.toughness}`
- Rarity is displayed on line 196: `<span>{card.rarity}</span>`

## Todo Items

- [x] Create utility function to format power/toughness values (remove trailing .0)
- [x] Update CardList component to use the formatting function for power/toughness
- [x] Remove rarity display from CardList component
- [x] Test the changes to ensure formatting works correctly

## Review

### Changes Made

1. **Added formatPowerToughness utility function** in CardList.tsx:
   - Converts "2.0" → "2" by removing trailing zeros
   - Preserves non-integer values like "1.5" → "1.5"
   - Uses parseFloat() and modulo check to determine if value is whole number

2. **Updated power/toughness display** in CardList.tsx:
   - Applied formatPowerToughness() to both power and toughness values
   - Display now shows clean integer values without ".0" suffix

3. **Removed rarity display** from CardList.tsx:
   - Removed rarity span and its separator bullet
   - Card info now shows: Type • CMC • Power/Toughness (cleaner layout)

### Testing
- Build completed successfully with no errors
- All changes are minimal and focused on display formatting only
- No API or data structure changes required

## Implementation Details

### Power/Toughness Formatting
- Create a helper function that converts "2.0" → "2" but keeps "1.5" → "1.5"
- Apply this formatting to both power and toughness values

### Rarity Removal
- Remove the rarity span and its separator from the card info display
- Adjust the remaining info layout to look clean without rarity

## Files to Modify
- `apps/web/app/components/CardList.tsx` - Main changes for display formatting and rarity removal