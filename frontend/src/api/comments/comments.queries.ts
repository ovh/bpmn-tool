import { Comment } from '../../Types';
import { apiClient } from '../../queryClient';
import { ApiQuery } from '../types';
import { buildQuery } from '../helpers';

export const QUERY_KEY = 'resources_comments';

type CommentAttrs = {
  comment: string;
};

export const commentsQuery = (resourceId: string, query?: ApiQuery) => {
  const queryParams = buildQuery(query);

  return {
    queryKey: [`${QUERY_KEY}_${resourceId}`],
    queryFn: async (): Promise<Comment[]> =>
      apiClient.get(`/resources/${resourceId}/comments?${queryParams}`),
  };
};

export const createComment = async (
  resourceId: string,
  commentAttr: CommentAttrs,
) => {
  return apiClient.post(`/resources/${resourceId}/comments`, commentAttr);
};
