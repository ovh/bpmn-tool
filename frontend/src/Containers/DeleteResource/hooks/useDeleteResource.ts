import { useEffect } from 'react';
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useSearchParams,
  useSubmit,
} from 'react-router-dom';

import { useSnackbar } from '../../../shared/hooks/useSnackbar';

import type {
  DeleteResourceActionResponse,
  DeleteResourceLoaderData,
  DeleteResourceSubmitData,
} from '..';
import { useResource } from '../../../shared/hooks/useResource';
import { ResourceType } from '../../../shared/types/BpmnResource';

export const useDeleteResource = () => {
  const [searchParams] = useSearchParams();
  const actionData = useActionData() as DeleteResourceActionResponse;
  const loaderData = useLoaderData() as DeleteResourceLoaderData;

  const targetResourceId = searchParams.get('targetResourceId') as string;

  const navigate = useNavigate();
  const submit = useSubmit();
  const { showAlert } = useSnackbar();

  const { resource } = useResource(targetResourceId, !actionData);

  /**
   * Callbacks
   */

  const onModalClose = () => {
    return navigate('..');
  };

  const onModalConfirm = () => {
    return submit(
      {
        resourceType: resource?.type,
      } as DeleteResourceSubmitData,
      { method: 'delete' },
    );
  };

  const onModalCancel = () => {
    return onModalClose();
  };

  /**
   * Action return management
   */

  useEffect(() => {
    if (actionData && !actionData.error) {
      showAlert({
        message:
          actionData.deletedResourceType === ResourceType.Folder
            ? 'Folder successfully deleted!'
            : 'Business Process successfully deleted!',
        severity: 'success',
      });
    } else if (actionData?.error) {
      showAlert({
        message:
          actionData.deletedResourceType === ResourceType.Folder
            ? 'An error occurred during folder deletion.'
            : 'An error occurred during Business Process deletion.',
        severity: 'danger',
      });
    }
  }, [actionData]);

  return {
    resource,
    actionData,
    loaderData,
    callbacks: {
      onModalClose,
      onModalConfirm,
      onModalCancel,
    },
  };
};
