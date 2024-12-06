import queryClient from '../../queryClient';
import {
  createComment,
  commentsQuery,
} from '../../api/comments/comments.queries';
import { CommentsRouteParams } from '.';

export const action = async ({
  request,
  params,
}: {
  request: Request;
  params: CommentsRouteParams;
}) => {
  const formData = await request.formData();

  const commentData = {
    comment: formData.get('comment') as string,
  };

  try {
    const response = await createComment(params.resourceId, commentData);

    queryClient.invalidateQueries({
      queryKey: commentsQuery(params.resourceId).queryKey,
    });

    return response;
  } catch (error) {
    return { error };
  }
};
