import { UUID } from "crypto";

import { TABLE } from "../enums";
import { IGetUserQuery } from "../interface";

export type CommentPolymorphicId = {
  commentableId: UUID;
  commentableType: TABLE.MODEL | TABLE.PROMPT;
};

export type CommentQueryParams = CommentPolymorphicId & IGetUserQuery;
