import { UUID } from "crypto";

export interface IComment {
  id: UUID;
  commentableId: UUID;
  commentableType: string;
  comment: string;
  userId: UUID;
  createdAt: Date;
  updatedAt: Date | null;
}
