// src/graphql.resolvers.ts

import { Resolver, Query, Args } from '@nestjs/graphql';
import { UsersService } from 'src/user/user.service';
import { MessagesService } from 'src/messages/messages.service';
import { GroupService } from 'src/group/group.service';
import { ParseIntPipe } from '@nestjs/common';

@Resolver('User')
export class UserResolver {
  constructor(private userService: UsersService) {}

  @Query()
  async getUser(@Args('id',ParseIntPipe) id: number) {
    return this.userService.getUser(id);
  }

  // Other user-related resolver methods
}

@Resolver('Message')
export class MessageResolver {
  constructor(private messageService: MessagesService) {}

  // @Query()
  // async getMessages(@Args('senderId') senderId: string) {
  //   return this.messageService.getMessagesBySenderId(senderId);
  // }

  // Other message-related resolver methods
}

@Resolver('Group')
export class GroupResolver {
  constructor(private groupService: GroupService) {}

  @Query()
  async getGroup(@Args('id',ParseIntPipe) groupId: number) {
    return this.groupService.getGroupMembers(groupId);
  }

  // Other group-related resolver methods
}
