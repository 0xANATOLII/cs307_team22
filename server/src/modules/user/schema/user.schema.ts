import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document, Types } from 'mongoose';

export type UserDocument = User & Document

@Schema()
export class User {
@Prop({ required: true, unique: true }) // Ensure unique usernames
username:string
@Prop({ required: true, unique: true }) // Ensure unique emails
email:string
@Prop({ required: true })
password:string

@Prop()
name?:string
@Prop()
surname?:string
@Prop()
dob?:Date
@Prop()
country?:string
@Prop()
description?:string

//profile picture
@Prop()
pfp?:string

// Add the privacy field here
@Prop({ default: false }) // Default value can be set to false
privacy?: boolean; // Optional field

}


export const UserSchema = SchemaFactory.createForClass(User)