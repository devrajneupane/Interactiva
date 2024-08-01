import { UUID } from "crypto";

import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { NotFound } from "../error";
import { loggerWithNameSpace } from "../utils";
import { IRequest, IGetUserQuery } from "../interface";
import * as PromptService from "../service/promptService";

const logger = loggerWithNameSpace(__filename);

/**
 * Get all prompts
 *
 * @param {IRequest} req Request Object with query parameters
 * @param {Response} res Response Object
 * @returns HTTP Response
 */
export async function getPrompts(req: IRequest, res: Response) {
  const query = req.query as IGetUserQuery;
  logger.info(`Getting all messages for chat ${req.user?.id}`);

  const serviceData = await PromptService.getPrompts(query);
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
export async function getPromptById(req: IRequest, res: Response) {
  const id = req.params?.id as UUID;
  logger.info(`Getting details for prompt ${id}`);

  const serviceData = await PromptService.getPromptById(id);
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
export async function createPrompt(req: IRequest, res: Response) {
  const userId = req.user?.id as UUID;

  logger.info(`Creating a new message for user ${userId}`);

  const serviceData = await PromptService.createPrompt(userId, req.body);
  logger.info(`Prompt ${serviceData.data?.id} created successfully`);

  res.status(StatusCodes.CREATED).json(serviceData);
}

/**
 * Update an existing Prompt
 *
 * @param {IRequest} req Request Object
 * @param {Response} res Response Object
 * @returns HTTP Response
 */
export async function updatePrompt(req: IRequest, res: Response) {
  const id = req.params?.id as UUID;
  const userId = req.user?.id as UUID;

  logger.info(`Updating details for prompt ${id}`);
  const { body } = req;
  const serviceData = await PromptService.updatePrompt(id, userId, body);
  logger.info(`Prompt ${id} updated successfully`);

  res.status(StatusCodes.OK).json(serviceData);
}
