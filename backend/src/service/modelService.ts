import { UUID } from "crypto";

import { NotFound, UnauthorizedError } from "../error";
import { ModelModel } from "../model";
import { getUUID } from "../utils/utils";
import { IGetUserQuery, IModel } from "../interface";

/**
 * Retrieve all models based on filter criteria
 *
 * @param {IGetUserQuery} query query params
 * @returns List of Models
 */
export async function getModels(
  query: IGetUserQuery,
): Promise<{ message: string; data: IModel[] }> {
  const data = await ModelModel.getModels(query);

  return {
    message: "Models retrieved successfully",
    data,
  };
}

/**
 * Create a new Model based on given data
 *
 * @param {UUID} userId User Id
 * @param {Pick<IModel, "name" | "description" | "params">} payload Model details
 * @returns Newly created model object
 */
export async function createModel(
  userId: UUID,
  payload: Pick<IModel, "name" | "description" | "params">,
): Promise<{ message: string; data: IModel }> {
  const model: Omit<IModel, "updatedAt"> = {
    id: getUUID(),
    ...payload,
    userId,
    createdAt: new Date(),
  };

  const data = await ModelModel.createModel(model);

  return {
    message: "Model created successfully",
    data: data[0],
  };
}

/**
 * Update Model details
 *
 * @param {UUID} id Model Id
 * @param {UUID} userId User Id
 * @param {{ title?: string, description?: string, likes?: number }} payload Model details to update
 * @throws `UnauthorizedError` Error if user is not authorized to update
 */
export async function updateModel(
  id: UUID,
  userId: UUID,
  payload: { name?: string; description?: string; likes?: number },
) {
  const { name, description, likes } = payload;
  const existingPrompt = await getModelById(id);
  if (!payload.likes && existingPrompt.data.userId !== userId)
    throw new UnauthorizedError("User is not authorized to update prompt");

  const modelData: Partial<IModel> = {};

  if (name) modelData.name = name;
  if (description) modelData.description = description;
  if (likes) modelData.likes = likes;

  const data = await ModelModel.updateModel(id, modelData);

  return {
    message: "Prompt updated successfully",
    data: data[0],
  };
}

/**
 * Get model by given id
 *
 * @param {UUID} id Model Id
 * @returns Model object of given Id
 * @throws `NotFound` Error if model does not exists
 */
export async function getModelById(
  id: UUID,
): Promise<{ message: string; data: IModel }> {
  const model = await ModelModel.getModelById(id);

  if (!model) {
    throw new NotFound(`Model with id ${id} does not exists`);
  }

  return {
    message: "Model retrieved successfully",
    data: model,
  };
}
