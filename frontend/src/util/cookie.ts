export function setCookie(name: string, val: string) {
  const value = encodeURIComponent(val); // Ensure value is properly encoded

  // Set the cookie with no expiration date, making it a session cookie
  document.cookie = `${name}=${value};SameSite=None; Secure; path=/`;
}

export function getCookie(name: string): string | undefined {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");

  if (parts.length == 2) {
    // @ts-ignore
    return parts.pop().split(";").shift();
  }
}

export function deleteCookie(name: string) {
  const date = new Date();

  // Set it expire in -1 days
  date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000);

  document.cookie = name + "=; expires=" + date.toUTCString() + "; path=/";
}

export function deleteAllCookies() {
  document.cookie.split(";").forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;

    // Setting the expiry day to past date deletes the cookie
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });
}
