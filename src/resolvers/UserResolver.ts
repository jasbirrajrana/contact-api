import UserModel, { User } from "../schema/UserSchema";
import * as argon2 from "argon2";
import { UserResponse } from "../types/UserResponse";
import { Arg, Ctx, Mutation, Query } from "type-graphql";
import { ctx } from "../types/MyContext";
import { COOKIE_NAME } from "../types/constants";
export class UserResolver {
  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: ctx) {
    return new Promise((resolve) =>
      req.session.destroy((err: any) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: ctx) {
    if (!req.session.userId) {
      return null;
    }
    console.log(req.session.userId);
    return UserModel.findById(req.session.userId);
  }
  @Mutation(() => UserResponse)
  async register(
    @Arg("name", () => String) name: string,
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() { req, res }: ctx
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
    req.session.userId = user._id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() { req, res }: ctx
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
    console.log(userExist);
    req.session.userId = userExist._id;
    console.log(req.session);
    return {
      user: userExist,
    };
  }
}
