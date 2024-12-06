import React from 'react';
import { useNavigate, useSubmit } from 'react-router-dom';

import { useComments } from './hooks/useComments';
import { AddCommentForm } from './components/AddCommentForm';
import { BaseModal } from '../../Components/GenericComponents/BaseModal/BaseModal';

import type { AddCommentFormFields } from './components/AddCommentForm';
import { CommentList } from './components/CommentList';
import { Box } from '@mui/joy';

export const Component = () => {
  const navigate = useNavigate();
  const submit = useSubmit();
  const { comments } = useComments();

  const closeModal = () => {
    return navigate('..');
  };

  const submitForm = (data: AddCommentFormFields) => {
    return submit(data, { method: 'post' });
  };

  return (
    <BaseModal
      sx={{
        minWidth: '65dvw',
        height: '100vh',
      }}
      title="Comments"
      open
      onClose={closeModal}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Box>
          <CommentList comments={comments} />
        </Box>
        <AddCommentForm onFormSubmit={submitForm} />
      </Box>
    </BaseModal>
  );
};

Component.displayName = 'CommentsContainer';
