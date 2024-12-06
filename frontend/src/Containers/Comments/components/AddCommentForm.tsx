import React, { useRef } from 'react';
import { Button, Input, Stack } from '@mui/joy';
import { useForm } from 'react-hook-form';

export type AddCommentFormFields = {
  comment: string;
};

export type AddCommentFormProps = {
  onFormSubmit: (props: AddCommentFormFields) => void;
};

export const AddCommentForm = ({ onFormSubmit }: AddCommentFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit } = useForm<AddCommentFormFields>({});

  return (
    <Stack sx={{ mt: 1 }}>
      <form
        onSubmit={handleSubmit(props => {
          onFormSubmit(props);
        })}
      >
        <Input
          {...register('comment')}
          required
          onKeyDown={event => {
            if (event.key !== 'Enter') {
              return;
            }

            handleSubmit(props => {
              onFormSubmit(props);
            });
          }}
          slotProps={{
            input: { ref: inputRef },
          }}
          sx={{
            '--Input-minHeight': '54px',
            '--Input-decoratorChildHeight': '42px',
          }}
          placeholder="Add a comment..."
          endDecorator={<Button type="submit">Comment</Button>}
        />
      </form>
    </Stack>
  );
};
