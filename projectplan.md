# Project Plan: Limit Deck Check to 100 Lines (Issue #26)

## Overview
Implement a 100-line limit for deck check functionality to prevent abuse and improve performance. The implementation should include both frontend and backend validation with appropriate user feedback.

## Current State Analysis
- **Frontend**: `apps/web/app/routes/deck-check.tsx` handles deck list input via textarea and calls `validateCards` API
- **Backend**: `apps/api/src/data.ts` has `validateCards` function that processes card names array
- **Parser**: `apps/web/app/lib/deck-parser.ts` parses deck list text into entries
- **API**: `apps/web/app/lib/api.ts` calls GraphQL validateCards endpoint

## Requirements
1. Frontend prevents submission when more than 100 lines
2. Backend rejects requests with more than 100 lines
3. User-friendly error messages
4. Preserve textarea content when validation fails

## Todo Items

### ✅ Analyze current deck check implementation
- [x] Review deck check route and components
- [x] Understand deck parsing logic
- [x] Examine API validation flow

### 🔄 Write project plan to projectplan.md
- [x] Document current state and requirements
- [x] Create detailed implementation plan

### ⏳ Add frontend validation to prevent submission over 100 lines
- [ ] Add line counting logic to deck check form
- [ ] Display warning message when over 100 lines
- [ ] Prevent form submission when limit exceeded
- [ ] Add visual indicators for line count

### ⏳ Add backend API validation to reject requests over 100 lines
- [ ] Modify `validateCards` function in `apps/api/src/data.ts` to check array length
- [ ] Return appropriate error for over-limit requests
- [ ] Update GraphQL resolver error handling

### ⏳ Implement proper error handling and user feedback
- [ ] Add translation keys for line limit messages
- [ ] Update frontend to handle API errors gracefully
- [ ] Ensure textarea content is preserved on error

### ⏳ Test the line limit functionality
- [ ] Test frontend validation with 99, 100, and 101 lines
- [ ] Test backend validation
- [ ] Verify error messages display correctly
- [ ] Test user experience flow

## Implementation Details

### Frontend Changes
1. **Line Counting**: Add real-time line count display
2. **Validation**: Check line count before form submission
3. **UI Updates**: Show warning when approaching/exceeding limit
4. **Error Handling**: Display backend errors while preserving input

### Backend Changes
1. **Validation**: Check `cardNames.length > 100` in `validateCards`
2. **Error Response**: Return structured error for over-limit requests
3. **GraphQL**: Update resolver to handle validation errors

### Translation Keys Needed
- `deckLineLimitWarning`: Warning when approaching 100 lines
- `deckLineLimitExceeded`: Error when over 100 lines
- `deckLineLimitError`: Backend error message for over-limit requests

## Review Section

### Implementation Completed
✅ **Frontend Validation**: Added real-time line counting with visual feedback
- Line counter display (X/100 lines) with color coding
- Warning message when approaching limit (90+ lines)
- Error message when exceeding limit (100+ lines)
- Form submission prevention when over limit
- Button disabled when over limit
- Textarea border turns red when over limit

✅ **Backend Validation**: Added server-side validation in `validateCards` function
- Rejects requests with more than 100 card names
- Returns structured error message
- Frontend loader handles line count before API call

✅ **Translation Support**: Added translation keys for all new messages
- English and Japanese translations for warnings and errors
- Proper i18n integration with existing translation system

✅ **User Experience**: Preserved textarea content and provided clear feedback
- Content is preserved when validation fails
- Progressive warnings (near limit → over limit)
- Consistent error styling with existing design system

### Technical Changes Made
1. **Frontend** (`apps/web/app/routes/deck-check.tsx`):
   - Added React state for line counting and deck list tracking
   - Real-time line count display with conditional styling
   - Form submission prevention for over-limit cases
   - Warning and error message displays
   - Enhanced accessibility with visual indicators

2. **Backend** (`apps/api/src/data.ts`):
   - Added length validation in `validateCards` function
   - Throws error for requests exceeding 100 cards
   - Maintains existing functionality for valid requests

3. **Translations** (`apps/web/app/lib/translations.ts`):
   - Added 3 new translation keys in English and Japanese
   - Supports dynamic line count display in messages

### Testing Verification
- ✅ Build compilation successful
- ✅ Created test file with 108 lines for over-limit testing
- ✅ Line counting logic correctly filters empty lines
- ✅ Frontend and backend validation alignment confirmed

### Summary
Successfully implemented comprehensive 100-line limit functionality with:
- Real-time validation and user feedback
- Server-side protection against abuse
- Internationalization support
- Preserved user experience with clear error communication