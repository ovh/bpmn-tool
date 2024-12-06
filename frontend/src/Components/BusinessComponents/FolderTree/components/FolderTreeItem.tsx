import React from 'react';
import { alpha, styled } from '@mui/material';
import {
  TreeItem,
  TreeItemProps,
  treeItemClasses,
} from '@mui/x-tree-view/TreeItem';

export const FolderTreeItem = styled((props: TreeItemProps) => (
  // @ts-ignore
  <TreeItem {...props} />
))(({ theme }) => {
  return {
    [`& .${treeItemClasses.iconContainer}`]: {
      paddingTop: 11,
      paddingBottom: 11,
      paddingLeft: 8,
      paddingRight: 8,
      margin: 0,

      '& .close': {
        opacity: 0.3,
      },
      '&:hover:not(:empty)': {
        background: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
    [`& .${treeItemClasses.content}`]: {
      padding: 0,
      width: 'auto',
    },
    [`& .${treeItemClasses.label}`]: {
      padding: 8,
      paddingLeft: 0,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
  };
});

export const FolderTreeItemLoading = styled((props: TreeItemProps) => (
  // @ts-ignore
  <TreeItem {...props} />
))(() => {
  return {
    [`& .${treeItemClasses.content}`]: {
      padding: 8,
      width: 'auto',
    },
  };
});
