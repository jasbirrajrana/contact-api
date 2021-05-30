import { Field, InputType } from "type-graphql";

@InputType()
export class CreateContactInput {
  @Field()
  name: string;

  @Field()
  email: string;
}
