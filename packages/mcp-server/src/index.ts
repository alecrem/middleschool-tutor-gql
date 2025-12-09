#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import {
  searchCards,
  searchCardsToolDefinition,
} from "./tools/search-cards.js";
import { getCard, getCardToolDefinition } from "./tools/get-card.js";
import {
  validateDeck,
  validateDeckToolDefinition,
} from "./tools/validate-deck.js";

// Create MCP server
const server = new Server(
  {
    name: "middleschool-mtg",
    version: "0.0.1",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tool listing handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      searchCardsToolDefinition,
      getCardToolDefinition,
      validateDeckToolDefinition,
    ],
  };
});

// Register tool execution handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    switch (request.params.name) {
      case "search_cards": {
        const result = await searchCards(request.params.arguments as any);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_card": {
        const result = await getCard(request.params.arguments as any);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "validate_deck": {
        const result = await validateDeck(request.params.arguments as any);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Middle School MTG MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
