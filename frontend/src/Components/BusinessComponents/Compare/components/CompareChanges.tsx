import React, { FC } from 'react';
import { Table, Typography, Chip } from '@mui/joy';

import { BaseModal } from '../../../../Components/GenericComponents/BaseModal/BaseModal';
import { Diffs } from '../../../../Components/BusinessComponents/Compare/hooks/useCompare';

type CompareChangesProps = {
  open: boolean;
  onCancelClick(): void;
  props: {
    diffs: Diffs;
  };
};
export const CompareChanges: FC<CompareChangesProps> = ({
  open,
  onCancelClick,
  props,
}) => {
  const diffs = props.diffs;

  return (
    <BaseModal open={open} onClose={onCancelClick}>
      <>
        <Typography level="h2">Changes</Typography>
        <div style={{ overflowY: 'auto' }}>
          <Table
            stickyHeader
            hoverRow
            sx={{
              '--Table-headerUnderlineThickness': '1px',
              '--TableRow-hoverBackground': theme =>
                theme.vars.palette.background.level1,
            }}
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(diffs?._changed ?? {}).map(changed => (
                <tr
                  key={changed.model.id}
                  style={{ display: changed.model?.name ? '' : 'none' }}
                >
                  <td>{changed.model.name}</td>
                  <td>{changed.model.type}</td>
                  <td>
                    <Chip variant="solid" color="warning">
                      Changed
                    </Chip>
                  </td>
                </tr>
              ))}
              {Object.values(diffs?._removed ?? {}).map(removed => (
                <tr
                  key={removed.id}
                  style={{
                    display: removed?.name || removed?.text ? '' : 'none',
                  }}
                >
                  <td>{removed.name || removed.text}</td>
                  <td>{removed.$type}</td>
                  <td>
                    <Chip variant="solid" color="danger">
                      Removed
                    </Chip>
                  </td>
                </tr>
              ))}
              {Object.values(diffs?._layoutChanged ?? {}).map(changed => (
                <tr
                  key={changed.id}
                  style={{
                    display: changed?.name || changed?.text ? '' : 'none',
                  }}
                >
                  <td>{changed.name || changed?.text}</td>
                  <td>{changed.$type}</td>
                  <td>
                    <Chip variant="solid" color="primary">
                      Layout Changed
                    </Chip>
                  </td>
                </tr>
              ))}
              {Object.values(diffs?._added ?? {}).map(added => (
                <tr
                  key={added.id}
                  style={{ display: added?.name || added?.text ? '' : 'none' }}
                >
                  <td>{added.name || added?.text}</td>
                  <td>{added.$type}</td>
                  <td>
                    <Chip variant="solid" color="success">
                      Added
                    </Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </>
    </BaseModal>
  );
};
