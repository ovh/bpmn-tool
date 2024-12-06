import { BpmnLayoutRouteParams } from '.';
import queryClient from '../../queryClient';
import { getResourceQuery } from '../../api/resources/resources.queries';
import { getRootResource, isRoot } from '../../shared/helpers/resource';

export const loader = async ({ params }: { params: BpmnLayoutRouteParams }) => {
  const { resourceId } = params;
  let resourcePromise;

  if (!isRoot(resourceId)) {
    const resourceQuery = getResourceQuery(resourceId);
    resourcePromise =
      queryClient.getQueryData(resourceQuery.queryKey) ??
      queryClient.fetchQuery(resourceQuery);
  } else {
    resourcePromise = Promise.resolve(getRootResource());
  }

  return {
    resource: resourcePromise,
  };
};
