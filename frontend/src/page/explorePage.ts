import { Content } from "../component/Content";
import { getUserById } from "../service/userService";
import { getPrompts } from "../service/promptService";
import { getModels } from "../service/modelService";

export const render = async () => {
  const container = document.createElement("div");
  container.className = "container mx-auto px-4 sm:px-6 lg:px-8 py-8";

  const backButton = document.createElement("button");
  backButton.innerHTML = `
    <button
      type="submit"
      class="inline-flex items-center gap-x-2 rounded-lg bg-slate-500 px-3 py-2 text-center text-sm text-slate-50 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M5 12l14 0" />
        <path d="M5 12l4 4" />
        <path d="M5 12l4 -4" />
      </svg>
      Back
    </button>
  `;
  backButton.addEventListener("click", () => {
    window.location.href = "/";
  });

  container.appendChild(backButton);

  const banner = document.createElement("div");
  banner.className =
    "mt-8 mx-auto w-full text-center text-sm text-token-text-secondary md:text-lg md:leading-tight";
  banner.textContent =
    "Discover custom versions of LLMs and Prompts that combine instructions and extra information";
  container.appendChild(banner);

  const filterButtons = document.createElement("div");
  filterButtons.className = "flex justify-center space-x-4 mt-4";

  const buttonGroupSpan = document.createElement("span");
  buttonGroupSpan.className =
    "mt-4 inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm";

  const contentContainer = document.createElement("div");
  contentContainer.className = "mt-8";
  contentContainer.innerHTML = "Nothing to show here";

  const modelButton = document.createElement("button");
  modelButton.className =
    "inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative";
  modelButton.textContent = "models";
  buttonGroupSpan.appendChild(modelButton);
  modelButton.addEventListener("click", async () => {
    const models = await items();
    contentContainer.innerHTML = "";
    contentContainer.appendChild(models);
  });

  const promptButton = document.createElement("button");
  promptButton.className =
    "inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative";
  promptButton.textContent = "Prompts";
  promptButton.addEventListener("click", async () => {
    const prompts = await items("prompts");
    contentContainer.innerHTML = "";
    contentContainer.appendChild(prompts);
  });

  buttonGroupSpan.appendChild(promptButton);

  container.appendChild(buttonGroupSpan);
  container.appendChild(contentContainer);

  window.addEventListener("load", () => {
    if (modelButton) {
      modelButton.click();
    }
  });

  // return mainContainer;
  return container;
};

const items = async (contentType: string = "models") => {
  const container = document.createElement("ul");
  container.role = "list";
  container.className = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2";

  let contents: Record<string, any>[];

  if (contentType === "models") {
    contents = await getModels();
  } else {
    contents = await getPrompts();
  }

  if (!contents) {
    container.textContent = `No ${contentType} Found`;
    return container;
  }

  for (let content of contents) {
    const user = await getUserById(content.userId);
    content.username = user.name;
    content.type = contentType;
    const promptElement = document.createElement("li");
    promptElement.className = "col-span-1 rounded-lg bg-slate-50 shadow";
    const promptInnerElement = new Content(content);

    container.appendChild(promptElement);
    promptElement.appendChild(promptInnerElement.render());
  }
  return container;
};
