import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { MuteGroupDto } from './dto/mute-group.dto';
import { SendMessageDto } from './dto/sendmessage.dto';
import { User } from '@prisma/client';
@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) { }

  async createGroup(createGroupDto: CreateGroupDto) {
    return this.prisma.group.create({
      data: {
        name: createGroupDto.name,
        members: {
          createMany: {
            data: createGroupDto.members.map((userId) => ({
              userId,
            })),
          },
        },
      },
    });
  }

  async addMember(groupId: number, addMemberDto: AddMemberDto) {
    return this.prisma.groupMember.create({
      data: {
        userId: addMemberDto.userId,
        groupId,
      },
    });
  }



  async muteGroup(groupId: number, muteGroupDto: MuteGroupDto) {
    const groupMember = await this.prisma.groupMember.findFirst({
      where: {
        userId: muteGroupDto.userId,
        muteUntil: muteGroupDto.muteUntil
      },
    });

    if (!groupMember) {
      throw new NotFoundException('Group member not found.');
    }

    await this.prisma.groupMember.update({
      where: { id: groupMember.id },
      data: {
        isMuted: true,
        muteUntil: muteGroupDto.muteUntil,
      },
    });
  }



  async getGroupMembers(groupId: number) {
    const groupMembers = await this.prisma.groupMember.findMany({
      where: {
        groupId,
      },
    });

    if (!groupMembers) {
      throw new NotFoundException('Group members not found.');
    }

    return groupMembers.map((member) => member.userId);

  }
  async addUserToGroup(userId: number, groupId: number) {
    const existingUser = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        userId,
      },
    });

    if (!existingUser) {
      // User is not in the group, so add them
      await this.prisma.groupMember.create({
        data: {
          userId,
          groupId,
        },
      });
    }
  }

  async getUsersInGroup(groupId: number): Promise<User[]> {
    // Retrieve all users in a group
    const groupUsers = await this.prisma.groupMember.findMany({
      where: {
        groupId,
      },
      select: {
        user: true,
      },
    });

    // Extract the 'user' field from each groupUser and return as an array of Users
    return groupUsers.map(groupUser => groupUser.user);
  }






  async removeUserFromGroup(userId: number, groupId: number) {
    return this.prisma.groupMember.deleteMany({
      where: {
        userId,
        groupId,
      },
    });
  }


  async getGroupMessages(groupId: number) {
    return this.prisma.groupMessage.findMany({
      where: {
        groupId,
      },
      include: {
        sender: true,
      },
    });
  }
  async sendMessage(sendMessageDto: SendMessageDto) {
    return this.prisma.groupMessage.create({
      data: {
        content: sendMessageDto.content,
        senderId: sendMessageDto.senderId,
        groupId: sendMessageDto.groupId,
      },
    });
  }
  async softDeleteMessage(messageId: number) {
    // Find the message by ID
    const message = await this.prisma.messages.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Update the deletedAt field to mark it as soft-deleted
    await this.prisma.messages.update({
      where: {
        id: messageId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }


}


