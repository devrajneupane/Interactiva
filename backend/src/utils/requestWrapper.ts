import { Request, Response, NextFunction } from "express";

export function requestHandler(callbacks: Function[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      for (let callback of callbacks) {
        await callback(req, res, next);
        if (res.headersSent) break;
      }
    } catch (e) {
      if (e instanceof Error) {
        next(e);
      }
    }
  };
}
