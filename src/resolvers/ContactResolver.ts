import ContactModel, { Contact } from "../schema/ContactSchema";
import { Arg, Mutation, ObjectType, Query } from "type-graphql";

@ObjectType()
export class ContactResolver {
  @Mutation(() => Boolean)
  async createContact(
    @Arg("name", () => String) name: string,
    @Arg("email", () => String) email: string
  ): Promise<boolean> {
    const contact = await ContactModel.create({
      name,
      email,
    });
    if (!contact) {
      return false;
    }
    return true;
  }
  @Query(() => [Contact])
  async getContacts() {
    const contacts = await ContactModel.find({});
    return contacts;
  }

  @Mutation(() => Contact)
  async updateContact(
    @Arg("email", () => String) email: string,
    @Arg("name", () => String) name: string
  ) {
    const contact = await ContactModel.findOne({ email });
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
  async deleteContact(
    @Arg("email", () => String) email: string
  ): Promise<boolean> {
    const contact = await ContactModel.findOne({ email });

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
  async getContactByName(@Arg("name", () => String) name: string) {
    const contacts = await ContactModel.find({ name });

    if (!contacts) {
      throw new Error("Contacts not found!");
    }

    return contacts;
  }

  @Query(() => [Contact])
  async getContactByEmail(@Arg("email", () => String) email: string) {
    const contacts = await ContactModel.find({ email });

    if (!contacts) {
      throw new Error("Contacts not found!");
    }

    return contacts;
  }

  @Query(() => [Contact])
  async searchContact(
    @Arg("keyword", () => String) keyword: string,
    @Arg("page", () => Number, { defaultValue: 1 }) page: number
  ) {
    let resultPerPage = 10;
    page = page - 1;

    let searchingOnject = keyword
      ? {
          email: {
            $regex: keyword,
            $options: "i",
          },
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
