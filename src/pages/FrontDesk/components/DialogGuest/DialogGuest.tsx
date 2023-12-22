import { Dialog, DialogContent } from "@mui/material";
import { FC, useCallback, useEffect } from "react";
import { AppbarDialog, Transition } from "~/components";
import { SCROLLBAR_CUSTOM } from "~/constants";
import { appActions } from "~/features/app";
import { frontDeskActions, useFrontDeskSelector } from "~/features/frontDesk";
import { useAppDispatch } from "~/stores";
import { IGuestStayInformation, IRoomNumber } from "~/types";
import SaveGuestStay from "../SaveGuestStay";

type DialogGuestProps = {
  open: boolean;
  onClose?: () => void;
  roomNumber: IRoomNumber | null;
};

const DialogGuest: FC<DialogGuestProps> = ({ open, onClose, roomNumber }) => {
  const dispatch = useAppDispatch();
  const {
    screenGrid: { guestsInRoom },
  } = useFrontDeskSelector();

  useEffect(() => {
    if ((!open && !roomNumber) || !roomNumber?.booking_detail_id || !roomNumber?.id) return;

    dispatch(appActions.openOverplay("Đang lấy thông tin..."));
    dispatch(
      frontDeskActions.getGuestsInRoomStart({
        bookingDetailsId: roomNumber.booking_detail_id,
        roomNumberId: roomNumber.id,
      })
    );
  }, [roomNumber, open]);

  const handleSubmit = useCallback(
    (values: IGuestStayInformation, resetForm: () => void, mode: "add" | "edit") => {
      dispatch(appActions.openOverplay("Đang thêm thông tin..."));
      dispatch(
        frontDeskActions.addGuestsInRoomStart({
          data: values,
          resetForm: resetForm!,
          mode,
        })
      );
    },
    []
  );

  return (
    <Dialog open={open} TransitionComponent={Transition} maxWidth="lg" fullWidth onClose={onClose}>
      <AppbarDialog
        title={`Thông tin khách lưu trú phòng ${roomNumber?.id || ""}`}
        onClose={onClose}
      />

      <DialogContent sx={SCROLLBAR_CUSTOM}>
        {roomNumber ? (
          <SaveGuestStay
            bookingDetailsId={roomNumber?.booking_detail_id!}
            roomNumber={roomNumber?.id || ""}
            guests={guestsInRoom}
            checkIn={String(roomNumber.check_in)}
            checkOut={String(roomNumber.check_out)}
            adults={Number(roomNumber.adults)}
            children={roomNumber.children ?? 0}
            onSubmit={handleSubmit}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default DialogGuest;
