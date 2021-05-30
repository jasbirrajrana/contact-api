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
const db_1 = require("../config/db");
const dotenv_1 = __importDefault(require("dotenv"));
const random_name_1 = __importDefault(require("random-name"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.connect();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.closeDbConnection();
}));
const name = random_name_1.default.first();
const email = random_name_1.default.last();
describe("User Resolver", () => {
    it("Create User", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.post("http://localhost:4000/graphql", {
            query: `mutation{
         register(name:"${name}",email:"${email}",password:"password!!"){
             errors{
                 field
                 message
             }
             user{
                name
                email
                createdAt
                updatedAt
             }
         }
      }`,
        });
        const { data } = response;
        console.log(data);
    }));
    it("Create User", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.post("http://localhost:4000/graphql", {
            query: `mutation{
         login(email:"${email}",password:"password!!"){
             errors{
                 field
                 message
             }
             user{
                name
                email
                createdAt
                updatedAt
             }
         }
      }`,
        });
        const { data } = response;
        console.log(data);
    }));
});
//# sourceMappingURL=UserResolver.test.js.map