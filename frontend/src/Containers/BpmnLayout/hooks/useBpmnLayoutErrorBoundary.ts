import { HttpError } from '../../../shared/api/httpError';
import { useNavigate, useParams, useRouteError } from 'react-router-dom';
import { BpmnLayoutRouteParams } from '..';

export const useBpmnLayoutErrorBoundary = () => {
  const { resourceId } = useParams() as BpmnLayoutRouteParams;
  const error = useRouteError() as HttpError;
  const navigate = useNavigate();

  const onFolderTreeItemClick = (id: string) => {
    return navigate(`/${id}`);
  };

  return {
    resourceId,
    error,
    callbacks: {
      onFolderTreeItemClick,
    },
  };
};
