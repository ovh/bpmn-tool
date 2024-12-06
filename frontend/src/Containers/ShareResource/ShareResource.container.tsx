import React from 'react';
import { Await, Navigate } from 'react-router-dom';

import { useShareResource } from './hooks/useShareResource';
import { ShareForm } from './components/ShareForm';
import { BaseModal } from '../../Components/GenericComponents/BaseModal/BaseModal';
import { ResourceType } from '../../shared/types/BpmnResource';

export const Component = () => {
  const { callbacks, loaderData, getResourceShareLink, resource } =
    useShareResource();

  if (resource && resource.type === ResourceType.Folder) {
    return <Navigate to=".." />;
  }

  return (
    <React.Suspense
      fallback={
        <BaseModal open onClose={callbacks.onModalClose} isLoading>
          <ShareForm isLoading />
        </BaseModal>
      }
    >
      <Await resolve={loaderData.resource}>
        <BaseModal
          title="Share Business Process"
          open
          onClose={callbacks.onModalClose}
        >
          <ShareForm
            getResourceShareLink={getResourceShareLink}
            onShareLinkCopyClick={callbacks.onShareLinkCopyClick}
          />
        </BaseModal>
      </Await>
    </React.Suspense>
  );
};

Component.displayName = 'ShareResourceContainer';
