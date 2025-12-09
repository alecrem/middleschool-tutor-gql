# Middle School MTG MCP Server

An MCP (Model Context Protocol) server that provides access to the Middle School Magic: The Gathering card database through natural language queries in Claude Desktop and Claude Code.

## Features

- **Search Cards**: Search for MTG cards with flexible filters (card type, colors, power/toughness, CMC)
- **Get Card Details**: Retrieve full information about a specific card by Oracle ID
- **Validate Decks**: Check if a deck list is legal for Middle School format

## Installation

1. Build the MCP server:
```bash
# From the monorepo root
pnpm install
cd packages/mcp-server
pnpm build
```

2. Configure Claude Desktop to use the MCP server.

## Claude Desktop Configuration

Add the following to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "middleschool-mtg": {
      "command": "node",
      "args": [
        "/absolute/path/to/middleschool-mono/packages/mcp-server/dist/index.js"
      ]
    }
  }
}
```

Replace `/absolute/path/to/middleschool-mono` with the actual path to your repository.

## Claude Code Configuration

For Claude Code, add to your settings:

```json
{
  "mcp": {
    "servers": {
      "middleschool-mtg": {
        "command": "node",
        "args": [
          "/absolute/path/to/middleschool-mono/packages/mcp-server/dist/index.js"
        ]
      }
    }
  }
}
```

## Usage Examples

Once configured, you can use natural language queries in Claude:

### Search for Cards
```
"Show me all red creatures with power 3 or greater"
"Find blue counterspells in Middle School"
"Search for cards with 'draw' in their text"
```

### Get Card Details
```
"What's the full text on Lightning Bolt?"
"Tell me about the card with oracle ID abc-123-def"
```

### Validate Decks
```
"Is this deck legal for Middle School?
4 Lightning Bolt
4 Counterspell
4 Dark Ritual
..."
```

## Available Tools

### search_cards

Search for cards with various filters.

**Parameters:**
- `query` (required): Search text to match against card names, types, or text
- `cardType` (optional): Filter by card type (e.g., "Creature", "Instant")
- `colors` (optional): Array of color codes: 'w', 'u', 'b', 'r', 'g'
- `limit` (optional): Maximum results to return (default: 20)
- `offset` (optional): Pagination offset (default: 0)
- `powerMin`, `powerMax` (optional): Filter creatures by power
- `toughnessMin`, `toughnessMax` (optional): Filter creatures by toughness
- `cmcMin`, `cmcMax` (optional): Filter by converted mana cost

### get_card

Get detailed information about a specific card.

**Parameters:**
- `oracleId` (required): The Oracle ID of the card

### validate_deck

Validate a list of card names for Middle School legality.

**Parameters:**
- `cardNames` (required): Array of card names (max 100)

## Development

Run the server in development mode:

```bash
pnpm dev
```

Build for production:

```bash
pnpm build
```

## API Endpoint

The MCP server connects to the deployed GraphQL API at:
`https://middleschool-tutor-gql.vercel.app/graphql`

You can override this with the `API_ENDPOINT` environment variable:

```json
{
  "mcpServers": {
    "middleschool-mtg": {
      "command": "node",
      "args": ["..."],
      "env": {
        "API_ENDPOINT": "http://localhost:3001/graphql"
      }
    }
  }
}
```

## Troubleshooting

### Server not appearing in Claude Desktop

1. Check that the configuration file has valid JSON
2. Verify the absolute path to `dist/index.js` is correct
3. Ensure you've run `pnpm build` to compile TypeScript
4. Restart Claude Desktop after changing configuration

### Connection errors

1. Check your internet connection (needs to reach Vercel API)
2. Verify the API endpoint is accessible
3. Check the Claude Desktop logs for detailed error messages

## License

MIT
