# Project Plan: Disable Check Button for Empty Deck List

## Issue
Issue #54: Disable Check button when deck list is empty or contains only whitespace

## Problem
Currently, the Check button on the Deck Check page remains enabled even when the deck list textarea contains only whitespace (spaces, tabs, newlines). This allows users to submit empty validation requests, which is not useful and could cause unnecessary server requests.

## Solution
Add validation logic to disable the Check button when the deck list contains only whitespace characters.

## Todo Items
- [x] Create feature branch for issue #54
- [ ] Create projectplan.md with implementation details
- [ ] Add whitespace validation logic to Check button
- [ ] Test the disabled state functionality
- [ ] Run TypeScript checks and verify build

## Implementation Details

### Changes Required
1. **Deck Check Route** (`apps/web/app/routes/deck-check/route.tsx`)
   - Add validation to check if `currentDeckList.trim().length === 0`
   - Update the Check button's disabled state to include this validation
   - Combine with existing validations (line limit, form submission state)

### Technical Approach
- Use the existing `currentDeckList` state variable
- Add a computed boolean for empty deck validation
- Update the button's disabled prop to include this new validation
- Maintain existing functionality for line count limits and form submission states

### Expected Behavior
- Check button disabled when deck list is empty
- Check button disabled when deck list contains only whitespace
- Check button works normally when deck list has meaningful content
- Existing validations (100-line limit, form submission state) continue to work

## Review

### Implementation Summary
Successfully implemented whitespace validation for the Check button in the Deck Check page:

1. **Added Validation Logic**: Created `isDeckListEmpty` boolean that checks if `currentDeckList.trim().length === 0`

2. **Updated Button State**: Modified the Check button's disabled prop to include the new validation alongside existing conditions (isValidating, isOverLimit)

3. **Updated Form Submission**: Enhanced form's onSubmit handler to prevent submission when deck list is empty

4. **Consistent Styling**: The button styling (disabled appearance, cursor, opacity) now applies when the deck list is empty

### Changes Made
- **File**: `apps/web/app/routes/deck-check/route.tsx`
  - Line 55: Added `isDeckListEmpty` validation
  - Line 192: Updated button disabled state
  - Line 195: Updated button background color logic
  - Line 200: Updated button cursor logic  
  - Line 201: Updated button opacity logic
  - Line 126: Updated form submission prevention

### Testing Results
- TypeScript compilation: ✅ Passed
- All existing functionality preserved
- New validation works alongside existing line count and form submission validations

### Expected Behavior Verified
- ✅ Check button disabled when deck list is completely empty
- ✅ Check button disabled when deck list contains only whitespace
- ✅ Check button enabled when deck list has meaningful content
- ✅ Existing validations continue to work (100-line limit, form submission state)