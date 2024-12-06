import React from 'react';
import { Await, Navigate } from 'react-router-dom';
import { Typography } from '@mui/joy';

import { useDeleteResource } from './hooks/useDeleteResource';
import { ResourceType } from '../../shared/types/BpmnResource';
import {
  ConfirmModal,
  ConfirmModalTypeEnum,
} from '../../Components/GenericComponents/ConfirmModal';

export const Component = () => {
  const { resource, actionData, loaderData, callbacks } = useDeleteResource();

  const confirmText = `Are you sure you want to delete this ${
    resource && resource.type === ResourceType.Folder
      ? 'folder'
      : 'Business Process'
  }${resource ? ` (${resource.name})` : ''}?`;

  if (actionData) {
    return <Navigate to=".." />;
  }

  return (
    <React.Suspense
      fallback={
        <ConfirmModal
          type={ConfirmModalTypeEnum.Warning}
          isLoading
          open
          onClose={callbacks.onModalClose}
          onCancel={callbacks.onModalCancel}
        />
      }
    >
      <Await resolve={loaderData.resource}>
        <ConfirmModal
          title={
            resource && resource.type === ResourceType.Folder
              ? 'Delete folder'
              : 'Delete Business Process'
          }
          open
          onClose={callbacks.onModalClose}
          onCancel={callbacks.onModalCancel}
          onConfirm={callbacks.onModalConfirm}
          type={ConfirmModalTypeEnum.Warning}
        >
          <Typography>{confirmText}</Typography>
        </ConfirmModal>
      </Await>
    </React.Suspense>
  );
};

Component.displayName = 'DeleteResourceContainer';
