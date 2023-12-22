import { AppBar, Button, Dialog, DialogContent, Stack, Toolbar, Typography } from "@mui/material";
import { FC, useCallback, useLayoutEffect } from "react";
import { Transition } from "~/components";
import { SCROLLBAR_CUSTOM } from "~/constants";
import { FORMAT_DATETIME_SQL } from "~/constants/format";
import { appActions } from "~/features/app";
import { frontDeskActions, useFrontDeskSelector } from "~/features/frontDesk";
import { roomActions } from "~/features/room";
import { useAppDispatch } from "~/stores";
import { selectWeek } from "~/utils";
import CollapsibleTable from "../components/CollapsibleTable";

type FormDialogSaveGuestStayProps = {};

const FormDialogSaveGuestStay: FC<FormDialogSaveGuestStayProps> = () => {
  const dispatch = useAppDispatch();
  const {
    openDialogSaveGuestStay,
    selectRoomNumberId,
    customerBookedSelected,
    optionCheckIn,
    checkIn,
    checkOut,
    modeBooking,
    mode,
    timeline: { dateRange },
  } = useFrontDeskSelector();

  const onClose = useCallback(() => {
    dispatch(frontDeskActions.setToggleDialogSaveGuestStay(false));
  }, []);

  useLayoutEffect(() => {
    if (!openDialogSaveGuestStay || !selectRoomNumberId || !customerBookedSelected) return;

    dispatch(appActions.openOverplay("Đang tải dữ liệu..."));

    dispatch(
      frontDeskActions.getCustomerBookedCheckInsStart({
        checkIn: checkIn.format(FORMAT_DATETIME_SQL),
        checkOut: checkOut.format(FORMAT_DATETIME_SQL),
        modeBooking: modeBooking,
        roomNumber: selectRoomNumberId,
        customerId: customerBookedSelected.customer_id,
        ...(optionCheckIn === "CHECK_IN_ONE"
          ? { bookingDetailsId: customerBookedSelected.id }
          : {}),
        status: "in_progress",
      })
    );
  }, [
    openDialogSaveGuestStay,
    selectRoomNumberId,
    customerBookedSelected,
    optionCheckIn,
    checkIn,
    checkOut,
  ]);

  const onSave = useCallback(() => {
    dispatch(appActions.openOverplay("Đang tải dữ liệu..."));
    dispatch(frontDeskActions.setToggleDialogSaveGuestStay(false));
    dispatch(frontDeskActions.setToggleListCustomerBooked(false));
    dispatch(frontDeskActions.setSelectedRoomNumberId(""));
    dispatch(frontDeskActions.setResetCheckInOut());
    dispatch(frontDeskActions.setModeBooking("day"));
    dispatch(frontDeskActions.getCustomerBookedByRoomNumberSuccess([]));

    if (mode === "grid") {
      dispatch(roomActions.getDataFrontDeskStart());
    } else {
      const dateOfWeek = selectWeek(dateRange);

      dispatch(
        roomActions.getDataFrontDeskTimelineStart({
          startDate: dateOfWeek[0].date,
          endDate: dateOfWeek[dateOfWeek.length - 1].date,
        })
      );
    }
  }, [mode]);

  return (
    <Dialog
      fullScreen
      TransitionComponent={Transition}
      fullWidth
      open={openDialogSaveGuestStay}
      onClose={onClose}
    >
      <AppBar sx={{ position: "relative" }} color="inherit">
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Khách lưu trú
          </Typography>
          <Stack flexDirection={"row"} gap={2}>
            <Button onClick={onClose} variant="outlined" color="error">
              Hủy bỏ
            </Button>
            <Button variant="contained" color="success" onClick={onSave}>
              Lưu
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <DialogContent dividers={true} sx={SCROLLBAR_CUSTOM}>
        <CollapsibleTable />
      </DialogContent>
    </Dialog>
  );
};

export default FormDialogSaveGuestStay;
