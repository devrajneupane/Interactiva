import { UUID } from "crypto";

export interface IPrompt {
  id: UUID;
  title: string;
  prompt: string;
  likes: number;
  userId: UUID;
  createdAt: Date;
  updatedAt: Date | null;
}
