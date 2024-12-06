import { useCallback, useEffect, useMemo, useState } from 'react';
import { useActionData, useParams, useSubmit } from 'react-router-dom';
import { useQuery } from 'react-query';

import type { ContentModelerRouteParams } from '..';
import {
  contentsQuery,
  getXmlContentQuery,
} from '../../../api/contents/contents.queries';
import { useSnackbar } from '../../../shared/hooks/useSnackbar';
import { ActionResponse } from '../../../shared/types/ActionResponse';

import { ContentStatusEnum, type Content } from '../../../Types';
import { useResource } from '../../../shared/hooks/useResource';
import Modeler from 'camunda-bpmn-js/lib/base/Modeler';

export const useContentModeler = (bpmnModelerInstance: Modeler) => {
  const { resourceId } = useParams() as ContentModelerRouteParams;
  const actionData = useActionData() as Content & ActionResponse;

  const submit = useSubmit();
  const { showAlert } = useSnackbar();

  const [isShortcurtModalOpen, setIsShortcurtModalOpen] = useState(false);

  const { data: contents } = useQuery(contentsQuery(resourceId));
  const { resource } = useResource(resourceId);

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

  const contentData = useMemo(() => {
    if (!contents) {
      return undefined;
    }

    return contents.find(
      ({ status }: Content) => status === ContentStatusEnum.Draft,
    );
  }, [contents]);

  const onFileUpload = useCallback(
    async (files: FileList) => {
      try {
        const processContent = await files[0].text();
        bpmnModelerInstance.importXML(processContent);
      } catch {
        showAlert({
          message: 'An error occurs during file upload.',
          severity: 'danger',
        });
      }
    },
    [resourceId, bpmnModelerInstance],
  );

  /**
   * File export action
   */
  const triggerDownload = useCallback(
    (content: string, exportType: 'svg' | 'bpmn'): void => {
      if (resource && draftContent) {
        const hiddenElement = document.createElement('a');
        const fileContent = new Blob([content], { type: 'text/xml' });
        const fileName = `${resource.name}_v${draftContent.version}`;
        hiddenElement.setAttribute('download', `${fileName}.${exportType}`);
        hiddenElement.setAttribute(
          'href',
          window.URL.createObjectURL(fileContent),
        );
        hiddenElement.style.display = 'none';
        document.body.appendChild(hiddenElement);
        hiddenElement.click();
        document.body.removeChild(hiddenElement);
      }
    },
    [draftContent, resource, resourceId],
  );

  const onFileExport = useCallback(
    async (exportType: 'svg' | 'bpmn') => {
      let file;
      try {
        if (exportType === 'svg') {
          file = await bpmnModelerInstance.saveSVG();
          triggerDownload(file.svg, 'svg');
        } else {
          file = await bpmnModelerInstance.saveXML({ format: true });
          if (file.xml) {
            triggerDownload(file.xml, exportType);
          }
        }
      } catch (error) {
        showAlert({
          message: `Fail to export as ${exportType}.`,
          severity: 'danger',
        });
      }
    },
    [draftContent, resource, resourceId, bpmnModelerInstance],
  );

  /**
   * Diagram save action
   */

  const saveDiagram = useCallback(
    async (action: string, content: Content) => {
      const contentXml = await bpmnModelerInstance.saveXML({ format: true });
      if (contentXml.xml) {
        submit(
          {
            action,
            contentId: content.id,
            content: contentXml.xml,
          },
          { method: 'put' },
        );
      }
    },
    [bpmnModelerInstance],
  );

  const onDiagramSave = useCallback(async () => {
    if (!contentData) {
      return;
    }

    try {
      saveDiagram('saveContent', contentData);
    } catch (error) {
      showAlert({
        message: 'An error occur during saving content.',
        severity: 'danger',
      });
    }
  }, [resourceId, contentData]);

  const onDiagramPublish = useCallback(async () => {
    if (!contentData) {
      return;
    }

    try {
      saveDiagram('saveContentBeforePublish', contentData);
    } catch (error) {
      showAlert({
        message: 'An error occur during saving content.',
        severity: 'danger',
      });
    }
  }, [contentData, resourceId, bpmnModelerInstance]);

  const processActionMessages: Record<string, string> = {
    saveContent: 'Content has been saved successfully.',
  };

  const processActionErrorMessages: Record<string, string> = {
    saveContent: 'An error occured during saving content.',
    saveContentBeforePublish:
      "An error occured during publishing content. Content can't be saved.",
  };

  useEffect(() => {
    if (actionData && !actionData.error) {
      const message = processActionMessages[actionData.formAction as string];

      if (message) {
        showAlert({
          message,
          severity: 'success',
        });
      }
    } else if (actionData && actionData.error) {
      const message =
        processActionErrorMessages[actionData.formAction as string];

      if (message) {
        showAlert({
          message,
          severity: 'danger',
        });
      }
    }
  }, [actionData]);

  return {
    resourceId,
    draftXmlContent: draftXmlContent ?? '',
    isShortcurtModalOpen,
    actionData,
    setIsShortcurtModalOpen,
    onFileUpload,
    onFileExport,
    onDiagramSave,
    onDiagramPublish,
  };
};
