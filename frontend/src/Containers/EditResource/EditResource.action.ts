import queryClient from '../../queryClient';
import {
  updateResource,
  QUERY_KEY as resourceQueryKey,
} from '../../api/resources/resources.queries';
import { ResourceType } from '../../shared/types/BpmnResource';

import type { EditResourceParams } from '.';

export const action = async ({
  request,
  params,
}: {
  request: Request;
  params: EditResourceParams;
}) => {
  const url = new URL(request.url);
  const targetResourceId = url.searchParams.get('targetResourceId');

  const formData = await request.formData();
  const resourceData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
  };
  const editedResourceType = formData.get('type') as ResourceType;

  try {
    const resourceId = targetResourceId || params.resourceId;

    const response = await updateResource(resourceId, resourceData);
    queryClient.invalidateQueries({
      queryKey: [resourceQueryKey],
    });
    queryClient.invalidateQueries({
      queryKey: [`${resourceQueryKey}_${resourceId}`],
    });

    return {
      editedResourceType: response.type,
    };
  } catch (error) {
    return { editedResourceType, error };
  }
};
