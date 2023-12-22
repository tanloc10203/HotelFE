import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import { FC } from "react";
import { AppbarDialog, Transition } from "~/components";

type DialogCleanupProps = {
  open: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
};

const DialogCleanup: FC<DialogCleanupProps> = ({ open, onClose, onSubmit }) => {
  return (
    <Dialog TransitionComponent={Transition} open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <AppbarDialog title="Xác nhận" onClose={onClose} />

      <DialogContent>
        <DialogContentText>Xác nhận đã dọn phòng</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onSubmit}>Đã dọn xong</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogCleanup;
