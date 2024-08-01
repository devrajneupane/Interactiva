import { UUID } from "crypto";

import { TABLE } from "../enums";
import { BaseModel } from "./Base";
import { IChat, IGetUserQuery } from "../interface";

/**
 * ChatModel class represents operations related to chat management
 * Extends BaseModel for common functionalities
 */
export class ChatModel extends BaseModel {
  /**
   * Retrieves a list of chats based on filter criteria
   *
   * @param {UUID} userId User Id
   * @param {UUID} filter Filter criteria including search query, page, and size
   * @returns List of Chat
   */
  static async getChats(userId: UUID, filter: IGetUserQuery) {
    const { q } = filter;

    const chats = this.queryBuilder()
      .select<IChat[]>("id", "title", "created_at", "updated_at")
      .table(TABLE.CHAT)
      .where({ userId })
      .orderBy("created_at")
      .limit(filter.size || 10)
      .offset((filter.page || 1 - 1) * (filter.size || 10));

    if (q) {
      chats.whereLike("name", `%${q}%`);
    }

    return chats;
  }

  /**
   * Creates a new chat
   *
   * @param {UUID} userId User Id
   * @param {UUID} id Chat Id
   */
  static async createChat(userId: UUID, id: UUID) {
    return await this.queryBuilder().transaction(async (trx) => {
      return await trx(TABLE.CHAT)
        .insert({
          id,
          userId,
        })
        .returning<IChat[]>("*");
    });
  }

  /**
   * Updates an existing chat
   *
   * @param {UUID} id Chat ID
   * @param {Pick<IChat, "title" | "updatedAt">} chatData Chat data to update
   */
  static async updateChat(
    id: UUID,
    chatData: Pick<IChat, "title" | "updatedAt">,
  ) {
    await this.queryBuilder().transaction(async (trx) => {
      await trx(TABLE.CHAT).where({ id }).update(chatData);
    });
  }

  /**
   * Deletes a chat by ID
   *
   * @param id Chat ID
   */
  static async deleteChat(id: UUID) {
    await this.queryBuilder().transaction(async (trx) => {
      await trx(TABLE.CHAT).where({ id }).del();
    });
  }

  /**
   * Retrieves chat by id
   *
   * @param id Chat id
   * @returns Chat object if found or undefined
   */
  static async getChatById(id: UUID): Promise<IChat> {
    const chat = await this.queryBuilder()
      .select<IChat>("*")
      .table(TABLE.CHAT)
      .where({ id })
      .first();
    return chat!;
  }
}
