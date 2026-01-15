import type { IConversation } from "../../Common";
import { conversationModel } from "../Models";
import { BaseRepository } from "./base.repository";

export class ConversationRepository extends BaseRepository<IConversation> {
  constructor() {
    super(conversationModel);
  }
}