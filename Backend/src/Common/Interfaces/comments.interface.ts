import { Types, Document } from "mongoose"

export interface IComment extends Document<Types.ObjectId> {
    content: string
    ownerId: Types.ObjectId
    attachments?: string[];
    refId: Types.ObjectId
    onModel: string
}