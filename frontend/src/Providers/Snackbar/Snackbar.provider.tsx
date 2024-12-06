import React, {
  createContext,
  forwardRef,
  JSXElementConstructor,
  ReactElement,
  Ref,
  useCallback,
  useState,
} from 'react';
import MUISnackbar from '@mui/material/Snackbar';
import { Slide } from '@mui/material';
import { Alert, ColorPaletteProp, Typography } from '@mui/joy';
import { TransitionProps } from '@mui/material/transitions';
import { CheckCircle, Info, Report, Warning } from '@mui/icons-material';

const TransitionComponent = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<unknown, string | JSXElementConstructor<unknown>>;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type AlertProps = {
  message: string;
  severity: 'danger' | 'success' | 'warning' | 'info';
  content?: string;
};

type SnackbarContextType = {
  showAlert: (props: AlertProps) => void;
};
export const SnackbarContext = createContext<SnackbarContextType>(
  {} as SnackbarContextType,
);

export const SnackbarProvider = ({ children }: { children: ReactElement }) => {
  const [alert, setAlert] = useState<AlertProps>();
  const [open, setOpen] = useState(false);

  const showAlert = useCallback((curAlert: AlertProps) => {
    setAlert(curAlert);
    setOpen(true);
  }, []);

  const items: Record<
    string,
    {
      color: ColorPaletteProp;
      icon: ReactElement;
    }
  > = {
    success: { color: 'success', icon: <CheckCircle /> },
    danger: { color: 'danger', icon: <Report /> },
    warning: { color: 'warning', icon: <Warning /> },
    info: { color: 'primary', icon: <Info /> },
  };

  const color = alert?.severity ? items[alert.severity].color : undefined;

  return (
    <SnackbarContext.Provider value={{ showAlert }}>
      {children}
      <MUISnackbar
        sx={{ borderRadius: 2 }}
        TransitionComponent={TransitionComponent}
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={5000}
      >
        <Alert
          startDecorator={
            alert?.severity ? items[alert.severity].icon : undefined
          }
          variant="solid"
          color={color}
          invertedColors
        >
          <div>
            <Typography level="title-md">{alert?.message}</Typography>
            {alert?.content && (
              <Typography level="body-sm">{alert?.content}</Typography>
            )}
          </div>
        </Alert>
      </MUISnackbar>
    </SnackbarContext.Provider>
  );
};
