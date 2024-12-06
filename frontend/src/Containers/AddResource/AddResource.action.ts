import queryClient from '../../queryClient';
import { isRoot } from '../../shared/helpers/resource';
import {
  createResource,
  QUERY_KEY as resourceQueryKey,
} from '../../api/resources/resources.queries';

import { AddResourceParams } from '.';

export const action = async ({
  request,
  params,
}: {
  request: Request;
  params: AddResourceParams;
}) => {
  const url = new URL(request.url);
  const resourceType = url.searchParams.get('type');
  const { resourceId } = params;

  const formData = await request.formData();
  const resourceData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    parentId: !isRoot(resourceId) ? resourceId : undefined,
    type: resourceType,
  };

  try {
    const response = await createResource(resourceData);
    queryClient.invalidateQueries({
      queryKey: [resourceQueryKey],
    });
    return response;
  } catch (error) {
    return { error };
  }
};
