import { UUID } from "crypto";

import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ROLE } from "../enums/Role";
import { UnauthorizedError } from "../error";
import { IRequest } from "../interface/auth";
import { IGetUserQuery } from "../interface/User";
import loggerWithNameSpace from "../utils/logger";
import * as UserService from "../service/userService";

const logger = loggerWithNameSpace(__filename);

/**
 * Get user info for given user id or current user if user id is not provided
 *
 * @param {IRequest} req Request Object
 * @param {Response} res Response Object
 */
export async function getUserInfo(req: IRequest, res: Response) {
  const id = req.params.id as UUID;
  // if (id !== req.user?.id && req.user?.role !== ROLE.ADMIN)
  //   throw new UnauthorizedError("You are not authorized to access this user");

  logger.info(`Getting information for user ${id}`);

  const serviceData = await UserService.getUserInfo(id);
  logger.info(`Retrived information for user ${id}`);

  res.status(StatusCodes.OK).json(serviceData);
}

/**
 * Get all users
 *
 * @param {IRequest} req Request Object with query parameters
 * @param {Response} res Response Object
 * @returns List of users
 */
export async function getUsers(req: IRequest, res: Response) {
  const query = req.query as IGetUserQuery;
  logger.info(`Getting all users`);

  const serviceData = await UserService.getUsers(query);
  logger.info(`Retrived all users`);

  res.status(StatusCodes.OK).json(serviceData);
}

/**
 * Create new user
 *
 * @param {IRequest} req Request
 * @param {Response} res Response
 */
export async function createUser(req: IRequest, res: Response) {
  const { body } = req;
  logger.info(`Creating new user ${body.name}`);

  const serviceData = await UserService.createUser(body);
  logger.info(`User ${body.name} created successfully`);

  res.status(StatusCodes.CREATED).json(serviceData);
}

/**
 * Update user
 *
 * @param {IRequest} req Request
 * @param {Response} res Response
 */
export async function updateUser(req: IRequest, res: Response) {
  const id = req.query?.id as UUID;
  const updatedBy = req.user?.id as UUID;
  logger.info(`Updating user ${id}`);

  const { body } = req;
  const serviceData = await UserService.updateUser(id, updatedBy, body);
  logger.info(`User ${id} updated successfully`);

  res.status(StatusCodes.OK).json(serviceData);
}

/**
 * Delete user
 *
 * @param {IRequest} req Request
 * @param {Response} res Response
 */
export async function deleteUser(req: IRequest, res: Response) {
  const id = req.query.id as UUID;
  logger.info(`Deleting user ${id}`);

  const serviceData = await UserService.deleteUser(id);
  logger.info(`User ${id} deleted successfully`);

  res.status(StatusCodes.OK).json(serviceData);
}
