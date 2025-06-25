# Project Plan: Add Scryfall Card Images to Search Results (Issue #9)

## Overview
Add Scryfall card images to the card search results display. Images should appear on the right side of each card div (the one with border-radius of 8px) and should be loaded efficiently to avoid overwhelming the Scryfall API.

## Requirements from Issue #9
- Add `small` size card images to the right side of card display divs
- Use URI format: `https://cards.scryfall.io/small/front/6/d/${oracle_id}.jpg`
- Implement rate limiting or lazy loading to avoid overwhelming Scryfall with requests
- Consider one of these approaches:
  - Stagger image loads to average 10 per second
  - Only load images for cards in viewport or about to enter it
  - Other performance optimization ideas

## Todo Items

### [ ] 1. Analyze current card display structure
- Review CardList.tsx component layout
- Understand current styling and layout system

### [ ] 2. Create image loading utility
- Create utility function to generate Scryfall image URLs
- Add error handling for failed image loads
- Implement fallback for missing images

### [ ] 3. Implement lazy loading or intersection observer
- Add intersection observer to detect when cards enter viewport
- Only load images for visible cards to optimize performance
- Consider loading images slightly before they become visible

### [ ] 4. Update CardList component
- Modify card layout to include image on the right side
- Add responsive styling to ensure good layout on different screen sizes
- Maintain existing card styling and functionality

### [ ] 5. Add image loading states
- Show loading placeholder while image loads
- Handle failed image loads gracefully
- Provide alt text for accessibility

### [ ] 6. Test image loading performance
- Verify images load efficiently without overwhelming API
- Test on different screen sizes and connection speeds
- Ensure no layout shifts during image loading

## Technical Details

### Current Card Structure
Each card is displayed in a div with:
- Border radius of 8px
- Card information (name, type, mana cost, etc.)
- Perfect match highlighting with thicker border

### Image Requirements
- Size: `small` from Scryfall API
- Position: Right side of existing card div
- URL format: `https://cards.scryfall.io/small/front/6/d/${oracle_id}.jpg`
- Error handling: Fallback for missing/failed images

### Performance Considerations
- Use Intersection Observer API for lazy loading
- Load images only when cards are visible or about to be visible
- Consider image preloading for better UX
- Add proper loading and error states

## Files to Modify
- `/Users/ale/repos/mtg/middleschool-mono/apps/web/app/components/CardList.tsx`
- `/Users/ale/repos/mtg/middleschool-mono/apps/web/app/lib/utils.ts` (for image URL utility)

## Expected Outcome
Users will see card images alongside search results, making it easier to identify cards visually while maintaining good performance and API usage patterns.