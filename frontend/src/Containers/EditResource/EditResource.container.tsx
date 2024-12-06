import React from 'react';
import { Await, Navigate } from 'react-router-dom';

import { BaseModal } from '../../Components/GenericComponents/BaseModal/BaseModal';
import { ResourceForm } from '../../Components/BusinessComponents/ResourceForm';
import { isFolder } from '../../shared/helpers/resource';
import { useEditResource } from './hooks/useEditResource';

export const Component = () => {
  const { resource, loaderData, actionData, callbacks } = useEditResource();

  if (actionData) {
    return <Navigate to=".." />;
  }

  return (
    <React.Suspense
      fallback={
        <BaseModal open onClose={callbacks.onModalClose} isLoading>
          <ResourceForm isLoading />
        </BaseModal>
      }
    >
      <Await resolve={loaderData.resource}>
        <BaseModal
          title={
            resource && isFolder(resource)
              ? 'Update folder'
              : 'Update Business Process'
          }
          open
          onClose={callbacks.onModalClose}
        >
          <ResourceForm
            onFormSubmit={callbacks.onFormSubmit}
            resource={resource}
          />
        </BaseModal>
      </Await>
    </React.Suspense>
  );
};

Component.displayName = 'EditResourceContainer';
