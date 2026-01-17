import { Schema, Types, model } from "mongoose";
import  { ConversationEnum, IConversation } from "../../Common";

const conversationSchema = new Schema<IConversation>(
    {
        type: {
            type: String,
            enum: ConversationEnum,
            default: ConversationEnum.DIRECT
    },
        name: String,
        
        members: [
            {
                type: Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

export const conversationModel = model<IConversation>(
    "Conversation",
    conversationSchema
);