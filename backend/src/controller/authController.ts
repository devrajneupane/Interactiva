import { Response, Request } from "express";
import HttpStatusCodes from "http-status-codes";

import * as AuthService from "../service/authService";

/**
 * Login user
 *
 * @param req Request
 * @param res Response
 * @returns Response
 */
export async function login(req: Request, res: Response) {
  const { body } = req;

  const serviceData = await AuthService.login(body);

  if (serviceData?.error) {
    res.status(HttpStatusCodes.NOT_FOUND).json(serviceData);
    return;
  }

  res.status(HttpStatusCodes.OK).json(serviceData);
}

/**
 * Refresh access tokens
 *
 * @param req Request
 * @param res Response
 * @returns Response
 */
export async function refresh(req: Request, res: Response) {
  const { authorization } = req.headers;

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

  return res.status(HttpStatusCodes.OK).json(serviceData);
}
