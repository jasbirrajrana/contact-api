import ContactModel, { Contact } from "../schema/ContactSchema";
import {
  Arg,
  Ctx,
  Mutation,
  ObjectType,
  Query,
  UseMiddleware,
} from "type-graphql";
import { ctx } from "../types/MyContext";
import { isAuth } from "../middlewares/isAuth";

@ObjectType()
export class ContactResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createContact(
    @Arg("name", () => String) name: string,
    @Arg("email", () => String) email: string,
    @Ctx() { req, res }: ctx
  ): Promise<boolean> {
    const contact = await ContactModel.create({
      name,
      email,
      author: req.session.userId,
    });
    if (!contact) {
      return false;
    }
    return true;
  }
  @Query(() => [Contact])
  @UseMiddleware(isAuth)
  async getContacts(@Ctx() { req, res }: ctx) {
    const contacts = await ContactModel.find({
      author: req.session.userId,
    });
    return contacts;
  }

  @Mutation(() => Contact)
  @UseMiddleware(isAuth)
  async updateContact(
    @Arg("email", () => String) email: string,
    @Arg("name", () => String) name: string,
    @Ctx() { req, res }: ctx
  ) {
    const contact = await ContactModel.findOne({
      email,
      author: req.session.userId,
    });

    if (!contact) {
      throw new Error("contact not found!");
    }

    if (contact) {
      contact.name = name || contact.name;
      contact.updatedAt = new Date();
    }

    const updatedContact = await contact.save();
    return updatedContact;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteContact(
    @Arg("email", () => String) email: string,
    @Ctx() { req, res }: ctx
  ): Promise<boolean> {
    const contact = await ContactModel.findOne({
      email,
      author: req.session.userId,
    });

    if (!contact) {
      throw new Error("Contact not found!");
    }
    try {
      await ContactModel.deleteOne({ email }, function (err) {
        if (err) return false;
      });
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }
  @Query(() => [Contact])
  @UseMiddleware(isAuth)
  async getContactByName(
    @Arg("name", () => String) name: string,
    @Ctx() { req, res }: ctx
  ) {
    const contacts = await ContactModel.find({
      name,
      author: req.session.userId,
    });

    if (!contacts) {
      throw new Error("Contacts not found!");
    }

    return contacts;
  }

  @Query(() => [Contact])
  @UseMiddleware(isAuth)
  async getContactByEmail(
    @Arg("email", () => String) email: string,
    @Ctx() { req, res }: ctx
  ) {
    const contacts = await ContactModel.find({
      email,
      author: req.session.userId,
    });

    if (!contacts) {
      throw new Error("Contacts not found!");
    }

    return contacts;
  }

  @Query(() => [Contact])
  @UseMiddleware(isAuth)
  async searchContact(
    @Arg("keyword", () => String) keyword: string,
    @Arg("page", () => Number, { defaultValue: 1 }) page: number,
    @Ctx() { req, res }: ctx
  ) {
    let resultPerPage = 10;
    page = page - 1;

    let searchingOnject = keyword
      ? {
          email: {
            $regex: keyword,
            $options: "i",
          },
          author: req.session.userId,
        }
      : {};
    let contacts = await ContactModel.find({ ...searchingOnject })
      .limit(resultPerPage)
      .skip(resultPerPage * page);

    if (!contacts) {
      throw new Error("Contact not found!");
    }
    return contacts;
  }
}
