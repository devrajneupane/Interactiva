import { deleteAllCookies } from "../util";
import { getUser, removeToken } from "../service/authService";

export const profileIconSetup = (container: HTMLDivElement) => {
  const menuButton =
    container.querySelector<HTMLButtonElement>("#profileMenuButton")!;
  const popupMenu = container.querySelector<HTMLDivElement>("#popupMenu")!;

  if (menuButton && popupMenu) {
    menuButton.addEventListener("click", (e: MouseEvent) => {
      console.log(e.x, e.y);
      const buttonRect = menuButton.getBoundingClientRect();
      popupMenu.style.left = `${e.x - 140}px`;
      popupMenu.style.top = `${e.y + buttonRect.height}px`;
      popupMenu.classList.toggle("hidden");
    });

    // Add event listeners for menu buttons
    const userElement =
      container.querySelector<HTMLButtonElement>("#userProfileButton")!;

    const user = getUser()!;
    const usernameElement = userElement.firstElementChild!;
    usernameElement.textContent = user.name;

    const signOutButton =
      container.querySelector<HTMLButtonElement>("#signOutButton")!;

    userElement.addEventListener("click", () => {
      console.log("Settings button clicked");
    });

    signOutButton.addEventListener("click", () => {
      removeToken();
      window.location.replace("/auth");
      deleteAllCookies();
    });
  }
};
