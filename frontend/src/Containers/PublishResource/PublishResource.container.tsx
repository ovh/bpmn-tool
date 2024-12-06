import React from 'react';
import { Await, Navigate } from 'react-router-dom';

import { usePublishResource } from './hooks/usePublishResource';
import { BaseModal } from '../../Components/GenericComponents/BaseModal/BaseModal';

import { ResourceType } from '../../shared/types/BpmnResource';
import { PublishContent } from './components/PublishContent';
import { Button, DialogActions } from '@mui/joy';

export const Component = () => {
  const { loaderData, resource, base64Png, actionData, viewerRef, callbacks } =
    usePublishResource();

  if ((resource && resource.type === ResourceType.Folder) || actionData) {
    return <Navigate to={`/${resource?.id}`} />;
  }

  return (
    <>
      <React.Suspense
        fallback={
          <BaseModal
            sx={{ maxWidth: 1000 }}
            open
            onClose={callbacks.onModalClose}
            isLoading
          >
            <PublishContent isLoading />
          </BaseModal>
        }
      >
        <Await resolve={loaderData.resource}>
          <BaseModal
            title="Business Process publication"
            open
            onClose={callbacks.onModalClose}
            sx={{ maxWidth: 1000 }}
          >
            <>
              <PublishContent
                resource={resource}
                base64Png={base64Png}
                onPngPreviewClick={callbacks.onPngPreviewClick}
              />

              <DialogActions>
                <Button
                  variant="solid"
                  color="primary"
                  onClick={callbacks.onPublish}
                >
                  Publish
                </Button>
                <Button
                  variant="plain"
                  color="neutral"
                  onClick={callbacks.onModalClose}
                >
                  Cancel
                </Button>
              </DialogActions>
            </>
          </BaseModal>
        </Await>
      </React.Suspense>
      <div ref={viewerRef} style={{ height: '0' }} />
    </>
  );
};

Component.displayName = 'PublishResourceContainer';
