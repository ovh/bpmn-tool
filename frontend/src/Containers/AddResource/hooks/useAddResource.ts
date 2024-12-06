import { useEffect } from 'react';
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from 'react-router-dom';

import { useSnackbar } from '../../../shared/hooks/useSnackbar';

import type { AddResourceLoader } from '..';
import type { ActionResponse } from '../../../shared/types/ActionResponse';
import type { ResourceFormFields } from '../../../Components/BusinessComponents/ResourceForm';
import { ResourceType } from '../../../shared/types/BpmnResource';

export const useAddResource = () => {
  const { type } = useLoaderData() as AddResourceLoader;
  const actionData = useActionData() as ActionResponse;
  const navigate = useNavigate();
  const submit = useSubmit();
  const { showAlert } = useSnackbar();

  /**
   * Callbacks
   */

  const onModalClose = () => {
    return navigate('..');
  };

  const onFormSubmit = (data: ResourceFormFields) => {
    return submit(data, { method: 'post' });
  };

  /**
   * Action return management
   */

  useEffect(() => {
    if (actionData && !actionData.error) {
      showAlert({
        message:
          type === ResourceType.Folder
            ? 'Folder successfully created!'
            : 'Business Process successfully created!',
        severity: 'success',
      });
    } else if (actionData?.error) {
      const errorMessage = actionData?.error.errorResponse.message;

      showAlert({
        message:
          type === ResourceType.Folder
            ? 'An error occurred during folder creation.'
            : 'An error occurred during Business Process creation.',
        severity: 'danger',
        content:
          errorMessage && Array.isArray(errorMessage)
            ? errorMessage.join(', ')
            : errorMessage,
      });
    }
  }, [actionData]);

  return {
    type,
    actionData,
    callbacks: {
      onModalClose,
      onFormSubmit,
    },
  };
};
