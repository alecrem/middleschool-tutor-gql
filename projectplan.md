# Compression Feature API Interference Debug Plan

## Problem
After merging compression changes, both production and preview deployments are failing with "Unexpected error" in API calls (`validateCards` and `searchCards`). The GraphQL API itself works fine at https://middleschool-api.vercel.app/graphql, but frontend API calls are failing.

## Root Cause Analysis
Compression changes are interfering with API calls, likely due to:
1. **Build dependency conflict** - Node.js modules (`node:zlib`, `node:util`) affecting client/server bundles
2. **Import/bundling issue** - Server-side imports conflicting with API code compilation  
3. **Server-side rendering change** - `.server.ts` file altering Remix server-side handling

## Action Plan

### Phase 1: Quick Isolation Test ⚡
- [ ] Temporarily revert compression feature entirely
- [ ] Deploy and verify API calls work again  
- [ ] Confirm compression changes are the cause

### Phase 2: Minimal Re-implementation 🔧
If revert fixes the issue:
- [ ] Remove all Node.js imports from web app
- [ ] Keep compression browser-only for now
- [ ] Handle compressed URLs by falling back to `decklist=` parameter server-side
- [ ] Deploy and test that compression works without breaking API

### Phase 3: Investigation & Proper Fix 🔍
If minimal approach works:
- [ ] Investigate why Node.js imports broke API calls
- [ ] Implement proper server-side decompression once root cause understood

## Timeline
- Phase 1: 10 minutes (revert + test)
- Phase 2: 30 minutes (browser-only implementation)  
- Phase 3: TBD based on findings

## Current Branch
`feature/issue-72/server-side-compression-compatibility`

## Files to Revert
- `apps/web/app/lib/compression.server.ts` (delete)
- `apps/web/app/lib/utils.ts` (restore browser-only)
- `apps/web/app/routes/deck-check/loader.ts` (remove server compression)

## Success Criteria
- [ ] API calls work in production
- [ ] Compression feature works browser-side
- [ ] No regression in existing functionality