import { getCookie } from "../util";
import { INTERACTIVA_BASE_URL } from "../util/constant";

export const getPrompts = async () => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/prompts`, {
    credentials: "include",
    headers: {
      Authorization: "Bearer " + getCookie("accessToken"),
    },
  });

  if (!response) {
    throw new Error("Problem getting prompts");
  }

  const prompts = await response.json();
  return prompts.data;
};

export const getPromptById = async (id: string) => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/prompts/${id}`, {
    credentials: "include",
    headers: {
      Authorization: "Bearer " + getCookie("accessToken"),
    },
  });

  if (!response) {
    throw new Error("Problem getting prompt");
  }

  const prompts = await response.json();
  return prompts.data;
};

export const updatePrompt = async (
  id: string,
  data: Record<string, string | number>,
) => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/prompts/${id}`, {
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
    throw new Error("Problem updating prompt");
  }

  const prompts = await response.json();
  return prompts.data;
};
