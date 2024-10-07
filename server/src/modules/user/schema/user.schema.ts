import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document, Types } from 'mongoose';

export type UserDocument = User & Document

@Schema()
export class User {
@Prop()
username:string
@Prop()
email:string
@Prop()
password:string

@Prop()
name?:string
@Prop()
surname?:string
@Prop()
dob?:Date
@Prop()
country?:string

//profile picute
@Prop()
pfp?:string

// Add the privacy field here
@Prop({ default: false }) // Default value can be set to false
privacy?: boolean; // Optional field

}


export const UserSchema = SchemaFactory.createForClass(User)