import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
// import { User } from '../users/users.controller';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { AuthDto } from 'src/auth/dto/signup.dto';

@Injectable()
export class UsersService {
   
    constructor(private prisma: PrismaService) {}
     
    async getUser(id: number){
        return await this.prisma.user.findUnique({where:{id}})
    }

    async getUsers(){
        return await this.prisma.user.findMany({ select:{id: true, email: true}})
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        
        const user = await this.prisma.user.findUnique({
            where: {
                email:email,
            },
        });

       
        if (user && (await bcrypt.compare(password, user.password))) {
            return user; 
        }

        throw new NotFoundException('User not found or invalid credentials');
    }
    async blockUser(blockerId: number, blockedId: number): Promise<void> {
        // Check if a block record already exists for the specified users.
        const existingBlock = await this.prisma.block.findFirst({
          where: {
            blockerId,
            blockedId,
          },
        });
      
        if (existingBlock) {
          throw new NotFoundException('User is already blocked.');
        }
      
        // Create a new block record in the database.
        await this.prisma.block.create({
          data: {
            blockerId,
            blockedId,
          },
        });
      }
      
  async createUser(input: AuthDto): Promise<User> {
    const { username, email, password } = input;

    // Check if the user with the provided email already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Create the user
    const newUser = await this.prisma.user.create({
      data: {
        username,
        email,
        password, // Make sure to hash the password before storing it in the database
      },
    });

    return newUser;
  }
  async deleteUser(userId:number): Promise<boolean> {
    try {
      // Use Prisma to delete the user by userId
      const deletedUser = await this.prisma.user.delete({
        where: {
          id: userId,
        },
      });

      if (deletedUser) {
        return true; // User was deleted successfully
      } else {
        return false; // User not found or deletion failed
      }
    } catch (error) {
      console.error(error);
      return false; // Handle any potential errors and return false
    }
  }
}
