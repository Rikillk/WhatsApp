
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Block } from './block.model';

@Injectable()
export class BlockService {
    constructor(@InjectModel(Block.name) private readonly blockModel: Model<Block>) { }

    async blockUser({ blocker, blockedUser }: { blocker: string; blockedUser: string }) {
        // Create a new Block document
        const block = new this.blockModel({ blocker, blockedUser });
    
        // Save the document to the database
        return block.save();
      }
    async unblockUser(blocker: string, blockedUser: string): Promise<void> {
        await this.blockModel.deleteOne({ blocker, blockedUser }).exec();
    }

    async getBlockedUsers(blocker: string): Promise<string[]> {
        const blocks = await this.blockModel.find({ blocker }).select('blockedUser').exec();
        return blocks.map((block) => block.blockedUser.toString());
    }
}
