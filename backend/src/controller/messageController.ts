import { UUID } from "crypto";

import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { NotFound } from "../error";
import { loggerWithNameSpace } from "../utils";
import { IRequest, IGetUserQuery } from "../interface";
import * as MessageService from "../service/messageService";

const logger = loggerWithNameSpace(__filename);

/**
 * Get all message
 *
 * @param {IRequest} req Request Object with query parameters
 * @param {Response} res Response Object
 * @returns HTTP Response
 */
export async function getMessages(req: IRequest, res: Response) {
  const chatId = req.cookies?.activeChatId as UUID;
  if (!chatId) throw new NotFound("Chat Id not found");

  const query = req.query as IGetUserQuery;
  logger.info(`Getting all messages for chat ${req.user?.id}`);

  const serviceData = await MessageService.getMessages(chatId, query);
  logger.info(`Retrived all messages for chat ${req.user?.id} successfully`);

  res.status(StatusCodes.OK).json(serviceData);
}

/**
 * Create new message
 *
 * @param {IRequest} req Request
 * @param {Response} res Response
 * @returns HTTP Response
 */
export async function createMessage(req: IRequest, res: Response) {
  const chatId = req.cookies?.activeChatId as UUID;
  const userId = req.user?.id as UUID;
  if (!chatId) throw new NotFound("Chat Id not found");

  logger.info(`Creating new message for chat ${chatId}`);

  const serviceData = await MessageService.createMessage(
    chatId,
    userId,
    // TODO: schema validation for req.body
    req.body,
  );
  logger.info(`Message ${serviceData.data?.id} created successfully`);

  res.status(StatusCodes.CREATED).json(serviceData);
}

/**
 * Update message
 *
 * @param {IRequest} req Request
 * @param {Response} res Response
 * @returns HTTP Response
 */
export async function updateMessage(req: IRequest, res: Response) {
  const id = req.params?.id as UUID;
  const chatId = req.cookies?.activeChatId as UUID;
  if (!chatId) throw new NotFound("Chat Id not found");
  logger.info(`Updating chat ${id}`);

  const { body } = req;
  const serviceData = await MessageService.updateMessage(
    id,
    chatId,
    body.content,
  );
  logger.info(`User ${id} updated successfully`);

  res.status(StatusCodes.OK).json(serviceData);
}
