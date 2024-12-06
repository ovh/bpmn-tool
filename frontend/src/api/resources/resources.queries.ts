import { ResourceType } from '../../shared/types/BpmnResource';
import { Resource } from '../../Types';
import { apiClient } from '../../queryClient';

export const QUERY_KEY = 'resources';

type ResourceAttrs = {
  name: string;
  description?: string;
  parentId?: string;
};

type ResourceQueryFilters = {
  type?: ResourceType;
  parentId?: string;
  depth?: number;
};

const buildFilters = (filters: ResourceQueryFilters = {}) => {
  const queryStringParts = [];
  if (filters.type !== undefined) {
    queryStringParts.push(`filter.type=${filters.type}`);
  }
  if (filters.parentId !== undefined) {
    queryStringParts.push(`filter.parentId=${filters.parentId}`);
  }
  if (filters.depth !== undefined) {
    queryStringParts.push(`filter.depth=${filters.depth}`);
  }

  return queryStringParts.join('&');
};

export const resourcesQuery = (filters?: ResourceQueryFilters) => {
  const buildedFilters = buildFilters(filters);
  return {
    queryKey: [QUERY_KEY, buildedFilters],
    queryFn: async (): Promise<Resource[]> =>
      apiClient.get(`/resources?${buildFilters(filters)}`),
  };
};

export const foldersQuery = () => ({
  queryKey: [QUERY_KEY, `type_${ResourceType.Folder}`],
  queryFn: async (): Promise<Resource[]> =>
    apiClient.get(`/resources?filter.type=${ResourceType.Folder}`),
});

export const getResourceQuery = (resourceId: string) => ({
  queryKey: [`${QUERY_KEY}_${resourceId}`],
  queryFn: async (): Promise<Resource> =>
    apiClient.get(`/resources/${resourceId}`),
});

export const createResource = async (resourceAttr: ResourceAttrs) => {
  return apiClient.post('/resources', {
    ...resourceAttr,
    description: resourceAttr.description ?? '',
  });
};

export const updateResource = async (
  resourceId: string,
  resourceAttr: ResourceAttrs,
) => {
  return apiClient.put(`/resources/${resourceId}`, {
    ...resourceAttr,
    description: resourceAttr.description ?? '',
  });
};

export const deleteResource = async (resourceId: string) => {
  return apiClient.remove(`/resources/${resourceId}`);
};
