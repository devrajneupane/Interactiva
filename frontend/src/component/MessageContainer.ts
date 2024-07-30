import { Message } from "./Message";
import { IMessage } from "../interface";

export class MessageContainer {
  private messageContainer: HTMLDivElement;
  private messages: IMessage[];
  private messageHistory: IMessage[] = [];

  constructor(messages: IMessage[]) {
    this.messageContainer =
      document.querySelector<HTMLDivElement>("#message-container")!;
    this.messages = messages;
  }

  message(): IMessage[] {
    return this.messageHistory;
  }

  render() {
    this.messageContainer.innerHTML = "";
    this.messages.forEach((message) => {
      const messageComponent = new Message(message.content).render();
      this.messageHistory.push({
        role: message.sender,
        content: message.content,
      });
      this.messageContainer.appendChild(messageComponent);
    });
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
  }
}
