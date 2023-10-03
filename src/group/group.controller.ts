import { Controller, Post, Body, Param, Put, Get, ParseIntPipe, UseGuards,UseInterceptors, NotFoundException } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { MuteGroupDto } from './dto/mute-group.dto';
import { SendMessageDto } from './dto/sendmessage.dto';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { OffensiveMessageMiddleware } from 'src/middlewares/offensive-message.middleware';
import { CombinedGateway } from 'src/common/combined.gateway';
@Controller('groups')
export class GroupController {
  
 constructor(private readonly groupService: GroupService,
  private readonly combinedgateway:CombinedGateway) {}
  @UseGuards(AuthMiddleware) 
  @Post()
  async createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.createGroup(createGroupDto);
  }

  @Put(':groupId/members')
  async addMember(@Param('groupId',ParseIntPipe) groupId: number, @Body() addMemberDto: AddMemberDto) {
    return this.groupService.addMember(groupId, addMemberDto);
  }  
  @UseInterceptors(OffensiveMessageMiddleware)
  @Post(':groupId/messages')
  async sendMessage(@Param('groupId', ParseIntPipe) groupId: number, 
  @Body() sendMessageDto: SendMessageDto) {
    // Handle the sendMessage request
    const message = await this.groupService.sendMessage(sendMessageDto);

    // Use WebSocket to send the message to the group
    this.combinedgateway.server.to(`group-${groupId}`).emit('message', message);

    return message;
  }

  @Put(':groupId/mute')
  async muteGroup(@Param('groupId',ParseIntPipe) groupId: number, @Body() muteGroupDto: MuteGroupDto) {
    return this.groupService.muteGroup(groupId, muteGroupDto);
  }

  @Get(':groupId/members')
  async getGroupMembers(@Param('groupId',ParseIntPipe) groupId: number) {
    return this.groupService.getGroupMembers(groupId);
  }
  @Post(':id/delete')
  async softDeleteMessage(@Param('id') messageId: number) {
    try {
      await this.groupService.softDeleteMessage(messageId);
      return { message: 'Message deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Message not found');
      }
      throw error;
    }
  }

}
