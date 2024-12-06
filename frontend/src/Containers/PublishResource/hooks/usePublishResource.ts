import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useParams,
  useSubmit,
} from 'react-router-dom';
import { useQuery } from 'react-query';

import { useResource } from '../../../shared/hooks/useResource';
import {
  contentsQuery,
  getXmlContentQuery,
} from '../../../api/contents/contents.queries';
// @ts-ignore
import { generatePngFromSvg } from '../../../shared/utils/generatePngFromSvg';

import { type PublishResourceLoaderData, type PublishResourceParams } from '..';
import { type Content, ContentStatusEnum } from '../../../Types';
import type { ActionResponse } from '../../../shared/types/ActionResponse';
import { useSnackbar } from '../../../shared/hooks/useSnackbar';
import { useModelerInstance } from '../../../shared/hooks/useModelerInstance';

export const usePublishResource = () => {
  const [base64Png, setBase64Png] = useState('');
  const viewerRef = useRef<HTMLDivElement>(null);

  const { resourceId } = useParams() as PublishResourceParams;
  const loaderData = useLoaderData() as PublishResourceLoaderData;
  const navigate = useNavigate();
  const actionData = useActionData() as ActionResponse;
  const submit = useSubmit();

  const { showAlert } = useSnackbar();

  const { resource } = useResource(resourceId);
  const { data: contents } = useQuery(contentsQuery(resourceId));

  const { getViewerInstance } = useModelerInstance();
  const viewer = getViewerInstance();

  const draftContent = useMemo(() => {
    if (!contents) {
      return undefined;
    }

    return contents.find(
      ({ status }: Content) => status === ContentStatusEnum.Draft,
    );
  }, [contents]);

  const { data: draftXmlContent } = useQuery({
    ...getXmlContentQuery(resourceId, draftContent?.id as string),
    enabled: !!draftContent?.id,
  });

  useEffect(() => {
    if (viewerRef.current && draftXmlContent) {
      viewer.importXML(draftXmlContent).then(async () => {
        viewer.attachTo(viewerRef.current as HTMLDivElement);
        const processSvg = await viewer.saveSVG();
        const pngData = await generatePngFromSvg(processSvg.svg);
        setBase64Png(pngData || '');
      });
    }
  }, [viewer, viewerRef, draftXmlContent]);

  /**
   * Callbacks
   */

  const onModalClose = () => {
    return navigate('..');
  };

  const onPublish = () => {
    submit(
      {
        action: 'publishContent',
        contentId: (draftContent as Content).id,
        pngContent: base64Png,
      },
      { method: 'post' },
    );
  };

  const onPngPreviewClick = useCallback(() => {
    if (base64Png) {
      const binaryString = window.atob(
        base64Png.replace(/^data:image\/png;base64,/, ''),
      );
      const binaryLen = binaryString.length;
      const bytes = new Uint8Array(binaryLen);
      for (let i = 0; i < binaryLen; i++) {
        const ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
      }
      const blob = new Blob([bytes], { type: 'image/png' });
      window.open(URL.createObjectURL(blob), '_blank');
    }
  }, [base64Png]);

  /**
   * Error management
   */

  useEffect(() => {
    if (actionData && !actionData.error && actionData.formAction) {
      showAlert({
        message: 'Business Process publication success.',
        severity: 'success',
      });
    } else if (actionData?.error && actionData.formAction) {
      showAlert({
        message: 'An error occurred during Business Process publication.',
        severity: 'danger',
      });
    }
  }, [actionData]);

  return {
    loaderData,
    resource,
    base64Png,
    viewerRef,
    actionData,
    callbacks: {
      onModalClose,
      onPublish,
      onPngPreviewClick,
    },
  };
};
