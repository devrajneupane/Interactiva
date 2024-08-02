import { match } from "path-to-regexp";

import { Route } from "./types";
import { isAuthenticated } from "./service/authService";

const routes: Route[] = [
  {
    path: match("/auth"),
    handler: async () => {
      if (isAuthenticated()) {
        window.history.pushState(null, "", "/");
        return import("./page/chatPage");
      }
      return import("./page/authPage");
    },
  },
  {
    path: match("/register"),
    handler: async () => {
      if (isAuthenticated()) {
        window.history.pushState(null, "", "/");
        return import("./page/chatPage");
      }
      return import("./page/registerPage");
    },
  },
  {
    path: match("/"),
    handler: async () => {
      if (!isAuthenticated()) {
        window.history.pushState(null, "", "/auth");
        return import("./page/authPage");
      }
      return import("./page/chatPage");
    },
  },
  {
    path: match("/workspace"),
    handler: async () => {
      if (!isAuthenticated()) {
        window.history.pushState(null, "", "/auth");
        return import("./page/authPage");
      }
      return import("./page/workspacePage");
    },
  },
];

export const initRouter = () => {
  const container = document.getElementById("app") as HTMLElement;

  const navigate = async (path: string) => {
    try {
      let foundRoute: Route | undefined;
      let params: object | undefined;

      for (const route of routes) {
        const result = route.path(path);
        if (result) {
          foundRoute = route;
          params = result.params;
          break;
        }
      }

      if (!foundRoute) {
        const notFoundModule = await import("./page/notFoundPage");
        container.innerHTML = "";
        container.appendChild(notFoundModule.render());
        return;
      }

      const module = await foundRoute.handler(
        params as { [key: string]: string },
      );
      const content = await module.render();

      if (!(content instanceof Node)) {
        throw new Error("Render function did not return a DOM Node");
      }

      container.innerHTML = "";
      container.appendChild(content);
    } catch (error) {
      console.error(`Failed to navigate to ${path}:`, error);
    }
  };

  window.addEventListener("popstate", () => {
    const path = window.location.pathname;
    navigate(path);
  });

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLAnchorElement;

    if (target.matches("[data-link]")) {
      e.preventDefault();
      const route = target.getAttribute("href");

      window.history.pushState(null, "", route);
      navigate(route!);
    }
  });

  navigate(window.location.pathname);
};
