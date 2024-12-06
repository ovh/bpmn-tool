import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import {
  getContentQuery,
  getXmlContentQuery,
} from '../../../api/contents/contents.queries';

import type { CompareRouteParams } from '..';
import { useState } from 'react';

export const useCompareData = () => {
  const [isDiffsModalOpen, setIsDiffsModalOpen] = useState(false);

  const { resourceId, leftContentId, rightContentId } =
    useParams() as CompareRouteParams;

  const { data: leftContent, isLoading: isLeftContentLoading } = useQuery(
    getContentQuery(resourceId, leftContentId),
  );

  const { data: rightContent, isLoading: isRightContentLoading } = useQuery(
    getContentQuery(resourceId, rightContentId),
  );

  const { data: leftXmlContent, isLoading: isLeftXmlContentLoading } = useQuery(
    getXmlContentQuery(resourceId, leftContentId),
  );

  const { data: rightXmlContent, isLoading: isRightXmlContentLoading } =
    useQuery(getXmlContentQuery(resourceId, rightContentId));

  return {
    resourceId,
    leftContent,
    leftXmlContent: leftXmlContent ?? '',
    rightXmlContent: rightXmlContent ?? '',
    rightContent,
    isLoading:
      isLeftContentLoading ||
      isRightContentLoading ||
      isLeftXmlContentLoading ||
      isRightXmlContentLoading,
    isDiffsModalOpen,
    setIsDiffsModalOpen,
  };
};
