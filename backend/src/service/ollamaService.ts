import { Ollama, ListResponse } from "ollama";

import { env } from "../config";

const ollama = new Ollama({ host: env.ollama.host });

/**
 * Generate the next message in a chat with a provided model
 *
 * @param {{ role: string, content: string}[]} messages User message
 * @returns  Chat response from Ollama
 */
export async function ollamaChat(messages: { role: string; content: string }[]) {
  const response = await ollama.chat({
    model: "llama3.1",
    messages: messages,
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
