import { useCallback } from 'react';
import { useQuery } from 'react-query';

import { foldersQuery } from '../../api/resources/resources.queries';
import { getRootResource } from '../helpers/resource';

import type { Resource } from '../../Types';

export const useFolders = () => {
  const { data: folders, isLoading } = useQuery(foldersQuery());

  const makeFlatHierarchy = (
    flatTree: Resource[],
    resourceId: string,
  ): Resource[] => {
    const folder = (folders as Resource[]).find(({ id }) => id === resourceId);
    if (folder) {
      flatTree.push(folder);
    }

    return folder?.parentId
      ? makeFlatHierarchy(flatTree, folder?.parentId)
      : flatTree;
  };

  /**
   * Return a flat hierarchy of folders
   */
  const getFolderHierarchy = useCallback(
    (folderId: string) => {
      if (!folders) {
        return [];
      }

      return [getRootResource(), ...makeFlatHierarchy([], folderId).reverse()];
    },
    [folders],
  );

  return {
    folders: folders ?? [],
    isLoading,
    getFolderHierarchy,
  };
};
