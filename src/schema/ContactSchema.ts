import { getModelForClass, Prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { User } from "./UserSchema";

@ObjectType()
export class Contact {
  @Field()
  _id: string;

  @Field((_type) => User)
  @Prop({ ref: User, required: true })
  author: string;

  @Field()
  @Prop({ type: () => String, required: true, unique: false })
  name: string;

  @Field()
  @Prop({ type: () => String, required: true, unique: true })
  email: string;

  @Field()
  @Prop({ default: Date.now() })
  createdAt: Date;

  @Field()
  @Prop({ default: Date.now() })
  updatedAt: Date;
}

const ContactModel = getModelForClass(Contact);
export default ContactModel;
