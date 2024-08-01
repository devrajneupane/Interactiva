import { UUID } from "crypto";

import { TABLE } from "../enums";
import { BaseModel } from "./Base";
import { IGetUserQuery, IPrompt } from "../interface";

/**
 * `PromptModel` class represents operations related to prompts management
 * Extends BaseModel for common functionalities
 */
export class PromptModel extends BaseModel {
  /**
   * Retrieves a list of comment based on filter criteria
   *
   * @param {UUID} filter Filter criteria including page, and size
   * @returns {Promise<IPrompt[]>} List of Prompt
   */
  static async getPrompts(
    filter: Omit<IGetUserQuery, "q">,
  ): Promise<IPrompt[]> {
    const prompts = await this.queryBuilder()
      .select<IPrompt[]>("*")
      .table(TABLE.PROMPT)
      .limit(filter.size || 10)
      .offset((filter.page || 1 - 1) * (filter.size || 10));

    return prompts;
  }

  /**
   * Creates a new prompt
   *
   * @param {Omit<IPrompt, "updatedAt">} prompt prompt Prompt Object
   * @returns Newly created prompt object
   */
  static async createPrompt(
    prompt: Pick<IPrompt, "title" | "prompt">,
  ): Promise<IPrompt[]> {
    return await this.queryBuilder().transaction(async (trx) => {
      return await trx(TABLE.PROMPT).insert(prompt).returning<IPrompt[]>("*");
    });
  }

  /**
   * Updates an existing prompt
   *
   * @param {UUID} id Prompt Id
   * @param {Partial<IPrompt>} promptData Prompt data to update
   * @returns Updated prompt object
   */
  static async updatePrompt(
    id: UUID,
    promptData: Partial<IPrompt>,
  ): Promise<IPrompt[]> {
    return await this.queryBuilder().transaction(async (trx) => {
      return await trx(TABLE.PROMPT)
        .where({ id })
        .update(promptData)
        .returning<IPrompt[]>("*");
    });
  }

  /**
   * Deletes a prompt by ID
   *
   * @param id Prompt ID
   */
  static async deleteChat(id: UUID) {
    await this.queryBuilder().transaction(async (trx) => {
      await trx(TABLE.PROMPT).where({ id }).del();
    });
  }

  /**
   * Retrieves prompt by id
   *
   * @param {UUID} id Prompt Id
   * @returns {Promise<IPrompt | undefined>} Prompt object if found or undefined
   */
  static async getPromptById(id: UUID): Promise<IPrompt | undefined> {
    const prompt = await this.queryBuilder()
      .select<IPrompt>("*")
      .table(TABLE.PROMPT)
      .where({ id })
      .first();
    return prompt;
  }
}
