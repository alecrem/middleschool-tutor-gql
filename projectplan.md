# Project Plan: Add Paging to Card Search (Issue #25)

## Overview
Change the card search functionality from showing up to 50 results to showing 20 results per page with pagination controls. The backend already provides total count information, so we can implement proper paging.

## Current State Analysis
- Search currently limits to 50 results (hard-coded in multiple places)
- Backend already returns total count of matches
- Frontend shows partial results indicator when total > shown count
- No pagination UI or API parameters exist

## Implementation Plan

### Todo Items

- [ ] **Backend: Add offset parameter to data layer**
  - Modify `searchCards()` in `/Users/ale/repos/mtg/middleschool-mono/apps/api/src/data.ts`
  - Add `offset` parameter and update slice logic
  - Change default limit from 50 to 20

- [ ] **Backend: Update GraphQL schema**
  - Add `offset` parameter to searchCards query in `/Users/ale/repos/mtg/middleschool-mono/apps/api/src/index.ts`
  - Update resolver to handle offset parameter

- [ ] **Frontend: Update API client**
  - Add `offset` parameter to `searchCards()` in `/Users/ale/repos/mtg/middleschool-mono/apps/web/app/lib/api.ts`
  - Change default limit from 50 to 20

- [ ] **Frontend: Update route loader**
  - Parse `page` parameter from URL query string in `/Users/ale/repos/mtg/middleschool-mono/apps/web/app/routes/_index.tsx`
  - Calculate offset from page number (offset = (page - 1) * 20)
  - Pass offset to searchCards call

- [ ] **Frontend: Create pagination component**
  - Create reusable pagination component with Previous/Next buttons
  - Show current page and total pages
  - Generate proper URLs with page parameter

- [ ] **Frontend: Integrate pagination in search results**
  - Add pagination component to search results area
  - Position below CardList component
  - Only show when total results > 20

- [ ] **Testing: Verify functionality**
  - Test pagination with various search queries
  - Verify URL updates correctly
  - Test edge cases (first page, last page, no results)

## Technical Details

### Key Changes
1. **Limit change:** 50 → 20 results per page
2. **New parameters:** Add `offset` parameter throughout the stack
3. **URL structure:** Add `?page=N` parameter to search URLs
4. **Pagination math:** `offset = (page - 1) * 20`

### Files to Modify
- `/Users/ale/repos/mtg/middleschool-mono/apps/api/src/data.ts` - Core search logic
- `/Users/ale/repos/mtg/middleschool-mono/apps/api/src/index.ts` - GraphQL resolver
- `/Users/ale/repos/mtg/middleschool-mono/apps/web/app/lib/api.ts` - Frontend API client
- `/Users/ale/repos/mtg/middleschool-mono/apps/web/app/routes/_index.tsx` - Route loader
- `/Users/ale/repos/mtg/middleschool-mono/apps/web/app/components/` - New pagination component

### Design Considerations
- Keep pagination simple with Previous/Next buttons
- Maintain existing URL structure and add page parameter
- Preserve all existing search functionality
- Show page information (e.g., "Page 2 of 5")

## Review Section

### Implementation Completed ✅

All planned features have been successfully implemented and tested:

#### Backend Changes
- **Data Layer**: Modified `searchCards()` function in `data.ts` to accept `offset` parameter and changed default limit from 50 to 20
- **GraphQL Schema**: Added `offset` parameter to searchCards query and updated resolver
- **Pagination Logic**: Updated slice logic to use `sortedMatches.slice(offset, offset + limit)`

#### Frontend Changes  
- **API Client**: Updated `searchCards()` function in `api.ts` to include offset parameter
- **Route Loader**: Added page parameter parsing and offset calculation (`offset = (page - 1) * 20`)
- **Pagination Component**: Created reusable `Pagination.tsx` component with:
  - Previous/Next navigation buttons
  - Current page and total pages display
  - Proper URL generation with page parameter
  - Disabled state styling for edge cases
  - Internationalization support (English/Japanese)
- **Integration**: Added pagination component below CardList with conditional rendering

#### Translation Updates
- Added pagination translation keys for both English and Japanese:
  - `previous`: "Previous" / "前へ"
  - `next`: "Next" / "次へ"  
  - `pageInfo`: "Page {{current}} of {{total}}" / "{{current}}ページ / {{total}}ページ"

#### Technical Verification
- ✅ TypeScript compilation passes without errors
- ✅ Pagination logic tested with various search result counts
- ✅ URL parameter handling works correctly
- ✅ Component renders conditionally (only shows when results > 20)
- ✅ Theme integration works with proper disabled state styling

#### Key Features Delivered
1. **Reduced Page Size**: Changed from 50 to 20 results per page
2. **URL-based Navigation**: Page state persists in URL with `?page=N` parameter  
3. **Smart Pagination**: Only shows when there are multiple pages
4. **Accessible Design**: Proper disabled states and clear navigation
5. **Internationalized**: Full support for English and Japanese interfaces
6. **Preserved Functionality**: All existing search filters work with pagination

The implementation follows the existing code patterns and maintains simplicity while adding the requested pagination functionality.