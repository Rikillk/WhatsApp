// dtos.ts
import { Field, ID, InputType, Int, ObjectType, Query } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;
  @Field({ nullable: true })
  username: string;
  @Field()
  email: string;
  @Field({ nullable: true })
  password: string;
}
@InputType()
export class AuthInput {
  // @Field(() => Int)
  // id: number;
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
}
@ObjectType()
export class AuthResponse {
  @Field()
  message: string;
  @Field(() => User)
  user: User;
}
@InputType()
export class DeleteUserInput {
  @Field(() => ID)
  userId: number;
}

// @ObjectType() // Decorate the class as a GraphQL object type
// export class MessageDto {
//   @Field(() => ID)
//   id: string;

//   @Field()
//   message: string;

//   @Field()
//   senderId: number;

//   @Field()
//   receiverId: number;

//   @Field()
//   type: string;

//   @Field()
//   messageStatus: string;
// }

// @ObjectType()
// export class GroupDto {
//   @Field(() => ID)
//   id: number;

//   @Field()
//   name: string;

//   @Field(() => [UserDto])
//   members: UserDto[];

//   @Field({ nullable: true })
//   description?: string;

//   @Field({ nullable: true })
//   creationDate?: string;
// }
// @InputType()
// export class SendMessageInput {
//   @Field(() => Int)
//   senderId: number;

//   @Field(() => Int)
//   receiverId: number;

//   @Field()
//   message: string;

//   @Field()
//   type:string
//   // You can add more fields as needed
// }

