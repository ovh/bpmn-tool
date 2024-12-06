import { useMemo, useState, ChangeEvent, useEffect } from 'react';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { ContentStatusEnum, type Content } from '../../../../Types';
import { formatDateTime } from '../../../../shared/helpers/date';
import { BpmnLintIssues, checkForLinterIssues } from '../../Modeler/helpers';
import { useQuery } from 'react-query';
import { getXmlContentQuery } from '../../../../api/contents/contents.queries';
import { useModelerInstance } from '../../../../shared/hooks/useModelerInstance';

export const useProcessContentList = (contents: Content[]) => {
  const [checkedContents, setCheckedContents] = useState<string[]>([]);
  const [hasDraftLintError, setHasDraftLintError] = useState(false);

  const { getModelerInstance } = useModelerInstance();

  const columnHelper = createColumnHelper<Content>();
  const columns = [
    columnHelper.display({
      id: 'versionSelect',
    }),
    columnHelper.accessor('version', {
      header: 'Version',
      cell: info => info.getValue() || 'N/A',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('createdBy', {
      header: 'Author',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: info => formatDateTime(info.getValue()),
    }),
    columnHelper.accessor('updatedAt', {
      header: 'Updated At',
      cell: info => formatDateTime(info.getValue()),
    }),
    columnHelper.display({
      id: 'actions',
    }),
  ];

  const table = useReactTable({
    data: contents,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const draftContent = useMemo(() => {
    if (!contents) {
      return undefined;
    }

    return contents.find(
      ({ status }: Content) => status === ContentStatusEnum.Draft,
    );
  }, [contents]);

  const hasDraft = useMemo(() => {
    return !!draftContent;
  }, [draftContent]);

  const { data: draftXmlContent } = useQuery({
    ...getXmlContentQuery(
      draftContent?.resourceId as string,
      draftContent?.id as string,
    ),
    enabled: !!draftContent?.id,
  });

  const onContentCheck = (event: ChangeEvent<HTMLInputElement>) => {
    let contentIds = [...checkedContents];
    if (event.target.checked) {
      contentIds = [...checkedContents, event.target.value];
    } else {
      contentIds.splice(checkedContents.indexOf(event.target.value), 1);
    }
    setCheckedContents(contentIds);
    return contentIds;
  };

  useEffect(() => {
    const bpmnInstance = getModelerInstance();

    if (!draftXmlContent) {
      setHasDraftLintError(false);
    } else {
      bpmnInstance.importXML(draftXmlContent).then(() => {
        bpmnInstance.on(
          'linting.completed',
          ({ issues }: { issues: BpmnLintIssues }) => {
            setHasDraftLintError(checkForLinterIssues(issues));
          },
        );
      });
    }

    return () => {
      bpmnInstance.clear();
    };
  }, [draftXmlContent]);

  return {
    table,
    hasDraft,
    hasDraftLintError,
    checkedContents,
    onContentCheck,
  };
};
