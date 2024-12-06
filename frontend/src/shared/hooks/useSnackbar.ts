import { useContext } from 'react';
import { SnackbarContext } from '../../Providers/Snackbar/Snackbar.provider';

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};
