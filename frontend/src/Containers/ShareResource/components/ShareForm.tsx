import React from 'react';
import { Button, Input, Skeleton, Stack, Typography } from '@mui/joy';

import type { Resource } from '../../../Types';

type ShareFormProps = {
  isLoading?: boolean;
  resource?: Resource;
  getResourceShareLink?: () => string;
  onShareLinkCopyClick?: () => void;
};

export const ShareForm = ({
  isLoading,
  getResourceShareLink,
  onShareLinkCopyClick,
}: ShareFormProps) => {
  return (
    <Stack spacing={2}>
      <Typography>
        <Skeleton loading={isLoading || false}>
          Copy the link to Business Process:
        </Skeleton>
      </Typography>
      <Skeleton sx={{ position: 'relative' }} loading={isLoading || false}>
        <Input
          readOnly
          value={getResourceShareLink?.()}
          endDecorator={<Button onClick={onShareLinkCopyClick}>Copy</Button>}
        />
      </Skeleton>
    </Stack>
  );
};
