import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import { FC } from "react";
import { AppbarDialog, Transition } from "~/components";

type DialogConfirmChangeRoomProps = {
  open: boolean;
  onClose?: () => void;
  onAgree?: () => void;
  roomNumber: string;
};

const DialogConfirmChangeRoom: FC<DialogConfirmChangeRoomProps> = ({
  open,
  roomNumber,
  onClose,
  onAgree,
}) => {
  return (
    <Dialog TransitionComponent={Transition} maxWidth="sm" fullWidth open={open} onClose={onClose}>
      <AppbarDialog onClose={onClose} title="Xác nhận" />

      <DialogContent>
        <DialogContentText>Bạn có chắc chắn đổi sang phòng {roomNumber}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onAgree} variant="contained" color="success">
          Đồng ý
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogConfirmChangeRoom;
