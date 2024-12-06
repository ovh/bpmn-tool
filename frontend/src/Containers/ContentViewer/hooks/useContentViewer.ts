import { useParams } from 'react-router-dom';

import { ContentViewerRouteParams } from '..';

export const useContentViewer = () => {
  const { resourceId, contentId } = useParams() as ContentViewerRouteParams;

  return {
    resourceId,
    contentId,
  };
};
