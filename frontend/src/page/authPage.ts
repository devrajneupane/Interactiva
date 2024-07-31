import { login } from "../service/userService";

export const render = () => {
  const container = document.createElement("div");
  container.className =
    "flex items-center justify-center min-h-screen bg-gray-100";

  const wrapper = document.createElement("div");
  wrapper.className =
    "w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md";

  const loginDiv = document.createElement("div");
  loginDiv.className =
    "z-10 bg-white p-10 rounded shadow-md h-screen md:h-auto w-full md:w-1/2";

  const logo = document.createElement("h2");
  logo.className = "text-2xl font-bold text-center";

  logo.textContent = "Interactiva";

  const form = document.createElement("form");
  form.innerHTML = `
    <div>
      <label class="block text-sm">Email</label>
      <input type="email" id = "email" placeholder="Email" class="w-full p-2 border rounded" required />
    </div>
    <div>
      <label class="block mt-2 text-sm">Password</label>
      <input type="password" id="password" placeholder="Password" class="w-full p-2 border rounded" required />
    </div>
    <button type="submit" class="w-full p-2 mt-4 text-white bg-blue-500 rounded">Login</button>
    <div class="text-red-500 mt-2 hidden error"></div>
    <p class="mt-4">Don't have an account? <a href="/register" data-link class="text-blue-500">Register</a></p>
  `;

  const email = form.querySelector<HTMLInputElement>("#email")!;
  const password = form.querySelector<HTMLInputElement>("#password")!;

  const inputs = [email, password];

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await login(email.value, password.value);

      // Redirect to dashboard or another route upon successful login
      window.history.pushState(null, "", "/");
      window.dispatchEvent(new Event("popstate"));
    } catch (error) {
      const errorElement = form.querySelector(".error") as HTMLElement;
      errorElement.textContent = `${error}`;
      errorElement.classList.remove("hidden");
    }
  });

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const errorElement = form.querySelector(".error") as HTMLElement;
      errorElement.classList.add("hidden");
    });
  });

  container.appendChild(wrapper);
  wrapper.appendChild(logo);
  wrapper.appendChild(form);
  return container;
};
