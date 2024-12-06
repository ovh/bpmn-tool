import React, { FC, ReactElement } from 'react';
import { Box, Skeleton, Typography } from '@mui/joy';

import { Breadcrumbs } from '../../../Components/GenericComponents/Breadcrumbs/Breadcrumbs';

import type { BreadcrumbItem } from '../../../Components/GenericComponents/Breadcrumbs/Breadcrumbs';

type HeaderProps = {
  isLoading?: boolean;
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactElement;
};

export const Header: FC<HeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  isLoading,
}) => {
  return (
    <>
      <Breadcrumbs isLoading={isLoading} breadcrumbItems={breadcrumbs || []} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          my: 1,
          gap: 1,
          flexWrap: 'wrap',
          '& > *': {
            minWidth: 'clamp(0px, (500px - 100%) * 999, 100%)',
            flexGrow: 1,
          },
        }}
      >
        <Typography level="h1" fontSize="xl4">
          {isLoading ? (
            <Skeleton variant="text" level="h1" width={350} />
          ) : (
            title
          )}
        </Typography>
        <Box sx={{ flex: 999 }} />
        <Box sx={{ display: 'flex', gap: 1, '& > *': { flexGrow: 1 } }}>
          {actions}
        </Box>
      </Box>
      <Typography level="body-sm" sx={{ overflowWrap: 'break-word' }}>
        {isLoading ? <Skeleton variant="text" level="body-sm" /> : description}
      </Typography>
    </>
  );
};
