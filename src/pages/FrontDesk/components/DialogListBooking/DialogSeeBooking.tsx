import { Dialog, DialogContent, Stack } from "@mui/material";
import { FC, useEffect } from "react";
import { AppbarDialog, Transition } from "~/components";
import { SCROLLBAR_CUSTOM } from "~/constants";
import { appActions } from "~/features/app";
import { bookingActions, useBookingSelector } from "~/features/booking";
import { useAppDispatch } from "~/stores";
import { IBooking } from "~/types";
import RoomItem from "./RoomItem";

type DialogSeeBookingProps = {
  open: boolean;
  data: IBooking;
  onClose?: () => void;
};

const DialogSeeBooking: FC<DialogSeeBookingProps> = ({ open, onClose, data }) => {
  const dispatch = useAppDispatch();
  const { bookingDetails } = useBookingSelector();

  useEffect(() => {
    if (!data.id) return;

    dispatch(appActions.openOverplay());
    dispatch(
      bookingActions.getDataBookingDetailsStart({
        booking_id: data.id,
        limit: 9999,
        page: 1,
        order: "room_number_id,asc",
      })
    );
  }, [data]);

  return (
    <Dialog TransitionComponent={Transition} open={open} onClose={onClose} maxWidth="md" fullWidth>
      <AppbarDialog title={`Chi tiết đặt phòng`} onClose={onClose} />

      <DialogContent sx={SCROLLBAR_CUSTOM}>
        <Stack flexDirection={"row"} flexWrap={"wrap"} gap={1}>
          {bookingDetails.map((b) => (
            <RoomItem booking={data} data={b} key={b.id} />
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSeeBooking;
