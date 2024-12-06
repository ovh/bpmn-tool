import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { useFolders } from '../../../shared/hooks/useFolders';
import { useResource } from '../../../shared/hooks/useResource';
import { isProcess } from '../../../shared/helpers/resource';

import type { BpmnLayoutRouteParams } from '..';

export const useBpmnLayoutBreadcrumbs = () => {
  const { resourceId } = useParams() as BpmnLayoutRouteParams;

  const { folders, getFolderHierarchy } = useFolders();
  const { resource } = useResource(resourceId);

  const getBreadCrumbs = useCallback(() => {
    if (!resource) {
      return [];
    }

    const folderHierarchy = getFolderHierarchy(
      isProcess(resource) ? (resource.parentId as string) : resourceId,
    ).map(({ id, name }) => ({
      id,
      label: name,
      to: `/${id}`,
    }));

    return [
      ...folderHierarchy,
      ...(isProcess(resource)
        ? [
            {
              id: resource.id,
              label: resource.name,
              to: `/${resource.id}`,
            },
          ]
        : []),
    ];
  }, [resourceId, resource, folders]);

  return { getBreadCrumbs };
};
