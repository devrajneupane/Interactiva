import { getCookie } from "../util";
import { fetchWithAuth, getUser } from "./authService";
import { INTERACTIVA_BASE_URL } from "../util/constant";

export const login = async (email: string, password: string): Promise<void> => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const { accessToken, refreshToken } = await response.json();
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  } else {
    const error = await response.json();
    throw new Error(error.error.message);
  }
};

export const register = async (
  name: string,
  email: string,
  password: string,
): Promise<void> => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/users`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getCookie("accessToken"),
    },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }
};

export const updateUser = async (
  name: string,
  email: string,
  password: string,
): Promise<void> => {
  const user = getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const response = await fetchWithAuth(
    `${INTERACTIVA_BASE_URL}/users/${user.id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getCookie("accessToken"),
      },
      body: JSON.stringify({ name, email, password }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }
};
