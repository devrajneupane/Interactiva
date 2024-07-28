import { Router } from "./util";
import { Home, Auth, Base } from "./page";

export class App {
  private router: Router;
  private pages: { [route: string]: Base } = {};

  constructor() {
    this.router = new Router();
    this.initializePages();
  }

  private initializePages() {
    this.pages = {
      "/": new Home(),
      "/auth": new Auth(),
    };

    Object.keys(this.pages).forEach((route) => {
      this.router.addRoute(route, () => {
        return this.pages[route].render();
      });
    });
  }

  async init() {
    await this.router.navigate(window.location.pathname);
  }
}
