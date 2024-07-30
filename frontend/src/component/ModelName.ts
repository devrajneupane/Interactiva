export class ModelName {
  private optionElement: HTMLOptionElement;

  constructor(model: string) {
    this.optionElement = document.createElement("option");
    this.optionElement.value = model;
    this.optionElement.textContent = model;
  }

  render(): HTMLElement {
    return this.optionElement;
  }
}
