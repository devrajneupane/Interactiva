export abstract class Base {
  constructor(title: string = "") {
    document.title = title;
  }

  abstract render(): HTMLElement;
}
