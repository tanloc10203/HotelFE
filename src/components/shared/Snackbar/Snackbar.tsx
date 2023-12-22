import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import { FC, forwardRef, SyntheticEvent, useCallback } from "react";
import { appActions, useSnackbar } from "~/features/app";
import { useAppDispatch } from "~/stores";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackbarCommon: FC = () => {
  const { duration, open, severity, text, vertical } = useSnackbar();
  const dispatch = useAppDispatch();

  const handleClose = useCallback((_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(appActions.setCloseSnackbar());
  }, []);

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        anchorOrigin={{ vertical: vertical, horizontal: "right" }}
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {text}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default SnackbarCommon;
