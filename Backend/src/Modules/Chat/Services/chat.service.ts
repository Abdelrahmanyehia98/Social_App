import type { Socket } from "socket.io";
import { getIo } from "../../../Gateways/SocketIo/socketio.gateways";
import { MessageRepository, ConversationRepository } from "../../../DB/Repositories";


export class ChatService {

    private conversationRepository: ConversationRepository = new ConversationRepository();
    private messageRepository: MessageRepository = new MessageRepository();

    async joinprivateChat(socket: Socket, targerUserId: string) {

        let convesation = await this.conversationRepository.findOneDocument({
            type: "direct",
            members: { $all: [socket.data.userId, targerUserId] },
        });
        if (!convesation) {
            convesation = await this.conversationRepository.createNewDocument({
                type: "direct",
                members: [socket.data.userId, targerUserId],
            });
        }
        socket.join(convesation._id!.toString());
        return convesation;
    }
    async sendPrivateMessage(socket: Socket, data: unknown) {
        const { text, targerUserId } = data as { text: string; targerUserId: string; };
        const coversation = await this.joinprivateChat(socket, targerUserId);

        // create message
        const message = await this.messageRepository.createNewDocument({
            text,
            conversationId: coversation._id!,
            senderId: socket.data.userId,
        });

        getIo()?.to(coversation._id!.toString()).emit("message-sent", message);
    }

    async getCoversationMessages(socket: Socket, targeterUserId: string) {
        const conversation = await this.joinprivateChat(socket, targeterUserId);
        const messages = await this.messageRepository.findDocuments({ conversationId: conversation._id! })
        socket.emit('Conversation messages', messages)
    }

    async joinChatGroup(socket: Socket, targetGroupId: string) {
        let conversation = await this.conversationRepository.findOneDocument({
            _id: targetGroupId,
            type: 'group'
        })
        socket.join(conversation?._id?.toString() || "")
        return conversation
    }

    async sendGroupMessage(socket: Socket, data: unknown) {
        const { text, targetGroupId } = data as { text: string, targetGroupId: string }
        const conversation = await this.joinChatGroup(socket, targetGroupId)

        // creat message
        const message = await this.messageRepository.createNewDocument({
            text,
            conversationId: conversation?._id,
            senderId: socket.data.userId
        })

        getIo()?.to(conversation?._id?.toString() || "").emit('message-sent', message)
    }

    async getGroupHistory(socket: Socket, targetGroupId: string) {
        const messages = await this.messageRepository.findDocuments({
            conversationId: targetGroupId
        })
        socket.emit('chat history', messages)
    }
}