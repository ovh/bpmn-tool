import React, { FC } from 'react';
import { Modal, ModalClose, ModalDialog, Skeleton, Typography } from '@mui/joy';

import type { SxProps } from '@mui/joy/styles/types';

export type BaseModalProps = {
  title?: string;
  children?: JSX.Element;
  open: boolean;
  isLoading?: boolean;
  onClose(): void;
  sx?: SxProps;
};

export const BaseModal: FC<BaseModalProps> = ({
  children,
  open,
  isLoading,
  onClose,
  title,
  sx,
}) => {
  const modalSx = { maxWidth: 500, gap: 2, display: 'flex', ...sx };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog sx={modalSx}>
        <ModalClose />
        {isLoading && <Skeleton variant="text" level="h2" width="90%" />}
        {!isLoading && title && <Typography component="h2">{title}</Typography>}
        {children && children}
      </ModalDialog>
    </Modal>
  );
};
