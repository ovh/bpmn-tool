import React, { ReactNode } from 'react';
import { Box } from '@mui/joy';

type ActionBarProps = {
  children: ReactNode;
};

export const ActionBar = ({ children }: ActionBarProps) => {
  return (
    <Box
      sx={theme => ({
        borderBottom: '1px solid',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '16px',
        borderColor: theme.palette.neutral.outlinedBorder,
      })}
    >
      {children}
    </Box>
  );
};
