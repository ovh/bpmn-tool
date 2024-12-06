import { useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useParams,
  useSubmit,
} from 'react-router-dom';

import { useResource } from '../../../shared/hooks/useResource';
import {
  ResourceAction,
  ResourceType,
} from '../../../shared/types/BpmnResource';
import { useSnackbar } from '../../../shared/hooks/useSnackbar';
import { contentsQuery } from '../../../api/contents/contents.queries';

import type { BpmnLayoutLoaderData, BpmnLayoutRouteParams } from '..';
import type { ActionResponse } from '../../../shared/types/ActionResponse';
import { ContentStatusEnum, type Content, type Resource } from '../../../Types';
import { useModelerInstance } from '../../../shared/hooks/useModelerInstance';

export const useBpmnLayout = () => {
  const { resourceId } = useParams() as BpmnLayoutRouteParams;
  const actionData = useActionData() as Resource & ActionResponse;
  const loaderData = useLoaderData() as BpmnLayoutLoaderData;

  const { getModelerInstance } = useModelerInstance();
  const bpmnModelerInstance = getModelerInstance();

  const navigate = useNavigate();
  const submit = useSubmit();
  const { showAlert } = useSnackbar();

  const { resource } = useResource(resourceId);
  const { data: contents } = useQuery({
    ...contentsQuery(resourceId),
    enabled: Boolean(resource && resource.type === ResourceType.Process),
  });

  /**
   * Navigation functions
   */

  const getResourceLink = (id: string) => {
    return `/${id}`;
  };

  const getResourceActionLink = (id: string, action: ResourceAction) => {
    return `/${resourceId}/${action}?targetResourceId=${id}`;
  };

  /**
   * Callbacks
   */

  const onFolderTreeItemClick = (id: string) => {
    return navigate(`/${id}`);
  };

  /**
   * Manage click on modeler button
   */
  const onModelerBtnClick = useCallback(async () => {
    const lastVersionContent = (contents || []).find(
      ({ version }: Content) => version === contents?.length,
    );
    let actionPayload: {
      action: string;
      contentId?: string;
      content?: string;
    } = { action: '' };

    if (lastVersionContent) {
      if (lastVersionContent.status === ContentStatusEnum.Draft) {
        return navigate('./modeler');
      }

      if (lastVersionContent.status === ContentStatusEnum.Published) {
        actionPayload = {
          action: 'createContentFromClone',
          contentId: lastVersionContent.id,
        };
      }
    } else {
      let xmlContent;
      try {
        await bpmnModelerInstance.createDiagram();
        const draftContentXml = await bpmnModelerInstance.saveXML();
        xmlContent = draftContentXml.xml || '';
      } catch (error) {
        xmlContent = '';
      }

      actionPayload = {
        action: 'createContent',
        content: xmlContent,
      };
    }

    return submit(actionPayload, { method: 'post' });
  }, [contents, bpmnModelerInstance]);

  /**
   * Manage compare button click
   */
  const onCompareClick = useCallback(
    (leftContentId: string, rightContentId: string) => {
      navigate(`/${resourceId}/compare/${leftContentId}/${rightContentId}`);
    },
    [contents],
  );

  /**
   * Manage click on copy link
   */
  const onContentViewerLinkCopy = useCallback(() => {
    if (resource) {
      const baseUrl =
        import.meta.env.MODE === 'development'
          ? `${window.location.protocol}//${window.location.host}`
          : '';

      void navigator.clipboard.writeText(
        `${baseUrl}${
          import.meta.env.VITE_API_URL as string
        }/export/${resourceId}.png?authToken=${resource.authToken}`,
      );

      showAlert({
        message: 'Link successfully copied to clipboard!',
        severity: 'success',
      });
    }
  }, [resourceId, resource]);

  const onContentUpload = (content: string) => {
    return submit(
      {
        action: 'uploadContent',
        content,
      },
      { method: 'post' },
    );
  };

  const onContentPublish = () => {
    navigate(`/${resourceId}/publish`);
  };

  const onContentErase = (contentId: string) => {
    return submit(
      {
        action: 'eraseContent',
        contentId,
      },
      {
        method: 'delete',
      },
    );
  };

  const onContentClone = (contentId: string) => {
    return submit(
      {
        action: 'cloneContent',
        contentId,
      },
      {
        method: 'post',
      },
    );
  };

  /**
   * Action return management
   */
  const processActionMessages: Record<string, string> = {
    uploadContent: 'Content has been successfully uploaded.',
    publishContent: 'Content has been successfully published.',
    eraseContent: 'Content has been successfully erased.',
    cloneContent: 'Content has been successfully cloned.',
  };

  const processActionErrorMessages: Record<string, string> = {
    uploadContent: 'An error occured during content upload.',
    publishContent: 'An error occured during content publication.',
    eraseContent: 'An error occured during content erasure.',
    cloneContent: 'An error occured during content cloning.',
  };

  useEffect(() => {
    if (actionData && !actionData.error && actionData.formAction) {
      const message = processActionMessages[actionData.formAction as string];

      showAlert({
        message,
        severity: 'success',
      });
    } else if (actionData?.error && actionData?.formAction) {
      const message =
        processActionErrorMessages[actionData.formAction as string];

      showAlert({
        message,
        severity: 'danger',
      });
    }
  }, [actionData]);

  return {
    resource,
    loaderData,
    contents: contents ?? [],
    navigationFns: {
      getResourceLink,
      getResourceActionLink,
    },
    callbacks: {
      folderTree: {
        onFolderTreeItemClick,
      },
      header: {
        onModelerBtnClick,
      },
      processDetails: {
        onContentViewerLinkCopy,
        onCompareClick,
        onContentUpload,
        onContentPublish,
        onContentErase,
        onContentClone,
      },
    },
  };
};
