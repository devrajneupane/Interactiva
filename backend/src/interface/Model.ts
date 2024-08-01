import { UUID } from "crypto";

export interface IModel {
  id: UUID;
  name: string;
  description: string;
  params: Record<string, any>;
  likes?: number;
  userId: UUID;
  createdAt: Date;
  updatedAt: Date | null;
}
