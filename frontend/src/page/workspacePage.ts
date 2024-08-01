import { ModelName } from "../component/ModelName";
import { IModel, IModelParams } from "../interface";
import { createModel, getModels } from "../service/ollamaService";

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

  // Initialize sliders
  sliders.forEach((slider) => {
    const valueSpan = slider.nextElementSibling as HTMLSpanElement;
    if (valueSpan && valueSpan.classList.contains("sliderValue")) {
      valueSpan.textContent = parseFloat(slider.dataset.default!).toFixed(2);
    }
  });

  const modelsDropdown =
    main.querySelector<HTMLSelectElement>("#models-dropdown")!;
  let models = await getModels();

  if (models) {
    modelsDropdown.innerHTML = "";
    models.forEach((model: IModel) => {
      const modelName = new ModelName(model.name).render();
      modelsDropdown.appendChild(modelName);
    });
  }

  // Handle form submission
  const form = main.querySelector<HTMLFormElement>("#model-creation-form")!;

  form.addEventListener("submit", (event: Event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const data: IModelParams = {
      params: {},
    };

    for (const [key, value] of formData.entries()) {
      const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement;

      if (
        input &&
        (input.type === "range" || ["seed", "temperature", "stop"].includes(key))
      ) {
        data.params[key] = value.toString();
      } else {
        data[key] = value;
      }
    }

    createModel(data);
  });

  return container;
};
