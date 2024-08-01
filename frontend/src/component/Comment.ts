export class Comment {
  private container: HTMLDivElement;

  constructor(comment: Record<string, string>) {
    this.container = document.createElement("div");

    const commentWrapper = document.createElement("div");
    commentWrapper.className =
      "mb-2 flex rounded-xl bg-slate-50 px-2 py-6 sm:px-4";

    const userSpan = document.createElement("span");
    userSpan.className = "mr-4 font-bold";

    userSpan.textContent = `${comment.username}`;
    commentWrapper.appendChild(userSpan);

    const commentContainer = document.createElement("div");
    commentContainer.className = "flex max-w-3xl items-center rounded-xl";

    const commentText = document.createElement("p");
    commentText.textContent = comment.comment;

    commentContainer.appendChild(commentText);

    commentWrapper.appendChild(commentContainer);
    this.container.appendChild(commentWrapper);
  }

  render(): HTMLElement {
    return this.container;
  }
}
