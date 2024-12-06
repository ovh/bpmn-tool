import { useEffect } from 'react';
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useParams,
  useSearchParams,
  useSubmit,
} from 'react-router-dom';

import { useResource } from '../../../shared/hooks/useResource';
import { useSnackbar } from '../../../shared/hooks/useSnackbar';

import type {
  EditResourceParams,
  EditResourceActionResponse,
  EditResourceLoaderData,
} from '..';
import type { ResourceFormFields } from '../../../Components/BusinessComponents/ResourceForm';
import { ResourceType } from '../../../shared/types/BpmnResource';

export const useEditResource = () => {
  const [searchParams] = useSearchParams();
  const { resourceId } = useParams() as EditResourceParams;
  const actionData = useActionData() as EditResourceActionResponse;
  const loaderData = useLoaderData() as EditResourceLoaderData;

  const targetResourceId =
    (searchParams.get('targetResourceId') as string) || resourceId;

  const navigate = useNavigate();
  const submit = useSubmit();
  const { showAlert } = useSnackbar();

  const { resource } = useResource(targetResourceId);

  /**
   * Callbacks
   */

  const onModalClose = () => {
    return navigate('..');
  };

  const onFormSubmit = (data: ResourceFormFields) => {
    return submit(data, { method: 'put' });
  };

  /**
   * Action return management
   */

  useEffect(() => {
    if (actionData && !actionData.error) {
      showAlert({
        message:
          actionData.editedResourceType === ResourceType.Folder
            ? 'Folder successfully edited!'
            : 'Business Process successfully edited!',
        severity: 'success',
      });
    } else if (actionData?.error) {
      const errorMessage = actionData?.error.errorResponse.message;

      showAlert({
        message:
          actionData.editedResourceType === ResourceType.Folder
            ? 'An error occurred during folder edition.'
            : 'An error occurred during Business Process edition.',
        severity: 'danger',
        content:
          errorMessage && Array.isArray(errorMessage)
            ? errorMessage.join(', ')
            : errorMessage,
      });
    }
  }, [actionData]);

  return {
    resource,
    loaderData,
    actionData,
    callbacks: {
      onModalClose,
      onFormSubmit,
    },
  };
};
