import { register } from "../service/userService";

export const render = () => {
  const container = document.createElement("div");
  container.className =
    "flex items-center justify-center min-h-screen bg-gray-100";

  const wrapper = document.createElement("div");
  wrapper.className =
    "w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md";

  const heading = document.createElement("h2");
  heading.className = "text-2xl font-bold";

  heading.textContent = "Interactiva";

  const form = document.createElement("form");
  form.className = "space-y-2";
  form.innerHTML = `
    <div>
      <label class="block text-sm">Name</label>
      <input type="text" placeholder="Name" id="name" class="w-full p-2 border rounded" required />
    </div>
    <div>
      <label class="block text-sm">Email</label>
      <input type="email" placeholder="Email" id="email" class="w-full p-2 border rounded" required />
    </div>
    <div>
      <label class="block text-sm">Password</label>
      <input type="password" placeholder="Password", id="password" class="w-full p-2 border rounded" required />
    </div>
    <div>
      <label class="block text-sm">Confirm Password</label>
      <input type="password" placeholder="Confirm Password" id="confirmPassword" class="w-full p-2 border rounded" required />
    </div>
    <div class="text-red-500 mt-2 error hidden"></div>
      <button
        type="submit"
        class="w-full p-2 mt-4 text-white bg-blue-500 rounded"
      >
        Register
      </button>
    <p class="mt-4">Already have an account? <a href="/auth" data-link class="text-blue-500">Login</a></p>
  `;

  const name = form.querySelector("#name") as HTMLInputElement;
  const email = form.querySelector("#email") as HTMLInputElement;
  const password = form.querySelector("#password") as HTMLInputElement;
  const confirmPassword = form.querySelector(
    "#confirmPassword",
  ) as HTMLInputElement;

  const inputs = [name, email, password, confirmPassword];

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      if (password.value !== confirmPassword.value) {
        throw new Error("Passwords do not match");
      }
      await register(name.value, email.value, password.value);
      window.history.pushState(null, "", "/login");
      const event = new PopStateEvent("popstate");
      dispatchEvent(event);
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
  wrapper.appendChild(heading);
  wrapper.appendChild(form);
  return container;
};
