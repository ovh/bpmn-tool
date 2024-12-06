import React, { FC } from 'react';
import { ChevronRight, Home } from '@mui/icons-material';
import {
  Breadcrumbs as MUIBreadcrumbs,
  Link,
  Typography,
  Skeleton,
} from '@mui/joy';
import Box from '@mui/joy/Box';
import { Link as RouterLink } from 'react-router-dom';

export type BreadcrumbItem = {
  id: string;
  to: string;
  label: string;
};

type BreadcrumbsProps = {
  isLoading?: boolean;
  breadcrumbItems: BreadcrumbItem[];
};

export const Breadcrumbs: FC<BreadcrumbsProps> = ({
  isLoading,
  breadcrumbItems,
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {isLoading ? (
        <Skeleton variant="text" width={500} height={24} />
      ) : (
        <>
          <MUIBreadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRight />}
            sx={{
              '--Breadcrumbs-gap': '1rem',
              '--Icon-fontSize': '16px',
              fontWeight: 'lg',
              color: 'neutral.400',
              px: 0,
            }}
          >
            {breadcrumbItems.map((breadcrumbItem, index) => (
              <React.Fragment key={breadcrumbItem.id}>
                {index === breadcrumbItems.length - 1 ? (
                  <Typography fontSize="inherit">
                    {breadcrumbItem.id === 'root' ? (
                      <Home />
                    ) : (
                      breadcrumbItem.label
                    )}
                  </Typography>
                ) : (
                  <Link
                    underline="none"
                    color="neutral"
                    fontSize="inherit"
                    component={RouterLink}
                    to={breadcrumbItem.to}
                  >
                    {breadcrumbItem.id === 'root' ? (
                      <Home />
                    ) : (
                      breadcrumbItem.label
                    )}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </MUIBreadcrumbs>
        </>
      )}
    </Box>
  );
};
