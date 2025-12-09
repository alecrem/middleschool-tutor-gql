import { graphqlRequest } from "../graphql/client.js";

interface ValidateDeckArgs {
  cardNames: string[];
}

const VALIDATE_CARDS_QUERY = `
  query ValidateCards($cardNames: [String!]!) {
    validateCards(cardNames: $cardNames) {
      name
      found
      banned
      matchedName
      matchedNameJa
    }
  }
`;

export async function validateDeck(args: ValidateDeckArgs) {
  return await graphqlRequest(VALIDATE_CARDS_QUERY, args);
}

export const validateDeckToolDefinition = {
  name: "validate_deck",
  description:
    "Validate a list of Magic: The Gathering card names for Middle School format legality. Checks if cards exist in the format and whether they are banned. Useful for deck list validation.",
  inputSchema: {
    type: "object",
    properties: {
      cardNames: {
        type: "array",
        items: { type: "string" },
        description:
          "Array of card names to validate. Maximum 100 cards. Can include card names in English or Japanese.",
      },
    },
    required: ["cardNames"],
  },
};
