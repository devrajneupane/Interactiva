import { UUID } from "crypto";

import { TABLE } from "../enums";
import { BaseModel } from "./Base";
import { IComment } from "../interface";
import { CommentQueryParams } from "../types";

/**
 * `CommentModel` class represents operations related to comment management
 * Extends BaseModel for common functionalities
 */
export class CommentModel extends BaseModel {
  /**
   * Retrieves a list of comment based on filter criteria
   *
   * @param {UUID} filter Filter criteria including commentableId, commentableType, page, size etc.
   * @returns {Promise<IComment[]>} List of Comment
   */
  static async getComments(
    filter: Partial<CommentQueryParams>,
  ): Promise<IComment[]> {
    const comments = await this.queryBuilder()
      .select<IComment[]>("*")
      .table(TABLE.COMMENT)
      .where({
        commentableId: filter.commentableId,
        commentableType: filter.commentableType,
      })
      .limit(filter.size || 10)
      .offset((filter.page || 1 - 1) * (filter.size || 10));

    return comments;
  }

  /**
   * Creates a new comment with given data
   *
   * @param {Omit<IComment, "updatedAt">} commentData Comment Object
   * @returns Newly created comment object or `undefined`
   */
  static async createComment(
    commentData: Omit<IComment, "updatedAt">,
  ): Promise<IComment[]> {
    console.warn(
      "DEBUGPRINT[3]: commentModel.ts:42: commentData=",
      commentData,
    );
    return await this.queryBuilder().transaction(async (trx) => {
      return await trx(TABLE.COMMENT)
        .insert(commentData)
        .returning<IComment[]>("*");
    });
  }

  /**
   * Updates an existing comment with given data
   *
   * @param {UUID} id Comment ID
   * @param {Partial<IComment>} commentData Comment data to update
   * @returns Updated comment object
   */
  static async updateComment(
    id: UUID,
    commentData: Partial<IComment>,
  ): Promise<IComment> {
    return await this.queryBuilder().transaction(async (trx) => {
      return await trx(TABLE.COMMENT)
        .where({ id })
        .update(commentData)
        .returning<IComment>("*");
    });
  }

  /**
   * Retrieves comment by Id
   *
   * @param {UUID} id Comment id
   * @returns {Promise<IComment | undefined>} Comment object if found or undefined
   */
  static async getCommentById(id: UUID): Promise<IComment | undefined> {
    const comment = await this.queryBuilder()
      .select<IComment>("*")
      .table(TABLE.COMMENT)
      .where({ id })
      .first();
    return comment;
  }
}
