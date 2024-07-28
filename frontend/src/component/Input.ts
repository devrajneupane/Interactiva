export class Input {
  private element: HTMLInputElement;

  constructor(type: string, name: string, placeholder: string) {
    this.element = document.createElement("input");
    this.element.type = type;
    this.element.name = name;
    this.element.placeholder = placeholder;
    this.element.className = "form-input";
  }

  render(): HTMLInputElement {
    return this.element;
  }

  getValue(): string {
    return this.element.value;
  }
}
