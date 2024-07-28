import { NotFound } from "../page";

export class Router {
  private routes: { [route: string]: () => HTMLElement };
  private appElement: HTMLElement;

  constructor() {
    this.routes = {};
    this.appElement = document.getElementById("app")!;
    this.bindEvents();
  }

  addRoute(route: string, handler: () => HTMLElement) {
    this.routes[route] = handler;
  }

  async navigate(route: string) {
    const handler = this.routes[route];

    this.appElement.innerHTML = "";
    if (handler) {
      this.appElement.appendChild(handler());
    } else {
      this.appElement.appendChild(new NotFound().render());
    }
  }

  private bindEvents() {
    window.addEventListener("popstate", () => {
      const route = window.location.pathname;
      this.navigate(route);
    });

    document.addEventListener("click", async (e) => {
      const target = e.target as HTMLAnchorElement;
      if (target.matches("[data-link]")) {
        e.preventDefault();
        const route = target.href;
        window.history.pushState(null, "", route);

        await this.navigate(route);
      }
    });
  }
}
