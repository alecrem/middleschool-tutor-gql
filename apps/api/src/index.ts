import { Hono } from "hono";
import { cors } from "hono/cors";
import { createYoga, createSchema } from "graphql-yoga";
import { searchCards, getCardById, getCardsByColor, validateCards } from "./data.js";
import type { MagicCard } from "@mtg-middle-school/shared-types";
import { pathToFileURL } from "url";

// GraphQL resolver types
interface SearchCardsArgs {
  query: string;
  cardType?: string;
  colors?: string[];
  limit?: number;
  offset?: number;
  powerMin?: number;
  powerMax?: number;
  toughnessMin?: number;
  toughnessMax?: number;
  cmcMin?: number;
  cmcMax?: number;
}

interface GetCardArgs {
  oracleId: string;
}

interface GetCardsByColorArgs {
  colors: string[];
}

interface ValidateCardsArgs {
  cardNames: string[];
}

// GraphQL resolver context (empty for now)
interface ResolverContext {}

// Vercel handler types
interface VercelRequest {
  method: string;
  url: string;
  headers: Record<string, string | string[]>;
  body?: unknown;
}

interface VercelResponse {
  status: (code: number) => void;
  setHeader: (key: string, value: string) => void;
  send: (body: string) => void;
}

const app = new Hono();

// CORS for frontend access
app.use(
  "*",
  cors({
    // Uncomment the following line to restrict CORS to specific origins
    // origin: ["http://localhost:3000", "https://*.vercel.app"],
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// GraphQL schema
const typeDefs = `
  type MagicCard {
    oracle_id: String!
    name: String!
    name_ja: String
    banned: Boolean!
    mv: Int!
    rarity: String!
    text: String!
    type: String!
    power: String
    toughness: String
    w: Boolean!
    u: Boolean!
    b: Boolean!
    r: Boolean!
    g: Boolean!
    c: Boolean!
    perfectMatch: Boolean
    image_small: String!
  }

  type CardSearchResult {
    cards: [MagicCard!]!
    total: Int!
  }

  type CardValidationResult {
    name: String!
    found: Boolean!
    banned: Boolean!
    matchedName: String
    matchedNameJa: String
  }

  type Query {
    searchCards(query: String!, cardType: String, colors: [String!], limit: Int, offset: Int, powerMin: Int, powerMax: Int, toughnessMin: Int, toughnessMax: Int, cmcMin: Int, cmcMax: Int): CardSearchResult!
    getCard(oracleId: String!): MagicCard
    getCardsByColor(colors: [String!]!): [MagicCard!]!
    validateCards(cardNames: [String!]!): [CardValidationResult!]!
  }
`;

const resolvers = {
  Query: {
    searchCards: (
      _: unknown,
      { query, cardType, colors, limit = 20, offset = 0, powerMin, powerMax, toughnessMin, toughnessMax, cmcMin, cmcMax }: SearchCardsArgs
    ) => {
      return searchCards(query, cardType, colors, limit, offset, powerMin, powerMax, toughnessMin, toughnessMax, cmcMin, cmcMax);
    },
    getCard: (_: unknown, { oracleId }: GetCardArgs) => {
      return getCardById(oracleId);
    },
    getCardsByColor: (_: unknown, { colors }: GetCardsByColorArgs) => {
      return getCardsByColor(colors);
    },
    validateCards: (_: unknown, { cardNames }: ValidateCardsArgs) => {
      return validateCards(cardNames);
    },
  },
};

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  graphqlEndpoint: "/graphql",
  landingPage: false,
});

// Mount GraphQL endpoint
app.all("/graphql", async (c) => {
  return yoga.handleRequest(c.req.raw, {});
});

// Health check
app.get("/", (c) => {
  return c.json({
    message: "MTG Middle School API",
    endpoints: {
      graphql: "/graphql",
    },
  });
});

// For Vercel serverless functions
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Convert Vercel request to Web API Request
  const url = `https://${req.headers.host}${req.url}`;
  
  // Convert headers to proper format for Request constructor
  const headers = new Headers();
  Object.entries(req.headers).forEach(([key, value]) => {
    if (typeof value === 'string') {
      headers.set(key, value);
    } else if (Array.isArray(value)) {
      // Take the first value if it's an array
      headers.set(key, value[0]);
    }
  });
  
  const request = new Request(url, {
    method: req.method,
    headers,
    body:
      req.method !== "GET" && req.method !== "HEAD"
        ? JSON.stringify(req.body)
        : undefined,
  });

  const response = await app.fetch(request);

  res.status(response.status);

  // Set headers
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  // Send body
  const body = await response.text();
  res.send(body);
}

// For local development - check if this file is being run directly
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const { serve } = await import("@hono/node-server");
  serve({
    fetch: app.fetch,
    port: 3001,
  });
  console.log("🚀 API server running on http://localhost:3001");
}
