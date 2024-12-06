import React from 'react';
import { QueryClientProvider } from 'react-query';
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy';

import { SnackbarProvider } from './Providers/Snackbar/Snackbar.provider';
import { routes } from './routes';
import queryClient from './queryClient';
import {
  BpmnToolOptions,
  BpmnToolOptionsProvider,
} from './Providers/BpmnToolOptions';

import './styles.css';
import '@fontsource/public-sans';

const router = createBrowserRouter(routes as RouteObject[], {
  basename: import.meta.env.VITE_APP_BASE_PATH as string,
});

type MainContainerProps = {
  options: BpmnToolOptions;
};

export function MainContainer(props: MainContainerProps) {
  return (
    <React.StrictMode>
      <CssVarsProvider />
      <SnackbarProvider>
        <QueryClientProvider client={queryClient}>
          <BpmnToolOptionsProvider options={props.options}>
            <RouterProvider router={router} />
          </BpmnToolOptionsProvider>
        </QueryClientProvider>
      </SnackbarProvider>
    </React.StrictMode>
  );
}
