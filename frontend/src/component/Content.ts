export class Content {
  private container: HTMLDivElement;
  private content: Record<string, string>;

  constructor(content: Record<string, string>) {
    this.content = content;
    this.container = document.createElement("div");

    this.container.className =
      "flex w-full items-center justify-between space-x-6 p-6";
    this.container.innerHTML = `
      <button class="group flex-1 truncate">
        <div class="flex items-center space-x-3">
          <h3
            class="truncate text-sm font-medium text-slate-900 transition-colors group-hover:text-blue-600"
          >
            ${this.content.title || this.content.name}
          </h3>
        </div>
        <p class="mt-1 truncate text-sm text-slate-500">
          ${this.content.prompt || this.content.description}
        </p>
        <p class="mt-1 truncate text-sm text-slate-500">
          By ${this.content.username}
        </p>
      </button>
      <div
        class="flex flex-shrink-0 flex-col items-center gap-y-1 rounded-lg p-1 text-xs text-slate-900 transition-colors hover:text-blue-600 focus:text-blue-600"
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
          class="icon icon-tabler icons-tabler-outline icon-tabler-star"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
          />
        </svg>
        <span>${content.likes}</span>
      </div>
    `;
    this.bindEvents();
  }

  private bindEvents() {
    const buttons =
      this.container.querySelectorAll<HTMLButtonElement>("button");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        window.location.href = `/${this.content.type}/${this.content.id}`;
      });
    });
  }

  render() {
    return this.container;
  }
}
