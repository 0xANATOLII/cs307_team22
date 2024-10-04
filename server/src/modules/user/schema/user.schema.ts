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



}


export const UserSchema = SchemaFactory.createForClass(User)