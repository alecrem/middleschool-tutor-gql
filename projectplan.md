# Project Plan: Refine UI Text and Refactor Loaders (Issue #29)

## Overview
Improve UI text clarity and refactor the route structure by localizing text, clarifying search functionality descriptions, and organizing routes into directories with separate loader files.

## Current State Analysis
- **Routes**: Currently have `_index.tsx` (card search) and `deck-check.tsx` routes as flat files
- **Loaders**: Loader functions are embedded within route files 
- **UI Text Issues**:
  - "lines" text on deck check is hardcoded in English
  - Card search description says "card names" but actually searches names, types, and text
- **Route Structure**: Simple flat file structure in `app/routes/`

## Requirements
1. Localize "lines" text on the deck check textarea
2. Clarify where the query text field actually searches (not just card names)
3. Create directories for each route with `route.tsx` files
4. Extract loader functions to separate `loader.ts` files
5. Maintain same URLs and functionality

## Todo Items

### ✅ Analyze current route structure and UI text
- [x] Review current routes and their structure
- [x] Identify hardcoded UI text that needs localization
- [x] Understand current search functionality scope

### 🔄 Write project plan to projectplan.md
- [x] Document current state and requirements
- [x] Create detailed implementation plan

### ⏳ Localize 'lines' text on deck check textarea
- [ ] Add translation keys for "lines" text
- [ ] Update deck check component to use localized text
- [ ] Verify both English and Japanese translations

### ⏳ Clarify query text field description on card search
- [ ] Update search description to mention names, types, and text
- [ ] Update translation keys and text
- [ ] Ensure accuracy for both languages

### ⏳ Create directories for each route with route.tsx files
- [ ] Create `app/routes/_index/` directory
- [ ] Create `app/routes/deck-check/` directory
- [ ] Move route components to `route.tsx` files in respective directories
- [ ] Verify URLs remain unchanged

### ⏳ Extract loader functions to loader.ts files
- [ ] Extract `_index` loader to `app/routes/_index/loader.ts`
- [ ] Extract `deck-check` loader to `app/routes/deck-check/loader.ts`
- [ ] Update imports in route files
- [ ] Maintain all existing functionality

### ⏳ Test that URLs and functionality remain unchanged
- [ ] Test card search functionality at `/`
- [ ] Test deck check functionality at `/deck-check`
- [ ] Verify all features work as before
- [ ] Check build compilation

## Implementation Details

### Text Localization Changes
1. **Deck Check Lines**: Replace hardcoded "lines" with localized text
2. **Search Description**: Update to clarify search scope (names, types, text)

### Route Structure Changes
**Before:**
```
app/routes/
├── _index.tsx
└── deck-check.tsx
```

**After:**
```
app/routes/
├── _index/
│   ├── route.tsx
│   └── loader.ts
└── deck-check/
    ├── route.tsx
    └── loader.ts
```

### Loader Extraction
- Move loader functions to separate files for better organization
- Maintain all existing loader logic and functionality
- Update imports and exports accordingly

### Translation Keys Needed
- `lines`: Word "lines" for deck check counter
- Update existing search description to be more accurate

## Review Section

### Implementation Completed
✅ **UI Text Localization**: Localized hardcoded "lines" text on deck check
- Added "lines" translation key in English and Japanese
- Updated deck check component to use `t("lines")` instead of hardcoded text
- Proper internationalization for line count display

✅ **Search Description Clarification**: Updated search functionality description
- Changed from "card names" to "card names, types, and rules text"
- Updated both English and Japanese descriptions to be more accurate
- Updated placeholder text to reflect broader search scope

✅ **Route Structure Refactoring**: Organized routes into directories
- Created `app/routes/_index/` and `app/routes/deck-check/` directories
- Moved route components to `route.tsx` files in respective directories
- URLs remain unchanged (`/` and `/deck-check`)
- Maintained all existing functionality

✅ **Loader Extraction**: Separated loader functions into dedicated files
- Extracted `_index` loader to `app/routes/_index/loader.ts`
- Extracted `deck-check` loader to `app/routes/deck-check/loader.ts`
- Updated imports and exports correctly
- All loader logic preserved and functional

### Technical Changes Made
1. **Translation Updates** (`apps/web/app/lib/translations.ts`):
   - Added `lines: "lines"` (EN) and `lines: "行"` (JP)
   - Updated search descriptions to mention names, types, and rules text
   - Updated placeholder text for broader search scope

2. **Route Structure** (new directory organization):
   ```
   app/routes/
   ├── _index/
   │   ├── route.tsx (component logic)
   │   └── loader.ts (data loading logic)
   └── deck-check/
       ├── route.tsx (component logic)
       └── loader.ts (data loading logic)
   ```

3. **Component Updates**:
   - Updated deck check line count display to use `{t("lines")}`
   - Maintained all existing functionality and styling
   - Proper imports for separated loader functions

### Testing Verification
- ✅ Build compilation successful with new route structure
- ✅ Route URLs remain unchanged (`/` and `/deck-check`)
- ✅ All functionality preserved (search, validation, pagination)
- ✅ Internationalization working correctly
- ✅ Loader logic properly separated and functional

### Summary
Successfully completed all requirements:
- Localized hardcoded UI text for better internationalization
- Clarified search functionality description for user clarity
- Refactored route structure for better code organization
- Separated concerns with dedicated loader files
- Maintained backward compatibility and URL structure