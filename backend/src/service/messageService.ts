import { UUID } from "crypto";

import { SENDER } from "../enums";
import { MessageModel } from "../model";
import { getUUID } from "../utils/utils";
import * as ChatService from "./chatService";
import { NotFound, UnauthorizedError } from "../error";
import { IGetUserQuery, IMessage } from "../interface";

/**
 * Get all Messages in given chat
 *
 * @param {UUID} chatId Chat Id
 * @param {IGetUserQuery} query Query parameters
 * @returns List of messages
 */
export async function getMessages(chatId: UUID, query: IGetUserQuery) {
  const data = await MessageModel.getMessages(chatId, query);

  return {
    message: "Messages retrieved successfully",
    data,
  };
}

/**
 * Create Message
 *
 * @param {UUID} chatId Chat Id
 * @param {UUID} userId User Id
 * @param {role: SENDER, content: string} payload User prompt content
 * @returns Newly created message object
 */
export async function createMessage(
  chatId: UUID,
  userId: UUID,
  payload: { role: SENDER, content: string },
) {
  const message: Omit<IMessage, "updatedAt"> = {
    id: getUUID(),
    chatId,
    sender: payload.role,
    content: payload.content,
    createdAt: new Date(),
  };

  const data = await MessageModel.createMessage(message);

  // Update chat update time
  await ChatService.updateChat(chatId, userId);

  return {
    message: "message received successfully",
    data: data[0],
  };
}

/**
 * Update message
 *
 * @param {UUID} id Message Id
 * @param {UUID} chatId Chat Id
 * @param {string} content User data
 * @throws `UnauthorizedError` Error if user is not authorized to update
 */
export async function updateMessage(id: UUID, chatId: UUID, content: string) {
  const existingMessage = await getMessageById(id);
  if (existingMessage.chatId !== chatId)
    throw new UnauthorizedError("Message does not belong to this chat");

  const messageData: Pick<IMessage, "content" | "updatedAt"> = {
    content,
    updatedAt: new Date(),
  };

  const data = await MessageModel.updateMessage(id, messageData);

  return {
    message: "User updated successfully",
    data,
  };
}

/**
 * Get message by id
 *
 * @param {UUID} id message id
 * @returns {Promise<IMessage>} Chat object
 * @throws `NotFound` Error if chat does not exists
 */
export async function getMessageById(id: UUID): Promise<IMessage> {
  const message = await MessageModel.getMessageById(id);

  if (!message) {
    throw new NotFound(`Message with id ${id} does not exists`);
  }

  return message;
}
