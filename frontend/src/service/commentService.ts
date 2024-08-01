import { getCookie } from "../util";
import { CommentPolymorphicId } from "../types";
import { INTERACTIVA_BASE_URL } from "../util/constant";

export const getComments = async (commentId: CommentPolymorphicId) => {
  const response = await fetch(
    `${INTERACTIVA_BASE_URL}/comments/?commentableId=${commentId.commentableId}&commentableType=${commentId.commentableType}`,
    {
      credentials: "include",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + getCookie("accessToken"),
      },
    },
  );

  if (!response.body) {
    throw new Error("Problem with ReadableStream");
  }

  const comments = await response.json();
  return comments.data;
};

export const createComment = async (
  commentId: CommentPolymorphicId,
  comment: string,
) => {
  const response = await fetch(`${INTERACTIVA_BASE_URL}/comments`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + getCookie("accessToken"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...commentId, comment }),
  });

  if (!response.body) {
    throw new Error("Problem with ReadableStream");
  }

  const commentObj = await response.json();
  return commentObj.data;
};
