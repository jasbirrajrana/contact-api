import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/HelloResolver";
import { connect } from "./config/db";
import session from "express-session";
import { ContactResolver } from "./resolvers/ContactResolver";
import { UserResolver } from "./resolvers/UserResolver";
import connectRedis from "connect-redis";
import { client } from "./utils/redisConfig";
import cors from "cors";
import { COOKIE_NAME, __prod__ } from "./types/constants";
(async () => {
  const RedisStore = connectRedis(session);
  const app = express();
  if (__prod__) {
    app.set("trust proxy", 1);
  }

  app.use(cors());
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: client, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      secret: process.env.SESSION_SECRET!,
      saveUninitialized: false,
      resave: false,
    })
  );
  const port: any = process.env.PORT! || 4000;
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, ContactResolver, UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
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
