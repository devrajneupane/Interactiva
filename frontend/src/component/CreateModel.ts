export class CreateModel {
  private workspace: HTMLDivElement;
  private container: HTMLDivElement;
  private main: HTMLDivElement;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.workspace =
      container.querySelector<HTMLDivElement>("#sidebar-workspace")!;
    this.main = this.container.querySelector<HTMLDivElement>("#main")!;

    this.fetchView();
  }

  private fetchView() {
    this.workspace.addEventListener("click", async () => {
      const view = await fetch("/views/modelCreationForm.html");
      this.main.innerHTML = await view.text();
    });
  }

  render() {
    return this.container;
  }
}
