import { StatusCodes } from "http-status-codes";
import { BaseError } from "./BaseError";

export class NotFound extends BaseError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
  }
}
