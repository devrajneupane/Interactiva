import { UUID } from "crypto";

import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { loggerWithNameSpace } from "../utils";
import { IRequest, IGetUserQuery } from "../interface";
import * as ModelService from "../service/modelService";

const logger = loggerWithNameSpace(__filename);

/**
 * Get all models
 *
 * @param {IRequest} req Request Object with query parameters
 * @param {Response} res Response Object
 * @returns HTTP Response
 */
export async function getModels(req: IRequest, res: Response) {
  const query = req.query as IGetUserQuery;
  logger.info(`Getting models`);

  const serviceData = await ModelService.getModels(query);
  logger.info(`Retrived models successfully`);

  res.status(StatusCodes.OK).json(serviceData);
}

/**
 * Get model details by given Id
 *
 * @param {IRequest} req Request Object
 * @param {Response} res Response Object
 * @returns HTTP Response
 */
export async function updateModel(req: IRequest, res: Response) {
  const id = req.params?.id as UUID;
  const userId = req.user?.id as UUID;
  const { body } = req;

  logger.info(`Updating details for model ${id}`);

  const serviceData = await ModelService.updateModel(id, userId, body);
  logger.info(`Model ${id} updated successfully`);

  res.status(StatusCodes.OK).json(serviceData);
}

/**
 * Get model details by given Id
 *
 * @param {IRequest} req Request Object
 * @param {Response} res Response Object
 * @returns HTTP Response
 */
export async function getModelById(req: IRequest, res: Response) {
  const id = req.params?.id as UUID;
  logger.info(`Getting details for model ${id}`);

  const serviceData = await ModelService.getModelById(id);
  logger.info(`Retrived details for model ${id} successfully`);

  res.status(StatusCodes.OK).json(serviceData);
}
