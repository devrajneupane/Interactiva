import { UUID } from "crypto";

import { CommentModel } from "../model";
import { getUUID } from "../utils/utils";
import { IComment, IGetUserQuery } from "../interface";
import { NotFound, UnauthorizedError } from "../error";
import { CommentPolymorphicId, CommentQueryParams } from "../types";

/**
 * Retrieve all comments based on filter criteria
 *
 * @param {CommentQueryParams} query Comment query params
 * @returns List of Comments
 */
export async function getComments(
  query: Partial<CommentQueryParams>,
): Promise<{ message: string; data: IComment[] }> {
  const data = await CommentModel.getComments(query);

  return {
    message: "Comments retrieved successfully",
    data,
  };
}

/**
 * Create a new Comment based on given data
 *
 * @param {UUID} userId User Id
 * @param {CommentPolymorphicId & { comment: string }} payload Comment content
 * @returns Newly created comment object
 */
export async function createComment(
  userId: UUID,
  payload: CommentPolymorphicId & { comment: string },
): Promise<{ message: string; data: IComment }> {
  const comment: Omit<IComment, "updatedAt"> = {
    id: getUUID(),
    ...payload,
    userId,
    createdAt: new Date(),
  };

  const data = await CommentModel.createComment(comment);

  return {
    message: "Comment created successfully",
    data: data[0],
  };
}

/**
 * Update Comment with new comment details
 *
 * @param {UUID} id Comment Id
 * @param {UUID} userId User Id
 * @param {string} comment Comment text data
 * @returns Updated comment object
 * @throws `UnauthorizedError` Error if user is not authorized to update
 */
export async function updateComment(
  id: UUID,
  userId: UUID,
  comment: string,
): Promise<{ message: string; data: IComment }> {
  const existingComment = await getCommentById(id);
  if (existingComment.data.userId !== userId)
    throw new UnauthorizedError(
      `User is not authorized to update comment ${id}`,
    );

  const commentData: Partial<IComment> = {
    comment,
    updatedAt: new Date(),
  };

  const data = await CommentModel.updateComment(id, commentData);

  return {
    message: "Comment updated successfully",
    data,
  };
}

/**
 * Get prompt by given id
 *
 * @param {UUID} id Comment Id
 * @returns {Promise<IComment>} Comment object
 * @throws `NotFound` Error if comment does not exists
 */
export async function getCommentById(
  id: UUID,
): Promise<{ message: string; data: IComment }> {
  const comment = await CommentModel.getCommentById(id);

  if (!comment) {
    throw new NotFound(`Comment with id ${id} does not exists`);
  }

  return {
    message: "Comment retrieved successfully",
    data: comment,
  };
}
