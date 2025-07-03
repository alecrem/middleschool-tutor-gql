# Add Icon Library Support - Issue #48

## Problem
The application currently uses Unicode characters (▼, ←, →) for visual indicators in components like Accordion and Pagination. While minimal, this approach lacks consistency and professional appearance.

## Analysis
Current icon usage:
- **Accordion.tsx**: Uses `▼` (line 47) for expand/collapse indicator
- **Pagination.tsx**: Uses `←` (line 59) and `→` (line 104) for navigation
- No existing icon library dependencies
- Theme system with design tokens already in place

## Implementation Plan

### Tasks
- [x] Create feature branch for issue 48
- [x] Create projectplan.md with implementation details
- [ ] Install lucide-react dependency
- [ ] Create Icon wrapper component with theme integration
- [ ] Update Accordion component to use ChevronDown icon
- [ ] Update Pagination component to use ChevronLeft/ChevronRight icons
- [ ] Run TypeScript type checking and tests
- [ ] Verify theme integration and functionality

## Technical Details

### 1. Dependencies
```bash
npm install lucide-react
```

### 2. Icon Component Design
- Create `apps/web/app/components/Icon.tsx`
- Integrate with existing theme system
- Support size variants using design tokens
- Theme-aware color support

### 3. Component Updates
- **Accordion**: Replace `▼` with `<ChevronDown />` 
- **Pagination**: Replace `←` with `<ChevronLeft />`, `→` with `<ChevronRight />`
- Maintain existing styling and functionality

### 4. Benefits
- Professional, consistent visual indicators
- Better accessibility (semantic meaning)
- Scalable approach for future icon needs
- Maintains minimal bundle size (~3KB total)
- Seamless integration with existing design system

## Files to Modify
- `apps/web/package.json` - Add lucide-react dependency
- `apps/web/app/components/Icon.tsx` - New wrapper component
- `apps/web/app/components/Accordion.tsx` - Replace Unicode arrow
- `apps/web/app/components/Pagination.tsx` - Replace Unicode arrows

## Review
*To be completed after implementation*