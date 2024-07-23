import { StatusCodes } from "http-status-codes";

export class BaseError extends Error {
  message: string;
  statusCode: StatusCodes;
  constructor(
    message = "",
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message);

    this.message = message;
    this.statusCode = statusCode;
  }
}
