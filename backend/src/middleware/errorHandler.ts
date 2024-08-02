import { StatusCodes } from "http-status-codes";
import { Response, NextFunction } from "express";

import { IRequest } from "../interface/auth";
import { BaseError } from "../error/BaseError";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace(__filename);

/**
 * Middleware to respond to Not Found errors
 *
 * @param req request object.
 * @param res Express response object.
 * @returns HTTP response with a JSON object.
 */
export function notFoundError(
  req: IRequest,
  res: Response,
): Response<Record<string, string>> {
  logger.error("Resource Not Found");
  return res.status(StatusCodes.NOT_FOUND).json({
    message: "Resource Not Found",
  });
}

/**
 * Middleware to respond to generic errors
 *
 * @param error Error object to handle.
 * @param req request object.
 * @param res Express response object.
 * @returns HTTP response with a JSON object.
 */
export function genericErrorHandler(
  error: Error,
  req: IRequest,
  res: Response,
  next: NextFunction,
): Response<Record<string, string>> {
  if (error.stack) {
    logger.error(error.stack);
  }

  switch (true) {
    case error instanceof BaseError:
      return res.status(error.statusCode).json({
        message: error.message,
      });
    default:
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Errror",
      });
  }
}
