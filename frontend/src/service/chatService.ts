import { getCookie } from "../util";
import { INTERACTIVA_BASE_URL } from "../util/constant";

export const getChats = async () => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/c`, {
    credentials: "include",
    headers: {
      // Authorization: "Bearer " + document.cookie.split("=")[1].split(";")[0],
      Authorization: "Bearer " + getCookie("accessToken"),
    },
  });

  if (!response.body) {
    throw new Error("Problem gettting chats from database");
  }

  const chats = await response.json();

  return chats;
};

export const getChat = async (id: string): Promise<Response> => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/c/${id}`, {
    credentials: "include",
    headers: {
      // Authorization: "Bearer " + document.cookie.split("=")[1].split(";")[0],
      Authorization: "Bearer " + getCookie("accessToken"),
    },
  });

  if (!response.body) {
    throw new Error("Problem with ReadableStream");
  }

  return response;
};

export const updateChat = async (
  chatParams: { role: string; content: string }[],
): Promise<Response> => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/c`, {
    method: "PATCH",
    body: JSON.stringify(chatParams),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.body) {
    throw new Error("Problem with ReadableStream");
  }

  return response;
};

export const deleteChat = async (
  chatParams: { role: string; content: string }[],
): Promise<Response> => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/c/chat`, {
    method: "DELETE",
    body: JSON.stringify(chatParams),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.body) {
    throw new Error("Problem with ReadableStream");
  }

  return response;
};
