import { UUID } from "crypto";

import { Ollama, ListResponse } from "ollama";

import { env } from "../config";
import { IModelParams } from "../interface";
import * as ModelService from "./modelService";

const ollama = new Ollama({ host: env.ollama.host || "localhost:11434" });

/**
 * Generate the next message in a chat with a provided model
 *
 * @param {{ role: string, content: string}[]} chatParams Chat parameters
 * @returns  Chat response from Ollama
 */
export async function ollamaChat(chatParams: {
  model: string;
  messages: { role: string; content: string }[];
}) {
  const response = await ollama.chat({
    ...chatParams,
    stream: true,
  });
  if (!response) throw new Error("Failed to get response from Ollama");

  return response;
}

/**
 * List models that are available locally
 *
 * @returns List of models
 */
export async function getLocalModels(): Promise<ListResponse> {
  const models = await ollama.list();
  if (!models) throw new Error("Failed to get local models from Ollama");

  return models;
}

/**
 * Create a new model from existing model with given model parameters
 *
 * @param {UUID} userId User Id
 * @param {IModelParams} modelParams Model parameters
 */
export async function ollamaCreateModel(
  userId: UUID,
  modelParams: IModelParams,
) {
  let params = "";
  for (const [key, value] of Object.entries(modelParams.params)) {
    if (value) params += `PARAMETER ${key} ${value} \n`;
  }
  const modelfile = `
  FROM ${modelParams.base_model.split(":")[0]}
  SYSTEM "${modelParams.system_prompt}"
  ${params}
`;
  await ollama.create({ model: modelParams.name, modelfile: modelfile });
  await ModelService.createModel(userId, {
    name: modelParams.name,
    description: modelParams.model_description,
    params: modelParams.params,
  });
}

/**
 * Generate a response for a given prompt with a provided model
 *
 * @param {{model: string; prompt: string}} data Details about model and prompt for generation
 * @returns Generated response from Ollama
 */
export async function ollamaGenerate(data: { model: string; prompt: string }) {
  const title = await ollama.generate({ ...data, keep_alive: "1s" });
  return title.response;
}
