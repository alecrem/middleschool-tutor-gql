# Dark Mode Implementation Plan

## Overview
Implement a comprehensive dark mode feature for the Middle School Tutor application with:
- Dark theme with appropriate color scheme
- Theme switcher component
- System theme detection and default preference
- Persistent theme selection across sessions

## Current State Analysis
The application currently uses inline styles exclusively with hard-coded color values throughout all components. There is no existing theme system or CSS variables, which means we need to build the theming infrastructure from the ground up.

## Implementation Plan

### Phase 1: Theme Infrastructure
- [x] Create theme context and provider for managing light/dark mode state
- [x] Create theme configuration with light and dark color palettes
- [x] Add theme detection utilities (system preference, localStorage persistence)
- [x] Update root layout to include theme provider

### Phase 2: Theme System Integration
- [x] Create theme-aware styling utilities/hooks
- [x] Update all inline styles to use theme colors instead of hard-coded values
- [x] Ensure proper contrast ratios for accessibility in dark mode

### Phase 3: Theme Switcher Component
- [x] Create ThemeSwitcher component with toggle functionality
- [x] Add theme switcher to the header alongside LanguageSwitcher
- [x] Implement smooth theme transitions
- [x] Add proper aria-labels and accessibility features

### Phase 4: Component Updates
- [x] Update main page (_index.tsx) with theme-aware styling
- [x] Update deck check page (deck-check.tsx) with theme-aware styling
- [x] Update CardList component with theme-aware styling
- [x] Update Footer component with theme-aware styling
- [x] Update LanguageSwitcher component with theme-aware styling

### Phase 5: Testing and Refinement
- [x] Test theme switching functionality across all pages
- [x] Test system theme detection and persistence
- [x] Verify accessibility compliance in both themes
- [x] Test responsive design in both light and dark modes
- [x] Review color contrast and readability

### Phase 6: Localization
- [x] Add theme switcher labels to translation files
- [x] Ensure theme switcher works properly with both English and Japanese

## Technical Implementation Details

### Theme Color Palette
**Light Mode (Current):**
- Primary Background: #ffffff
- Secondary Background: #f9fafb  
- Text Primary: #111827
- Text Secondary: #6b7280
- Accent Blue: #3b82f6
- Error Red: #dc2626
- Warning Orange: #f59e0b
- Success Green: #10b981

**Dark Mode (Proposed):**
- Primary Background: #111827
- Secondary Background: #1f2937
- Text Primary: #f9fafb
- Text Secondary: #d1d5db
- Accent Blue: #60a5fa
- Error Red: #f87171
- Warning Orange: #fbbf24
- Success Green: #34d399

### Files to Create/Modify
1. **New Files:**
   - `app/lib/theme.ts` - Theme configuration and utilities
   - `app/contexts/ThemeContext.tsx` - Theme context and provider
   - `app/components/ThemeSwitcher.tsx` - Theme toggle component
   - `app/hooks/useTheme.ts` - Theme hook for components

2. **Files to Modify:**
   - `app/root.tsx` - Add theme provider and global theme styles
   - `app/routes/_index.tsx` - Update with theme-aware styling
   - `app/routes/deck-check.tsx` - Update with theme-aware styling
   - `app/components/CardList.tsx` - Update with theme-aware styling
   - `app/components/Footer.tsx` - Update with theme-aware styling
   - `app/components/LanguageSwitcher.tsx` - Update with theme-aware styling
   - `app/lib/translations.ts` - Add theme-related translations

### Default Behavior
- Detect system theme preference on first visit
- Fall back to light mode if system preference is not available
- Persist user's manual theme selection in localStorage
- Respect user's choice over system preference once they manually select

## Success Criteria
- [x] Users can toggle between light and dark themes
- [x] Theme preference is persisted across browser sessions
- [x] System theme is detected and applied by default
- [x] All components display properly in both themes
- [x] Smooth theme transitions without jarring flashes
- [x] Maintains accessibility standards in both modes
- [x] Works properly with both English and Japanese localization

## Implementation Summary

### Files Created
1. **`app/lib/theme.ts`** - Theme configuration with light/dark color palettes and utilities
2. **`app/contexts/ThemeContext.tsx`** - React context for theme state management
3. **`app/hooks/useTheme.ts`** - Custom hook for accessing theme data and styled helpers
4. **`app/components/ThemeSwitcher.tsx`** - UI component for toggling between themes

### Files Modified
1. **`app/root.tsx`** - Added ThemeProvider wrapper and global theme transitions
2. **`app/routes/_index.tsx`** - Updated with theme-aware styling and ThemeSwitcher
3. **`app/routes/deck-check.tsx`** - Updated with theme-aware styling and ThemeSwitcher
4. **`app/components/CardList.tsx`** - Updated all colors to use theme system
5. **`app/components/Footer.tsx`** - Updated with theme-aware styling
6. **`app/components/LanguageSwitcher.tsx`** - Updated with theme-aware styling
7. **`app/lib/translations.ts`** - Added theme-related translation strings for EN/JA

### Key Features Implemented
- **System Theme Detection**: Automatically detects user's OS preference on first visit
- **Theme Persistence**: Stores user's manual theme selection in localStorage
- **Smooth Transitions**: CSS transitions for background and text color changes
- **Accessibility**: Proper ARIA labels and respects reduced motion preferences
- **Responsive Design**: Theme switcher works across all screen sizes
- **Internationalization**: Theme labels available in English and Japanese

### Technical Approach
- Maintained existing inline styles architecture while adding theme abstraction
- Used React Context API for global theme state management
- Created comprehensive color palette covering all use cases
- Implemented theme-aware utility functions for common styling patterns
- Added proper TypeScript interfaces for type safety

The dark mode implementation successfully transforms the entire application while maintaining all existing functionality and design patterns.