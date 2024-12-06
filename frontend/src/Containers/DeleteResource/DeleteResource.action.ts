import {
  deleteResource,
  QUERY_KEY as resourceQueryKey,
} from '../../api/resources/resources.queries';
import queryClient from '../../queryClient';
import { ResourceType } from '../../shared/types/BpmnResource';

export const action = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const targetResourceId = url.searchParams.get('targetResourceId');

  const formData = await request.formData();
  const deletedResourceType = formData.get('resourceType') as ResourceType;

  try {
    await deleteResource(targetResourceId as string);
    queryClient.invalidateQueries({
      queryKey: [resourceQueryKey],
    });

    return {
      deletedResourceType,
    };
  } catch (error) {
    return {
      deletedResourceType,
      error,
    };
  }
};
