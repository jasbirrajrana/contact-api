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
exports.graphqlTestCall = void 0;
const graphql_1 = __importDefault(require("graphql"));
const type_graphql_1 = require("type-graphql");
const ContactResolver_1 = require("./resolvers/ContactResolver");
const HelloResolver_1 = require("./resolvers/HelloResolver");
let schema;
(() => __awaiter(void 0, void 0, void 0, function* () {
    schema = yield type_graphql_1.buildSchema({
        resolvers: [HelloResolver_1.HelloResolver, ContactResolver_1.ContactResolver],
    });
}))();
const graphqlTestCall = (query, variables) => __awaiter(void 0, void 0, void 0, function* () {
    return graphql_1.default(schema, query, {
        variables,
    });
});
exports.graphqlTestCall = graphqlTestCall;
//# sourceMappingURL=graphqlTestCall.js.map