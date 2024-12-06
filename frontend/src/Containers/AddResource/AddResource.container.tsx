import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAddResource } from './hooks/useAddResource';
import { ResourceForm } from '../../Components/BusinessComponents/ResourceForm';
import { ResourceType } from '../../shared/types/BpmnResource';
import { BaseModal } from '../../Components/GenericComponents/BaseModal/BaseModal';

export const Component = () => {
  const { type, actionData, callbacks } = useAddResource();

  if (actionData) {
    return <Navigate to=".." />;
  }

  return (
    <BaseModal
      title={
        type === ResourceType.Folder
          ? 'Create folder'
          : 'Create Business Process'
      }
      open
      onClose={callbacks.onModalClose}
    >
      <ResourceForm onFormSubmit={callbacks.onFormSubmit} />
    </BaseModal>
  );
};

Component.displayName = 'AddResourceContainer';
