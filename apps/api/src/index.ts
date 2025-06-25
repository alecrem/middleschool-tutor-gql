import { Hono } from "hono";
import { cors } from "hono/cors";
import { createYoga, createSchema } from "graphql-yoga";
import { searchCards, getCardById, getCardsByColor } from "./data.js";
import type { MagicCard } from "./types.js";
import { pathToFileURL } from "url";

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

  type Query {
    searchCards(query: String!, limit: Int): CardSearchResult!
    getCard(oracleId: String!): MagicCard
    getCardsByColor(colors: [String!]!): [MagicCard!]!
  }
`;

const resolvers = {
  Query: {
    searchCards: (
      _: any,
      { query, limit = 50 }: { query: string; limit?: number }
    ) => {
      return searchCards(query, limit);
    },
    getCard: (_: any, { oracleId }: { oracleId: string }) => {
      return getCardById(oracleId);
    },
    getCardsByColor: (_: any, { colors }: { colors: string[] }) => {
      return getCardsByColor(colors);
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
export default async function handler(req: any, res: any) {
  // Convert Vercel request to Web API Request
  const url = `https://${req.headers.host}${req.url}`;
  const request = new Request(url, {
    method: req.method,
    headers: req.headers,
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
