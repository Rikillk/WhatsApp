import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
// import { User } from '../users/users.controller';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

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
      

}
