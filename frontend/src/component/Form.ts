import { Input } from "./Input";

export class Form {
  private form: HTMLFormElement;
  private inputs: { [key: string]: Input } = {};

  constructor(private onSubmit: (data: { [key: string]: string }) => void) {
    this.form = document.createElement("form");
    this.form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  addInput(input: Input, name: string): void {
    this.inputs[name] = input;
    this.form.appendChild(input.render());
  }

  addSubmitButton(text: string): void {
    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = text;
    button.className = "form-submit";
    this.form.appendChild(button);
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();
    const data: { [key: string]: string } = {};
    for (const [name, input] of Object.entries(this.inputs)) {
      data[name] = input.getValue();
    }
    this.onSubmit(data);
  }

  render(): HTMLFormElement {
    return this.form;
  }
}
