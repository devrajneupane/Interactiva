import { UUID } from "crypto";
import { SENDER } from "../enums";

export interface IMessage {
  id: UUID;
  chatId: UUID;
  sender: SENDER;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
}
