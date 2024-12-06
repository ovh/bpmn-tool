import { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import {
  createColumnHelper,
  type SortingState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  filterFns,
} from '@tanstack/react-table';
import debounce from '@mui/utils/debounce';

import { resourcesQuery } from '../../../../api/resources/resources.queries';
import { isRoot } from '../../../../shared/helpers/resource';
import { ResourceType } from '../../../../shared/types/BpmnResource';

import type { Resource } from '../../../../Types';

export const useResourceExplorer = (parentId: string) => {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'name',
      desc: false,
    },
  ]);
  const [globalFilter, setGlobalFilter] = useState('');

  const queryFilter = {
    ...(isRoot(parentId) ? { depth: 0 } : { parentId }),
  };

  const { data: resources, isLoading } = useQuery(resourcesQuery(queryFilter));

  const columnHelper = createColumnHelper<Resource>();
  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      meta: {
        ellipsis: true,
      },
      sortingFn: (rowA, rowB) => {
        const resourceA = rowA.original;
        const resourceB = rowB.original;
        // First sort by type (ascending)
        if (resourceA.type < resourceB.type) {
          return -1;
        } else if (resourceB.type < resourceA.type) {
          return 1;
        }

        // If the types are equal, sort by name (ascending)
        return resourceA.name.localeCompare(resourceB.name);
      },
      // cell: info => info.getValue(),
      //   `${getResourceIcon(info.row.original.type)} ${info.getValue()}`,
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      meta: {
        ellipsis: true,
      },
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      enableColumnFilter: false,
      cell: info => {
        return info.getValue() === ResourceType.Folder ? 'Folder' : 'BPMN';
      },
      enableSorting: false,
    }),
    // {
    //   header: 'Draft',
    //   cell: () => '',
    // },
    columnHelper.display({
      id: 'actions',
      enableSorting: false,
    }),
  ];

  const updateSearchTerm = useCallback((term: string) => {
    setGlobalFilter(term);
  }, []);

  const onSearch = useMemo(
    () => debounce(updateSearchTerm, 200),
    [updateSearchTerm],
  );

  const table = useReactTable({
    data: resources ?? [],
    columns,
    state: {
      sorting,
      globalFilter,
    },
    enableSortingRemoval: false,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: filterFns.includesString,
  });

  return {
    explorerItems: resources ?? [],
    isLoading,
    table,
    columns,
    onSearch,
  };
};
