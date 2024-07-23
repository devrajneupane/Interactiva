import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import { BadRequestError } from "../error";

/**
 * Middleware to validate request query
 *
 * @param schema Joi schema to validate request query
 * @returns Express middleware function
 * @throws BadRequestError
 */
export function validateReqQuery(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query);

    if (error) {
      throw new BadRequestError(error.message);
    }

    req.query = value;
  };
}

/**
 * Middleware to validate request body
 *
 * @param schema Joi schema to validate request body
 * @returns Express middleware function
 * @throws BadRequestError
 */
export function validateReqBody(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      throw new BadRequestError(error.message);
    }

    req.body = value;
  };
}

/**
 * Middleware to validate request params
 *
 * @param schema Joi schema to validate request params
 * @returns Express middleware function
 * @throws BadRequestError
 */
export function validateReqParams(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params);

    if (error) {
      throw new BadRequestError(error.message);
    }

    req.params = value;
  };
}
