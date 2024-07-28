export type Route = {
  path: string;
  handler: () => Promise<void>;
};

export type Page = {
  render: () => HTMLElement;
  // update?: () => void;
};
