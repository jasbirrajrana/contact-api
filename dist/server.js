"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const HelloResolver_1 = require("./resolvers/HelloResolver");
const db_1 = require("./config/db");
const express_session_1 = __importDefault(require("express-session"));
const ContactResolver_1 = require("./resolvers/ContactResolver");
const UserResolver_1 = require("./resolvers/UserResolver");
const connect_redis_1 = __importDefault(require("connect-redis"));
const redisConfig_1 = require("./utils/redisConfig");
const cors_1 = __importDefault(require("cors"));
const constants_1 = require("./types/constants");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const RedisStore = connect_redis_1.default(express_session_1.default);
    const app = express_1.default();
    app.use(cors_1.default());
    app.set("trust proxy", true);
    app.enable("trust proxy");
    app.use(express_session_1.default({
        name: constants_1.COOKIE_NAME,
        store: new RedisStore({ client: redisConfig_1.client, disableTouch: true }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            sameSite: "lax",
            secure: constants_1.__prod__,
            domain: ".herokuapp.com",
        },
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
    }));
    const port = process.env.PORT || 4000;
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [HelloResolver_1.HelloResolver, ContactResolver_1.ContactResolver, UserResolver_1.UserResolver],
        }),
        context: ({ req, res }) => ({ req, res }),
        playground: true,
        introspection: true,
    });
    apolloServer.applyMiddleware({ app, cors: false });
    db_1.connect()
        .then(() => {
        app.listen(port, () => {
            console.log(`Server is in ${process.env.NODE_ENV} mode on http://localhost:${port}/graphql`);
        });
    })
        .catch((e) => {
        console.log(e, "Error");
    });
}))();
//# sourceMappingURL=server.js.map