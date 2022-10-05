import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomizedSnackbars = ({open, onClose, serverity}) => {
  return (
    <React.Fragment>
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={open} autoHideDuration={4000} onClose={onClose} >
        <Alert onClose={onClose} severity={serverity}>
            This is a success message!
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}

export default CustomizedSnackbars;