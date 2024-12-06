import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';

import type { ShareResourceLoaderData } from '..';
import { useCallback } from 'react';
import { useSnackbar } from '../../../shared/hooks/useSnackbar';
import { useResource } from '../../../shared/hooks/useResource';

export const useShareResource = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const loaderData = useLoaderData() as ShareResourceLoaderData;

  const { showAlert } = useSnackbar();

  const targetResourceId = searchParams.get('targetResourceId') as string;

  const { resource } = useResource(targetResourceId);

  const getResourceShareLink = useCallback(() => {
    return `${window.location.protocol}//${window.location.host}${
      import.meta.env.VITE_APP_BASE_PATH as string
    }${targetResourceId}`;
  }, [targetResourceId]);

  /**
   * Callbacks
   */

  const onModalClose = () => {
    return navigate('..');
  };

  const onShareLinkCopyClick = useCallback(() => {
    void navigator.clipboard.writeText(getResourceShareLink());

    showAlert({
      message: 'Link copied to clipboard!',
      severity: 'success',
    });
  }, [targetResourceId]);

  return {
    loaderData,
    resource,
    getResourceShareLink,
    callbacks: {
      onModalClose,
      onShareLinkCopyClick,
    },
  };
};
