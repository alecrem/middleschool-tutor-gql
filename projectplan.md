# Project Plan: Remove Deck List Comments

## Overview
Remove the ability to add comments to deck lists. Currently, the deck parser strips comments using `//` syntax, but we want to completely remove this functionality.

## Current State
- Comments are handled in `apps/web/app/lib/deck-parser.ts`
- Comments are stripped from deck list lines using `//` syntax
- Split card names (which use `" // "`) are differentiated from comments
- No persistent storage of comments - they're just removed during parsing

## Tasks
- [x] Remove comment parsing logic from deck-parser.ts
- [x] Update deck parser to treat `//` as part of card names (for split cards only)
- [x] Update any documentation or examples that mention comment functionality
- [x] Test deck parsing still works for split cards with " // " syntax

## Implementation Details
- Focus on `apps/web/app/lib/deck-parser.ts` file
- Remove the comment stripping logic while preserving split card name handling
- Ensure split cards like "Fire // Ice" continue to work correctly
- Simple change - remove comment handling code path

## Review
Successfully removed comment functionality from deck list parsing:

### Changes Made:
1. **Removed comment parsing logic** from `deck-parser.ts` - eliminated all code that stripped comments using `//`
2. **Simplified parser** - now treats `//` as part of card names, which works perfectly for split cards
3. **Updated tests** - modified test cases to reflect new behavior where `//` is treated as part of card names
4. **Verified functionality** - all tests pass and split cards continue to work correctly

### Technical Details:
- Removed 23 lines of complex comment handling code
- Simplified `parseDeckLine` function to just trim whitespace
- Updated 3 test cases to expect `//` as part of card names
- All existing functionality for split cards like "Fire // Ice" continues to work
- Linter passes with no issues

### Impact:
- Users can no longer add comments to deck lists using `//`
- Split cards work exactly as before
- Code is significantly simpler and more maintainable
- No breaking changes to existing deck list functionality