# Project Plan: Issue #7 - Add Scryfall Links to Card Search Results

## Problem Statement
Add clickable links to Scryfall for every card in the search results. The English card name should be a clickable link that opens the card on Scryfall, using the specific URL format with search preferences.

## Requirements Analysis
- **URL Format**: `https://scryfall.com/search?q=prefer%3Aoldest%20!%22English%20Card%20Name%22`
- **Language Behavior**: Always use English name for links, even in Japanese UI mode
- **Link Target**: Only the English card name becomes clickable
- **URL Encoding**: Card names must be properly URL-encoded

## Current State Analysis
- Cards displayed in `CardList.tsx` with English/Japanese name handling
- Current name display logic shows Japanese name first when in Japanese mode
- Names are currently plain text in `<h3>` tags
- Internationalization already implemented with `useTranslation` hook

## Implementation Plan

### Todo Items
- [x] Create branch for issue #7 - Scryfall links
- [ ] Analyze current CardList component structure
- [ ] Create utility function for Scryfall URL generation
- [ ] Update CardList to make English names clickable links
- [ ] Test links with various card names and URL encoding

### Technical Approach

1. **URL Generation Utility**:
   - Create function to generate Scryfall URLs with proper encoding
   - Handle special characters in card names
   - Use `encodeURIComponent()` for URL safety

2. **Component Updates**:
   - Modify `CardList.tsx` to wrap English names in `<a>` tags
   - Maintain current Japanese name display logic
   - Add proper styling for links (underline, hover states)

3. **Link Behavior**:
   - `target="_blank"` to open in new tab
   - `rel="noopener noreferrer"` for security
   - Preserve existing conditional rendering for Japanese names

### Implementation Details

**URL Structure Breakdown**:
- Base: `https://scryfall.com/search?q=`
- Preference: `prefer%3Aoldest%20` (prefer:oldest )
- Search: `!%22{CARD_NAME}%22` (!"Card Name")

**Current Name Display Logic**:
```jsx
{i18n.language === "ja" && card.name_ja !== null && `${card.name_ja} • `}
{card.name}
```

**Planned Change**:
```jsx
{i18n.language === "ja" && card.name_ja !== null && `${card.name_ja} • `}
<a href={generateScryfallUrl(card.name)} target="_blank" rel="noopener noreferrer">
  {card.name}
</a>
```

### Files to Modify
- `apps/web/app/components/CardList.tsx` - Add clickable links
- `apps/web/app/lib/utils.ts` - Add URL generation utility (create if needed)

## Next Steps
1. Create Scryfall URL generation utility
2. Update CardList component with clickable English names
3. Test with various card names and special characters
4. Verify proper URL encoding and link behavior
5. Create pull request with "Close #7"