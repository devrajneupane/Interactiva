export interface IRoute {
  path: string;
  handler: () => Promise<void>;
}
