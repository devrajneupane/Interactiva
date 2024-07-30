import { Base } from "./BasePage";

export class NotFound extends Base {
  private container: HTMLElement;

  constructor() {
    super("404 Page Not Found");
    this.container = document.createElement("div");
    this.container.className = "pageNotFound";
  }

  render(): HTMLElement {
    const heading = document.createElement("h1");
    heading.className = "text-3xl";
    heading.textContent = "404 Page Not Found";
    this.container.appendChild(heading);

    return this.container;
  }
}

export const render = () => {
  const container = document.createElement("div");
  container.className = "flex justify-center items-center h-screen";

  const heading = document.createElement("h1");
  heading.className = "text-3xl";
  heading.textContent = "404 Page Not Found";

  container.appendChild(heading);
  return container;
};
