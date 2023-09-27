import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { AuthDto } from 'src/auth/dto/signup.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) { }

  async getUser(id: number) {
    try {
      const cachedUser = await this.cache.get<User>(`user_profile_${id}`);
      console.log(cachedUser);
      if (cachedUser) {
        this.logger.log(`User retrieved from cache: ID ${id}`);
        return cachedUser;
      }

      const user = await this.prisma.user.findUnique({ where: { id } });

      await this.cache.set(`user_profile_${id}`, user, { ttl: 3600 });

      this.logger.log(`User fetched from the database: ID ${id}`);

      return user;
    } catch (error) {
      this.logger.error(error, 'UsersService.getUser');
      throw error;
    }
  }

  async getUsers() {
    try {

      const users = await this.prisma.user.findMany({ select: { id: true, email: true } });

      this.logger.log(`Users fetched successfully: Count ${users.length}`);

      return users;
    } catch (error) {
      this.logger.error(error, 'UsersService.getUsers');
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {

      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (user && (await bcrypt.compare(password, user.password))) {
        this.logger.log(`User validated successfully: Email ${email}`);
        return user;
      }

      throw new NotFoundException('User not found or invalid credentials');
    } catch (error) {
      this.logger.error(error, 'UsersService.validateUser');
      throw error;
    }
  }

  async blockUser(blockerId: number, blockedId: number): Promise<void> {
    try {

      const existingBlock = await this.prisma.block.findFirst({
        where: {
          blockerId,
          blockedId,
        },
      });

      if (existingBlock) {
        throw new NotFoundException('User is already blocked.');
      }

      await this.prisma.block.create({
        data: {
          blockerId,
          blockedId,
        },
      });

      this.logger.log(`User blocked successfully: Blocker ID ${blockerId}, Blocked ID ${blockedId}`);
    } catch (error) {
      this.logger.error(error, 'UsersService.blockUser');
      throw error;
    }
  }

  async createUser(input: AuthDto): Promise<User> {
    try {

      const { username, email, password } = input;

      const existingUser = await this.prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        throw new Error('Email already exists');
      }

      const newUser = await this.prisma.user.create({
        data: {
          username,
          email,
          password,
        },
      });

      this.logger.log(`User created successfully: ID ${newUser.id}`);

      return newUser;
    } catch (error) {
      this.logger.error(error, 'UsersService.createUser');
      throw error;
    }
  }

  async deleteUser(userId: number): Promise<boolean> {
    try {

      const deletedUser = await this.prisma.user.delete({
        where: {
          id: userId,
        },
      });

      if (deletedUser) {
        this.logger.log(`User deleted successfully: ID ${userId}`);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.logger.error(error, 'UsersService.deleteUser');
      console.error(error);
      return false;
    }
  }

}
