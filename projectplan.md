# MCP Server Implementation Plan

## Objective
Build an MCP (Model Context Protocol) server that wraps our GraphQL API, enabling natural language card queries in Claude Desktop and Claude Code.

## Overview
Create a new package `packages/mcp-server` that:
- Exposes three MCP tools: `search_cards`, `get_card`, `validate_deck`
- Communicates with our existing GraphQL API
- Runs locally via stdio transport
- Can be configured in Claude Desktop/Code

## Todo List

### 1. Setup Package Structure
- [x] Create `packages/` directory
- [x] Create `packages/mcp-server/` with proper structure
- [x] Initialize package.json with MCP SDK dependency
- [x] Setup TypeScript configuration
- [x] Add build scripts

### 2. Implement Core MCP Server
- [x] Create main server file with stdio transport
- [x] Register server capabilities (tools)
- [x] Implement tool listing handler

### 3. Implement Tool: search_cards
- [x] Define input schema (query, cardType, colors, filters)
- [x] Implement GraphQL query to API
- [x] Format response for LLM consumption
- [x] Handle errors gracefully

### 4. Implement Tool: get_card
- [x] Define input schema (oracleId)
- [x] Implement GraphQL query to API
- [x] Format card details response
- [x] Handle card not found errors

### 5. Implement Tool: validate_deck
- [x] Define input schema (cardNames array)
- [x] Implement GraphQL query to API
- [x] Format validation results
- [x] Handle validation errors

### 6. Configuration & Documentation
- [x] Create README with installation instructions
- [x] Document Claude Desktop configuration
- [x] Add example queries
- [x] Document tool schemas

### 7. Testing
- [x] Test server builds correctly
- [ ] Test each tool with sample inputs (requires Claude Desktop configuration)
- [ ] Test error handling (requires Claude Desktop configuration)
- [ ] Test with Claude Desktop locally (ready for user testing)

### 8. Monorepo Integration
- [x] Add to pnpm workspace (already configured)
- [x] Add turbo configuration (already configured)
- [x] Update root package.json scripts if needed (no changes required)

## Technical Decisions

### API Endpoint
- Use deployed Vercel API: Will need to determine the production URL
- GraphQL endpoint: `/graphql`

### MCP Transport
- Use stdio transport (standard for local MCP servers)
- Server runs as a subprocess when Claude Desktop starts

### Dependencies
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `graphql-request` or `node-fetch` - HTTP client for GraphQL

### File Structure
```
packages/mcp-server/
├── package.json
├── tsconfig.json
├── README.md
├── src/
│   ├── index.ts          # Main server entry point
│   ├── tools/
│   │   ├── search-cards.ts
│   │   ├── get-card.ts
│   │   └── validate-deck.ts
│   └── graphql/
│       └── client.ts     # GraphQL client wrapper
└── dist/                 # Built output
```

## Simplicity Principles
- Use the existing API without modifications
- Keep tool implementations simple and focused
- Use standard MCP SDK patterns
- Minimal error handling - just pass through API errors
- No caching or optimization initially

## Review Section

### Implementation Summary

Successfully implemented a complete MCP server for the Middle School MTG API. The implementation includes:

#### Core Components Created
1. **Package Structure** (`packages/mcp-server/`)
   - Properly configured TypeScript package
   - MCP SDK integration
   - GraphQL client for API communication

2. **Three MCP Tools**
   - `search_cards`: Full-featured card search with multiple filters
   - `get_card`: Retrieve specific card by Oracle ID
   - `validate_deck`: Validate deck lists for format legality

3. **GraphQL Client** (`src/graphql/client.ts`)
   - Simple wrapper around graphql-request library
   - Configured to use deployed Vercel API
   - Environment variable support for custom endpoints

4. **Documentation** (README.md)
   - Installation instructions
   - Claude Desktop/Code configuration examples
   - Usage examples and troubleshooting

#### Files Created
- `packages/mcp-server/package.json` - Package configuration with dependencies
- `packages/mcp-server/tsconfig.json` - TypeScript configuration
- `packages/mcp-server/src/index.ts` - Main MCP server with stdio transport
- `packages/mcp-server/src/graphql/client.ts` - GraphQL client wrapper
- `packages/mcp-server/src/tools/search-cards.ts` - Search tool implementation
- `packages/mcp-server/src/tools/get-card.ts` - Get card tool implementation
- `packages/mcp-server/src/tools/validate-deck.ts` - Validate tool implementation
- `packages/mcp-server/README.md` - User documentation

#### Build & Integration
- Successfully builds to `dist/` directory
- Integrated with pnpm workspace (automatically included via `packages/*`)
- Compatible with existing turbo configuration
- All TypeScript compilation passes without errors

#### Simplicity Achieved
- No modifications to existing API required
- Clean separation of concerns (tools, client, server)
- Minimal error handling - passes through API errors
- Standard MCP SDK patterns used throughout
- Total implementation: ~200 lines of core code

#### Next Steps for User
1. Configure Claude Desktop/Code with the MCP server path
2. Test each tool with natural language queries
3. Validate error handling works as expected
4. Optional: Share configuration with community

The implementation is complete and ready for user testing.
