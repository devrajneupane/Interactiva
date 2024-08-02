import hljs from "highlight.js";

import { Message } from "../component";
import { getChats } from "../service/chatService";
import { ModelName } from "../component/ModelName";
import { ChatHistory } from "../component/ChatHistory";
import { profileIconSetup } from "../component/Profile";
import { updateMessageDatabase } from "../service/messageService";
import { getModelResponse, getModels } from "../service/ollamaService";
import { CreateModel } from "../component/CreateModel";

interface IModel extends Record<string, any> {
  name: string;
}

export const render = async () => {
  const container = document.createElement("div");
  let messages: { role: string; content: string }[] = [];

  const view = await fetch("/views/chat.html");
  container.innerHTML = await view.text();

  const modelsDropdown =
    container.querySelector<HTMLOptionElement>("#models-dropdown")!;

  modelsDropdown.addEventListener("click", async () => {
    // FIX: Only fetch models when dropdown not active
    // if (document.activeElement === modelsDropdown) return;

    let models = await getModels();
    modelsDropdown.innerHTML = "";
    models.models.forEach((model: IModel) => {
      const modelName = new ModelName(model.name).render();
      modelsDropdown.appendChild(modelName);
    });
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
    if (!textarea.value) return;

    const messagesContainer =
      container.querySelector<HTMLDivElement>("#message-container")!;

    const userPrompt = textarea.value;
    textarea.value = "";

    messages.push({ role: "user", content: userPrompt });

    const message = new Message(userPrompt);
    messagesContainer.appendChild(message.render());
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const modelResponse = await getModelResponse(messages);
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
      // TODO: Fix chat title
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
