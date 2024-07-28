import "./styles/style.css";

import { App } from "./App.ts";

const app = new App();

document.addEventListener("DOMContentLoaded", () => {
  app.init();
});
