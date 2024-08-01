import { getCookie } from "../util";
import { ChatParams } from "../types";
import { createChat, getChats } from "./chatService";
import { INTERACTIVA_BASE_URL } from "../util/constant";
import { ChatHistory } from "../component/ChatHistory";

export const getModelResponse = async (
  chatParams: ChatParams,
): Promise<Response> => {
  if (!chatParams.model) throw new Error("Please Select a Model");

  let urlPath = window.location.pathname.split("/");
  const activeChatId = urlPath[urlPath.length - 1];

  if (!activeChatId) {
    createChat();
    const chats = await getChats();
    if (chats.data) {
      const chatHistory =
        document.querySelector<HTMLDivElement>("#sidebar-history")!;
      chatHistory.innerHTML = "";
      chats.data.forEach((chat: Record<any, any>) => {
        const history = new ChatHistory(chat.id, chat.id);
        const historyElement = history.render();
        chatHistory.appendChild(historyElement);
      });
    }
  }

  const response = await fetch(`${INTERACTIVA_BASE_URL}/ollama/chat`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + getCookie("accessToken"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(chatParams),
  });

  if (!response.body) {
    throw new Error("Problem with ReadableStream");
  }

  return response;
};

export const getModels = async () => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/ollama/list`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + getCookie("accessToken"),
    },
  });

  if (response.ok) {
    // throw new Error("Problem gettting local models");

    const models = await response.json();

    return models.models;
  }
};

export const createModel = async (modelParams: Record<string, string>) => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/ollama/create`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + getCookie("accessToken"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(modelParams),
  });

  if (!response.ok) {
    throw new Error("Problem creating model");
  }
};

export const generateTitle = async (data: {
  model: string;
  prompt: string;
}): Promise<string> => {
  const message = {
    model: data.model,
    prompt: `Generate a concise title of 10-15 characters that captures the main essence of the following text. The title should be engaging and relevant to the content. Here's the text:

    ${data.prompt}

    Provide only the title in your response, without any additional explanation or context.
  `,
  };
  const response = await fetch(`${INTERACTIVA_BASE_URL}/ollama/generate`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + getCookie("accessToken"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  if (!response.body) {
    throw new Error("Problem getting completion");
  }

  const title: string = await response.json();
  return title;
};
