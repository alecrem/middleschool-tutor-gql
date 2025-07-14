# Project Plan: Add External Link Icons

## Problem
Add external link icons to all links pointing to external domains to improve UX by clearly indicating when users will be taken to another site.

## Analysis
Found external links in the following locations:
- **Scryfall**: `apps/web/app/components/CardDetails.tsx` (lines 139-150)
- **Eternal Central**: `apps/web/app/components/SearchControls.tsx` (lines 86-94) and `apps/web/app/routes/deck-check/route.tsx` (lines 160-167)
- **GitHub**: `apps/web/app/components/Footer.tsx` (lines 42-52)

All current links follow security best practices with `target="_blank"` and `rel="noopener noreferrer"`.

## Implementation Plan

### Todo Items:
- [x] Create reusable ExternalLink component
- [x] Replace Scryfall links in CardDetails.tsx
- [x] Replace Eternal Central links in SearchControls.tsx
- [x] Replace Eternal Central links in deck-check route
- [x] Replace GitHub links in Footer.tsx
- [x] Test the implementation

### Technical Approach:
1. Create a simple `ExternalLink` component that wraps regular links
2. Add a small external link icon (↗) positioned after the link text
3. Maintain existing security attributes and theme-based styling
4. Ensure proper accessibility with aria labels
5. Make the component reusable for future external links

### Files to Modify:
- Create: `apps/web/app/components/ExternalLink.tsx`
- Update: `apps/web/app/components/CardDetails.tsx`
- Update: `apps/web/app/components/SearchControls.tsx`
- Update: `apps/web/app/routes/deck-check/route.tsx`
- Update: `apps/web/app/components/Footer.tsx`

## Acceptance Criteria:
- [x] All external links show external link icon
- [x] Icons are properly themed (light/dark mode)
- [x] Icons are accessible (proper aria labels)
- [x] Existing security attributes are preserved
- [x] Component is reusable for future external links

## Review

### Changes Made:
1. **Created ExternalLink component** (`apps/web/app/components/ExternalLink.tsx`):
   - Reusable component that wraps external links
   - Adds external link icon (↗) with proper styling
   - Maintains all security attributes (`target="_blank"`, `rel="noopener noreferrer"`)
   - Respects theme colors and accessibility

2. **Updated CardDetails.tsx**:
   - Replaced Scryfall link with ExternalLink component
   - Preserved existing styling and functionality

3. **Updated SearchControls.tsx**:
   - Replaced Eternal Central link with ExternalLink component
   - Maintained existing inline styling

4. **Updated deck-check route**:
   - Replaced Eternal Central link with ExternalLink component
   - Preserved existing styling

5. **Updated Footer.tsx**:
   - Replaced GitHub link with ExternalLink component
   - Maintained existing link styling

### Technical Implementation:
- External link icon is positioned with `marginLeft: '0.25rem'` and `fontSize: '0.85em'`
- Icon color uses `colors.text.secondary` for subtle appearance
- Proper `aria-label="External link"` for accessibility
- Component accepts all standard link props (`style`, `className`)

### Testing:
- Build completed successfully
- TypeScript compilation passed without errors
- All external links now show the external link icon (↗)
- Icons are properly themed and accessible