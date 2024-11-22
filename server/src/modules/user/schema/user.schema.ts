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
deletedAt? : Date | null;
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
@Prop()
resetPasswordExpires?:Date
@Prop()
resetPasswordToken?:string


@Prop({ type: String })
pfp?: string | null; // Explicitly allow null if needed, e.g., for empty profile pictures

// Add the privacy field here
@Prop({ default: false }) // Default value can be set to false
privacy?: boolean; // Optional field

@Prop({ type: [String], default: [] })
following: string[];

@Prop({ type: [String], default: [] })
followers: string[];

@Prop({ type: [String], default: [] })
followRequests: string[];

@Prop({ type: [String], default: [] })
wishlist: string[];

@Prop({ type: [String], default: [] })
badgeIds: string[];

//Has this user seen the tutorial?
@Prop({ default: false })
tutorial?: boolean;

}


export const UserSchema = SchemaFactory.createForClass(User)