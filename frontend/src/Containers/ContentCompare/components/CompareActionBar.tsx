import React from 'react';
import { Button, Stack } from '@mui/joy';
import { Link } from 'react-router-dom';
import { Compare, Home } from '@mui/icons-material';

import { ActionBar } from '../../../Components/GenericComponents/ActionBar/ActionBar';

type CompareActionBarProps = {
  resourceId: string;
  onDiffsDisplay: () => void;
};

export const CompareActionBar = ({
  resourceId,
  onDiffsDisplay,
}: CompareActionBarProps) => {
  return (
    <ActionBar>
      <Stack gap={1} direction="row">
        <Button
          variant="outlined"
          color="neutral"
          component={Link}
          to={`/${resourceId}`}
        >
          <Home fontSize="small" />
        </Button>
        <Button
          onClick={onDiffsDisplay}
          variant="outlined"
          color="neutral"
          startDecorator={<Compare fontSize="small" />}
        >
          See changes
        </Button>
      </Stack>
    </ActionBar>
  );
};
