import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document, Types } from 'mongoose';

export type MonumentDocument = Monument & Document

@Schema()
export class Monument {
    
    @Prop()
    name:string

    @Prop()
    description:string

    @Prop()
    location:string

    @Prop({ type: Number})
    radius:number


}


export const MonumentSchema = SchemaFactory.createForClass(Monument)