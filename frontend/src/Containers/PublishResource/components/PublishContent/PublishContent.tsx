import React from 'react';
import { AspectRatio, Box, Link, Skeleton, Typography } from '@mui/joy';
import ImageIcon from '@mui/icons-material/Image';

import type { Resource } from '../../../../Types';

type PublishContentProps = {
  isLoading?: boolean;
  resource?: Resource;
  base64Png?: string;
  onPngPreviewClick?: () => void;
};

export const PublishContent = ({
  isLoading,
  resource,
  base64Png,
  onPngPreviewClick,
}: PublishContentProps) => {
  return (
    <Box>
      <Typography>
        <Skeleton loading={isLoading || false}>
          You are about to publish your Business Process{' '}
          <strong>{resource?.name}</strong>. Are you sure you want to publish
          it?
        </Skeleton>
      </Typography>
      <Typography>
        <Skeleton loading={isLoading || false}>
          Here is a preview of your Business Process that will be published
          (click on it in order to enlarge).
        </Skeleton>
      </Typography>
      <AspectRatio
        variant={isLoading || !base64Png ? 'soft' : 'outlined'}
        sx={{ width: 900, marginTop: 2 }}
        objectFit="contain"
      >
        {isLoading || !base64Png ? (
          <div>
            <ImageIcon sx={{ fontSize: '3rem', opacity: 0.2 }} />
          </div>
        ) : (
          <Link component="button" onClick={onPngPreviewClick}>
            <img src={base64Png} alt="" />
          </Link>
        )}
      </AspectRatio>
    </Box>
  );
};
