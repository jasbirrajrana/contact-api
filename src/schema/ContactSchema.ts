import { getModelForClass, Prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Contact {
  @Field()
  _id: string;

  @Field()
  @Prop({ type: () => String, required: true, unique: true })
  name: string;

  @Field()
  @Prop({ type: () => String, required: true })
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
