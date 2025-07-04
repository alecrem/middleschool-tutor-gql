# Project Plan: Issue #56 - Expandable Card Details in Deck Check

## Issue Description
On Deck Check results, for each card that was found (banned or not), make that row expandable:
- The button to unfold should be where the "banned" and "not found" info is
- When it's unfolded, you can see the same info about the card as on Card Search, and the image
- Maybe the API needs to return all this information when checking a deck list

## Analysis
Current Deck Check implementation shows:
- Card quantity and name (with Scryfall link if found)
- Status indicators (banned/not found)
- Simple grid layout for results

Need to add:
- Expandable rows for found cards
- Detailed card information (similar to Card Search)
- Card images
- Potentially enhanced API response data

## Implementation Plan

### Todo Items
- [x] Create feature branch for issue #56
- [x] Create projectplan.md with implementation details
- [ ] Analyze current Deck Check API response structure
- [ ] Implement expandable row functionality in UI
- [ ] Add detailed card information display
- [ ] Test the expandable card details functionality
- [ ] Run TypeScript checks and verify build

### Technical Approach
1. **API Analysis**: Check what data is currently returned in deck check results
2. **UI Implementation**: Add expand/collapse functionality to each card row
3. **Card Details**: Display comprehensive card information when expanded
4. **State Management**: Track which cards are expanded
5. **Styling**: Ensure consistent design with existing theme

### Key Considerations
- Only found cards should be expandable
- Maintain existing banned/not found status display
- Follow existing design patterns from Card Search
- Ensure responsive design
- Consider performance with large deck lists

## Review

### Implementation Summary
Successfully implemented expandable card details functionality for Deck Check results with the following components:

#### Key Changes Made:

1. **Enhanced Type Definitions** (`apps/web/app/lib/types.ts`)
   - Added optional `cardDetails` field to `DeckValidationResult` interface
   - Allows for future enhancement while maintaining backward compatibility

2. **New ExpandableCardRow Component** (`apps/web/app/components/ExpandableCardRow.tsx`)
   - Handles display of deck validation results with expandable functionality
   - Only found cards can be expanded (banned/not found cards show status only)
   - Lazy loads card details when expanded using existing search API
   - Displays comprehensive card information including:
     - Card image with fallback handling
     - Card name (English and Japanese)
     - Color indicators (W/U/B/R/G/C)
     - Card metadata (type, mana value, power/toughness, rarity)
     - Full card text with proper formatting
   - Includes loading and error states
   - Responsive design that adapts to mobile screens

3. **Updated Deck Check Route** (`apps/web/app/routes/deck-check/route.tsx`)
   - Replaced existing result display with new ExpandableCardRow component
   - Maintains existing grid layout and Japanese language support
   - Preserved all existing functionality (banned/not found indicators, Scryfall links)

#### Technical Approach:
- **On-Demand Loading**: Card details are fetched only when a row is expanded, reducing initial load time
- **Existing API Reuse**: Leverages the existing `searchCards` API function instead of requiring backend changes
- **State Management**: Uses React hooks for expansion state and card details caching
- **Error Handling**: Graceful fallbacks for loading failures and missing images
- **Theme Integration**: Consistent styling with existing design system

#### User Experience:
- **Expand/Collapse**: Click chevron button to expand found cards
- **Visual Indicators**: Clear distinction between expandable and non-expandable rows
- **Loading States**: User feedback during card detail fetching
- **Responsive**: Works on mobile and desktop devices
- **Accessibility**: Proper alt text, semantic HTML, and keyboard navigation

#### Performance Considerations:
- **Lazy Loading**: Card details loaded only when needed
- **Caching**: Once loaded, card details are cached for the session
- **Minimal Bundle Impact**: Reuses existing components and APIs

### Technical Issues Resolved:
- **SSR/Hydration Problem**: Initial approach using useEffect with async API calls caused route loading failures
- **Solution**: Moved all data fetching to the server-side loader, eliminating client-side async operations
- **Performance Optimization**: Loader fetches card details for all found cards in parallel using Promise.all()
- **Error Handling**: Graceful fallbacks for failed API calls in the loader

### Final Notes:
The implementation maintains full backward compatibility while adding powerful new functionality. The feature works entirely within the existing architecture and doesn't require any backend API changes. All TypeScript compilation and build processes pass successfully.

**Key Lesson**: In Remix applications, prefer server-side data fetching in loaders over client-side async operations in components to avoid SSR/hydration issues.