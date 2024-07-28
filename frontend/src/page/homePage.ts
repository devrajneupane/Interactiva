import { Base } from "./BasePage";

export class Home extends Base {
  private container: HTMLElement;

  constructor() {
    super("Login Page");
    this.container = document.createElement("div");
    this.container.className = "home-page";
  }

  render(): HTMLElement {
    const heading = document.createElement("h1");
    heading.textContent = "Home Page";
    this.container.appendChild(heading);

    const paragraph = document.createElement("p");
    paragraph.textContent = "Welcome to our SPA!";
    this.container.appendChild(paragraph);

    const login = document.createElement("a");
    login.textContent = "login";
    login.href = "/auth";
    this.container.appendChild(login);

    return this.container;
  }
}
