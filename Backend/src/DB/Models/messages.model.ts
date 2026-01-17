import mongoose from "mongoose";
import type { IMessage } from "../../Common";

const messageSchema = new mongoose.Schema<IMessage>(
    {
        text: String,
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "conversations",
            required: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        attachments: [String],
    },
    { timestamps: true }
);

export const messageModel = mongoose.model<IMessage>("Messages", messageSchema);