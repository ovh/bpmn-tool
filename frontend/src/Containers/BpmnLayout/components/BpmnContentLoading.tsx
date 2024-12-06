import React from 'react';
import { Skeleton } from '@mui/joy';

import { Header } from '../../../Components/GenericComponents/Header/Header';

export const BpmnContentLoading = () => {
  return (
    <>
      <Header isLoading />
      <Skeleton variant="rectangular" height={300} />
    </>
  );
};
