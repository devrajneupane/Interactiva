import { UUID } from "crypto";

import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ROLE } from "../enums";
import { UnauthorizedError } from "../error";
import { loggerWithNameSpace } from "../utils";
import * as ChatService from "../service/chatService";
import { IRequest, IGetUserQuery } from "../interface";

const logger = loggerWithNameSpace(__filename);

/**
 * Get Chat details for given chat id
 *
 * @param {IRequest} req Request Object
 * @param {Response} res Response Object
 * @returns HTTP Response
 */
export async function getChat(req: IRequest, res: Response) {
  const id = req.params.id as UUID;
  if (id !== req.user?.id && req.user?.role !== ROLE.ADMIN)
    throw new UnauthorizedError("You are not authorized to access this chat");

  logger.info(`Getting information for chat ${id}`);

  const serviceData = await ChatService.getChatById(id);
  res.cookie("activeChatId", serviceData.id);
  logger.info(`Retrived information for chat ${id}`);

  res.status(StatusCodes.OK).json(serviceData);
}

/**
 * Get all users
 *
 * @param {IRequest} req Request Object with query parameters
 * @param {Response} res Response Object
 * @returns HTTP Response
 */
export async function getChats(req: IRequest, res: Response) {
  const userId = req.user?.id as UUID;
  const query = req.query as IGetUserQuery;
  logger.info(`Getting all chats for user ${req.user?.id}`);

  const serviceData = await ChatService.getChats(userId, query);
  logger.info(`Retrived all chats for user ${req.user?.id} successfully`);

  res.status(StatusCodes.OK).json(serviceData);
}

/**
 * Create new chat
 *
 * @param {IRequest} req Request
 * @param {Response} res Response
 * @returns HTTP Response
 */
export async function createChat(req: IRequest, res: Response) {
  const userId = req.user?.id as UUID;
  logger.info(`Creating new chat for user ${userId}`);

  const serviceData = await ChatService.createChat(userId);
  res.cookie("activeChatId", serviceData.data.id);
  logger.info(`Chat ${serviceData.data?.id} created successfully`);

  res.status(StatusCodes.CREATED).json(serviceData);
}

/**
 * Update user
 *
 * @param {IRequest} req Request
 * @param {Response} res Response
 * @returns HTTP Response
 */
export async function updateChat(req: IRequest, res: Response) {
  const id = req.params?.id as UUID;
  const userId = req.user?.id as UUID;
  logger.info(`Updating chat ${id}`);

  const { body } = req;
  const serviceData = await ChatService.updateChat(id, userId, body.title);
  logger.info(`User ${id} updated successfully`);

  res.status(StatusCodes.OK).json(serviceData);
}

/**
 * Delete user
 *
 * @param {IRequest} req Request
 * @param {Response} res Response
 * @returns HTTP Response
 */
export async function deleteChat(req: IRequest, res: Response) {
  const id = req.params.id as UUID;
  const userId = req.user?.id as UUID;
  logger.info(`Deleting chat ${id}`);

  const serviceData = await ChatService.deleteUser(id, userId);
  logger.info(`Chat ${id} deleted successfully`);

  res.status(StatusCodes.OK).json(serviceData);
}
