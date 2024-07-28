import { Form } from "../component/Form";
import { Input } from "../component/Input";
import { Base } from "./BasePage";

export class Auth extends Base {
  private container: HTMLElement;

  constructor() {
    super("Login Page");
    this.container = document.createElement("div");
    this.container.className = "login-page";
  }

  private handleLogin(data: { [key: string]: string }): void {
    console.log("Login data:", data);
  }

  render(): HTMLElement {
    const heading = document.createElement("h1");
    heading.textContent = "Login";
    this.container.appendChild(heading);

    const form = new Form(this.handleLogin);

    const emailInput = new Input("email", "email", "Enter your email");
    form.addInput(emailInput, "email");

    const passwordInput = new Input(
      "password",
      "password",
      "Enter your password",
    );
    form.addInput(passwordInput, "password");

    form.addSubmitButton("Log In");

    this.container.appendChild(form.render());

    return this.container;
  }
}
