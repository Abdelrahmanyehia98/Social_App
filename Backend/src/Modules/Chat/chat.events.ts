import type { Socket } from "socket.io";
import { ChatService } from "./Services/chat.service";

export class ChatEvents {
    private chatService: ChatService = new ChatService();

    constructor(private socket: Socket) { }

    sendPrivateMessageEvent() {
        this.socket.on("send-private-message", (data) => {
            this.chatService.sendPrivateMessage(this.socket, data);
        });
    }

    getCoversationMessagesEvent() {
        this.socket.on("get-conversation-messages", (data) => {
            this.chatService.getCoversationMessages(this.socket, data);
        });
    }

    sendGroupMessageEvent() {
        this.socket.on("send-group-message", (data) => {
            this.chatService.sendGroupMessage(this.socket, data);
        });
    }

    getGroupHistoryEvent() {
        this.socket.on("get-group-history", (data) => {
            this.chatService.getGroupHistory(this.socket, data);
        });
    }
}