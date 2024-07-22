import { UUID } from "crypto";

export interface IChat {
  id: UUID;
  userId: UUID;
  title: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}
