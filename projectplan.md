# Project Plan: Improve Deck Check Results UI

## Issue
GitHub Issue #82: Remove scryfall link from folded deck check results and make the whole row clickable to unfold

## Current State Analysis
Looking at the current implementation in `ExpandableCardRow.tsx`:

1. **Scryfall Link Location**: The scryfall link is currently displayed in the main card row (lines 69-84), visible even when the card details are folded/collapsed
2. **Expand Interaction**: Only the small chevron button in the dedicated column (lines 138-156) is clickable to expand card details
3. **Card Details**: Full card details with additional scryfall links are shown when expanded (lines 170-183)

## Problem
- The scryfall link is visible in the collapsed state, making the UI cluttered
- Only the small chevron button is clickable, which is not intuitive for users
- The entire row should be clickable to provide better UX

## Solution
1. **Remove scryfall link from folded state**: Show plain text card name when collapsed
2. **Keep scryfall link in expanded state**: The CardDetails component already shows scryfall links
3. **Make entire row clickable**: Add click handler to the main row container
4. **Maintain visual feedback**: Keep the chevron button as visual indicator but make the whole row interactive

## Todo Items
- [x] Modify ExpandableCardRow.tsx to remove scryfall link from main row display
- [x] Add click handler to make the entire row clickable for expansion
- [x] Ensure scryfall links remain available in the expanded CardDetails section
- [x] Test the interaction on both desktop and mobile
- [x] Verify accessibility (keyboard navigation, screen readers)

## Implementation Strategy
1. Remove the `<a>` tag wrapper from lines 69-84 and show plain text
2. Add click handler to the main row container (lines 56-85)
3. Add cursor pointer styling to indicate clickable area
4. Ensure the chevron button still works as before
5. Test that scryfall links are still accessible in the expanded state

## Testing Plan
- [x] Test row clicking to expand/collapse
- [x] Test chevron button still works independently
- [x] Verify scryfall links are available in expanded state
- [x] Test keyboard navigation and accessibility
- [x] Test on mobile devices for touch interaction

## Review

### Changes Made
1. **Removed scryfall link from main row display** (`ExpandableCardRow.tsx:69-81`)
   - Replaced `<a>` tag with plain text showing `result.matchedName` or `result.name`
   - Maintains color coding for banned/not found cards

2. **Made entire row clickable** (`ExpandableCardRow.tsx:56-81`)
   - Added `onClick={toggleExpanded}` to main card row container
   - Added `cursor: pointer` styling for expandable rows
   - Added keyboard navigation support (Enter/Space keys)

3. **Enhanced accessibility** (`ExpandableCardRow.tsx:58-66`)
   - Added `onKeyDown` handler for keyboard navigation
   - Added `tabIndex`, `role="button"`, and `aria-label` for screen readers
   - Proper focus management for expandable vs non-expandable rows

4. **Preserved existing functionality**
   - Scryfall links remain available in expanded CardDetails component
   - Chevron button still functions independently
   - Mobile responsiveness maintained
   - All existing styling and color coding preserved

### Impact
- **Cleaner UI**: No underlined links cluttering the collapsed view
- **Better UX**: Entire row is clickable, more intuitive interaction
- **Accessibility**: Full keyboard navigation and screen reader support
- **Maintained functionality**: All scryfall links still accessible when expanded