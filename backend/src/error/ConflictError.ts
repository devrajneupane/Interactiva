import { StatusCodes } from "http-status-codes";

import { BaseError } from "./BaseError";

export class ConflictError extends BaseError {
  constructor(message: string = "Request conflicts with current state of server"){
    super(message, StatusCodes.CONFLICT)
  }
}
