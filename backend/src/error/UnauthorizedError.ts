import { StatusCodes } from "http-status-codes";

import { BaseError } from "./BaseError";

export class UnauthorizedError extends BaseError {
  constructor(message: string){
    super(message, StatusCodes.UNAUTHORIZED)
  }
}
