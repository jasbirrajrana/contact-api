import { connect, closeDbConnection } from "../config/db";
import dotenv from "dotenv";
import random from "random-name";
import axios from "axios";
dotenv.config();

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await closeDbConnection();
});
const name = random.first();
const email = random.last();
describe("User Resolver", () => {
  it("Create User", async () => {
    const response = await axios.post("http://localhost:4000/graphql", {
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
  });

  it("Create User", async () => {
    const response = await axios.post("http://localhost:4000/graphql", {
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
  });
});
