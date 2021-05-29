import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/HelloResolver";
import { connect } from "./config/db";
import { ContactResolver } from "./resolvers/ContactResolver";
(async () => {
  const app = express();
  const port: any = process.env.PORT! || 4000;
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, ContactResolver],
    }),
    playground: true,
    introspection: true,
  });
  apolloServer.applyMiddleware({ app, cors: false });
  connect()
    .then(() => {
      app.listen(port, () => {
        console.log(
          `Server is in ${process.env.NODE_ENV} mode on http://localhost:${port}/graphql`
        );
      });
    })
    .catch((e) => {
      console.log(e, "Error");
    });
})();
