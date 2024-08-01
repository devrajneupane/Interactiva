import { getCookie } from "../util";
import { INTERACTIVA_BASE_URL } from "../util/constant";

export const updateMessageDatabase = async (
  messages: { role: string; content: string }[],
) => {
  messages.forEach(async (message) => {
    const response = await fetch(`${INTERACTIVA_BASE_URL}/messages`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(message),
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + getCookie("accessToken"),
        "Content-Type": "application/json",
      },
    });

    if (!response.body) {
      throw new Error("Problem with ReadableStream");
    }
  });
};

export const getMessages = async () => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/messages`, {
    credentials: "include",
    headers: {
      Authorization: "Bearer " + getCookie("accessToken"),
    },
  });

  if (!response) {
    throw new Error("Problem with ReadableStream");
  }

  const messages = await response.json();
  return messages.data;
};
