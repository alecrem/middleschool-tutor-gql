# Project Plan: Add Deck Check Page (Issue #15)

## Problem Analysis
Issue #15 requests a new page for checking Magic deck lists to validate card legality in Middle School format. The feature should:

1. Accept a multi-line textarea input with deck lists in formats like:
   - `40 Lightning Bolt`
   - `20x Mountain`
   - `Balance` (no quantity)

2. Parse each line to extract quantity and card name
3. Check each card against Middle School legality
4. Return formatted results with:
   - Standardized quantity format (no 'x', default to '1' if missing)
   - Banned cards marked as "(Banned!)" / "(禁止カード!)"
   - Not found cards marked as "(Not Found!)" / "(該当なし!)"

## Current Codebase Structure
- Single page app with Remix framework
- Current page: Card search functionality at `/`
- API communication via GraphQL to `searchCards` query
- Internationalization support (English/Japanese)
- Consistent styling and layout patterns

## Implementation Plan

### Todo Items

- [ ] **Create deck check route** - Add new route `/deck-check` for the deck validation page
- [ ] **Add deck check API function** - Create new API function to handle deck list validation
- [ ] **Implement deck parsing logic** - Parse deck list format and extract quantities/card names
- [ ] **Create deck validation types** - Add TypeScript interfaces for deck validation results
- [ ] **Build deck check UI components** - Create textarea input and results display components
- [ ] **Add internationalization** - Add English/Japanese translations for deck check page
- [ ] **Add navigation** - Update main page to include link to deck check functionality
- [ ] **Style results output** - Create read-only textarea and rich UI for banned/not found cards
- [ ] **Test deck validation** - Verify parsing works with various input formats

### Implementation Details

#### New API Function
- Create `validateDeckList(deckText: string)` function in `api.ts`
- Send multiline text to GraphQL API (new query needed)
- Return formatted deck list + arrays of banned/not found cards

#### New Types
```typescript
interface DeckValidationResult {
  formattedDeckList: string;
  bannedCards: { name: string; count: number }[];
  notFoundCards: { name: string; count: number }[];
  totalBanned: number;
  totalNotFound: number;
}
```

#### New Route Structure
- `/app/routes/deck-check.tsx` - Main deck validation page
- Similar structure to existing index route
- Form with textarea input
- Results display area

#### Translations
- Add deck check specific translations to `translations.ts`
- Support both English and Japanese for all new UI elements

## Simplicity Approach
- Reuse existing styling patterns and components
- Follow same GraphQL communication pattern
- Maintain consistent internationalization approach
- Keep UI simple with textarea input/output model

## Files to Modify
- `/app/routes/deck-check.tsx` (new)
- `/app/lib/api.ts` (add new function)
- `/app/lib/types.ts` (add new interfaces)
- `/app/lib/translations.ts` (add new translations)
- `/app/routes/_index.tsx` (add navigation link)

## Backend Requirements
- New GraphQL query/mutation for deck validation
- Server-side parsing of deck list format
- Batch card lookup and validation logic