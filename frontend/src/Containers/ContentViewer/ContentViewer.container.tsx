import React from 'react';
import { useContentViewer } from './hooks/useContentViewer';
import { ProcessViewer } from '../../Components/BusinessComponents/ProcessViewer';
import { Box } from '@mui/joy';

export const Component = () => {
  const { resourceId, contentId } = useContentViewer();

  return (
    <Box height="100vh">
      <ProcessViewer resourceId={resourceId} contentId={contentId} />
    </Box>
  );
};

Component.displayName = 'ContentViewerContainer';
