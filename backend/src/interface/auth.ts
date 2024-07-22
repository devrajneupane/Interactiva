import { Request as ExpressRequest } from 'express';

import { IUser } from './User';

export interface IRequest extends ExpressRequest {
  user?: Omit<IUser, "password">;
}

