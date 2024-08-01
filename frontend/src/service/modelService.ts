import { getCookie } from "../util";
import { INTERACTIVA_BASE_URL } from "../util/constant";

export const getModels = async () => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/models`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + getCookie("accessToken"),
    },
  });

  if (!response.ok) throw new Error("Problem gettting custom models");

  const models = await response.json();

  return models.data;
};

export const getModelById = async (id: string) => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/models/${id}`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + getCookie("accessToken"),
    },
  });

  if (!response) {
    throw new Error("Problem getting model");
  }

  const prompts = await response.json();
  return prompts.data;
};

export const updateModel = async (
  id: string,
  data: Record<string, string | number>,
) => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/models/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + getCookie("accessToken"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error("Problem updating model");
  }

  const prompts = await response.json();
  return prompts.data;
};
