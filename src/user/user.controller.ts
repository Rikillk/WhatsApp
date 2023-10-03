import { Controller, Get, Param, UseGuards, Post, Body,ParseIntPipe } from '@nestjs/common';
import { UsersService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { BlockUserDto } from './dto/block-user.dto'; 
import { Throttle } from '@nestjs/throttler';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(JwtAuthGuard)
  @Get()
  @Throttle(5,60)
  getUsers() {
    return this.usersService.getUsers();
  }
  
  @Get(':id')
  @Throttle(10,60)
  getUser(@Param('id',ParseIntPipe) id: number) {
    return this.usersService.getUser(id);
  }
  
  @UseGuards(AuthGuard)
  @Post(':id/block')
  async blockUser(@Param('id',ParseIntPipe) id: number, @Body() blockUserDto: BlockUserDto) {
    await this.usersService.blockUser(id, blockUserDto.blockedId);
    return { message: 'User blocked successfully' };
  }
}

