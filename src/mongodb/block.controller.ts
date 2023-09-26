// block.controller.ts

import { Controller, Post, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { BlockService } from './block.service';
import { AuthGuard } from 'src/auth/auth.guard'; // Use your authentication guard
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('blocks')
@UseGuards(AuthGuard)
export class BlockController {
  constructor(private readonly blockService: BlockService) {}
  @ApiBearerAuth()

  @Post('block/:blockedUserId')
  async blockUser(@Param('blockedUserId') blockedUserId: string, @Req() req) {
    console.log('User information:', req.user); // Log user information
    const blocker = req.user.id; // Get the user who is blocking
    return this.blockService.blockUser({ blocker, blockedUser: blockedUserId });
  }

  @Delete('unblock/:blockedUserId')
  async unblockUser(@Param('blockedUserId') blockedUserId: string, @Req() req) {
    const blocker = req.user.id; // Get the user who is unblocking
    return this.blockService.unblockUser(blocker, blockedUserId);
  }

  @Get()
  async getBlockedUsers(@Req() req) {
    const blocker = req.user.userId; // Get the user's block list
    return this.blockService.getBlockedUsers(blocker);
  }
}
