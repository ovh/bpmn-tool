import { apiClient } from '../../queryClient';

import type { Content } from '../../Types';

type ContentAttrs = {
  content: string;
};

type PublishPayload = {
  pngContent: string;
};

export const QUERY_KEY = 'resources_contents';

export const contentsQuery = (resourceId: string) => {
  return {
    queryKey: [`${QUERY_KEY}_${resourceId}`],
    queryFn: async (): Promise<Content[]> =>
      apiClient.get(`/resources/${resourceId}/contents`),
  };
};

export const getContentQuery = (resourceId: string, contentId: string) => ({
  queryKey: [`${QUERY_KEY}_${resourceId}_${contentId}`],
  queryFn: async (): Promise<Content> =>
    apiClient.get(`/resources/${resourceId}/contents/${contentId}`),
});

export const getXmlContentQuery = (resourceId: string, contentId: string) => ({
  queryKey: [`${QUERY_KEY}_content_${resourceId}_${contentId}`],
  queryFn: async (): Promise<string> =>
    apiClient.get(`/resources/${resourceId}/contents/${contentId}/content`),
});

export const createContent = (
  resourceId: string,
  contentAttrs: ContentAttrs,
) => {
  return apiClient.post(`/resources/${resourceId}/contents`, {
    ...contentAttrs,
  });
};

export const deleteContent = (resourceId: string, contentId: string) => {
  return apiClient.remove(`/resources/${resourceId}/contents/${contentId}`);
};

export const saveContent = (
  resourceId: string,
  contentId: string,
  contentAttrs: ContentAttrs,
) => {
  return apiClient.put(
    `/resources/${resourceId}/contents/${contentId}`,
    contentAttrs,
  );
};

export const publishContent = (
  resourceId: string,
  contentId: string,
  publishPayload: PublishPayload,
) => {
  return apiClient.post(
    `/resources/${resourceId}/contents/${contentId}/publish`,
    publishPayload,
  );
};

export const cloneContent = (resourceId: string, contentId: string) => {
  return apiClient.post(
    `/resources/${resourceId}/contents/${contentId}/clone`,
    {},
  );
};
