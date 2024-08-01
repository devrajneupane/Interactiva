import { UUID } from "crypto";

import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { IRequest } from "../interface";
import { loggerWithNameSpace } from "../utils";
import * as OllamaService from "../service/ollamaService";

const logger = loggerWithNameSpace(__filename);

/**
 * List models that are available locally
 *
 * @param {IRequest} req Request Object
 * @param {Response} res Response Object
 * @returns List of models
 */
export async function getOllamaModels(req: IRequest, res: Response) {
  logger.info("Getting local models");
  const models = await OllamaService.getLocalModels();

  logger.info("Locally avilable models retrieved successfully");

  res.status(StatusCodes.OK).json(models);
}

/**
 * Generate next chat based on prompt and previous messages
 *
 * @param {IRequest} req Request Object
 * @param {Response} res Response Object
 * @returns Stream of chat messages
 */
export async function ollamaChat(req: IRequest, res: Response) {
  // TODO: schema validation for req.body
  const { body } = req;
  logger.info("Chat with Ollama");
  const response = await OllamaService.ollamaChat(body);

  res.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8",
    "Transfer-Encoding": "chunked",
    "X-Content-Type-Options": "nosniff",
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
}

/**
 * Create a model from `Modelfile`
 *
 * @param {IRequest} req Request Object
 * @param {Response} res Response Object
 */
export async function createModel(req: IRequest, res: Response) {
  const userId = req.user?.id as UUID;
  const { body } = req;

  logger.info("Creating a new model");
  await OllamaService.ollamaCreateModel(userId, body);
  logger.info("Model created successfully");
}

/**
 * Generete a completion for given prompt
 *
 * @param {IRequest} req Request Object
 * @param {Response} res Response Object
 * @returns generated completion
 */
export async function generateCompletion(req: IRequest, res: Response) {
  const { body } = req;
  console.warn("DEBUGPRINT[1]: ollamaController.ts:94: body=", body)
  logger.info("Generating completion for prompt");
  const response = await OllamaService.ollamaGenerate(body);
  logger.info("Completiong generated successfully");
  res.status(StatusCodes.OK).json(response);
}
