import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document, Types } from 'mongoose';

export type MonumentDocument = Monument & Document

@Schema()
export class Monument {
    
    @Prop()
    title:string

    @Prop()
    icon:string

    @Prop()
    description:string

    @Prop({
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
      })
      location: {
        type: string;
        coordinates: [number, number];
      };

    @Prop({ type: Number})
    radius:number


}


export const MonumentSchema = SchemaFactory.createForClass(Monument)