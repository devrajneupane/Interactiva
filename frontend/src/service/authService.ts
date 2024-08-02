import { jwtDecode } from "jwt-decode";

import { IUser } from "../interface";
import { INTERACTIVA_BASE_URL } from "../util/constant";
import { getCookie } from "../util";

let globalUser: IUser | null = null;

export const saveToken = (token: string) => {
  localStorage.setItem("accessToken", token);
  globalUser = jwtDecode<IUser>(token);
};

export const getUser = (): IUser | null => {
  if (!globalUser) {
    const token = getToken();
    if (token) {
      globalUser = jwtDecode<IUser>(token);
    }
  }
  return globalUser;
};

export const getToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const removeToken = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  globalUser = null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken(); // Checks if there's an access token
};

export const refreshToken = async (): Promise<void> => {
  const refreshToken = localStorage.getItem("refreshToken"); // Assuming you store refresh token as well

  if (!refreshToken) {
    removeToken();
    window.history.pushState(null, "", "/auth");
    return;
  }

  try {
    const response = await fetch(`${INTERACTIVA_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getCookie("accessToken"),
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const { accessToken } = await response.json();
      saveToken(accessToken); // Update access token
    } else {
      removeToken();
      window.history.pushState(null, "", "/login");
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    removeToken();
    window.history.pushState(null, "", "/login");
  }
};

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const token = getToken();

  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, options);

    if (response.status === 401) {
      await refreshToken();
      const newToken = getToken();

      if (newToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return fetch(url, options);
      }
    }

    return response;
  } catch (error) {
    console.error("API request failed:", error);
    throw error; // Optionally rethrow to handle at the calling site
  }
};
