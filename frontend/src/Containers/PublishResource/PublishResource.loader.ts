import { defer } from 'react-router-dom';

import queryClient from '../../queryClient';
import { getResourceQuery } from '../../api/resources/resources.queries';
import { PublishResourceParams } from '.';

export const loader = async ({ params }: { params: PublishResourceParams }) => {
  const resourceQuery = getResourceQuery(params.resourceId);
  const resourcePromise =
    queryClient.getQueryData(resourceQuery.queryKey) ??
    queryClient.fetchQuery(resourceQuery);

  return defer({
    resource: resourcePromise,
  });
};
