export type UpdateCommentCommandParams = {
  resourceId: string;
  commentId: string;
};

export type UpdateCommentCommand = {
  comment: string;
  updatedBy: string;
};
