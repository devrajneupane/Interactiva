import { INTERACTIVA_BASE_URL } from "../util/constant";

export const getModelResponse = async (
  chatParams: { role: string; content: string }[],
): Promise<Response> => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/ollama/chat`, {
    method: "POST",
    body: JSON.stringify(chatParams),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.body) {
    throw new Error("Problem with ReadableStream");
  }

  return response;
};

export const getModels = async () => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/ollama/list`);

  if (!response.body) {
    throw new Error("Problem gettting local models");
  }

  const models = await response.json();

  return models;
};
