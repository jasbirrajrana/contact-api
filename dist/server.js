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
const ContactResolver_1 = require("./resolvers/ContactResolver");
const UserResolver_1 = require("./resolvers/UserResolver");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const app = express_1.default();
    const port = process.env.PORT || 4000;
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [HelloResolver_1.HelloResolver, ContactResolver_1.ContactResolver, UserResolver_1.UserResolver],
        }),
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