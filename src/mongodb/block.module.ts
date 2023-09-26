// block.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { Block, BlockSchema } from './block.model';

import { DatabaseModule } from './mongodb.module'; // Import DatabaseModule

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Block.name, schema: BlockSchema }]),
        DatabaseModule, // Ensure that DatabaseModule is imported here
    ],
    controllers: [BlockController],
    providers: [BlockService],
})
export class BlockModule { }
