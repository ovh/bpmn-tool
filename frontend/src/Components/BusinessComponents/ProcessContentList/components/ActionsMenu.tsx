import React from 'react';
import { MoreVert } from '@mui/icons-material';
import {
  Dropdown,
  IconButton,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
} from '@mui/joy';

import type { ReactNode } from 'react';

type ActionItem = {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: ReactNode;
};

type ActionsMenuProps = {
  size: string;
  actions: ActionItem[];
};

export const ActionsMenu = ({ size, actions }: ActionsMenuProps) => {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'outlined', color: 'neutral', size } }}
      >
        <MoreVert />
      </MenuButton>
      <Menu>
        {actions.map((action: ActionItem) => (
          <MenuItem
            key={action.id}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.icon && (
              <ListItemDecorator>{action.icon}</ListItemDecorator>
            )}
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </Dropdown>
  );
};
