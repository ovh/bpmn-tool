import React from 'react';
import { Box, IconButton, Skeleton, Stack, List, ListItem } from '@mui/joy';
import { Compare, FileCopy } from '@mui/icons-material';

import { useProcessDetails } from './hooks/useProcessDetails';
import { ProcessContentList } from '../ProcessContentList/ProcessContentList';
import { ProcessViewer } from '../ProcessViewer';
import { ConditionalRender } from '../../../Components/GenericComponents/ConditionalRender/ConditionalRender';
import { Card } from '../../../Components/GenericComponents/Card/Card';
import { DropZone } from '../../../Components/GenericComponents/DropZone/DropZone';

type ProcessDetailsProps = {
  resourceId: string;
  onContentUpload: (content: string) => void;
  onContentPublish: (contentId: string) => void;
  onContentErase: (contentId: string) => void;
  onContentClone: (contentId: string) => void;
  onContentViewerLinkCopy: (content: string) => void;
  onCompareClick: (leftContentId: string, rightContentId: string) => void;
};

export const ProcessDetails = ({
  resourceId,
  onContentUpload,
  onContentPublish,
  onContentErase,
  onContentClone,
  onContentViewerLinkCopy,
  onCompareClick,
}: ProcessDetailsProps) => {
  const {
    contents,
    isLoading,
    draftContent,
    publishedContent,
    tasks,
    isCompareDisabled,
    contentIdsToCompare,
    onFilesUploaded,
    onContentChecked,
  } = useProcessDetails(resourceId, {
    onContentUpload,
  });

  if (isLoading) {
    return (
      <Stack gap={2}>
        <Skeleton variant="rectangular" height={200} />
        <Skeleton variant="rectangular" height={200} />
      </Stack>
    );
  }

  return (
    <>
      <ConditionalRender condition={Boolean(publishedContent)}>
        <Card
          title={`Last published version: ${
            publishedContent?.version ?? 'N/A'
          }`}
          actions={
            <IconButton
              title="Copy link"
              variant="plain"
              color="neutral"
              size="sm"
              sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem' }}
              onClick={() => {
                if (publishedContent) {
                  onContentViewerLinkCopy(publishedContent.id);
                }
              }}
            >
              <FileCopy />
            </IconButton>
          }
        >
          <Box marginY={2} height="30vh">
            <ProcessViewer
              resourceId={resourceId}
              contentId={publishedContent?.id as string}
            />
          </Box>
        </Card>
      </ConditionalRender>

      <ConditionalRender condition={Boolean(!contents.length)}>
        <Card title="Upload a Draft Diagram">
          <DropZone onFileUploaded={onFilesUploaded} />
        </Card>
      </ConditionalRender>

      <ConditionalRender
        condition={Boolean(draftContent) || Boolean(publishedContent)}
      >
        <Card
          title="Versions history"
          actions={
            <IconButton
              title="Compare"
              variant="plain"
              color="neutral"
              size="sm"
              disabled={isCompareDisabled}
              sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem' }}
              onClick={() =>
                onCompareClick(contentIdsToCompare[0], contentIdsToCompare[1])
              }
            >
              <Compare />
            </IconButton>
          }
        >
          <ProcessContentList
            contents={contents}
            onContentChecked={onContentChecked}
            onContentPublish={onContentPublish}
            onContentErase={onContentErase}
            onContentClone={onContentClone}
          />
        </Card>
      </ConditionalRender>

      <ConditionalRender condition={Boolean(tasks.length)}>
        <Card accordion title={`Activities (${tasks.length})`}>
          <List>
            {tasks.map((task, index) => (
              <ListItem key={`task_${index.toString()}`}>
                {task.getAttribute('name')}
              </ListItem>
            ))}
          </List>
        </Card>
      </ConditionalRender>
    </>
  );
};
