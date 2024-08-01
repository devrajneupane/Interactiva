import { CommentableType } from "../enums";

export type CommentPolymorphicId = {
  commentableId: string;
  commentableType: CommentableType;
};
