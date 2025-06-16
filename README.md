# MTG Middle School Monorepo

A monorepo containing a GraphQL API and web frontend for searching Magic: The Gathering cards legal in the Middle School format.

## Project Structure

```
middleschool-mono/
├── apps/
│   ├── api/          # Hono GraphQL API
│   └── web/          # Remix.js frontend
└── packages/         # Shared packages (if needed)
```

## Development

### Prerequisites

- Node.js 20+
- pnpm

### Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start development servers:
   ```bash
   pnpm dev
   ```

   This starts:
   - API server on http://localhost:3001
   - Web frontend on http://localhost:3000

### API Development

The API is built with Hono and serves a GraphQL endpoint at `/graphql`.

**Available queries:**
- `searchCards(query: String!, limit: Int)` - Search cards by name, type, or text
- `getCard(oracleId: String!)` - Get a single card by Oracle ID
- `getCardsByColor(colors: [String!]!)` - Filter cards by mana colors

**Convert CSV data:**
```bash
cd apps/api
pnpm run convert-data
```

### Web Development

The frontend is built with Remix.js and consumes the GraphQL API.

## Deployment

### Vercel Deployment

Both apps are configured for Vercel deployment:

1. **API**: Deploy as serverless functions
2. **Web**: Deploy as static site with SSR

### Environment Variables

Copy the example environment file and configure:

```bash
cp .env.example .env.local
```

**Required variables:**
- `API_URL` - GraphQL API endpoint URL

**For local development:**
```
API_URL=http://localhost:3001/graphql
```

**For Vercel deployment:**
Set in Vercel dashboard or CLI:
```bash
vercel env add API_URL
# Enter: https://your-api-domain.vercel.app/graphql
```

## Data

The card data is sourced from a CSV file and converted to JSON at build time. The data includes:

- Card names (English and Japanese)
- Mana cost and colors
- Card types and rarity
- Legal/banned status in Middle School format
- Rules text and power/toughness

## Tech Stack

- **API**: Hono.js, GraphQL Yoga, TypeScript
- **Frontend**: Remix.js, React, TypeScript
- **Build**: Turbo, pnpm workspaces
- **Deployment**: Vercel