import React from 'react';

import { CommentCard } from './CommentCard';

import type { Comment } from '../../../Types';

type CommentListProps = {
  comments: Comment[];
};

export const CommentList = ({ comments }: CommentListProps) => {
  return (
    <>
      {comments.map(comment => {
        return <CommentCard key={comment.id} comment={comment} />;
      })}
    </>
  );
};
