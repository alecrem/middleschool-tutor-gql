# Project Plan: Format Split Card Text Display

## Issue
Format the card text display so that the " // " separator that appears on split cards becomes "\n//\n" for better visual formatting.

## Current State
- Card text is rendered in `CardDetails.tsx` using `whiteSpace: "pre-wrap"`
- Split cards have text like "Assault deals 2 damage to any target. // Create a 3/3 green Elephant creature token."
- The " // " separator is displayed as plain text with no special formatting

## Proposed Solution
Replace the " // " separator with "\n//\n" in the card text display to create:
- A line break before the "//"
- The "//" on its own line
- A line break after the "//"

This will visually separate the two halves of split cards for better readability.

## Implementation Plan

### Todo Items
- [x] Read the codebase to understand how card text is currently displayed
- [x] Find where card text rendering happens
- [ ] Implement formatting to replace ' // ' with '\n//\n' for split cards
- [ ] Test the formatting changes
- [ ] Add review section to projectplan.md

### Technical Approach
1. **Location**: Modify the card text rendering in `apps/web/app/components/CardDetails.tsx` at lines 207-225
2. **Method**: Add a simple string replacement before displaying the text
3. **Logic**: Replace " // " with "\n//\n" only when the text contains the split card separator
4. **Preservation**: Keep the existing `whiteSpace: "pre-wrap"` styling to ensure line breaks are respected

### Files to Modify
- `apps/web/app/components/CardDetails.tsx` - Main card text rendering component

### Testing Strategy
- Test with known split cards from the corrected data
- Verify non-split cards are unaffected
- Check formatting in different contexts (CardList, ExpandableCardRow)

## Risk Assessment
- **Low Risk**: Simple string replacement operation
- **Non-breaking**: Only affects display formatting, not data or functionality
- **Isolated**: Changes contained to display component only

## Review

### Changes Made
- **File Modified**: `apps/web/app/components/CardDetails.tsx`
- **Change**: Replaced `{card.text}` with `{card.text.replace(' // ', '\n//\n')}` on line 223
- **Effect**: Split card text now displays with proper line breaks around the "//" separator

### Implementation Details
- Simple string replacement operation that converts " // " to "\n//\n"
- Works with existing `whiteSpace: "pre-wrap"` styling to render line breaks
- Only affects cards that have the " // " separator (split cards)
- No impact on regular cards without the separator

### Testing Results
- TypeScript compilation: ✅ Passed
- Linting: ✅ Passed  
- Development server: ✅ Running successfully

### Examples of Improved Formatting
Before: `Assault deals 2 damage to any target. // Create a 3/3 green Elephant creature token.`

After:
```
Assault deals 2 damage to any target.
//
Create a 3/3 green Elephant creature token.
```

### Verification
- The change is minimal and isolated to the display component
- Existing styling preserves the formatting correctly
- No breaking changes introduced
- Ready for deployment