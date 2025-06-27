# Issue #19: Add detailed search controls to Card Search (and the API)

## Problem Statement
Currently, the card search only accepts a text query. Users need more advanced search functionality including the ability to filter by card type (Artifact, Creature, Enchantment, Instant, Land, Sorcery). The search form should be converted to an accordion component that can be collapsed/expanded.

## Current Implementation Analysis
- Frontend: Single text input search form in `_index.tsx`
- API: GraphQL search query that accepts `query` and `limit` parameters
- Search logic: Filters cards by name, name_ja, type, and text fields
- Card type data is available in the `type` field of each card

## Plan

### Frontend Changes

- [ ] Create an Accordion component for collapsible sections
- [ ] Create SearchControls component to replace the current search form
- [ ] Add card type filtering UI (select dropdown)
- [ ] Update search form to include card type parameter
- [ ] Update the search route loader to handle card type parameter
- [ ] Add translation keys for card types and new UI elements

### Backend Changes

- [ ] Update GraphQL schema to accept cardType parameter in searchCards query
- [ ] Modify searchCards function in data.ts to filter by card type
- [ ] Update API types to include card type filtering

### Testing

- [ ] Test accordion expand/collapse functionality
- [ ] Test card type filtering with various types
- [ ] Test combination of text search + card type filtering
- [ ] Verify translations work for both English and Japanese

## Implementation Details

### Card Types to Support
Based on MTG card types: Artifact, Creature, Enchantment, Instant, Land, Sorcery

### Accordion Behavior
- Collapsed by default showing only search input and button
- When expanded, shows additional controls including card type filter
- Should maintain state during navigation

### API Changes
- Add optional `cardType` parameter to searchCards query
- Filter cards where `type` field contains the selected card type
- Combine with existing text-based filtering

## Files to Modify

### Frontend
- `app/routes/_index.tsx` - Update to use new SearchControls component
- `app/components/SearchControls.tsx` - New component with accordion functionality
- `app/components/Accordion.tsx` - New reusable accordion component
- `app/lib/api.ts` - Update searchCards function to accept cardType parameter
- `app/lib/types.ts` - Add types for search parameters
- `app/lib/translations.ts` - Add new translation keys

### Backend
- `apps/api/src/index.ts` - Update GraphQL schema
- `apps/api/src/data.ts` - Update searchCards function
- `apps/api/src/types.ts` - Update types if needed

## Review Section

### Implementation Completed Successfully ✅

All planned features have been implemented:

**Frontend Changes Completed:**
- ✅ Created reusable `Accordion` component with smooth animations and theme support
- ✅ Created `SearchControls` component that replaces the old search form
- ✅ Added card type filtering UI with dropdown for all major MTG card types
- ✅ Updated search form to include cardType parameter in URL params
- ✅ Updated route loader to handle cardType parameter
- ✅ Added complete translation keys for English and Japanese

**Backend Changes Completed:**
- ✅ Updated GraphQL schema to accept optional `cardType` parameter
- ✅ Modified `searchCards` function to filter by card type using case-insensitive matching
- ✅ Updated API types and function signatures throughout the stack

**Key Features Implemented:**
1. **Accordion Behavior**: The search form now shows basic search by default, with advanced options (card type filter) hidden in an accordion that can be expanded
2. **Card Type Filtering**: Users can filter by Artifact, Creature, Enchantment, Instant, Land, Sorcery, or show all types
3. **Combined Filtering**: Text search and card type filtering work together
4. **State Preservation**: Search parameters are preserved in URL and form state
5. **Internationalization**: All new UI elements support both English and Japanese
6. **Theme Integration**: All new components use the existing theme system

**Files Modified:**
- `app/components/Accordion.tsx` (new)
- `app/components/SearchControls.tsx` (new) 
- `app/routes/_index.tsx` (updated to use SearchControls)
- `app/lib/api.ts` (updated searchCards function)
- `app/lib/types.ts` (added SearchParams interface)
- `app/lib/translations.ts` (added card type translations)
- `apps/api/src/index.ts` (updated GraphQL schema and resolvers)
- `apps/api/src/data.ts` (updated searchCards with card type filtering)

**Testing Results:**
- ✅ TypeScript compilation successful with no errors
- ✅ Development servers start without issues
- ✅ All components integrate properly with existing theme system
- ✅ Search functionality maintains backward compatibility

The implementation successfully converts the search form into an accordion as requested, with the basic search visible by default and advanced controls (card type filtering) expandable. The accordion automatically expands when a card type filter is active, providing good UX.