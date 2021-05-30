import { ContactResolver } from "../resolvers/ContactResolver";
import { HelloResolver } from "../resolvers/HelloResolver";
import { buildSchema } from "type-graphql";

export const createSchema = async () => {
  await buildSchema({
    resolvers: [HelloResolver, ContactResolver],
  });
};
