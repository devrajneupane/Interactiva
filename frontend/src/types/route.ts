import { MatchFunction } from "path-to-regexp";

export type Route = {
  path: MatchFunction<object>;
  handler: (params?: { [key: string]: string }) => Promise<any>;
};
