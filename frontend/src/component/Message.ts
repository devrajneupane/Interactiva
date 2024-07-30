import hljs from "highlight.js";
import 'highlight.js/styles/default.css'

export class Message {
  private messageElement: HTMLDivElement;
  private message: string;

  constructor(message: string) {
    this.messageElement = document.createElement("div");
    this.message = message;
  }

  render(): HTMLElement {
    this.messageElement.className =
      "p-2  m-4 max-w-full overflow-x-auto whitespace-pre-wrap rounded-lg shadow";

    const pre = document.createElement("pre");
    this.messageElement.appendChild(pre);
    const code = document.createElement("code");
    code.className = "hljs language-markdown markdown whitespace-pre-wrap";
    code.innerHTML = hljs.highlightAuto(this.message, hljs.getLanguage("markdown")?.aliases).value || this.message;
    pre.appendChild(code);
    this.messageElement.appendChild(pre)
    return this.messageElement;
  }
}
