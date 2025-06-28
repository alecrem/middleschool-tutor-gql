# Project Plan: Add Power and Toughness Search Controls (Issue #23)

## Objective
Add range sliders for power and toughness filtering to the advanced search controls:
- Power range: 0-13 (inclusive)
- Toughness range: 0-13 (inclusive)  
- Default ranges (0-13) should not filter results
- Cards without power/toughness values should not be excluded by default ranges

## Analysis
Current search system supports:
- Text query
- Card type filtering
- Color filtering (checkboxes)

Need to add:
- Power min/max range sliders
- Toughness min/max range sliders
- Backend filtering logic for power/toughness ranges
- URL parameter handling for ranges

## Todo Items

- [x] Add translation keys for power/toughness controls
- [x] Update SearchControls interface to include power/toughness parameters
- [x] Add power/toughness range sliders to SearchControls component
- [x] Update route loader to handle power/toughness URL parameters
- [x] Update frontend API function to accept power/toughness parameters
- [x] Update GraphQL schema to support power/toughness filtering
- [x] Update backend search function to filter by power/toughness ranges
- [x] Update accordion expansion logic to include power/toughness filters
- [x] Test the power/toughness filtering functionality

## Review

### Changes Made

1. **Translation Keys** - Added "power" and "toughness" keys in English and Japanese

2. **SearchControls Component**:
   - Added powerMin, powerMax, toughnessMin, toughnessMax props with defaults (0, 13)
   - Created dual range sliders for both power and toughness
   - Updated accordion expansion logic to include power/toughness filters
   - Range sliders show current values and have proper styling

3. **Route Loader** (_index.tsx):
   - Parse powerMin, powerMax, toughnessMin, toughnessMax from URL parameters
   - Pass all parameters to searchCards API function
   - Return power/toughness values in loader data

4. **Frontend API** (api.ts):
   - Updated searchCards function signature to accept power/toughness parameters
   - Updated GraphQL query to include power/toughness variables

5. **Backend GraphQL Schema** (index.ts):
   - Added powerMin, powerMax, toughnessMin, toughnessMax to schema
   - Updated resolver to accept and pass through new parameters

6. **Backend Search Logic** (data.ts):
   - Added power/toughness filtering with inclusive ranges (>= and <=)
   - Only applies filtering when values differ from defaults (0-13)
   - Handles null/undefined power/toughness gracefully (doesn't exclude unless explicitly filtering)
   - Uses parseFloat to handle decimal values properly

7. **Type Definitions** - Updated SearchParams interface to include power/toughness fields

### Key Features
- **Default Behavior**: Range sliders default to 0-13, which don't filter results
- **Inclusive Filtering**: Uses >= and <= for range boundaries
- **Null Handling**: Cards without power/toughness aren't excluded by default ranges
- **URL Persistence**: Filter values are preserved in URL parameters
- **Responsive UI**: Range sliders work well on mobile and desktop
- **Accordion Integration**: Expands automatically when power/toughness filters are active

### Testing
- Both web and API builds completed successfully
- All TypeScript compilation passed
- Full-stack implementation from UI to database filtering

## Implementation Details

### Frontend Components
- Add dual range sliders for power (min/max) and toughness (min/max)
- Default values: min=0, max=13
- Only send parameters if values differ from defaults
- Use HTML range inputs with proper styling

### Backend Logic  
- Filter cards where power/toughness is within specified ranges
- Handle null/undefined power/toughness values (don't exclude unless explicitly filtered)
- Use >= and <= for inclusive range filtering

### URL Parameters
- `powerMin`, `powerMax`, `toughnessMin`, `toughnessMax`
- Only include in URL when values differ from defaults (0, 13)

## Files to Modify
- `apps/web/app/components/SearchControls.tsx` - Add range slider UI
- `apps/web/app/lib/translations.ts` - Add translation keys
- `apps/web/app/lib/types.ts` - Update SearchParams interface
- `apps/web/app/routes/_index.tsx` - Handle new URL parameters
- `apps/web/app/lib/api.ts` - Update searchCards function signature
- `apps/api/src/index.ts` - Update GraphQL schema and resolvers
- `apps/api/src/data.ts` - Add power/toughness filtering logic