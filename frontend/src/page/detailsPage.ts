import { CommentableType } from "../enums";
import { Comment } from "../component/Comment";
import { getModelById, updateModel } from "../service/modelService";
import { getPromptById, updatePrompt } from "../service/promptService";
import { getComments, createComment } from "../service/commentService";
import { getUserById } from "../service/userService";

export const render = async (contentType: string, id: string) => {
  const container = document.createElement("div");
  container.className = "container mx-auto px-4 sm:px-6 lg:px-8 py-8";

  const commentContaienr = document.createElement("div");
  let contentData: Record<string, string> = {};

  if (contentType === CommentableType.PROMPT) {
    contentData = await getPromptById(id);
  } else if (contentType === CommentableType.MODEL) {
    contentData = await getModelById(id);
  }
  const comments = await getComments({
    commentableId: id,
    commentableType: CommentableType.PROMPT,
  });

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
    window.location.href = "/explore";
  });

  container.appendChild(backButton);
  const commentElement = document.createElement("div");
  commentElement.className = "flex flex-col p-4";
  commentElement.innerHTML = `
    <div class="self-start sm:text-xl font-medium capitalize line-clamp-1">
      ${contentData.title || contentData.name}
    </div>
    <hr class="my-3 border-gray-850" />
    <div class="my-2">
      <div class="mb-3 flex justify-between">
        <div class="flex gap-5">
          <div class="self-center text-sm font-medium">
            <!--  TODO: Add user name -->
            By ${contentData.userId}
          </div>
          <div class="flex self-center gap-3">
            <div class="flex self-center">
              <button id="like-button">
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
              </button>
              <span id="likes-count" class="ml-1"n>${contentData.likes}</span>
            </div>
            <div class="flex self-center">
              <button id="comment-button">
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
                  class="icon icon-tabler icons-tabler-outline icon-tabler-message-circle"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1"
                  />
                </svg>
              </button>
              <span id="comment-count" class="ml-1">${comments.length}</span>
            </div>
          </div>
        </div>
        <div class="self-end translate-y-1">
          <button id="copyButton" class="flex items-center">
            <div id="buttonIcon" class="flex items-center">
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
                <path
                  d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"
                />
                <path
                  d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"
                />
              </svg>
              <span class="ml-1">Copy</span>
            </div>
          </button>
        </div>
      </div>
      <div>
        <pre
        id="textToCopy"
        class="whitespace-pre-line px-3 py-2 text-sm w-full bg-transparent border border-gray-850 outline-none rounded-lg"
        >
          ${contentData.prompt || contentData.description}
        </pre
        >
      </div>
    </div>
`;

  container.appendChild(commentElement);
  const copyButton = container.querySelector<HTMLButtonElement>("#copyButton")!;
  const buttonIcon = container.querySelector<HTMLDivElement>("#buttonIcon")!;
  const textToCopy = container.querySelector<HTMLPreElement>("#textToCopy")!;
  bindEvents(copyButton, buttonIcon, textToCopy);

  addComment(commentContaienr, comments);

  container.appendChild(commentContaienr);

  const inputWrapper = document.createElement("div");
  const submitButton = document.createElement("button");
  inputWrapper.className = "relative";
  const textArea = document.createElement("textarea");
  textArea.className =
    "mt-2 block w-full resize-none rounded-xl border-none bg-slate-200 p-4 text-sm text-slate-900 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-base";
  textArea.placeholder = "Add a comment...";
  textArea.rows = 1;
  textArea.required = true;

  submitButton.className =
    "absolute bottom-2 right-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:text-base";
  submitButton.textContent = "Submit";

  textArea.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      if (!e.shiftKey) {
        e.preventDefault();
        submitButton.click();
      }
    }
  });

  submitButton.addEventListener("click", async () => {
    const comment = textArea.value;
    if (!comment) return;
    textArea.value = "";

    const commentObj = await createComment(
      {
        commentableId: id,
        commentableType: CommentableType.PROMPT,
      },
      comment,
    );

    addComment(commentContaienr, [commentObj]);
    const commentCount =
      container.querySelector<HTMLSpanElement>("#comment-count")!;
    commentCount.textContent = (
      parseInt(commentCount.textContent || "0") + 1
    ).toString();
  });

  const likeButton =
    commentElement.querySelector<HTMLButtonElement>("#like-button")!;
  let liked = false;
  let likeCount = parseInt(contentData.likes || "0");
  let likeButtonIcon = likeButton.innerHTML;

  likeButton.addEventListener("click", async () => {
    liked = !liked;
    likeCount += liked ? 1 : -1;
    likeButton.innerHTML = liked
      ? `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path
          d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
        />
      </svg>
    `
      : likeButtonIcon;

    let contentObj: Record<string, string> = {};
    if (contentType === CommentableType.PROMPT) {
      contentObj = await updatePrompt(id, { likes: likeCount });
    } else if (contentType === CommentableType.MODEL) {
      contentObj = await updateModel(id, { likes: likeCount });
    }
    if (!contentObj) return;

    const likeCountElement = likeButton.nextElementSibling!;
    likeCountElement.textContent = `${likeCount}`;
  });

  const commentButton =
    commentElement.querySelector<HTMLButtonElement>("#comment-button")!;
  commentButton.addEventListener("click", () => {
    textArea.focus();
  });

  inputWrapper.appendChild(textArea);
  inputWrapper.appendChild(submitButton);

  container.appendChild(inputWrapper);

  return container;
};

const bindEvents = async (
  copyButton: HTMLButtonElement,
  buttonIcon: HTMLElement,
  textToCopy: HTMLElement,
) => {
  copyButton.addEventListener("click", async () => {
    // Copy text
    await navigator.clipboard.writeText(textToCopy.textContent || "");

    // Change icon to tick mark
    const originalIcon = buttonIcon.innerHTML;
    buttonIcon.innerHTML = `
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
        <path
          d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"
        />
        <path
          d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"
        />
        <path d="M9 14l2 2l4 -4" />
      </svg>
      <span class="ml-1">Copied!</span>
      `;

    // Disable button
    copyButton.setAttribute("disabled", "true");
    copyButton.classList.replace("bg-blue-500", "bg-gray-500");

    // Reset after 3 seconds
    setTimeout(() => {
      buttonIcon.innerHTML = originalIcon;
      copyButton.removeAttribute("disabled");
      copyButton.classList.replace("bg-gray-500", "bg-blue-500");
    }, 2000);
  });
};

const addComment = async (
  container: HTMLDivElement,
  comments: Record<string, string>[],
) => {
  comments.forEach(async (comment: Record<string, string>) => {
    const user = await getUserById(comment.userId);
    comment.username = user.name;
    const commentElement = new Comment(comment);
    container.appendChild(commentElement.render());
  });
};
