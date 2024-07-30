import { IMessage } from "../interface";
import { getChat } from "../service/chatService";
import { MessageContainer } from "./MessageContainer";
import { getMessages } from "../service/messageService";

export class ChatHistory {
  private historyElement: HTMLDivElement;
  private messages: IMessage[];

  constructor(title: string, id: string) {
    this.messages = [];
    this.historyElement = document.createElement("div");
    this.historyElement.className = "text-left overflow-hidden text-nowrap";
    this.historyElement.textContent = title;
    this.clickHandler(id);
  }

  render(): HTMLElement {
    return this.historyElement;
  }

  message(): IMessage[] {
    return this.messages;
  }

  private async clickHandler(id: string) {
    this.historyElement.addEventListener("click", async () => {
      document.cookie = `activeChatId=${id}`;
      const response = await getChat(id);
      const chat = await response.json();
      if (!chat) {
        throw new Error("Problem getting chat from database");
      }

      const messages = await getMessages();
      const messageContainer = new MessageContainer(messages);
      messageContainer.render();
      this.messages = messageContainer.message();
    });
  }
}
