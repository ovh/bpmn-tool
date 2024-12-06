import { useQuery } from 'react-query';

import { getResourceQuery } from '../../api/resources/resources.queries';
import { getRootResource, isRoot } from '../helpers/resource';

export const useResource = (resourceId: string, enabled: boolean = true) => {
  const { data: resource, isLoading } = useQuery({
    ...getResourceQuery(resourceId),
    enabled: enabled && !isRoot(resourceId),
  });

  return {
    isLoading,
    resource:
      resource || (isRoot(resourceId) && getRootResource()) || undefined,
  };
};
