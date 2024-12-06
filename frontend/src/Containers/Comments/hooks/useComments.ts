import { useParams } from 'react-router-dom';

import type { CommentsRouteParams } from '..';
import { useQuery } from 'react-query';
import { commentsQuery } from '../../../api/comments/comments.queries';

export const useComments = () => {
  const { resourceId } = useParams() as CommentsRouteParams;

  const { data: comments, isLoading } = useQuery(
    commentsQuery(resourceId, {
      sort: {
        by: 'createdAt',
        order: 'DESC',
      },
    }),
  );

  return {
    isLoading,
    comments: comments ?? [],
  };
};
