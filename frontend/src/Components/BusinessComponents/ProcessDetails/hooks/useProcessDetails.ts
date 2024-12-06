import { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';

import {
  contentsQuery,
  getXmlContentQuery,
} from '../../../../api/contents/contents.queries';
import { useSnackbar } from '../../../../shared/hooks/useSnackbar';

import { ContentStatusEnum } from '../../../../Types';

type UseProcessDetailsCallbacks = {
  onContentUpload: (content: string) => void;
};

const parser = new DOMParser();

export const useProcessDetails = (
  resourceId: string,
  callbacks: UseProcessDetailsCallbacks,
) => {
  const { showAlert } = useSnackbar();
  const [isCompareDisabled, setIsCompareDisabled] = useState(true);
  const [contentIdsToCompare, setContentIdsToCompare] = useState<string[]>([]);

  const { data: contents, isLoading } = useQuery(contentsQuery(resourceId));

  const draftContent = useMemo(() => {
    if (!contents) {
      return null;
    }

    return contents.find(({ status }) => status === ContentStatusEnum.Draft);
  }, [resourceId, contents]);

  const publishedContent = useMemo(() => {
    if (!contents) {
      return null;
    }

    return contents.find(
      ({ status }) => status === ContentStatusEnum.Published,
    );
  }, [resourceId, contents]);

  const { data: publishedXmlContent } = useQuery({
    ...getXmlContentQuery(resourceId, publishedContent?.id as string),
    enabled: !!publishedContent?.id,
  });

  const tasks = useMemo(() => {
    if (!publishedXmlContent) {
      return [];
    }

    const xml = parser.parseFromString(publishedXmlContent, 'text/xml');

    return Array.prototype.slice.call(xml.querySelectorAll('task'));
  }, [publishedXmlContent]);

  /**
   * Draft content creation
   */
  const onFilesUploaded = async (files: FileList) => {
    try {
      const file = files[0];
      const content = await file.text();
      callbacks.onContentUpload(content);
    } catch (error) {
      showAlert({
        message: 'An error occur during file upload.',
        severity: 'danger',
      });
    }
  };

  const onContentChecked = useCallback(
    (contentIds: string[]) => {
      if (contentIds.length === 2) {
        setIsCompareDisabled(false);
        setContentIdsToCompare([...contentIds]);
      } else {
        setIsCompareDisabled(true);
        setContentIdsToCompare([]);
      }
    },
    [contents],
  );

  return {
    isLoading,
    contents: contents ?? [],
    draftContent,
    publishedContent,
    isCompareDisabled,
    contentIdsToCompare,
    tasks: tasks ?? [],
    onFilesUploaded,
    onContentChecked,
  };
};
