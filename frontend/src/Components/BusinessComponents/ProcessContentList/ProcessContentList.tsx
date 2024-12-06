import React from 'react';
import { Checkbox, Stack, Table } from '@mui/joy';
import { flexRender } from '@tanstack/react-table';
import { Delete, FileCopy, Publish } from '@mui/icons-material';

import { useProcessContentList } from './hooks/useProcessContentList';

import { ContentStatusEnum, type Content } from '../../../Types';
import type { Cell } from '@tanstack/react-table';
import { ActionsMenu } from './components/ActionsMenu';

type ProcessContentListProps = {
  contents: Content[];
  onContentPublish: (contentId: string) => void;
  onContentErase: (contentId: string) => void;
  onContentClone: (contentId: string) => void;
  onContentChecked: (contentIds: string[]) => void;
};

export const ProcessContentList = ({
  contents,
  onContentPublish,
  onContentErase,
  onContentClone,
  onContentChecked,
}: ProcessContentListProps) => {
  const {
    table,
    hasDraft,
    // hasDraftLintError,
    checkedContents,
    onContentCheck,
  } = useProcessContentList(contents);

  const getContentActions = (content: Content) => {
    return [
      ...(content.status !== ContentStatusEnum.Draft
        ? [
            {
              id: `clone_${content.id}`,
              label: 'Clone',
              icon: <FileCopy fontSize="small" />,
              onClick: () => {
                onContentClone(content.id);
              },
              disabled: hasDraft,
            },
          ]
        : [
            {
              id: `publish_${content.id}`,
              label: 'Publish',
              icon: <Publish fontSize="small" />,
              onClick: () => {
                onContentPublish(content.id);
              },
              // disabled: hasDraftLintError,
            },
            {
              id: `erase_${content.id}`,
              label: 'Erase',
              icon: <Delete fontSize="small" />,
              onClick: () => {
                onContentErase(content.id);
              },
            },
          ]),
    ];
  };

  const getCellContent = (cell: Cell<Content, unknown>) => {
    switch (cell.column.id) {
      case 'versionSelect':
        return (
          <Checkbox
            value={cell.row.original.id}
            checked={checkedContents.includes(cell.row.original.id)}
            onChange={event => {
              onContentChecked(onContentCheck(event));
            }}
          />
        );
      case 'actions':
        return (
          <Stack spacing={1} direction="row" justifyContent="flex-end">
            <ActionsMenu
              size="sm"
              actions={getContentActions(cell.row.original)}
            />
          </Stack>
        );
      default:
        return flexRender(cell.column.columnDef.cell, cell.getContext());
    }
  };

  return (
    <Table
      stickyHeader
      hoverRow
      sx={{
        tableLayout: 'auto',
        '--TableCell-headBackground': 'white',
        '--Table-headerUnderlineThickness': '1px',
        '--TableRow-hoverBackground': theme =>
          theme.vars.palette.background.level1,
      }}
    >
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => {
              return <td key={cell.id}>{getCellContent(cell)}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
