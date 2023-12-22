import { Dialog, DialogContent } from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import { AppbarDialog, Transition } from "~/components";
import { SCROLLBAR_CUSTOM } from "~/constants";
import { appActions } from "~/features/app";
import { bookingActions, useBookingSelector } from "~/features/booking";
import { useAppDispatch } from "~/stores";
import { IBooking } from "~/types";
import DialogSeeBooking from "./DialogSeeBooking";
import TableListBooking from "./TableListBooking";

type DialogListBookingProps = {
  open: boolean;
  onClose?: () => void;
};

const DialogListBooking: FC<DialogListBookingProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { data, filters, pagination } = useBookingSelector();
  const [selectedSeeBooking, setSelectedSeeBooking] = useState<null | IBooking>(null);

  useEffect(() => {
    if (!open) return;
    dispatch(appActions.openOverplay());
    dispatch(bookingActions.getDataStart({ ...filters, order: "created_at" }));
  }, [open, filters]);

  const handleChangePage = useCallback(
    (newPage: number) => {
      dispatch(bookingActions.setFilter({ ...filters, page: newPage }));
    },
    [filters]
  );

  const handleSeeBooking = useCallback((row: IBooking) => {
    setSelectedSeeBooking(row);
  }, []);

  const handleCloseSeeBooking = useCallback(() => {
    setSelectedSeeBooking(null);
  }, []);

  return (
    <>
      {selectedSeeBooking ? (
        <DialogSeeBooking open data={selectedSeeBooking} onClose={handleCloseSeeBooking} />
      ) : null}

      <Dialog TransitionComponent={Transition} open={open} onClose={onClose} fullScreen>
        <AppbarDialog title="Danh sách đặt phòng" onClose={onClose} />

        <DialogContent sx={SCROLLBAR_CUSTOM}>
          <TableListBooking
            data={data}
            page={pagination.page}
            onChangePage={handleChangePage}
            onSeeBooking={handleSeeBooking}
            totalPage={pagination.totalPage}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogListBooking;
