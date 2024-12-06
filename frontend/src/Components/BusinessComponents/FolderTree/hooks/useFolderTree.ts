import { useMemo, SyntheticEvent, useState, useEffect } from 'react';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';

import { useFolders } from '../../../../shared/hooks/useFolders';

import type { RenderTree } from '..';
import type { Resource } from '../../../../Types';
import { useResource } from '../../../../shared/hooks/useResource';

type UseFolderTreeCallbacks = {
  onNodeClick: (nodeId: string) => void;
};

type FolderTreeItem = {
  id: string;
  name: string;
  children: FolderTreeItem[];
};

export const useFolderTree = (
  selectedResourceId: string,
  { onNodeClick }: UseFolderTreeCallbacks,
) => {
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  const { folders, isLoading, getFolderHierarchy } = useFolders();
  const { resource } = useResource(selectedResourceId);

  const createDataTree = (resources: Resource[]) => {
    return resources
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((folder: Resource): FolderTreeItem => {
        return {
          id: folder.id,
          name: folder.name,
          children: createDataTree(
            folders.filter(({ parentId }) => parentId === folder.id),
          ),
        };
      });
  };

  const dataTree: RenderTree = useMemo(() => {
    return {
      id: 'root',
      name: 'Root',
      children: createDataTree(folders.filter(({ depth }) => depth === 0)),
    };
  }, [folders]);

  const isLabelClick = (event: SyntheticEvent) => {
    return (event.target as HTMLElement).classList.contains(
      treeItemClasses.label,
    );
  };

  const onNodeSelect = (event: SyntheticEvent, nodeId: string | null) => {
    if (nodeId && isLabelClick(event)) {
      onNodeClick(nodeId);
      if (!expandedNodes.includes(nodeId)) {
        setExpandedNodes([...[...expandedNodes, nodeId]]);
      }
    }
  };

  const onNodeToggle = (event: SyntheticEvent, nodeIds: string[]) => {
    if (!isLabelClick(event)) {
      setExpandedNodes(nodeIds);
    }
  };

  /**
   * Set default expanded folders
   */
  useEffect(() => {
    if (folders?.length && resource) {
      setExpandedNodes([
        ...expandedNodes,
        ...getFolderHierarchy(
          resource.parentId ? resource.parentId : selectedResourceId,
        )
          .filter(({ id }) => !expandedNodes.includes(id))
          .map(({ id }) => id),
      ]);
    }
  }, [selectedResourceId, folders, resource]);

  return { dataTree, onNodeSelect, onNodeToggle, expandedNodes, isLoading };
};
