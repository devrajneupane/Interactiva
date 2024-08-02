import { UUID } from "crypto";

import { getUUID } from "../utils";
import * as ChatModel from "../model/chatModel";
import { IChat, IGetUserQuery } from "../interface";
import { NotFound, UnauthorizedError } from "../error";

/**
 * Get all chats
 *
 * @param {IGetUserQuery} query Query parameters
 * @returns List of chats
 */
export async function getChats(userId: UUID, query: IGetUserQuery) {
  const data = await ChatModel.ChatModel.getChats(userId, query);

  return {
    message: `All chats for user ${userId} retrieved successfully`,
    data,
  };
}

/**
 * Create a new chat
 *
 * @param {UUID} userId User id
 * @returns Newly created chat object
 */
export async function createChat(userId: UUID) {
  const chatId = getUUID();
  const chat = await ChatModel.ChatModel.createChat(userId, chatId);

  return {
    message: `Chat created successfully`,
    data: chat[0],
  };
}

/**
 * Update chat
 *
 * @param {UUID} id Chat ID
 * @param {UUID} userId User ID
 * @param {string} title Chat title
 * @returns Chat object
 * @throws `UnauthorizedError` Error if user is not authorized to update
 */
export async function updateChat(id: UUID, userId: UUID, title?: string) {
  const chat = await getChatById(id);

  if (chat.userId !== userId) {
    throw new UnauthorizedError("You are not authorized to update this chat");
  }
  const newChatData: Pick<IChat, "title" | "updatedAt"> = {
    title: title || null,
    updatedAt: new Date(),
  };

  await ChatModel.ChatModel.updateChat(id, newChatData);
  const data = await getChatById(id);

  return {
    message: "Chat updated successfully",
    data,
  };
}

/**
 * Delete Chat
 *
 * @param {UUID} id Chat ID
 * @param {UUID} userId User ID
 * @returns Chat object with message
 * @throws `UnauthorizedError` Error if user is not authorized to delete
 */
export async function deleteUser(id: UUID, userId: UUID) {
  const chat = await getChatById(id);

  if (chat.userId !== userId)
    throw new UnauthorizedError("You are not authorized to delete this chat");

  await ChatModel.ChatModel.deleteChat(id);

  return {
    message: "Chat deleted successfully",
    data: chat,
  };
}

/**
 * Get chat by id
 *
 * @param {UUID} id Chat id
 * @returns Chat object
 * @throws `NotFound` Error if chat does not exists
 */
export async function getChatById(id: UUID): Promise<IChat> {
  const chat = await ChatModel.ChatModel.getChatById(id);

  if (!chat) {
    throw new NotFound(`Chat with id ${id} does not exists`);
  }

  return chat;
}
