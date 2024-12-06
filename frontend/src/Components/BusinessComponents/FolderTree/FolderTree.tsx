import React from 'react';
import {
  List,
  ListItem,
  ListItemContent,
  ListSubheader,
  Skeleton,
} from '@mui/joy';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { ChevronRight, ExpandMore } from '@mui/icons-material';

import { useFolderTree } from './hooks/useFolderTree';
import { FolderTreeItem } from './components/FolderTreeItem';

import type { RenderTree } from '.';

type FolderTreeProps = {
  selectedId: string;
  onNodeClick: (nodeId: string) => void;
};

export const FolderTree = ({ selectedId, onNodeClick }: FolderTreeProps) => {
  const { dataTree, expandedNodes, isLoading, onNodeSelect, onNodeToggle } =
    useFolderTree(selectedId, { onNodeClick });

  const renderTree = (node: RenderTree) => {
    return (
      <FolderTreeItem
        key={node.id}
        itemId={node.id}
        label={`📁 ${node.name}`}
        title={node.name}
      >
        {Array.isArray(node.children)
          ? node.children.map(childNode => renderTree(childNode))
          : null}
      </FolderTreeItem>
    );
  };

  return (
    <List
      sx={{
        '--ListItem-radius': '8px',
        '--ListItem-minHeight': '32px',
        '--List-gap': '4px',
      }}
    >
      <ListSubheader role="presentation" sx={{ color: 'text.primary' }}>
        Folders
      </ListSubheader>

      {isLoading ? (
        new Array(10).fill('').map((_, index) => (
          <ListItem key={`skel-${index}`}>
            <ListItemContent>
              <Skeleton animation="wave" sx={{ width: '90%' }} height={24} />
            </ListItemContent>
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemContent>
            <SimpleTreeView
              selectedItems={selectedId}
              expandedItems={expandedNodes}
              disabledItemsFocusable
              slots={{ collapseIcon: ExpandMore, expandIcon: ChevronRight }}
              onSelectedItemsChange={onNodeSelect}
              onExpandedItemsChange={onNodeToggle}
            >
              {renderTree(dataTree)}
            </SimpleTreeView>
          </ListItemContent>
        </ListItem>
      )}
    </List>
  );
};
