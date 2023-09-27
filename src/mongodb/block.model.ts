
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Block extends Document {
  @Prop({ required: true, ref: 'User' })
  blocker: string;

  @Prop({ required: true, ref: 'User' })
  blockedUser: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const BlockSchema = SchemaFactory.createForClass(Block);
