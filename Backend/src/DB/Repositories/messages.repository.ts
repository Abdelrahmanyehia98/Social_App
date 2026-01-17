import type { IMessage } from "../../Common";
import { messageModel } from  "../Models";
import { BaseRepository } from "./base.repository";

export class MessageRepository extends BaseRepository<IMessage> {
    constructor() {
        super(messageModel);
    }
}