import React, { FC } from 'react';
import { Box, Typography } from '@mui/joy';

import { useCompare } from '../../BusinessComponents/Compare/hooks/useCompare';

import './Compare.css';
import { CompareChanges } from './components/CompareChanges';

type CompareProps = {
  leftSideTitle: string;
  rightSideTitle: string;
  leftContent: string;
  rightContent: string;
  isDiffsModalOpen: boolean;
  setIsDiffsModalOpen: (isOpen: boolean) => void;
};

export const Compare: FC<CompareProps> = ({
  leftContent,
  rightContent,
  leftSideTitle,
  rightSideTitle,
  isDiffsModalOpen,
  setIsDiffsModalOpen,
}) => {
  const { leftRef, rightRef, diffs } = useCompare(leftContent, rightContent);

  return (
    <>
      <CompareChanges
        open={isDiffsModalOpen}
        props={{ diffs }}
        onCancelClick={() => setIsDiffsModalOpen(false)}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '90vh',
        }}
      >
        <div
          style={{
            width: '50%',
          }}
          ref={leftRef}
        >
          <Box
            sx={{
              p: 1,
              position: 'absolute',
              left: 0,
              borderRadius: '8px',
              zIndex: 999,
              bgcolor: theme => theme.palette.background.level1,
            }}
          >
            <Typography level="h2" fontWeight="lg">
              {leftSideTitle}
            </Typography>
          </Box>
        </div>
        <Box
          sx={{
            border: '5px dashed',
            borderColor: theme => theme.palette.neutral.outlinedBorder,
          }}
        />
        <div
          style={{
            width: '50%',
          }}
          ref={rightRef}
        >
          <Box
            sx={{
              p: 1,
              position: 'absolute',
              right: 0,
              borderRadius: '8px',
              zIndex: 999,
              bgcolor: theme => theme.palette.background.level1,
            }}
          >
            <Typography level="h2" fontWeight="lg">
              {rightSideTitle}
            </Typography>
          </Box>
        </div>
      </div>
    </>
  );
};
