import { defer } from 'react-router-dom';

import { EditResourceParams } from '.';
import queryClient from '../../queryClient';
import { getResourceQuery } from '../../api/resources/resources.queries';

export const loader = async ({
  request,
  params,
}: {
  request: Request;
  params: EditResourceParams;
}) => {
  const url = new URL(request.url);
  const targetResourceId =
    url.searchParams.get('targetResourceId') || params.resourceId;

  const resourceQuery = getResourceQuery(targetResourceId);
  const resourcePromise =
    queryClient.getQueryData(resourceQuery.queryKey) ??
    queryClient.fetchQuery(resourceQuery);

  return defer({
    resource: resourcePromise,
  });
};
