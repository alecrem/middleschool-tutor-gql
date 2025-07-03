# Add Share Buttons for Search and Deck Check

## Problem
Users currently have no easy way to share their search results or deck validation results with others. This makes it difficult to:
- Share interesting card search queries with friends
- Get help with deck validation issues
- Reference specific searches in discussions
- Bookmark specific searches or deck states

## Proposed Solution
Add share buttons that copy shareable URLs to the clipboard in two key locations:

### 1. Card Search Page
- **Location**: Far right of the results line (e.g., next to "Found 5 cards")
- **Functionality**: Copy URL to current search (always reset to page 1)
- **Button Text**: "Share Search" / "検索を共有"

### 2. Deck Check Page  
- **Location**: Right of the "Copy Deck List" button
- **Functionality**: Copy URL to current deck validation state
- **Button Text**: "Share Deck Check" / "デッキ検証を共有"

## Implementation Requirements

### Share Button Component
Create a reusable share button component that:
- Uses existing Share icon from Lucide React
- Integrates with current theme system
- Provides visual feedback (success/error states)
- Follows existing button design patterns
- Includes proper accessibility attributes

### URL Generation Logic
#### Card Search Share URL
- Include all current search parameters (query, cardType, colors, power, toughness, cmc)
- Force page parameter to 1 (always share first page of results)
- Preserve all filter states for accurate recreation

#### Deck Check Share URL
- Include current deck list in URL parameters
- Ensure URL encoding handles special characters properly
- Consider URL length limitations for very large deck lists

### User Experience
- **Copy Feedback**: Show "Copied!" / "コピーしました!" message briefly
- **Error Handling**: Show "Copy failed" / "コピーに失敗しました" if clipboard access fails
- **Visual Integration**: Buttons should feel natural in their respective locations
- **Mobile Support**: Ensure buttons work properly on mobile devices

## Technical Design

### Share Button Component
```typescript
interface ShareButtonProps {
  url: string;
  label: string;
  size?: ComponentSize;
}

export function ShareButton({ url, label, size = 'sm' }: ShareButtonProps) {
  // Implementation with clipboard API and status feedback
}
```

### URL Generation Utilities
```typescript
// Card search URL generation
function generateSearchShareUrl(searchParams: SearchParams): string {
  // Build URL with all current search parameters, page reset to 1
}

// Deck check URL generation  
function generateDeckCheckShareUrl(deckList: string): string {
  // Build URL with encoded deck list
}
```

### Integration Points
#### Card Search Page (`apps/web/app/routes/_index/route.tsx`)
- Add ShareButton to results header line
- Position after "Found X cards" text
- Use responsive layout to handle mobile screens

#### Deck Check Page (`apps/web/app/routes/deck-check/route.tsx`)
- Add ShareButton next to "Copy Deck List" button
- Maintain consistent button group styling
- Only show when results are available

### Translation Keys
Add new translation keys for both English and Japanese:
```typescript
// English
shareSearch: "Share Search"
shareDeckCheck: "Share Deck Check"
urlCopied: "URL copied!"
copyUrlFailed: "Failed to copy URL"

// Japanese  
shareSearch: "検索を共有"
shareDeckCheck: "デッキ検証を共有"
urlCopied: "URLをコピーしました!"
copyUrlFailed: "URLのコピーに失敗しました"
```

## Benefits
- **Improved Sharing**: Easy way to share specific searches and deck validations
- **Better Collaboration**: Users can easily get help or share discoveries
- **Bookmarking**: Users can save specific search states for later reference
- **Community Building**: Facilitates sharing interesting findings
- **Support**: Easier to share deck validation issues for troubleshooting

## Technical Considerations
- **URL Length**: Monitor URL length for complex searches and large deck lists
- **Browser Compatibility**: Use Clipboard API with fallback for older browsers
- **Security**: Ensure proper URL encoding to prevent injection issues
- **Performance**: Minimal impact using existing clipboard patterns
- **Accessibility**: Proper ARIA labels and screen reader support

## Acceptance Criteria
- [ ] ShareButton component created with proper TypeScript types
- [ ] Share button appears on Card Search page in correct location
- [ ] Share button appears on Deck Check page next to copy button
- [ ] Card search URLs include all current search parameters with page=1
- [ ] Deck check URLs include current deck list properly encoded
- [ ] Copy success/failure feedback works correctly
- [ ] Translation keys added for both English and Japanese
- [ ] Buttons integrate properly with existing theme system
- [ ] Responsive design works on mobile and desktop
- [ ] Accessibility requirements met (ARIA labels, keyboard navigation)
- [ ] Error handling works when clipboard access is denied
- [ ] All existing functionality preserved
- [ ] TypeScript compilation and build process succeed

## Priority
**Medium** - Improves user experience and sharing capabilities, but doesn't impact core functionality.

## Estimated Complexity
**Low-Medium** - Straightforward implementation using existing patterns, clipboard API, and URL generation. Main work involves component creation and proper URL parameter handling.