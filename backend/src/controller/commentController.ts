import { UUID } from "crypto";

import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { IRequest } from "../interface";
import { loggerWithNameSpace } from "../utils";
import * as CommentService from "../service/commentService";
import { CommentPolymorphicId, CommentQueryParams } from "../types";

const logger = loggerWithNameSpace(__filename);

/**
 * Get all prompts
 *
 * @param {IRequest} req Request Object with query parameters
 * @param {Response} res Response Object
 * @returns HTTP Response
 */
export async function getComments(req: IRequest, res: Response) {
  const query = req.query as Partial<CommentQueryParams>;
  if (!query.commentableId || !query.commentableType)
    throw new Error("commentableId and commentableType are required");

  logger.info(
    `Getting all comments for ${query.commentableType} ${query.commentableId}`,
  );

  const serviceData = await CommentService.getComments(query);
  logger.info(`Retrived all messages for chat ${req.user?.id} successfully`);

  res.status(StatusCodes.OK).json(serviceData);
}

/**
 * Get prompt details by given Id
 *
 * @param {IRequest} req Request Object
 * @param {Response} res Response Object
 * @returns HTTP Response
 */
export async function getCommentById(req: IRequest, res: Response) {
  const id = req.params?.id as UUID;
  logger.info(`Getting details for prompt ${id}`);

  const serviceData = await CommentService.getCommentById(id);
  logger.info(`Retrived details for prompt ${id} successfully`);

  res.status(StatusCodes.OK).json(serviceData);
}

/**
 * Create a new prompt
 *
 * @param {IRequest} req Request Object
 * @param {Response} res Response Object
 * @returns HTTP Response
 */
export async function createComment(req: IRequest, res: Response) {
  const userId = req.user?.id as UUID;
  const payload: CommentPolymorphicId & { comment: string } = req.body;

  logger.info(`Creating a new comment for user ${userId}`);
  const serviceData = await CommentService.createComment(userId, payload);
  logger.info(`Comment ${serviceData.data?.id} created successfully`);

  res.status(StatusCodes.CREATED).json(serviceData);
}

/**
 * Update an existing Comment
 *
 * @param {IRequest} req Request Object
 * @param {Response} res Response Object
 * @returns HTTP Response
 */
export async function updateComment(req: IRequest, res: Response) {
  const id = req.params?.id as UUID;
  const userId = req.user?.id as UUID;

  logger.info(`Updating details for prompt ${userId}`);
  const { body } = req;
  const serviceData = await CommentService.updateComment(id, userId, body);
  logger.info(`Prompt ${id} updated successfully`);

  res.status(StatusCodes.OK).json(serviceData);
}
