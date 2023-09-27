import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { MuteGroupDto } from './dto/mute-group.dto';
import { SendMessageDto } from './dto/sendmessage.dto';
import { Group, User } from '@prisma/client';
@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name);
  constructor(private readonly prisma: PrismaService,
    ) { }

  async createGroup(createGroupDto: CreateGroupDto) {
    try {
      const createdGroup = await this.prisma.group.create({
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

      this.logger.log(`Group created successfully: ${createGroupDto.name}`);

      return createdGroup;
    } catch (error) {
      this.logger.error(error, 'GropuService.createGroup');
      throw error;
    }
  }

  async addMember(groupId: number, addMemberDto: AddMemberDto) {
    try {
      const newMember = await this.prisma.groupMember.create({
        data: {
          userId: addMemberDto.userId,
          groupId,
        },
      });

      const updatedGroup = await this.prisma.group.findUnique({
        where: { id: groupId },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });
      this.logger.log(`Member added to group: ${addMemberDto.userId}`);

      return updatedGroup;
    }

    catch (error) {
      this.logger.error(error, 'GroupService.addMember');
      throw error;

    }
  }

  async muteGroup(groupId: number, muteGroupDto: MuteGroupDto) {
    try {
      const groupMember = await this.prisma.groupMember.findFirst({
        where: {
          userId: muteGroupDto.userId,
          muteUntil: muteGroupDto.muteUntil,
        },
      });

      if (!groupMember) {
        this.logger.warn(`Group member not found for user ${muteGroupDto.userId}`);
        throw new NotFoundException('Group member not found.');
      }

      await this.prisma.groupMember.update({
        where: { id: groupMember.id },
        data: {
          isMuted: true,
          muteUntil: muteGroupDto.muteUntil,
        },
      });

      this.logger.log(`Group muted successfully: ${groupId}`);

    } catch (error) {
      this.logger.error(error, 'GroupService.muteGroup');
      throw error;
    }
  }

  async getGroupMembers(groupId: number) {
    try {
      const members = await this.prisma.groupMember.findMany({
        where: {
          groupId,
        },
      });

      if (!members) {
        throw new NotFoundException('Group members not found.');
      }

      const groupMembers: Group[] = members.map((member) => ({
        id: member.id,
        name: member.name,
      }));

      this.logger.log(`Retrieved group members for groupId: ${groupId}`);

      return groupMembers;
    } catch (error) {
      this.logger.error(error, 'GroupService.getGroupMembers');
      throw error;
    }
  }

  async addUserToGroup(userId: number, groupId: number) {
    try {
      const existingUser = await this.prisma.groupMember.findFirst({
        where: {
          groupId,
          userId,
        },
      });

      if (!existingUser) {
        await this.prisma.groupMember.create({
          data: {
            userId,
            groupId,
          },
        });

        this.logger.log(`User added to group: userId=${userId}, groupId=${groupId}`);
      }
    } catch (error) {
      this.logger.error(error, 'GroupService.addUserToGroup');
      throw error;
    }
  }

  async getUsersInGroup(groupId: number): Promise<User[]> {
    try {
      const groupUsers = await this.prisma.groupMember.findMany({
        where: {
          groupId,
        },
        select: {
          user: true,
        },
      });

      const usersInGroup = groupUsers.map((groupUser) => groupUser.user);

      this.logger.log(`Retrieved users in group: groupId=${groupId}`);

      return usersInGroup;
    } catch (error) {
      this.logger.error(error, 'GroupService.getUsersInGroup');
      throw error;
    }
  }



  async removeUserFromGroup(userId: number, groupId: number) {
    try {
      const batchPayload = await this.prisma.groupMember.deleteMany({
        where: {
          userId,
          groupId,
        },
      });

      const deletedCount = batchPayload.count;

      if (deletedCount > 0) {
        this.logger.log(`Users removed from group ${groupId}: ${deletedCount}`);
      }

      return deletedCount;
    } catch (error) {
      this.logger.error(error, 'GroupService.removeUserFromGroup');
      throw error;
    }
  }

  async getGroupMessages(groupId: number) {
    try {
      const messages = await this.prisma.groupMessage.findMany({
        where: {
          groupId,
        },
        include: {
          sender: true,
        },
      });

      return messages;
    } catch (error) {
      this.logger.error(error, 'GroupService.getGroupMessages');
      throw error;
    }
  }

  async sendMessage(sendMessageDto: SendMessageDto) {
    try {
      const createdMessage = await this.prisma.groupMessage.create({
        data: {
          content: sendMessageDto.content,
          senderId: sendMessageDto.senderId,
          groupId: sendMessageDto.groupId,
        },
      });

      this.logger.log(`Message sent by user ${sendMessageDto.senderId}`);

      return createdMessage;
    } catch (error) {
      this.logger.error(error, 'GroupService.sendMessage');
      throw error;
    }
  }

  async softDeleteMessage(messageId: number) {
    try {
      const message = await this.prisma.messages.findUnique({
        where: {
          id: messageId,
        },
      });

      if (!message) {
        throw new NotFoundException('Message not found');
      }

      await this.prisma.messages.update({
        where: {
          id: messageId,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      this.logger.log(`Message ${messageId} soft-deleted`);

    } catch (error) {
      this.logger.error(error, 'GroupService.softDeleteMessage');
      throw error;
    }
  }
}


