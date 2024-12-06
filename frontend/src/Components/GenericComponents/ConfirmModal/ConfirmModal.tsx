import React from 'react';
import { Avatar, Box, Button, Skeleton, Stack } from '@mui/joy';

import { ConfirmModalTypeEnum } from '.';
import { BaseModal } from '../BaseModal/BaseModal';

import type { BaseModalProps } from '../BaseModal/BaseModal';
import { WarningRounded } from '@mui/icons-material';

type ConfirmModalProps = BaseModalProps & {
  type: ConfirmModalTypeEnum;
  onConfirm?: () => void;
  onCancel: () => void;
};

export const ConfirmModal = ({
  title,
  isLoading,
  children,
  onClose,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  return (
    <BaseModal title={title} open onClose={onClose} isLoading={isLoading}>
      <>
        <Stack direction="row" spacing={2}>
          <Avatar color="danger">
            <WarningRounded />
          </Avatar>
          <Box>
            {isLoading ? (
              <>
                <Skeleton
                  variant="text"
                  level="body-md"
                  width={300}
                  sx={{ display: 'block' }}
                />
                <Skeleton
                  variant="text"
                  level="body-md"
                  width={300}
                  sx={{ display: 'block' }}
                />
              </>
            ) : (
              children
            )}
          </Box>
        </Stack>
        <Box
          sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}
        >
          <Button variant="plain" color="neutral" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="solid"
            color="danger"
            onClick={onConfirm}
            disabled={isLoading}
          >
            Delete
          </Button>
        </Box>
      </>
    </BaseModal>
  );
};
