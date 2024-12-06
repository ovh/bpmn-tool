import { defer, redirect } from 'react-router-dom';

import queryClient from '../../queryClient';
import { getResourceQuery } from '../../api/resources/resources.queries';

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const targetResourceId = url.searchParams.get('targetResourceId');

  if (!targetResourceId) {
    return redirect('..');
  }

  const resourceQuery = getResourceQuery(targetResourceId);
  const resourcePromise =
    queryClient.getQueryData(resourceQuery.queryKey) ??
    queryClient.fetchQuery(resourceQuery);

  return defer({
    resource: resourcePromise,
  });
};
