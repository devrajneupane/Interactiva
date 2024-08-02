import { deleteAllCookies } from "../util";
import { removeToken } from "../service/authService";

export const profileIconSetup = (container: HTMLDivElement) => {
  const menuButton =
    container.querySelector<HTMLButtonElement>("#profileMenuButton")!;
  const popupMenu = container.querySelector<HTMLDivElement>("#popupMenu")!;

  if (menuButton && popupMenu) {
    menuButton.addEventListener("click", () => {
      popupMenu.classList.toggle("hidden");
    });

    // Add event listeners for menu buttons
    const settingsButton =
      container.querySelector<HTMLButtonElement>("#settingsButton")!;
    const signOutButton =
      container.querySelector<HTMLButtonElement>("#signOutButton")!;

    settingsButton.addEventListener("click", () => {
      console.log("Settings button clicked");
    });

    signOutButton.addEventListener("click", () => {
      removeToken()
      window.location.replace("/auth");
      deleteAllCookies()
    });
  }
};
