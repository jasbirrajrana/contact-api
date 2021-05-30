import { ctx } from "../types/MyContext";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<ctx> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("Not Authenticated");
  }
  return next();
};
