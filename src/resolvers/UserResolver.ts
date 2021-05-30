import UserModel from "../schema/UserSchema";
import * as argon2 from "argon2";
import { UserResponse } from "../types/UserResponse";
import { Arg, Mutation } from "type-graphql";
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("name", () => String) name: string,
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string
  ): Promise<UserResponse> {
    let isUserExist = await UserModel.findOne({ email });

    if (isUserExist) {
      return {
        errors: [
          {
            field: "Email",
            message: "Email Already Registered!",
          },
        ],
      };
    }

    if (password.length <= 4) {
      return {
        errors: [
          {
            field: "password",
            message: "password length must be greater than 4",
          },
        ],
      };
    }

    const hashedPassword: string = await argon2.hash(password);
    let user;
    try {
      user = await UserModel.create({
        name,
        email,
        password: hashedPassword,
      });
    } catch (error) {
      throw new Error(error);
    }
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string
  ): Promise<UserResponse> {
    const userExist = await UserModel.findOne({ email });
    if (userExist === null) {
      return {
        errors: [
          {
            field: "email",
            message: "could not find a user with provided Email id!",
          },
        ],
      };
    }
    const valid = await argon2.verify(userExist.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "password is not matching!",
          },
        ],
      };
    }

    return {
      user: userExist,
    };
  }
}
