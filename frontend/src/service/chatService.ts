import { getCookie } from "../util";
import { INTERACTIVA_BASE_URL } from "../util/constant";

export const getChats = async () => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/c`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getCookie("accessToken"),
    },
  });

  if (!response.body) {
    throw new Error("Problem gettting chats from database");
  }

  const chats = await response.json();

  return chats;
};

export const getChat = async (id: string) => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/c/${id}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getCookie("accessToken"),
    },
  });

  if (!response.body) {
    throw new Error("Problem getting chat info");
  }

  const chat = await response.json();
  return chat;
};

export const createChat = async () => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/c`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getCookie("accessToken"),
    },
  });

  if (!response.body) {
    throw new Error("Problem creating chat");
  }

  const data = await response.json();

  window.history.pushState(null, "", `/c/${data.data.id}`);
};

export const updateChat = async (chat: {
  id: string;
  title: string;
}): Promise<Response> => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/c/${chat.id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + getCookie("accessToken"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(chat),
  });

  if (!response.body) {
    throw new Error("Problem updating chat");
  }

  return response;
};

export const deleteChat = async (
  chatParams: { role: string; content: string }[],
): Promise<Response> => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/c/chat`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + getCookie("accessToken"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(chatParams),
  });

  if (!response.body) {
    throw new Error("Problem deleting chat");
  }

  return response;
};
