export const render = async () => {
  const container = document.createElement("div");
  const chatView = await fetch("/views/chat.html");

  container.innerHTML = await chatView.text();

  let main = container.querySelector<HTMLDivElement>("#main")!;

  const view = await fetch("/views/workspace.html");
  main.innerHTML = await view.text();

  const paramsContainer =
    main.querySelector<HTMLDivElement>("#params-container")!;

  paramsContainer.addEventListener("input", (event: Event) => {
    const target = event.target as HTMLInputElement;

    if (target.type === "range") {
      const valueSpan = target.nextElementSibling as HTMLSpanElement;
      if (valueSpan && valueSpan.classList.contains("sliderValue")) {
        valueSpan.textContent = parseFloat(target.value).toFixed(2);
      }
    }
  });

  const sliders = main.querySelectorAll<HTMLInputElement>(
    'input[type="range"]',
  );
  // const switches =
  //   main.querySelectorAll<HTMLButtonElement>("[data-melt-switch]");

  // Initialize sliders
  sliders.forEach((slider) => {
    const valueSpan = slider.nextElementSibling as HTMLSpanElement;
    if (valueSpan && valueSpan.classList.contains("sliderValue")) {
      valueSpan.textContent = parseFloat(slider.dataset.default!).toFixed(2);
    }
  });

  // Handle form submission
  const form = main.querySelector<HTMLFormElement>("#model-creation-form")!;

  form.addEventListener("submit", (event: Event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const data: { [key: string]: string } = {};

    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    console.log("Form data:", data);
  });

  return container;
};
