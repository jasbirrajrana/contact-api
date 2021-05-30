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

describe("contact resolver", () => {
  it("Get all contacts", async () => {
    const response = await axios.post("http://localhost:4000/graphql", {
      query: `query{
         getContacts{
    name
    email
    createdAt
    updatedAt
  }
      }`,
    });
    const { data } = response;
    expect(Array.isArray(data.data.getContacts)).toBeTruthy();
  });

  it("Create Contact", async () => {
    const response = await axios.post("http://localhost:4000/graphql", {
      query: `mutation{
         createContact(name:"${name}",email:"${email}")
      }`,
    });
    const { data } = response;
    console.log(data);
  });
  it("Update Contact", async () => {
    const response = await axios.post("http://localhost:4000/graphql", {
      query: `mutation{
          updateContact(email:"${email}",name:"changed"){
            name
            email
            createdAt
            updatedAt
          }
        }`,
    });
    const { data } = response;
    console.log(data);
  });
  it("Delete contact", async () => {
    const response = await axios.post("http://localhost:4000/graphql", {
      query: `mutation{
          deleteContact(email:"${email}")

        }`,
    });
    const { data } = response;
    console.log(data);
  });
});
