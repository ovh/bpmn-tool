import React from 'react';
import { ChevronRight, CommentRounded, Edit } from '@mui/icons-material';

import { ActionButton } from '../../../Components/GenericComponents/ActionButton/ActionButton';

type BusinessProcessActionsProps = {
  onModelerBtnClick: () => void;
};

export const BusinessProcessActions = ({
  onModelerBtnClick,
}: BusinessProcessActionsProps) => {
  return (
    <>
      <ActionButton
        to="./comments"
        content="Comments"
        label="Manage comments of Business Process"
        leftIcon={<CommentRounded fontSize="small" />}
      />
      <ActionButton
        to="./edit"
        content="Edit"
        label="Edit Business Process"
        leftIcon={<Edit fontSize="small" />}
      />
      <ActionButton
        onClick={onModelerBtnClick}
        content="Modeler"
        label="Model Business Process"
        rightIcon={<ChevronRight fontSize="small" />}
      />
    </>
  );
};
