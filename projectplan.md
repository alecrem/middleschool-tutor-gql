# Project Plan: Add Share Buttons for Search and Deck Check (Issue #52)

## Overview
Add share buttons that copy shareable URLs to the clipboard in two key locations:
1. Card Search page - next to "Found X cards" text
2. Deck Check page - next to "Copy Deck List" button

## Implementation Plan

### Phase 1: Core Components
- [ ] Create ShareButton component with clipboard functionality
- [ ] Add URL generation utilities for search and deck check
- [ ] Add translation keys for share functionality

### Phase 2: Integration
- [ ] Integrate ShareButton in Card Search page (next to results count)
- [ ] Integrate ShareButton in Deck Check page (next to copy button)

### Phase 3: Testing & Polish
- [ ] Test clipboard functionality and user feedback
- [ ] Test responsive design and accessibility
- [ ] Run TypeScript checks and verify build

## Technical Details

### ShareButton Component
- Use Share icon from Lucide React
- Provide visual feedback (success/error states)
- Integrate with existing theme system
- Include proper accessibility attributes

### URL Generation
- **Card Search**: Include all search parameters, force page=1
- **Deck Check**: Include current deck list with proper encoding

### User Experience
- Show "Copied!" / "コピーしました!" on success
- Show "Copy failed" / "コピーに失敗しました" on error
- Ensure mobile compatibility

### Translation Keys
Add new keys for both English and Japanese:
- shareSearch / shareDeckCheck
- urlCopied / copyUrlFailed

## Files to Modify
- `apps/web/app/components/ShareButton.tsx` (new)
- `apps/web/app/lib/urlUtils.ts` (new)
- `apps/web/app/lib/translations.ts`
- `apps/web/app/routes/_index/route.tsx`
- `apps/web/app/routes/deck-check/route.tsx`

## Success Criteria
- Share buttons appear in correct locations
- URLs include proper parameters and encoding
- Clipboard functionality works with user feedback
- Responsive design works on mobile and desktop
- All translations complete
- TypeScript compilation succeeds