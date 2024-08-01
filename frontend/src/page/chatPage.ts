import hljs from "highlight.js";

import {
  generateTitle,
  getModelResponse,
  getModels,
} from "../service/ollamaService";
import { getCookie } from "../util";
import { IModel } from "../interface";
import { Message } from "../component";
import { ModelName } from "../component/ModelName";
import { ChatHistory } from "../component/ChatHistory";
import { profileIconSetup } from "../component/Profile";
import { updateMessageDatabase } from "../service/messageService";
import { getChat, getChats, updateChat } from "../service/chatService";

export const render = async (id?: string) => {
  const container = document.createElement("div");
  let messages: { role: string; content: string }[] = [];
  let model = "";

  const view = await fetch("/views/chat.html");
  container.innerHTML = await view.text();

  const modelsDropdown =
    container.querySelector<HTMLSelectElement>("#models-dropdown")!;

  modelsDropdown.addEventListener("focus", async () => {
    let models = await getModels();
    if (!models) return;
    modelsDropdown.innerHTML = "";

    models.forEach((model: IModel) => {
      const modelName = new ModelName(model.name).render();
      modelsDropdown.appendChild(modelName);
    });
  });

  modelsDropdown.addEventListener("change", () => {
    model = modelsDropdown.value.split(":")[0];
  });

  const button = container.querySelector<HTMLButtonElement>(
    "#message-send-button",
  )!;
  const textarea = container.querySelector<HTMLTextAreaElement>(
    "#prompt-message-textarea",
  )!;

  textarea.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      if (!e.shiftKey) {
        e.preventDefault();
        button.click();
      }
    }
  });

  button.addEventListener("click", async () => {
    const userPrompt = textarea.value;
    if (!userPrompt) return;

    const messagesContainer =
      container.querySelector<HTMLDivElement>("#message-container")!;

    textarea.value = "";

    messages.push({ role: "user", content: userPrompt });

    const message = new Message(userPrompt);
    messagesContainer.appendChild(message.render());
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const modelResponse = await getModelResponse({
      model: model,
      messages: messages,
    });
    const reader = modelResponse.body?.getReader();
    const decoder = new TextDecoder();

    const modelMessage = new Message("").render();
    const code = modelMessage.querySelector("code")!;
    messagesContainer.appendChild(modelMessage);

    let modelResponseMessage = "";

    while (true) {
      if (!reader) return;
      const { value, done } = await reader.read();
      if (done) {
        messages.push({
          role: "assistant",
          content: modelResponseMessage,
        });

        // Update message to database
        await updateMessageDatabase(messages.slice(-2));

        const activeChatId = getCookie("activeChatId")!;
        const activeChat = await getChat(activeChatId);

        // Don't set title if it already exists
        if (activeChat.title) break;

        const title = await generateTitle({ model: model, prompt: userPrompt });

        if (title) await updateChat({ id: activeChatId, title: title });
        const chatHistory =
          container.querySelector<HTMLDivElement>("#sidebar-history")!;
        const activeChatElement = chatHistory.querySelector<HTMLDivElement>(
          `"#${id}"`,
        ) as HTMLDivElement;
        activeChatElement.textContent = title;

        break;
      }
      let decodedChunk = decoder.decode(value, { stream: true });
      decodedChunk = decodedChunk.replace(/^"(.*)"$/, "$1");
      code.innerHTML += decodedChunk;
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      modelResponseMessage += decodedChunk;
    }
    code.innerHTML =
      hljs.highlightAuto(code.innerHTML, hljs.getLanguage("markdown")?.aliases)
        .value || code.innerHTML;
  });

  const chats = await getChats();

  if (chats.data) {
    const chatHistory =
      container.querySelector<HTMLDivElement>("#sidebar-history")!;
    chats.data.forEach((chat: Record<any, any>) => {
      const history = new ChatHistory(chat.id, chat.id);
      const historyElement = history.render();
      chatHistory.appendChild(historyElement);

      historyElement.addEventListener("click", () => {
        messages = history.message();
      });
    });
  }
  profileIconSetup(container);

  return container;
};
