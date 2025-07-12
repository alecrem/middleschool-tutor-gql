# Fix Japanese Text Alignment in Deck Check Results

## Problem
The Japanese card names in the deck check results are currently center-aligned due to CSS Grid's default alignment behavior, but they should be left-aligned for better readability and to follow standard Japanese text layout conventions.

## Analysis
After examining the codebase, I found that:

1. **Main grid layout** is defined in `/apps/web/app/routes/deck-check/route.tsx` (lines 458-478)
2. **Japanese column rendering** is handled in `/apps/web/app/components/ExpandableCardRow.tsx` (lines 96-114)
3. The issue is that CSS Grid items are center-aligned by default, and there's no explicit text alignment set for the Japanese text column

## Solution Plan

### Todo Items

- [ ] 1. Add `textAlign: "left"` style to the Japanese name column in ExpandableCardRow component
- [ ] 2. Test the change by viewing the deck check page with Japanese language selected
- [ ] 3. Verify that English text alignment remains unchanged
- [ ] 4. Ensure the fix works across different screen sizes

## Implementation Details

The fix involves adding a `textAlign: "left"` property to the Japanese column div in the ExpandableCardRow component (around line 98-114). This will override the default center alignment behavior and make Japanese text left-aligned while keeping the rest of the layout intact.

## Files to Modify

- `/apps/web/app/components/ExpandableCardRow.tsx` - Add text alignment style to Japanese column

## Testing

- Switch to Japanese language in the app
- Enter a deck list with cards that have Japanese translations
- Verify Japanese text is left-aligned
- Switch back to English and verify layout is unchanged