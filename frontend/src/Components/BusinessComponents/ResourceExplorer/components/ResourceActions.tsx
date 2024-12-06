import React from 'react';
import { Link } from 'react-router-dom';
import { Delete, Edit, MoreVert, Share } from '@mui/icons-material';
import {
  Dropdown,
  IconButton,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
  Stack,
} from '@mui/joy';

import {
  ResourceAction,
  ResourceType,
} from '../../../../shared/types/BpmnResource';

import type { Resource } from '../../../../Types';

type ResourceActionsProps = {
  resource: Resource;
  getActionLink: (id: string, action: ResourceAction) => string;
};

export const ResourceActions = ({
  resource,
  getActionLink,
}: ResourceActionsProps) => {
  return (
    <Stack spacing={1} direction="row" justifyContent="flex-end">
      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{
            root: { variant: 'outlined', color: 'neutral', size: 'sm' },
          }}
        >
          <MoreVert />
        </MenuButton>
        <Menu>
          <MenuItem
            component={Link}
            to={getActionLink(resource.id, ResourceAction.Edit)}
            title={`${resource.name}: edit the resource`}
          >
            <ListItemDecorator>
              <Edit fontSize="small" />
            </ListItemDecorator>
            Edit
          </MenuItem>
          {resource.type === ResourceType.Process && (
            <MenuItem
              component={Link}
              to={getActionLink(resource.id, ResourceAction.Share)}
              title={`${resource.name}: share the resource`}
            >
              <ListItemDecorator>
                <Share fontSize="small" />
              </ListItemDecorator>
              Share
            </MenuItem>
          )}
          <MenuItem
            component={Link}
            to={getActionLink(resource.id, ResourceAction.Delete)}
            title={`${resource.name}: delete the resource`}
          >
            <ListItemDecorator>
              <Delete fontSize="small" />
            </ListItemDecorator>
            Delete
          </MenuItem>
        </Menu>
      </Dropdown>
    </Stack>
  );
};
