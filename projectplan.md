# Project Plan: Issue #5 - Highlight Perfect Matches in Card Search

## Problem Statement
When users search for cards, perfect matches (exact name matches) should be visually distinguished from partial matches by using a more solid border on the card.

## Current State Analysis
- Cards are displayed in a grid layout using `CardList.tsx` component
- Individual cards have light gray borders (`border: '1px solid #e5e7eb'`)
- All styling is done inline using React `style` prop
- Perfect match logic already exists in API (`apps/api/src/data.ts:50-81`)
- Cards show name, type, rarity, and other metadata in a clean layout

## Implementation Plan

### Todo Items
- [x] Create branch for issue #5 - card highlight feature
- [x] Research existing card UI components and styling
- [ ] Understand how perfect matches are identified
- [ ] Implement UI highlighting for perfect matches
- [ ] Test visual changes

### Technical Approach

1. **Perfect Match Detection**: 
   - API already sorts perfect matches first in `searchCards` function
   - Need to pass perfect match status to frontend
   - Add `isExactMatch` field to card data or detect client-side

2. **UI Enhancement**:
   - Modify `CardList.tsx` to apply different border styling
   - Use more prominent border (thicker, different color) for perfect matches
   - Maintain existing design aesthetic

3. **Implementation Strategy**:
   - **Option A**: Modify API to include `isExactMatch` boolean
   - **Option B**: Detect perfect matches client-side in CardList component
   - **Preferred**: Option B for simplicity - detect in frontend

### Visual Design
- **Normal cards**: Current styling (1px solid #e5e7eb border)
- **Perfect matches**: Thicker, more prominent border (2-3px solid #3b82f6 or similar)
- Keep all other styling consistent

### Files to Modify
- `apps/web/app/components/CardList.tsx` - Add highlighting logic
- Potentially `apps/web/app/lib/types.ts` - Add perfect match typing if needed

## Next Steps
1. Examine current CardList implementation
2. Implement client-side perfect match detection
3. Apply enhanced border styling
4. Test with various search terms
5. Create pull request with "Close #5"