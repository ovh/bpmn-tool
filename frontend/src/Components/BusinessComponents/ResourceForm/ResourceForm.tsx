import React, { FC } from 'react';
import {
  Button,
  FormLabel,
  FormControl,
  Input,
  Stack,
  Skeleton,
} from '@mui/joy';
import { useForm } from 'react-hook-form';

import { ResourceType } from '../../../shared/types/BpmnResource';

import type { Resource } from '../../../Types';

export type ResourceFormFields = {
  name: string;
  description?: string;
  type: ResourceType;
};

export type ResourceFormProps = {
  onFormSubmit?: (props: ResourceFormFields) => void;
  isLoading?: boolean;
  resource?: Resource;
};

export const ResourceForm: FC<ResourceFormProps> = ({
  onFormSubmit,
  isLoading = false,
  resource,
}) => {
  const { register, handleSubmit } = useForm<ResourceFormFields>({
    values: resource ?? undefined,
  });

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(props => {
        onFormSubmit?.(props);
      })}
    >
      <input {...register('type')} type="hidden" />
      <Stack spacing={2}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Skeleton sx={{ position: 'relative' }} loading={isLoading}>
            <Input required {...register('name')} />
          </Skeleton>
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Skeleton sx={{ position: 'relative' }} loading={isLoading}>
            <Input {...register('description')} />
          </Skeleton>
        </FormControl>
        <Button type="submit" disabled={isLoading}>
          {resource ? 'Update' : 'Create'}
        </Button>
      </Stack>
    </form>
  );
};
