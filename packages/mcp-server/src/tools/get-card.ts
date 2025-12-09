import { graphqlRequest } from "../graphql/client.js";

interface GetCardArgs {
  oracleId: string;
}

const GET_CARD_QUERY = `
  query GetCard($oracleId: String!) {
    getCard(oracleId: $oracleId) {
      oracle_id
      name
      name_ja
      banned
      mv
      text
      type
      power
      toughness
      w
      u
      b
      r
      g
      c
      image_small
    }
  }
`;

export async function getCard(args: GetCardArgs) {
  return await graphqlRequest(GET_CARD_QUERY, args);
}

export const getCardToolDefinition = {
  name: "get_card",
  description:
    "Get detailed information about a specific Magic: The Gathering card by its Oracle ID. Returns full card details including stats, text, colors, and legality.",
  inputSchema: {
    type: "object",
    properties: {
      oracleId: {
        type: "string",
        description: "The Oracle ID of the card to retrieve",
      },
    },
    required: ["oracleId"],
  },
};
