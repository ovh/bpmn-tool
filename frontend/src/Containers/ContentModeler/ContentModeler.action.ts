import queryClient from '../../queryClient';
import {
  saveContent,
  contentsQuery,
  getContentQuery,
  getXmlContentQuery,
} from '../../api/contents/contents.queries';

import type { ContentModelerRouteParams } from '.';

const saveContentAction = async (
  resourceId: string,
  contentId: string,
  formData: FormData,
) => {
  const contentData = {
    content: formData.get('content') as string,
  };

  const response = await saveContent(resourceId, contentId, contentData);

  queryClient.invalidateQueries({
    queryKey: contentsQuery(resourceId).queryKey,
  });
  queryClient.invalidateQueries({
    queryKey: getContentQuery(resourceId, contentId).queryKey,
  });
  queryClient.invalidateQueries({
    queryKey: getXmlContentQuery(resourceId, contentId).queryKey,
  });

  return response;
};

export const action = async ({
  params,
  request,
}: {
  params: ContentModelerRouteParams;
  request: Request;
}) => {
  const { resourceId } = params;

  const formData = await request.formData();
  const formAction = formData.get('action');
  const contentId = formData.get('contentId') as string;
  let actionPromise;

  try {
    switch (formAction) {
      case 'saveContent':
      case 'saveContentBeforePublish':
        actionPromise = saveContentAction(resourceId, contentId, formData);
        break;
      default:
        break;
    }

    const response = await actionPromise;

    return {
      ...response,
      formAction,
    };
  } catch (error) {
    return {
      formAction,
      error,
    };
  }
};
