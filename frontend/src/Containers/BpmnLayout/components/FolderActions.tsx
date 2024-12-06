import React from 'react';
import { Add } from '@mui/icons-material';

import { ActionButton } from '../../../Components/GenericComponents/ActionButton/ActionButton';

export const FolderActions = () => {
  return (
    <>
      <ActionButton
        to="./add?type=folder"
        content="Folder"
        label="Add a new folder"
        leftIcon={<Add fontSize="small" />}
      />

      <ActionButton
        to="./add?type=process"
        content="Business Process"
        label="Add a new business process"
        leftIcon={<Add fontSize="small" />}
      />
    </>
  );
};
