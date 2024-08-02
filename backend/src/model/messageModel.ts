import { UUID } from "crypto";

import { TABLE } from "../enums";
import { BaseModel } from "./Base";
import { IChat, IGetUserQuery, IMessage } from "../interface";

/**
 * ChatModel class represents operations related to message management
 * Extends BaseModel for common functionalities
 */
export class MessageModel extends BaseModel {
  /**
   * Retrieves a list of message based on filter criteria
   *
   * @param {UUID} chatId Chat Id
   * @param {UUID} filter Filter criteria including page, and size
   * @returns {Promise<IChat[]>} List of Message
   */
  static async getMessages(
    chatId: UUID,
    filter: Omit<IGetUserQuery, "q">,
  ): Promise<IChat[]> {
    const messages = await this.queryBuilder()
      .select<IChat[]>("*")
      .table(TABLE.MESSAGE)
      .where({ chatId })
      .limit(filter.size || 10)
      .offset((filter.page || 1 - 1) * (filter.size || 10));

    return messages;
  }

  /**
   * Creates a new message
   *
   * @param {Omit<IMessage, "updatedAt">} message Message Object
   * @returns {Promise<IMessage[]} Newly created message object or `undefined`
   */
  static async createMessage(
    message: Omit<IMessage, "updatedAt">,
  ): Promise<IMessage[]> {
    return await this.queryBuilder().transaction(async (trx) => {
      return await trx(TABLE.MESSAGE)
        .insert(message)
        .returning<IMessage[]>("*");
    });
  }

  /**
   * Updates an existing message
   *
   * @param {UUID} id Message ID
   * @param {Pick<IMessage, "message" | "updatedAt">} messageData Message data to update
   * @returns {Promise<IMessage>} Updated message object
   */
  static async updateMessage(
    id: UUID,
    messageData: Pick<IMessage, "content" | "updatedAt">,
  ): Promise<IMessage> {
    return await this.queryBuilder().transaction(async (trx) => {
      return await trx(TABLE.CHAT)
        .where({ id })
        .update(messageData)
        .returning<IMessage>("*");
    });
  }

  /**
   * Retrieves message by id
   *
   * @param {UUID} id Message id
   * @returns {Promise<IMessage | undefined>} Message object if found or undefined
   */
  static async getMessageById(id: UUID): Promise<IMessage | undefined> {
    const message = await this.queryBuilder()
      .select<IMessage>("*")
      .table(TABLE.MESSAGE)
      .where({ id })
      .first();
    return message;
  }
}
