import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { IRequest } from "../interface";
import { loggerWithNameSpace } from "../utils";
import * as OllamaService from "../service/ollamaService";

const logger = loggerWithNameSpace(__filename);

/**
 * List models that are available locally
 *
 * @returns List of models
 */
export async function getLocalModels(req: IRequest, res: Response) {
  logger.info("Getting local models");
  const models = await OllamaService.getLocalModels();

  logger.info("Locally avilable models retrieved successfully");

  res.status(StatusCodes.OK).json(models);
}

/**
 * Generate next chat based on prompt and previous messages
 *
 */
export async function ollamaChat(req: IRequest, res: Response) {
  // TODO: schema validation for req.body
  const { body } = req;
  logger.info("Chat with Ollama");
  const response = await OllamaService.ollamaChat(body);

  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Transfer-Encoding': 'chunked',
    'X-Content-Type-Options': 'nosniff'
  });

  try {
    for await (const part of response) {
      // Ensure that the client is still connected
      if (!res.writableEnded) {
        res.write(part.message.content);
      } else {
        console.warn("Client disconnected");
        break;
      }
    }
  } catch (error) {
    console.error("Error streaming data:", error);
    if (!res.writableEnded) {
      res.status(500).send("Internal Server Error");
    }
  } finally {
    if (!res.writableEnded) {
      res.end();
    }
  }
  logger.info("Chat with Ollama successful");

  // res.status(StatusCodes.OK).json(response);
}

/**
 * Create a model from `Modelfile`
 */
export async function createModel(req: IRequest, res: Response) {

}
