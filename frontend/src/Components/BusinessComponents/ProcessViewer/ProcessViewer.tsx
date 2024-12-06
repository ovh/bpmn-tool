import React from 'react';
import { useProcessViewer } from './hooks/useProcessViewer';

type ProcessViewerProps = {
  resourceId: string;
  contentId: string;
};

export const ProcessViewer = ({
  resourceId,
  contentId,
}: ProcessViewerProps) => {
  const { viewerRef } = useProcessViewer(resourceId, contentId);

  return <div ref={viewerRef} style={{ height: '100%' }} />;
};
