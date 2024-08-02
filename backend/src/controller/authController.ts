import { Response, Request } from "express";
import HttpStatusCodes from "http-status-codes";

import { loggerWithNameSpace } from "../utils";
import * as AuthService from "../service/authService";

const logger = loggerWithNameSpace(__filename);

/**
 * Login user
 *
 * @param {IRequest} req Request Object
 * @param {Response} res Response Object
 * @rturns HTTP Response
 */
export async function login(req: Request, res: Response) {
  const { body } = req;

  logger.info(`Trying to log in as ${body.email}`);
  const serviceData = await AuthService.login(body);

  if (serviceData?.error) {
    res.status(HttpStatusCodes.NOT_FOUND).json(serviceData);
    return;
  }

  res.cookie("accessToken", serviceData.accessToken);
  res.cookie("refreshToken", serviceData.refreshToken);
  logger.info(`User with email ${body.email} logged in successfully`);
  res.status(HttpStatusCodes.OK).json(serviceData);
}

/**
 * Refresh access tokens
 *
 * @param {IRequest} req Request Object
 * @param {Response} res Response Object
 * @rturns HTTP Response
 */
export async function refresh(req: Request, res: Response) {
  const { authorization } = req.headers;

  logger.info(`Rereshing authentication tokens`);
  if (!authorization) {
    res.status(HttpStatusCodes.NOT_FOUND).json({
      error: "Token not found",
    });
    return;
  }

  const token = authorization.split(" ");

  if (token.length !== 2 || token[0] !== "Bearer") {
    res.status(HttpStatusCodes.NOT_FOUND).json({
      error: "Invalid Token",
    });
    return;
  }

  const serviceData = await AuthService.refresh(token[1]);

  res.cookie("accesToken", serviceData.accessToken);
  res.cookie("refreshToken", serviceData.refreshToken);
  logger.info(`Authentication tokens successfully refreshed `);

  return res.status(HttpStatusCodes.OK).json(serviceData);
}
