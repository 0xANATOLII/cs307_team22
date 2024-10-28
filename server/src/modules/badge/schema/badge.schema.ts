import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BadgeDocument = Badge & Document; // Fix typo here

@Schema()
export class Badge {
  @Prop()
  name: string;

  @Prop()
  picture: string;

  @Prop()
  location: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Monument', required: true })
  monumentId: Types.ObjectId;

  @Prop([
    {
      userId: { type: Types.ObjectId, ref: 'User', required: true },
      commentText: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ])
  comments: {
    userId: Types.ObjectId;
    commentText: string;
    createdAt: Date;
  }[];

  @Prop([
    {
      userId: { type: Types.ObjectId, ref: 'User', required: true },
      likedAt: { type: Date, default: Date.now },
    },
  ])
  likes: {
    userId: Types.ObjectId;
    createdAt: Date;
  }[];
}

export const BadgeSchema = SchemaFactory.createForClass(Badge);
