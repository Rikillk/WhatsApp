
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Block } from './block.model';

@Injectable()
export class BlockService {
    private readonly logger = new Logger(BlockService.name);
    constructor(@InjectModel(Block.name) private readonly blockModel: Model<Block>) { }
    async blockUser({ blocker, blockedUser }: { blocker: string; blockedUser: string }) {
        try {
          const block = new this.blockModel({ blocker, blockedUser });
    
          await block.save();
    
          this.logger.log(`User blocked successfully: ${blockedUser}`);
    
          return;
        } catch (error) {
          this.logger.error(error, 'BlockService.blockUser');
          throw error;
        }
      }
    
      async unblockUser(blocker: string, blockedUser: string): Promise<void> {
        try {
          await this.blockModel.deleteOne({ blocker, blockedUser }).exec();
    
          this.logger.log(`User unblocked successfully: ${blockedUser}`);
    
          return;
        } catch (error) {
          this.logger.error(error, 'BlockService.unblockUser');
          throw error;
        }
      }
    
      async getBlockedUsers(blocker: string): Promise<string[]> {
        try {
          const blocks = await this.blockModel.find({ blocker }).select('blockedUser').exec();
          const blockedUserIds = blocks.map((block) => block.blockedUser.toString());
    
          this.logger.log(`Blocked users for ${blocker}: ${blockedUserIds.join(', ')}`);
    
          return blockedUserIds;
        } catch (error) {
          this.logger.error(error, 'BlockService.getBlockedUsers');
          throw error;
        }
      }
    
}
