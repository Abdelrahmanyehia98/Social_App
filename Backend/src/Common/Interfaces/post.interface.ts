import { Types } from "mongoose";
export interface IPost {
    _id?: Types.ObjectId;
    description?: string;
    attachments?: string[];
    ownerId: Types.ObjectId;
    allowComments?: boolean;
    tags?: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}