import { UUID } from "crypto";

import { PromptModel } from "../model";
import { getUUID } from "../utils/utils";
import { NotFound, UnauthorizedError } from "../error";
import { IGetUserQuery, IPrompt } from "../interface";

/**
 * Retrieve all Prompts
 *
 * @param {IGetUserQuery} query Query parameters
 * @returns List of Prompts
 */
export async function getPrompts(query: IGetUserQuery) {
  const data = await PromptModel.getPrompts(query);

  return {
    message: "Prompts retrieved successfully",
    data,
  };
}

/**
 * Create a new Prompt
 *
 * @param {UUID} userId User Id
 * @param {{title: string; prompt: string}} payload User prompt content
 * @returns Newly created prompt object
 */
export async function createPrompt(
  userId: UUID,
  payload: { title: string; prompt: string },
) {
  const prompt: Omit<IPrompt, "updatedAt" | "likes"> = {
    id: getUUID(),
    title: payload.title,
    prompt: payload.prompt,
    userId,
    createdAt: new Date(),
  };

  const data = await PromptModel.createPrompt(prompt);

  return {
    message: "Prompt created successfully",
    data: data[0],
  };
}

/**
 * Update Prompt details
 *
 * @param {UUID} id Prompt Id
 * @param {UUID} userId User Id
 * @param {{ title?: string, prompt?: string, likes?: number }} payload Prompt data
 * @throws `UnauthorizedError` Error if user is not authorized to update
 */
export async function updatePrompt(
  id: UUID,
  userId: UUID,
  payload: { title?: string; prompt?: string; likes?: number },
) {
  const { title, prompt, likes } = payload;
  const existingPrompt = await getPromptById(id);
  if (!payload.likes && existingPrompt.data.userId !== userId)
    throw new UnauthorizedError("User is not authorized to update prompt");

  const promptData: Partial<IPrompt> = {};

  if (title) promptData.title = title;
  if (prompt) promptData.prompt = prompt;
  if (likes) promptData.likes = likes;

  const data = await PromptModel.updatePrompt(id, promptData);

  return {
    message: "Prompt updated successfully",
    data: data[0],
  };
}

/**
 * Get prompt by id
 *
 * @param {UUID} id Prompt Id
 * @returns {Promise<IPrompt>} Prompt object
 * @throws `NotFound` Error if prompt does not exists
 */
export async function getPromptById(
  id: UUID,
): Promise<{ message: string; data: IPrompt }> {
  const prompt = await PromptModel.getPromptById(id);

  if (!prompt) {
    throw new NotFound(`Prompt with id ${id} does not exists`);
  }

  return {
    message: "Prompt retrieved successfully",
    data: prompt,
  };
}
